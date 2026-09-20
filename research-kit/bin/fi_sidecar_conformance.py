#!/usr/bin/env python3
"""Offline cross-language FI sidecar/evidence-manifest schema conformance runner."""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any

PROFILE = "researcher-fi-schema-conformance-v1"
VERSION = "1.0.0"
SCHEMA_DIR = Path(__file__).resolve().parent.parent / "schemas"
SCHEMA_FILE = {"sidecar": "fi-signoff-sidecar.schema.json", "manifest": "fi-evidence-manifest.schema.json"}
CODE_PRIORITY = ["JSON-DUPLICATE-KEY", "JSON-PARSE", "SCHEMA-ADDITIONAL", "SCHEMA-REQUIRED", "SCHEMA-ONE-OF", "SCHEMA-CONST", "SCHEMA-ENUM", "SCHEMA-PATTERN", "SCHEMA-MIN-ITEMS", "SCHEMA-TYPE"]


class PacketError(ValueError):
    pass


def no_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"duplicate object key {key!r}")
        result[key] = value
    return result


def parse_json(text: str) -> Any:
    return json.loads(text, object_pairs_hook=no_duplicates, parse_constant=lambda value: (_ for _ in ()).throw(ValueError(f"non-finite JSON constant {value}")))


def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True, allow_nan=False)


def same(left: Any, right: Any) -> bool:
    return canonical(left) == canonical(right)


def resolve(schema: dict[str, Any], root: dict[str, Any]) -> dict[str, Any] | None:
    reference = schema.get("$ref")
    if not reference:
        return schema
    match = re.fullmatch(r"#/\$defs/([^/]+)", reference)
    return root.get("$defs", {}).get(match.group(1)) if match else None


def check(value: Any, schema: dict[str, Any], root: dict[str, Any], errors: list[str]) -> None:
    resolved = resolve(schema, root)
    if resolved is None:
        errors.append("SCHEMA-REF")
        return
    schema = resolved
    for alternative in schema.get("allOf", []):
        check(value, alternative, root, errors)
    alternatives = schema.get("oneOf") or schema.get("anyOf")
    if alternatives is not None:
        matches = 0
        alternative_errors: list[list[str]] = []
        for alternative in alternatives:
            local: list[str] = []
            check(value, alternative, root, local)
            alternative_errors.append(local)
            if not local:
                matches += 1
        valid = matches == 1 if "oneOf" in schema else matches >= 1
        if not valid:
            if matches == 0 and alternative_errors:
                errors.extend(alternative_errors[-1])
            errors.append("SCHEMA-ONE-OF" if "oneOf" in schema else "SCHEMA-ANY-OF")
    if "const" in schema and not same(value, schema["const"]):
        errors.append("SCHEMA-CONST")
    if "enum" in schema and not any(same(value, candidate) for candidate in schema["enum"]):
        errors.append("SCHEMA-ENUM")
    type_name = schema.get("type")
    if type_name:
        types = type_name if isinstance(type_name, list) else [type_name]
        matches = any(
            (name == "null" and value is None)
            or (name == "array" and isinstance(value, list))
            or (name == "object" and isinstance(value, dict))
            or (name == "integer" and isinstance(value, int) and not isinstance(value, bool))
            or (name == "number" and isinstance(value, (int, float)) and not isinstance(value, bool))
            or (name == "string" and isinstance(value, str))
            or (name == "boolean" and isinstance(value, bool))
            for name in types
        )
        if not matches:
            errors.append("SCHEMA-TYPE")
            return
    if isinstance(value, dict):
        for key in schema.get("required", []):
            if key not in value:
                errors.append("SCHEMA-REQUIRED")
        if schema.get("additionalProperties") is False and "properties" in schema:
            for key in value:
                if key not in schema["properties"]:
                    errors.append("SCHEMA-ADDITIONAL")
        for key, child in schema.get("properties", {}).items():
            if key in value:
                check(value[key], child, root, errors)
    if isinstance(value, list):
        for item in value:
            if "items" in schema:
                check(item, schema["items"], root, errors)
        if len(value) < schema.get("minItems", 0):
            errors.append("SCHEMA-MIN-ITEMS")
        if "maxItems" in schema and len(value) > schema["maxItems"]:
            errors.append("SCHEMA-MAX-ITEMS")
        if schema.get("uniqueItems"):
            seen: set[str] = set()
            for item in value:
                encoded = canonical(item)
                if encoded in seen:
                    errors.append("SCHEMA-UNIQUE")
                seen.add(encoded)
    if isinstance(value, str):
        if len(value) < schema.get("minLength", 0):
            errors.append("SCHEMA-MIN-LENGTH")
        if "maxLength" in schema and len(value) > schema["maxLength"]:
            errors.append("SCHEMA-MAX-LENGTH")
        if "pattern" in schema and not re.search(schema["pattern"], value):
            errors.append("SCHEMA-PATTERN")
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if "minimum" in schema and value < schema["minimum"]:
            errors.append("SCHEMA-MINIMUM")


def pointer_parts(pointer: str) -> list[str]:
    if not isinstance(pointer, str) or not pointer.startswith("/") or pointer == "/":
        raise PacketError("patch path must be a non-root JSON pointer")
    return [part.replace("~1", "/").replace("~0", "~") for part in pointer[1:].split("/")]


def patch(base: Any, patches: list[dict[str, Any]]) -> Any:
    value = copy.deepcopy(base)
    if not isinstance(patches, list):
        raise PacketError("patches must be an array")
    for operation in patches:
        if not isinstance(operation, dict) or operation.get("op") not in {"set", "remove"}:
            raise PacketError("patch operation must be set or remove")
        parts = pointer_parts(operation.get("path"))
        parent = value
        for part in parts[:-1]:
            if isinstance(parent, list):
                if not part.isdigit() or int(part) >= len(parent):
                    raise PacketError(f"patch path does not exist: {operation['path']}")
                parent = parent[int(part)]
            elif isinstance(parent, dict) and part in parent:
                parent = parent[part]
            else:
                raise PacketError(f"patch path does not exist: {operation['path']}")
        key = parts[-1]
        if operation["op"] == "set":
            if isinstance(parent, list):
                if not key.isdigit() or int(key) >= len(parent):
                    raise PacketError(f"patch path does not exist: {operation['path']}")
                parent[int(key)] = copy.deepcopy(operation.get("value"))
            elif isinstance(parent, dict):
                parent[key] = copy.deepcopy(operation.get("value"))
            else:
                raise PacketError(f"patch path does not exist: {operation['path']}")
        elif isinstance(parent, list) and key.isdigit() and int(key) < len(parent):
            parent.pop(int(key))
        elif isinstance(parent, dict) and key in parent:
            del parent[key]
        else:
            raise PacketError(f"patch path does not exist: {operation['path']}")
    return value


def primary(codes: list[str]) -> str:
    return next((code for code in CODE_PRIORITY if code in codes), codes[0] if codes else "PASS")


def load_packet(file: str | Path) -> dict[str, Any]:
    raw = Path(file).read_bytes()
    if raw.startswith(b"\xef\xbb\xbf"):
        raise PacketError("UTF-8 BOM is not permitted")
    try:
        packet = parse_json(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError, ValueError) as error:
        raise PacketError(str(error)) from error
    if not isinstance(packet, dict) or packet.get("packetVersion") != VERSION or packet.get("profile") != PROFILE:
        raise PacketError("packet version or profile is invalid")
    if packet.get("schemaIds") != {"sidecar": "research-kit/fi-signoff-sidecar-v1", "manifest": "research-kit/fi-evidence-manifest-v1"}:
        raise PacketError("packet schema IDs are invalid")
    if not isinstance(packet.get("documents"), dict) or not isinstance(packet.get("vectors"), list) or not packet["vectors"]:
        raise PacketError("documents and a non-empty vector list are required")
    ids: set[str] = set()
    for vector in packet["vectors"]:
        if not isinstance(vector, dict) or not isinstance(vector.get("vectorId"), str) or not vector["vectorId"] or vector["vectorId"] in ids:
            raise PacketError("vector IDs must be present and unique")
        ids.add(vector["vectorId"])
        if vector.get("target") not in SCHEMA_FILE:
            raise PacketError("vector target is invalid")
        if not isinstance(vector.get("rawDocument"), str) and (vector.get("base") not in packet["documents"] or not isinstance(vector.get("patches"), list)):
            raise PacketError("non-raw vector needs a declared base and patches")
    packet["_vectorPacketSha256"] = hashlib.sha256(raw).hexdigest()
    return packet


def run_vector(vector: dict[str, Any], documents: dict[str, Any], schemas: dict[str, dict[str, Any]]) -> dict[str, Any]:
    try:
        value = parse_json(vector["rawDocument"]) if isinstance(vector.get("rawDocument"), str) else patch(documents[vector["base"]], vector["patches"])
        errors: list[str] = []
        check(value, schemas[vector["target"]], schemas[vector["target"]], errors)
        codes = list(dict.fromkeys(errors))
    except ValueError as error:
        codes = ["JSON-DUPLICATE-KEY" if "duplicate object key" in str(error) else "JSON-PARSE"]
    except PacketError:
        codes = ["VECTOR-PACKET"]
    observed = primary(codes)
    return {"vectorId": vector["vectorId"], "target": vector["target"], "expectedCode": vector["expectedCode"], "observedCode": observed, "result": "PASS" if observed == vector["expectedCode"] else "FAIL"}


def run(packet: dict[str, Any]) -> dict[str, Any]:
    schemas = {target: parse_json((SCHEMA_DIR / filename).read_text(encoding="utf-8")) for target, filename in SCHEMA_FILE.items()}
    vectors = [run_vector(vector, packet["documents"], schemas) for vector in packet["vectors"]]
    return {
        "validatorVersion": VERSION,
        "profile": PROFILE,
        "vectorPacketSha256": packet["_vectorPacketSha256"],
        "implementation": {"language": "python", "runtime": sys.version.split()[0]},
        "vectorCount": len(vectors),
        "status": "PASS" if all(row["result"] == "PASS" for row in vectors) else "FAIL",
        "vectors": vectors,
    }


def report_json(report: dict[str, Any]) -> str:
    return json.dumps(report, indent=2, ensure_ascii=False) + "\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vectors", default=str(Path(__file__).resolve().parent.parent / "conformance" / "fi-sidecar-evidence-manifest-vectors.json"))
    parser.add_argument("--json", action="store_true")
    parsed = parser.parse_args(argv)
    try:
        report = run(load_packet(parsed.vectors))
        if parsed.json:
            sys.stdout.write(report_json(report))
        else:
            print(f"{report['status']} ({report['vectorCount']} vector(s))")
            for row in report["vectors"]:
                print(f"- {row['vectorId']}: {row['result']}" + (f" ({row['observedCode']})" if row["result"] == "FAIL" else ""))
        return 0 if report["status"] == "PASS" else 1
    except (OSError, PacketError, ValueError, json.JSONDecodeError) as error:
        report = {"validatorVersion": VERSION, "profile": PROFILE, "vectorCount": 0, "status": "FAIL", "vectors": [], "errors": [{"code": "VECTOR-PACKET", "message": str(error)}]}
        if parsed.json:
            sys.stdout.write(report_json(report))
        else:
            print(f"FAIL: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
