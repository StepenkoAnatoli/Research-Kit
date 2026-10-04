---
url: https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md
retrieved: 2026-10-04
command: firecrawl scrape https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: attestation/spec/v1/statement.md at main · in-toto/attestation · GitHub
---
[Skip to content](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md) to refresh your session.Dismiss alert

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

# statement.md

Copy path

Blame

More file actions

Blame

More file actions

## Latest commit

[![TomHennen](https://avatars.githubusercontent.com/u/5216560?v=4&size=40)](https://github.com/TomHennen)[TomHennen](https://github.com/in-toto/attestation/commits?author=TomHennen)

[Clarify that digests don't have to be cryptographic ones. (](https://github.com/in-toto/attestation/commit/06eafe3635bf8a425ad52cc82c6c90861e94a471) [#338](https://github.com/in-toto/attestation/pull/338) [)](https://github.com/in-toto/attestation/commit/06eafe3635bf8a425ad52cc82c6c90861e94a471)

Open commit details

2 years agoMay 6, 2024

[06eafe3](https://github.com/in-toto/attestation/commit/06eafe3635bf8a425ad52cc82c6c90861e94a471) · 2 years agoMay 6, 2024

## History

[History](https://github.com/in-toto/attestation/commits/main/spec/v1/statement.md)

Open commit details

[View commit history for this file.](https://github.com/in-toto/attestation/commits/main/spec/v1/statement.md) History

73 lines (59 loc) · 2.43 KB

· Code owner: @in-toto/attestation-maintainers

/

# statement.md

Copy path

Top

## File metadata and controls

- Preview

- Code

- Blame


73 lines (59 loc) · 2.43 KB

· Code owner: @in-toto/attestation-maintainers

[Raw](https://github.com/in-toto/attestation/raw/refs/heads/main/spec/v1/statement.md)

Copy raw file

Download raw file

You must be signed in to make or propose changes

More edit options

Outline

Edit and raw actions

# Statement layer specification

[Permalink: Statement layer specification](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md#statement-layer-specification)

The Statement is the middle layer of the attestation, binding it to a
particular subject and unambiguously identifying the types of the
[Predicate](https://github.com/in-toto/attestation/blob/main/spec/v1/predicate.md).

## Schema

[Permalink: Schema](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md#schema)

```
{
  "_type": "https://in-toto.io/Statement/v1",
  "subject": [\
    {\
      "name": "<NAME>",\
      "digest": {"<ALGORITHM>": "<HEX_VALUE>"}\
    },\
    ...\
  ],
  "predicateType": "<URI>",
  "predicate": { ... }
}
```

## Fields

[Permalink: Fields](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md#fields)

The Statement is represented as a [JSON](https://www.json.org/json-en.html) object with the following fields.
Additional [parsing rules](https://github.com/in-toto/attestation/blob/main/spec/v1/README.md#parsing-rules) apply.

`_type` _string ( [TypeURI](https://github.com/in-toto/attestation/blob/main/spec/v1/field_types.md#TypeURI)), required_

> Identifier for the schema of the Statement. Always
> `https://in-toto.io/Statement/v1` for this version of the spec.

`subject` _array of [ResourceDescriptor](https://github.com/in-toto/attestation/blob/main/spec/v1/resource_descriptor.md) objects, required_

> Set of software artifacts that the attestation applies to. Each element
> represents a single software artifact. Each element MUST have `digest` set.
>
> Subjects are assumed to be _immutable_, i.e. the artifacts identified by the
> subject SHOULD NOT change.
>
> The `name` field may be used as an identifier to distinguish this artifact
> from others within the `subject`. Similarly, other ResourceDescriptor fields
> may be used as required by the context. The semantics are up to the producer
> and consumer and they MAY use them when evaluating policy. If the name is not
> meaningful, leave the field unset or use "\_". For example, a
> [SLSA Provenance](https://slsa.dev/provenance) attestation might use the name to specify output filename,
> expecting the consumer to only consider entries with a particular name.
> Alternatively, a vulnerability scan attestation might leave name unset because
> the results apply regardless of what the artifact is named.
>
> If set, `name` and `uri` SHOULD be unique within subject.
>
> IMPORTANT: Subject artifacts are matched purely by digest, regardless of
> content type. If this matters to you, please comment on
> [GitHub Issue #28](https://github.com/in-toto/attestation/issues/28)

`predicateType` _string ( [TypeURI](https://github.com/in-toto/attestation/blob/main/spec/v1/field_types.md#TypeURI)), required_

> URI identifying the type of the [Predicate](https://github.com/in-toto/attestation/blob/main/spec/v1/predicate.md).

`predicate` _object, optional_

> Additional parameters of the [Predicate](https://github.com/in-toto/attestation/blob/main/spec/v1/predicate.md). Unset is treated the same as
> set-but-empty. MAY be omitted if `predicateType` fully describes the
> predicate.

You can’t perform that action at this time.
