#!/usr/bin/env python3
"""Offline Python conformance runner for exported synthetic property vectors."""

from __future__ import annotations

import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parent))

import argparse
import copy
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

# Canonicalisation, hashing, packet parsing and report rendering are SHARED with the
# other Python runners (research-kit/bin/conformance_common.py). They were duplicated
# in three files until 2026-09-20, and two of the copies had already drifted.
from conformance_common import (
    ConformanceError,
    canonical_json as _canonical_json,
    digest,
    js_number,
    json_string,
    parse_json_no_duplicates,
    read_packet,
    report_json,
    require_unique_vector_ids,
)


PROFILE = "researcher-property-vector-v1"
VERSION = "1.0.0"
PACKAGE_RANK = {f"R{number}": number for number in range(28, 34)}


class PacketError(ConformanceError):
    """This runner's name for a refused packet. Shared base so the three agree."""


# This runner's float policy, named rather than implied (see conformance_common).
def canonical_json(value):
    return _canonical_json(value, float_policy="reject")


def load_vectors(path: str | Path) -> dict[str, Any]:
    raw = Path(path).read_bytes()
    try:
        packet = parse_json_no_duplicates(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError, ConformanceError) as error:
        raise PacketError(str(error)) from error
    if not isinstance(packet, dict):
        raise PacketError("packet must be an object")
    if packet.get("packetVersion") != VERSION or packet.get("profile") != PROFILE or packet.get("generatorProfile") != "researcher-property-replay-v1":
        raise PacketError("unsupported packet, profile, or generator profile")
    if not isinstance(packet.get("vectors"), list) or not packet["vectors"] or not isinstance(packet.get("graphs"), dict):
        raise PacketError("vectors and graphs are required")
    ids: set[str] = set()
    for vector in packet["vectors"]:
        vector_id = vector.get("vectorId") if isinstance(vector, dict) else None
        if not isinstance(vector_id, str) or not vector_id or vector_id in ids:
            raise PacketError("vector IDs must be present and unique")
        ids.add(vector_id)
    packet["_vectorPacketSha256"] = hashlib.sha256(raw).hexdigest()
    return packet


def row(vector: dict[str, Any], **fields: Any) -> dict[str, Any]:
    result = {
        "vectorId": vector["vectorId"], "kind": vector["kind"], "result": "FAIL",
        "canonicalBytesHex": None, "sha256": None, "status": None, "primaryReason": None,
        "affectedPointers": [], "revocationRecordIds": [], "reason": "",
    }
    result.update(fields)
    return result


def hash_vector(vector: dict[str, Any]) -> dict[str, Any]:
    canonical = canonical_json(vector.get("value"))
    actual_hash = digest(canonical)
    reordered = digest(canonical_json(vector.get("reorderedValue")))
    matches = (
        canonical == vector.get("expectedCanonical")
        and canonical_json(vector.get("permutedValue")) == canonical
        and actual_hash == vector.get("expectedSha256")
        and reordered == vector.get("expectedReorderedSha256")
        and actual_hash != reordered
    )
    return row(vector, result="PASS" if matches else "FAIL", canonicalBytesHex=canonical.encode("utf-8").hex(), sha256=actual_hash, reason="" if matches else "hash.mismatch")


def record_vector(vector: dict[str, Any]) -> dict[str, Any]:
    value = vector.get("value")
    if not isinstance(value, dict):
        raise PacketError("record-chain vector value must be an object")
    unsigned = {key: item for key, item in value.items() if key not in {"recordHash", "chainHash", "signature"}}
    record_hash = digest(canonical_json(unsigned))
    chain_hash = digest(f"benchmark-ledger-chain-v1\0{record_hash}\0{value.get('prevChainHash')}\0{value.get('physicalSequence')}")
    matches = record_hash == vector.get("expectedRecordHash") and chain_hash == vector.get("expectedChainHash")
    return row(vector, result="PASS" if matches else "FAIL", sha256=record_hash, reason="" if matches else "record-chain.mismatch")


def graph_pointers(packet: dict[str, Any], vector: dict[str, Any]) -> list[dict[str, Any]]:
    source = packet["graphs"].get(vector.get("graphId"))
    if not isinstance(source, list) or not source:
        raise PacketError(f"{vector['vectorId']} names an unknown graph")
    pointers = copy.deepcopy(source)
    mutation = vector.get("mutation")
    if mutation is None:
        return pointers
    if not isinstance(mutation, dict):
        raise PacketError(f"{vector['vectorId']} has an invalid mutation")
    index = next((index for index, pointer in enumerate(pointers) if pointer.get("recordId") == mutation.get("recordId")), -1)
    if index < 0:
        raise PacketError(f"{vector['vectorId']} mutation names an unknown record")
    if mutation.get("kind") == "self-cycle":
        pointers[index]["predecessorHashes"] = [pointers[index]["targetHash"]]
    elif mutation.get("kind") == "duplicate":
        pointers.append(copy.deepcopy(pointers[index]))
    else:
        raise PacketError(f"{vector['vectorId']} has unknown mutation kind")
    return pointers


def graph_outcome(pointers: list[dict[str, Any]], roots: list[str]) -> dict[str, Any]:
    identities: set[tuple[Any, Any, Any]] = set()
    targets: dict[str, dict[str, Any]] = {}
    known: set[str] = set()
    for pointer in pointers:
        identity = (pointer.get("package"), pointer.get("generation"), pointer.get("recordId"))
        if identity in identities:
            return {"status": "FAIL", "primaryReason": "graph.duplicate-record", "affectedPointers": [], "revocationRecordIds": []}
        identities.add(identity)
        target = pointer.get("targetHash")
        if not isinstance(target, str) or target in targets:
            return {"status": "FAIL", "primaryReason": "graph.duplicate-record", "affectedPointers": [], "revocationRecordIds": []}
        targets[target] = pointer
        known.add(target)
        predecessors = pointer.get("predecessorHashes")
        if not isinstance(predecessors, list):
            raise PacketError("graph predecessorHashes must be an array")
        known.update(predecessors)

    visiting: set[str] = set()
    visited: set[str] = set()
    def visit(target: str) -> bool:
        if target in visiting:
            return True
        if target in visited:
            return False
        visiting.add(target)
        pointer = targets[target]
        for predecessor in pointer["predecessorHashes"]:
            if predecessor in targets and visit(predecessor):
                return True
        visiting.remove(target)
        visited.add(target)
        return False
    if any(visit(target) for target in targets):
        return {"status": "FAIL", "primaryReason": "graph.cycle", "affectedPointers": [], "revocationRecordIds": []}
    if any(root not in known for root in roots):
        return {"status": "FAIL", "primaryReason": "graph.missing-root", "affectedPointers": [], "revocationRecordIds": []}

    reverse: dict[str, list[dict[str, Any]]] = {}
    for pointer in pointers:
        for predecessor in pointer["predecessorHashes"]:
            reverse.setdefault(predecessor, []).append(pointer)
    affected: dict[str, dict[str, Any]] = {}
    queue = list(dict.fromkeys(roots))
    while queue:
        current = queue.pop(0)
        for pointer in reverse.get(current, []):
            if pointer["recordId"] in affected:
                continue
            affected[pointer["recordId"]] = pointer
            queue.append(pointer["targetHash"])
    ordered = sorted(affected.values(), key=lambda pointer: (PACKAGE_RANK.get(pointer["package"], 999), pointer["generation"], pointer["recordId"]))
    record_ids = [pointer["recordId"] for pointer in ordered]
    return {"status": "PASS", "primaryReason": "descendants.invalidated", "affectedPointers": record_ids, "revocationRecordIds": record_ids}


def graph_vector(packet: dict[str, Any], vector: dict[str, Any]) -> dict[str, Any]:
    outcome = graph_outcome(graph_pointers(packet, vector), vector.get("invalidationRoots", []))
    matches = (
        outcome["status"] == vector.get("expectedStatus")
        and outcome["primaryReason"] == vector.get("expectedPrimaryReason")
        and outcome["affectedPointers"] == vector.get("expectedAffectedPointers")
        and outcome["revocationRecordIds"] == vector.get("expectedRevocationRecordIds")
    )
    return row(vector, result="PASS" if matches else "FAIL", status=outcome["status"], primaryReason=outcome["primaryReason"], affectedPointers=outcome["affectedPointers"], revocationRecordIds=outcome["revocationRecordIds"], reason="" if matches else "graph.mismatch")


def run_conformance(packet: dict[str, Any]) -> dict[str, Any]:
    vectors = []
    for vector in packet["vectors"]:
        if not isinstance(vector, dict) or not isinstance(vector.get("vectorId"), str) or not isinstance(vector.get("kind"), str):
            raise PacketError("each vector needs vectorId and kind")
        if vector["kind"] == "canonical-hash":
            vectors.append(hash_vector(vector))
        elif vector["kind"] == "record-chain":
            vectors.append(record_vector(vector))
        elif vector["kind"] == "graph-invalidation":
            vectors.append(graph_vector(packet, vector))
        else:
            raise PacketError(f"{vector['vectorId']} has unknown vector kind")
    report = {
        "validatorVersion": VERSION, "profile": PROFILE, "vectorPacketSha256": packet["_vectorPacketSha256"],
        "implementation": {"language": "python", "runtime": sys.version.split()[0]}, "vectorCount": len(vectors),
        "status": "PASS" if all(vector["result"] == "PASS" for vector in vectors) else "FAIL", "vectors": vectors,
    }
    report["reportSha256"] = digest(canonical_json(report))
    return report


def main(argv: list[str] | None = None) -> int:
    root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(add_help=False, usage="property_vector_conformance.py [--vectors <property-graph-hash-vectors.json>] [--json]")
    parser.add_argument("--vectors", default=str(root / "conformance" / "property-graph-hash-vectors.json"))
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--help", action="store_true")
    parsed, unknown = parser.parse_known_args(argv)
    if parsed.help or unknown:
        print(parser.format_usage().strip(), file=sys.stdout if parsed.help else sys.stderr)
        return 0 if parsed.help else 2
    try:
        report = run_conformance(load_vectors(parsed.vectors))
        if parsed.json:
            sys.stdout.write(report_json(report))
        else:
            print(f"{report['status']} ({report['vectorCount']} vector(s))")
            for vector in report["vectors"]:
                suffix = f" ({vector['reason']})" if vector["reason"] else ""
                print(f"- {vector['vectorId']}: {vector['result']}{suffix}")
        return 0 if report["status"] == "PASS" else 1
    except (OSError, PacketError) as error:
        report = {"validatorVersion": VERSION, "profile": PROFILE, "vectorCount": 0, "status": "FAIL", "vectors": [], "errors": [{"code": "PROPERTY-VECTOR-PACKET", "message": str(error)}]}
        if parsed.json:
            sys.stdout.write(report_json(report))
        else:
            print(f"FAIL: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
