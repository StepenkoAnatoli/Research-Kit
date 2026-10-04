---
url: https://github.com/in-toto/attestation/blob/main/spec/README.md
retrieved: 2026-10-04
command: firecrawl scrape https://github.com/in-toto/attestation/blob/main/spec/README.md --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: attestation/spec/README.md at main · in-toto/attestation · GitHub
---
[Skip to content](https://github.com/in-toto/attestation/blob/main/spec/README.md#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/in-toto/attestation/blob/main/spec/README.md) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/in-toto/attestation/blob/main/spec/README.md) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/in-toto/attestation/blob/main/spec/README.md) to refresh your session.Dismiss alert

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

# README.md

Copy path

Blame

More file actions

Blame

More file actions

## Latest commit

[![mdeicas](https://avatars.githubusercontent.com/u/60855123?v=4&size=40)](https://github.com/mdeicas)[mdeicas](https://github.com/in-toto/attestation/commits?author=mdeicas)

[Bump minor version to v1.2](https://github.com/in-toto/attestation/commit/2b815f0567e48a0cec4352b5201829111376145b)

Open commit detailssuccess

last yearSep 24, 2025

[2b815f0](https://github.com/in-toto/attestation/commit/2b815f0567e48a0cec4352b5201829111376145b) · last yearSep 24, 2025

## History

[History](https://github.com/in-toto/attestation/commits/main/spec/README.md)

Open commit details

[View commit history for this file.](https://github.com/in-toto/attestation/commits/main/spec/README.md) History

76 lines (57 loc) · 3.43 KB

· Code owner: @in-toto/attestation-maintainers

/

# README.md

Copy path

Top

## File metadata and controls

- Preview

- Code

- Blame


76 lines (57 loc) · 3.43 KB

· Code owner: @in-toto/attestation-maintainers

[Raw](https://github.com/in-toto/attestation/raw/refs/heads/main/spec/README.md)

Copy raw file

Download raw file

You must be signed in to make or propose changes

More edit options

Outline

Edit and raw actions

# in-toto Attestation Framework Spec

[Permalink: in-toto Attestation Framework Spec](https://github.com/in-toto/attestation/blob/main/spec/README.md#in-toto-attestation-framework-spec)

Latest version: [v1.2](https://github.com/in-toto/attestation/blob/main/spec/v1/README.md)

An **in-toto attestation** is authenticated metadata about one or more
software artifacts[1](https://github.com/in-toto/attestation/blob/main/spec/README.md#user-content-fn-1-f6080deb0794d6a06f85e0927d299f89). The intended consumers are automated policy engines,
such as [in-toto-verify](https://github.com/in-toto/in-toto#verification) and [Binary Authorization](https://cloud.google.com/binary-authorization).

It has four layers that are independent but designed to work together:

- [Predicate](https://github.com/in-toto/attestation/blob/main/spec/v1/predicate.md): Contains arbitrary metadata about a subject artifact, with a
type-specific schema.
- [Statement](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md): Binds the attestation to a particular subject and
unambiguously identifies the types of the predicate.
- [Envelope](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md): Handles authentication and serialization.
- [Bundle](https://github.com/in-toto/attestation/blob/main/spec/v1/bundle.md): Defines a method of grouping multiple attestations together.

The following diagram visualises the relationships between the envelope, statement and predicate layers.

[![Relationships between the envelope, statement and predicate layers](https://github.com/in-toto/attestation/raw/main/images/envelope_relationships.png)](https://github.com/in-toto/attestation/blob/main/images/envelope_relationships.png)

For future edits, we provide the [source](https://github.com/in-toto/attestation/blob/main/images/envelope_relationships.excalidraw) of this diagram.

The [validation model](https://github.com/in-toto/attestation/blob/main/docs/validation.md) provides pseudocode showing how these layers fit
together. See the [documentation](https://github.com/in-toto/attestation/blob/main/docs) for more background and examples.

## Tagged Releases

[Permalink: Tagged Releases](https://github.com/in-toto/attestation/blob/main/spec/README.md#tagged-releases)

The latest [tagged release](https://github.com/in-toto/attestation/releases) version matches the [SemVer](https://semver.org/)
MAJOR.MINOR version of the Attestation Framework spec.

Backwards-compatible semantic updates to the spec (except predicates) are
indicated through new tagged MINOR version releases.
We use new tagged PATCH version releases to indicate updates to predicate
specifications and/or backwards-compatible changes to the language bindings.

### Examples

[Permalink: Examples](https://github.com/in-toto/attestation/blob/main/spec/README.md#examples)

- Attestation Framework tagged release v1.0.2 (PATCH version) incorporates
refinements to the predicate specification process, a new predicate type,
and a small patch to the Golang language bindings. None of these changes
affects the semantics of the core spec. The `_type` of a `Statement` is
still `https://in-toto.io/Statement/v1`.

- Tagged release v1.1.0 (MINOR version) generalizes the semantics of the
`DigestSet` field type to support any type of immutable identifier.
This change is backwards comptabile because cryptographic digests are
strongly recommended to achieve immutability, so any implementations that
only support cryptographic `DigestSet` still meet the modified semantics.
The `_type` of a `Statement` is still `https://in-toto.io/Statement/v1`
but a new entry in the `v1` CHANGELOG is added.

- Tagged release v2.0.0 (MAJOR version) changes the meaning of the
`predicateType` field. A new `v2` directory is added to `/spec` and the
`_type` of a `Statement` becomes `https://in-toto.io/Statement/v2`.


## Keywords

[Permalink: Keywords](https://github.com/in-toto/attestation/blob/main/spec/README.md#keywords)

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in all documents under
this specification are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

## Footnotes

1. This is compatible with the [SLSA Attestation Model](https://slsa.dev/attestation-model). [↩](https://github.com/in-toto/attestation/blob/main/spec/README.md#user-content-fnref-1-f6080deb0794d6a06f85e0927d299f89)


You can’t perform that action at this time.
