---
url: https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md
retrieved: 2026-10-04
command: firecrawl scrape https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: attestation/spec/v1/envelope.md at main · in-toto/attestation · GitHub
---
[Skip to content](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md) to refresh your session.Dismiss alert

{{ message }}

[in-toto](https://github.com/in-toto)/ **[attestation](https://github.com/in-toto/attestation)** Public

- [Notifications](https://github.com/login?return_to=%2Fin-toto%2Fattestation) You must be signed in to change notification settings
- [Fork\\
130](https://github.com/login?return_to=%2Fin-toto%2Fattestation)
- [Star\\
380](https://github.com/login?return_to=%2Fin-toto%2Fattestation)


## Collapse file tree

## Files

main

Search this repository(forward slash)` forward slash/`

/

# envelope.md

Copy path

Blame

More file actions

Blame

More file actions

## Latest commit

[![marcelamelara](https://avatars.githubusercontent.com/u/93797898?v=4&size=40)](https://github.com/marcelamelara)[marcelamelara](https://github.com/in-toto/attestation/commits?author=marcelamelara)

[Ensure the Envelope spec meets ITE-5 (](https://github.com/in-toto/attestation/commit/7bfb269c6eb5fe8ca56edf5e1cc17776a294457a) [#431](https://github.com/in-toto/attestation/pull/431) [)](https://github.com/in-toto/attestation/commit/7bfb269c6eb5fe8ca56edf5e1cc17776a294457a)

Open commit detailssuccess

7 months agoMar 11, 2026

[7bfb269](https://github.com/in-toto/attestation/commit/7bfb269c6eb5fe8ca56edf5e1cc17776a294457a) · 7 months agoMar 11, 2026

## History

[History](https://github.com/in-toto/attestation/commits/main/spec/v1/envelope.md)

Open commit details

[View commit history for this file.](https://github.com/in-toto/attestation/commits/main/spec/v1/envelope.md) History

110 lines (88 loc) · 5.53 KB

· Code owner: @in-toto/attestation-maintainers

/

# envelope.md

Copy path

Top

## File metadata and controls

- Preview

- Code

- Blame


110 lines (88 loc) · 5.53 KB

· Code owner: @in-toto/attestation-maintainers

[Raw](https://github.com/in-toto/attestation/raw/refs/heads/main/spec/v1/envelope.md)

Copy raw file

Download raw file

You must be signed in to make or propose changes

More edit options

Outline

Edit and raw actions

# Envelope layer specification

[Permalink: Envelope layer specification](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md#envelope-layer-specification)

The Envelope is the outermost layer of the attestation, handling serialization
and authentication (via digital signatures).

## Schema

[Permalink: Schema](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md#schema)

The RECOMMENDED format and protocol for Envelopes are defined per [DSSE v1.0](https://github.com/secure-systems-lab/dsse/blob/v1.0.2/envelope.md).
Producers MAY use other signature methods and formats that meet the [ITE-5](https://github.com/in-toto/ITE/tree/master/ITE/5#specification)
specification:

- MUST support the inclusion of multiple signatures in a single envelope
- SHOULD include an authenticated payload type
- SHOULD avoid depending on canonicalization for security
- SHOULD support a hint indicating what signing key was used, i.e., a KEYID
- SHOULD NOT require the verifier to parse the payload before verifying
- SHOULD NOT require the inclusion of signing key algorithms in the signature

### Alternative Envelope schemas

[Permalink: Alternative Envelope schemas](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md#alternative-envelope-schemas)

- The [Sigstore Bundle](https://docs.sigstore.dev/about/bundle/), while [supporting DSSE](https://docs.sigstore.dev/about/bundle/#dsse), is not currently [ITE-5](https://github.com/in-toto/ITE/tree/master/ITE/5#specification)
compliant because it requires a _single signature_ in the envelope.[1](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md#user-content-fn-1-b700a84a7c61e63932c366591d092c19)
- The [COSE\_Sign](https://datatracker.ietf.org/doc/html/rfc8152#section-4.1) structure is [ITE-5](https://github.com/in-toto/ITE/tree/master/ITE/5#specification) compliant, whereas the `COSE_Sign1`
format that supports only one signer is NOT compliant.

## Fields

[Permalink: Fields](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md#fields)

The in-toto Attestation Framework has the following general field requirements
for an Envelope:

- `signatures` (or equivalent) is REQUIRED and MUST be defined as an array of
digital signatures. The encoding of the signature bytes is determined by the
envelope schema.
- A `keyid` (or equivalent) SHOULD be included for each signing key used. The
envelope schema MAY nest this field within the signature array.
- `payload` (or equivalent) SHOULD be included and contain the in-toto
[Statement](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md) that was signed.
- `payloadType` (or equivalent) MUST be signed along with the `payload`.
It MUST take the form `application/vnd.in-toto+<encoding>` to indicate
an in-toto [Statement](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md) payload and its serialized `<encoding>` format.

In addition, the Envelope spec has the following specific requirements for the
standard [DSSE](https://github.com/secure-systems-lab/dsse/blob/v1.0.2/envelope.md) fields.

- `payloadType` MUST be set to `application/vnd.in-toto.<predicate>+json` or to
`application/vnd.in-toto+json`. This indicates that the Envelope contains
a JSON object with a `_type` field specifying its schema. If the
predicate-specific media type is used, the following requirements apply:

  - `<predicate>` MUST match the [predicate specification filename](https://github.com/in-toto/attestation/blob/main/spec/predicates) without
    the file extension.
  - Consumers SHOULD NOT rely upon the media type for individual attestations
    as faithful indicators of predicate type. Consumer SHOULD only rely on the
    `predicateType` field in the [Statement](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md) layer.
  - To obtain predicate information that is authenticated, consumers MUST
    parse the Envelope's `payload`, and verify it against its `signatures`.
  - The predicate version is not specified in the media type; it is handled
    in the [Statement](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md) layer.
- `payload` MUST be a base64-encoded JSON [Statement](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md).

## File naming convention

[Permalink: File naming convention](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md#file-naming-convention)

If stored in a dedicated file by itself, and not as part of a [Bundle](https://github.com/in-toto/attestation/blob/main/spec/v1/bundle.md), an
Envelope SHOULD use the suffix `.json`.

- For attestations intended for consumption by [in-toto-verify](https://github.com/in-toto/in-toto#verification), an
Envelope containing an attestation about a particular software supply
chain step `<step-name>` SHOULD be named `<step-name>.json`.
- For other verifiers, or cases in which a step name cannot be easily
determined, the attestation producer and consumer MAY agree on an
arbitrary filename: `<env-name>.json`.
- If multiple Envelopes are produced for the same step by different
[functionaries](https://github.com/in-toto/docs/blob/v1.0/in-toto-spec.md#212-functionaries) uniquely identified by a public key, an Envelope name
SHOULD include the truncated [KEYID](https://github.com/in-toto/docs/blob/v1.0/in-toto-spec.md#421-key-formats) of the public key `<keyid[0:8]>` of
the signing functionary: `<step/env-name>.<keyid[0:8]>.json`.

## Storage convention

[Permalink: Storage convention](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md#storage-convention)

The media type `application/vnd.in-toto.<predicate>+dsse` SHOULD
be used to denote an individual attestation in arbitrary storage systems.

- The `<predicate>` MUST match the [predicate specification filename](https://github.com/in-toto/attestation/blob/main/spec/predicates)
without the file extension. Predicate versioning is handled in the
[Statement](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md) layer.
- Consumers SHOULD NOT rely upon the media type for individual attestations
as faithful indicators of predicate type. Consumer SHOULD only rely on the
`predicateType` field in the [Statement](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md) layer.
- To obtain predicate information that is authenticated, consumers MUST
parse the Envelope's `payload`, and verify it against its `signatures`.

### Examples

[Permalink: Examples](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md#examples)

Example media types for single DSSE-signed attestation predicates include:

- SLSA Provenance: `application/vnd.in-toto.provenance+dsse`
- SPDX: `application/vnd.in-toto.spdx+dsse`
- VSA: `application/vnd.in-toto.vsa+dsse`

## Footnotes

1. There is an [ongoing discussion](https://github.com/sigstore/sig-clients/issues/9) about supporting [DSSE Signature Extensions](https://github.com/secure-systems-lab/dsse/blob/devel/envelope.md#signature-extensions-experimental) to extend the current features of Sigstore Bundles. [↩](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md#user-content-fnref-1-b700a84a7c61e63932c366591d092c19)


You can’t perform that action at this time.
