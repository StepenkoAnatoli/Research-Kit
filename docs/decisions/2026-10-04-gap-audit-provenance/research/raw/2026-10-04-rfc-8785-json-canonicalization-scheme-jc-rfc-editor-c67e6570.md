---
url: https://www.rfc-editor.org/rfc/rfc8785
retrieved: 2026-10-04
command: firecrawl scrape https://www.rfc-editor.org/rfc/rfc8785 --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: RFC 8785: JSON Canonicalization Scheme (JCS) | RFC Editor
---
RFC 8785: JSON Canonicalization Scheme (JCS) \| RFC Editor

Info

# RFC8785:JSON Canonicalization Scheme (JCS)

- [cryptography](https://www.rfc-editor.org/subjects/cryptography/)
- [JSON](https://www.rfc-editor.org/subjects/json/)

- A. Rundgren,
- B. Jordan,
- S. Erdtman

Informational

- Rate this RFC

- Subscribe

- Add to Set


## [Abstract](https://www.rfc-editor.org/info/rfc8785/\#abstract)

Cryptographic operations like hashing and signing need the data to be
expressed in an invariant format so that the operations are reliably
repeatable.

One way to address this is to create a canonical representation of
the data. Canonicalization also permits data to be exchanged in its
original form on the "wire" while cryptographic operations
performed on the canonicalized counterpart of the data in the
producer and consumer endpoints generate consistent results. [¶](https://www.rfc-editor.org/info/rfc8785/#section-abstract-1)

This document describes the JSON Canonicalization Scheme (JCS).
This specification defines how to create a canonical representation
of JSON data by building on the strict serialization methods for
JSON primitives defined by ECMAScript, constraining JSON data to
the Internet JSON (I-JSON) subset, and by using deterministic property
sorting. [¶](https://www.rfc-editor.org/info/rfc8785/#section-abstract-2)

## [Status of This Memo](https://www.rfc-editor.org/info/rfc8785/\#name-status-of-this-memo)

This document is not an Internet Standards Track specification; it is
published for informational purposes. [¶](https://www.rfc-editor.org/info/rfc8785/#section-boilerplate.1-1)

This is a contribution to the RFC Series, independently of any
other RFC stream. The RFC Editor has chosen to publish this
document at its discretion and makes no statement about its value
for implementation or deployment. Documents approved for
publication by the RFC Editor are not candidates for any level of
Internet Standard; see Section 2 of RFC 7841. [¶](https://www.rfc-editor.org/info/rfc8785/#section-boilerplate.1-2)

Information about the current status of this document, any
errata, and how to provide feedback on it may be obtained at
[https://www.rfc-editor.org/info/rfc8785](https://www.rfc-editor.org/info/rfc8785). [¶](https://www.rfc-editor.org/info/rfc8785/#section-boilerplate.1-3)

## [Copyright Notice](https://www.rfc-editor.org/info/rfc8785/\#name-copyright-notice)

Copyright (c) 2020 IETF Trust and the persons identified as the
document authors. All rights reserved. [¶](https://www.rfc-editor.org/info/rfc8785/#section-boilerplate.2-1)

This document is subject to BCP 78 and the IETF Trust's Legal
Provisions Relating to IETF Documents
([https://trustee.ietf.org/license-info](https://trustee.ietf.org/license-info)) in effect on the date of
publication of this document. Please review these documents
carefully, as they describe your rights and restrictions with
respect to this document. [¶](https://www.rfc-editor.org/info/rfc8785/#section-boilerplate.2-2)

## [1\.](https://www.rfc-editor.org/info/rfc8785/\#section-1) [Introduction](https://www.rfc-editor.org/info/rfc8785/\#name-introduction)

This document describes the JSON Canonicalization Scheme (JCS).
This specification defines how to create a canonical representation
of JSON \[ [RFC8259](https://www.rfc-editor.org/info/rfc8785/#RFC8259)\] data by building
on the strict serialization methods for
JSON primitives defined by ECMAScript \[ [ECMA-262](https://www.rfc-editor.org/info/rfc8785/#ECMA-262)\],
constraining JSON data to the I-JSON \[ [RFC7493](https://www.rfc-editor.org/info/rfc8785/#RFC7493)\]
subset, and by using deterministic property sorting. The output from
JCS is a
"hashable" representation of JSON data that can be used by
cryptographic methods.
The subsequent paragraphs outline the primary design considerations. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-1)

Cryptographic operations like hashing and signing need the data to be
expressed in an invariant format so that the operations are reliably
repeatable.
One way to accomplish this is to convert the data into
a format that has a simple and fixed representation,
like base64url \[ [RFC4648](https://www.rfc-editor.org/info/rfc8785/#RFC4648)\].
This is how JSON Web Signature (JWS) \[ [RFC7515](https://www.rfc-editor.org/info/rfc8785/#RFC7515)\] addressed this issue.
Another solution is to create a canonical version of the data,
similar to what was done for the XML signature \[ [XMLDSIG](https://www.rfc-editor.org/info/rfc8785/#XMLDSIG)\] standard. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-2)


The primary advantage with a canonicalizing scheme is that data
can be kept in its original form. This is the core rationale behind
JCS.
Put another way, using canonicalization enables a JSON object to
remain a JSON object
even after being signed. This can simplify system design,
documentation, and logging. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-3)

To avoid "reinventing the wheel", JCS relies on the serialization of
JSON primitives
(strings, numbers, and literals), as defined by ECMAScript (aka
JavaScript)
\[ [ECMA-262](https://www.rfc-editor.org/info/rfc8785/#ECMA-262)\] beginning with version 6. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-4)

Seasoned XML developers may recall difficulties getting XML signatures
to validate. This was usually due to different interpretations of the
quite intricate
XML canonicalization rules as well as of the equally complex
Web Services security standards.
The reasons why JCS should not suffer from similar issues are: [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-5)

- JSON does not have a namespace concept and default values. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-6.1)
- Data is constrained to the I‑JSON \[ [RFC7493](https://www.rfc-editor.org/info/rfc8785/#RFC7493)\] subset.
This eliminates the need for specific parsers for dealing with
canonicalization. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-6.2)
- JCS-compatible serialization of JSON primitives is currently
supported
by most web browsers as well as by Node.js \[ [NODEJS](https://www.rfc-editor.org/info/rfc8785/#NODEJS)\]. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-6.3)
- The full JCS specification is currently supported by multiple
open-source implementations (see [Appendix G](https://www.rfc-editor.org/info/rfc8785/#open.source)).
See also [Appendix F](https://www.rfc-editor.org/info/rfc8785/#impl.guidelines) for
implementation
guidelines. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-6.4)

JCS is compatible with some existing systems relying on JSON
canonicalization such as JSON Web Key (JWK) Thumbprint \[ [RFC7638](https://www.rfc-editor.org/info/rfc8785/#RFC7638)\] and Keybase \[ [KEYBASE](https://www.rfc-editor.org/info/rfc8785/#KEYBASE)\]. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-7)

For potential uses outside of cryptography, see \[ [JSONCOMP](https://www.rfc-editor.org/info/rfc8785/#I-D.rundgren-comparable-json)\]. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-8)

The intended audiences of this document are JSON tool vendors as
well as designers of JSON-based cryptographic solutions.
The reader is assumed to be knowledgeable in ECMAScript, including the
"JSON" object. [¶](https://www.rfc-editor.org/info/rfc8785/#section-1-9)

## [2\.](https://www.rfc-editor.org/info/rfc8785/\#section-2) [Terminology](https://www.rfc-editor.org/info/rfc8785/\#name-terminology)

Note that this document is not on the IETF standards track. However, a
conformant
implementation is supposed to adhere to the specified behavior for
security and interoperability reasons. This text uses BCP 14 to
describe that necessary behavior. [¶](https://www.rfc-editor.org/info/rfc8785/#section-2-1)

The key words "MUST", "MUST NOT",
"REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT",
"RECOMMENDED", "NOT RECOMMENDED",
"MAY", and "OPTIONAL" in this document are
to be interpreted as described in BCP 14 \[ [RFC2119](https://www.rfc-editor.org/info/rfc8785/#RFC2119)\]\[ [RFC8174](https://www.rfc-editor.org/info/rfc8785/#RFC8174)\] when, and only when, they appear in all capitals,
as shown here. [¶](https://www.rfc-editor.org/info/rfc8785/#section-2-2)

## [3\.](https://www.rfc-editor.org/info/rfc8785/\#section-3) [Detailed Operation](https://www.rfc-editor.org/info/rfc8785/\#name-detailed-operation)

This section describes the details related to creating
a canonical JSON representation and how they are addressed by JCS. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3-1)

[Appendix F](https://www.rfc-editor.org/info/rfc8785/#impl.guidelines) describes
the RECOMMENDED way of adding JCS support to existing
JSON tools. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3-2)

### [3.1.](https://www.rfc-editor.org/info/rfc8785/\#section-3.1) [Creation of Input Data](https://www.rfc-editor.org/info/rfc8785/\#name-creation-of-input-data)

Data to be canonically serialized is usually created by: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.1-1)

- Parsing previously generated JSON data. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.1-2.1)
- Programmatically creating data. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.1-2.2)

Irrespective of the method used, the data to be serialized
MUST be adapted
for I‑JSON \[ [RFC7493](https://www.rfc-editor.org/info/rfc8785/#RFC7493)\]
formatting, which implies the following: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.1-3)

- JSON objects MUST NOT exhibit duplicate property
names. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.1-4.1)
- JSON string data MUST be expressible
as Unicode \[ [UNICODE](https://www.rfc-editor.org/info/rfc8785/#UNICODE)\]. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.1-4.2)
- JSON number data MUST be expressible
as IEEE 754 \[ [IEEE754](https://www.rfc-editor.org/info/rfc8785/#IEEE754)\]
double-precision values.
For applications needing higher precision or longer integers than
offered by IEEE 754 double precision, it is
RECOMMENDED to represent such
numbers as JSON strings; see [Appendix D](https://www.rfc-editor.org/info/rfc8785/#json.bignumbers) for
details on how this can be performed in an interoperable and
extensible way. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.1-4.3)

An additional constraint is that parsed JSON string data MUST NOT be altered during subsequent serializations. For more
information, see [Appendix E](https://www.rfc-editor.org/info/rfc8785/#string.subtypes). [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.1-5)

Note: Although the Unicode standard offers the possibility of
rearranging certain character sequences, referred to as "Unicode
Normalization" \[ [UCNORM](https://www.rfc-editor.org/info/rfc8785/#UCNORM)\],
JCS-compliant string processing does not take this into
consideration. That is, all components involved in a scheme
depending on JCS MUST preserve Unicode string data
"as is". [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.1-6)

### [3.2.](https://www.rfc-editor.org/info/rfc8785/\#section-3.2) [Generation of Canonical JSON Data](https://www.rfc-editor.org/info/rfc8785/\#name-generation-of-canonical-jso)

The following subsections describe the steps required to create a
canonical
JSON representation of the data elaborated on in the previous
section. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2-1)

[Appendix A](https://www.rfc-editor.org/info/rfc8785/#canonicalize.js) shows sample code
for an ECMAScript-based canonicalizer, matching the JCS
specification. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2-2)

#### [3.2.1.](https://www.rfc-editor.org/info/rfc8785/\#section-3.2.1) [Whitespace](https://www.rfc-editor.org/info/rfc8785/\#name-whitespace)

Whitespace between JSON tokens MUST NOT be emitted. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.1-1)

#### [3.2.2.](https://www.rfc-editor.org/info/rfc8785/\#section-3.2.2) [Serialization of Primitive Data Types](https://www.rfc-editor.org/info/rfc8785/\#name-serialization-of-primitive-)

Assume the following JSON object is parsed: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2-1)

```json
  {
    "numbers": [333333333.33333329, 1E30, 4.50,\
                2e-3, 0.000000000000000000000000001],
    "string": "\u20ac$\u000F\u000aA'\u0042\u0022\u005c\\\"\/",
    "literals": [null, true, false]
  }
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2-2)

If the parsed data is subsequently serialized using a serializer
compliant with ECMAScript's "JSON.stringify()", the result would
(with a line wrap added for display purposes only) be rather
divergent with respect to the original data: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2-3)

```json
  {"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27],"string":
  "€$\u000f\nA'B\"\\\\\"/","literals":[null,true,false]}
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2-4)

The reason for the difference between the parsed data and its
serialized counterpart is due to a wide tolerance on input data
(as defined
by JSON \[ [RFC8259](https://www.rfc-editor.org/info/rfc8785/#RFC8259)\]), while output
data (as defined by ECMAScript)
has a fixed representation. As can be seen in the example,
numbers are subject to rounding as well. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2-5)

The following subsections describe the serialization of primitive
JSON data types
according to JCS. This part is identical to that of ECMAScript.
In the (unlikely) event that a future version of ECMAScript would
invalidate any of the following serialization methods, it will be
up to the developer community to
either stick to this specification or create a new specification. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2-6)

##### [3.2.2.1.](https://www.rfc-editor.org/info/rfc8785/\#section-3.2.2.1) [Serialization of Literals](https://www.rfc-editor.org/info/rfc8785/\#name-serialization-of-literals)

In accordance with JSON \[ [RFC8259](https://www.rfc-editor.org/info/rfc8785/#RFC8259)\],
the literals "null", "true", and
"false" MUST be serialized as null, true, and
false, respectively. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2.1-1)

##### [3.2.2.2.](https://www.rfc-editor.org/info/rfc8785/\#section-3.2.2.2) [Serialization of Strings](https://www.rfc-editor.org/info/rfc8785/\#name-serialization-of-strings)

For JSON string data (which includes JSON object property names
as well), each Unicode code point MUST be
serialized as described below (see Section 24.3.2.2 of \[ [ECMA-262](https://www.rfc-editor.org/info/rfc8785/#ECMA-262)\]): [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2.2-1)

- If the Unicode value falls within the traditional ASCII
control character range (U+0000 through U+001F), it
MUST be serialized using lowercase hexadecimal
Unicode notation (\\uhhhh) unless it is in the set of
predefined JSON control characters U+0008, U+0009, U+000A,
U+000C, or U+000D, which MUST be serialized as
\\b, \\t, \\n, \\f, and \\r, respectively. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2.2-2.1)
- If the Unicode value is outside of the ASCII control character
range, it MUST be serialized "as is"
unless it is equivalent to U+005C (\\) or U+0022 ("),
which MUST be serialized as \\\ and \\",
respectively. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2.2-2.2)

Finally, the resulting sequence of Unicode code points
MUST be enclosed in double quotes ("). [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2.2-3)

Note: Since invalid Unicode data like "lone surrogates" (e.g.,
U+DEAD)
may lead to interoperability issues including broken signatures,
occurrences of such data MUST cause a compliant
JCS implementation to terminate
with an appropriate error. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2.2-4)

##### [3.2.2.3.](https://www.rfc-editor.org/info/rfc8785/\#section-3.2.2.3) [Serialization of Numbers](https://www.rfc-editor.org/info/rfc8785/\#name-serialization-of-numbers)

ECMAScript builds on the IEEE 754 \[ [IEEE754](https://www.rfc-editor.org/info/rfc8785/#IEEE754)\] double-precision standard for representing
JSON number data. Such data MUST be serialized
according to Section 7.1.12.1 of \[ [ECMA-262](https://www.rfc-editor.org/info/rfc8785/#ECMA-262)\], including the "Note 2" enhancement. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2.3-1)

Due to the relative complexity of this part, the algorithm
itself is not included in this document.
For implementers of JCS-compliant number serialization,
Google's implementation in V8 \[ [V8](https://www.rfc-editor.org/info/rfc8785/#V8)\] may serve as a reference.
Another compatible number serialization reference implementation
is Ryu \[ [RYU](https://www.rfc-editor.org/info/rfc8785/#RYU)\],
which is used by the JCS open-source Java implementation
mentioned in [Appendix G](https://www.rfc-editor.org/info/rfc8785/#open.source).
[Appendix B](https://www.rfc-editor.org/info/rfc8785/#json.ieee754.test) holds a set
of IEEE 754 sample values and their
corresponding JSON serialization. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2.3-2)

Note: Since Not a Number (NaN) and Infinity
are not permitted in JSON, occurrences of NaN or
Infinity MUST cause a compliant JCS
implementation to terminate with an appropriate error. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.2.3-3)

#### [3.2.3.](https://www.rfc-editor.org/info/rfc8785/\#section-3.2.3) [Sorting of Object Properties](https://www.rfc-editor.org/info/rfc8785/\#name-sorting-of-object-propertie)

Although the previous step normalized the representation of
primitive JSON data types, the result would not yet qualify as
"canonical" since JSON object properties are not in lexicographic
(alphabetical) order. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-1)

Applied to the sample in [Section 3.2.2](https://www.rfc-editor.org/info/rfc8785/#json.serialization.data),
a properly canonicalized version should (with a
line wrap added for display purposes only) read as: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-2)

```json
  {"literals":[null,true,false],"numbers":[333333333.3333333,\
  1e+30,4.5,0.002,1e-27],"string":"€$\u000f\nA'B\"\\\\\"/"}
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-3)

The rules for lexicographic sorting of JSON object
properties according to JCS are as follows: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-4)

- JSON object properties MUST be sorted
recursively,
which means that JSON child Objects
MUST have their properties sorted as well. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-5.1)
- JSON array data MUST also be scanned for the
presence of JSON objects (if an object is found, then its
properties MUST be sorted),
but array element order MUST NOT be changed. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-5.2)

When a JSON object is about to have its properties
sorted, the following measures MUST be adhered to: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-6)

- The sorting process is applied to property name strings in their
"raw" (unescaped) form.
That is, a newline character is treated as U+000A. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-7.1)
- Property name strings to be sorted are formatted
as arrays of UTF-16 \[ [UNICODE](https://www.rfc-editor.org/info/rfc8785/#UNICODE)\]
code units.
The sorting is based on pure value comparisons, where code units
are treated as
unsigned integers, independent of locale settings. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-7.2)
- Property name strings either have different values at some
index that is
a valid index for both strings, or their lengths are
different, or both.
If they have different values at one or more index
positions, let k be the smallest such index; then, the string
whose
value at position k has the smaller value, as determined by
using
the "<" operator, lexicographically precedes the other
string.
If there is no index position at which they differ,
then the shorter string lexicographically precedes the longer
string. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-7.3.1)


In plain English, this means that property names are sorted in
ascending order like the following: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-7.3.2)











```
          ""
          "a"
          "aa"
          "ab"
```





[¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-7.3.3)


The rationale for basing the sorting algorithm on UTF-16 code
units is that
it maps directly to the string type in ECMAScript (featured in web
browsers
and Node.js), Java, and .NET. In addition, JSON only supports
escape sequences
expressed as UTF-16 code units, making knowledge and handling of
such data
a necessity anyway.
Systems using another internal representation of string data will
need to convert
JSON property name strings into arrays of UTF-16 code units before
sorting.
The conversion from UTF-8 or UTF-32 to UTF-16 is defined by the
Unicode \[ [UNICODE](https://www.rfc-editor.org/info/rfc8785/#UNICODE)\] standard. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-8)

The following JSON test data can be used for verifying the correctness of
the sorting scheme in a JCS implementation: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-9)

```json
  {
    "\u20ac": "Euro Sign",
    "\r": "Carriage Return",
    "\ufb33": "Hebrew Letter Dalet With Dagesh",
    "1": "One",
    "\ud83d\ude00": "Emoji: Grinning Face",
    "\u0080": "Control",
    "\u00f6": "Latin Small Letter O With Diaeresis"
  }
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-10)

Expected argument order after sorting property strings: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-11)

```
  "Carriage Return"
  "One"
  "Control"
  "Latin Small Letter O With Diaeresis"
  "Euro Sign"
  "Emoji: Grinning Face"
  "Hebrew Letter Dalet With Dagesh"
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-12)

Note: For the purpose of obtaining a deterministic property order,
sorting of data encoded in UTF-8 or UTF-32 would also work, but
the outcome for JSON data like above would differ and thus be
incompatible with this specification.

However, in practice, property names are rarely defined outside of
7-bit ASCII, making it possible to sort string data in UTF-8 or
UTF-32 format without conversion to UTF-16 and still be compatible
with JCS. Whether or not this is a viable option depends on the
environment JCS is used in. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.3-13)

#### [3.2.4.](https://www.rfc-editor.org/info/rfc8785/\#section-3.2.4) [UTF-8 Generation](https://www.rfc-editor.org/info/rfc8785/\#name-utf-8-generation)

Finally, in order to create a platform-independent representation,
the result of the preceding step MUST be encoded in
UTF-8. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.4-1)

Applied to the sample in [Section 3.2.3](https://www.rfc-editor.org/info/rfc8785/#json.sorting.properties), this
should yield the following bytes, here shown in hexadecimal
notation: [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.4-2)

```
  7b 22 6c 69 74 65 72 61 6c 73 22 3a 5b 6e 75 6c 6c 2c 74 72
  75 65 2c 66 61 6c 73 65 5d 2c 22 6e 75 6d 62 65 72 73 22 3a
  5b 33 33 33 33 33 33 33 33 33 2e 33 33 33 33 33 33 33 2c 31
  65 2b 33 30 2c 34 2e 35 2c 30 2e 30 30 32 2c 31 65 2d 32 37
  5d 2c 22 73 74 72 69 6e 67 22 3a 22 e2 82 ac 24 5c 75 30 30
  30 66 5c 6e 41 27 42 5c 22 5c 5c 5c 5c 5c 22 2f 22 7d
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.4-3)

This data is intended to be usable as input to cryptographic
methods. [¶](https://www.rfc-editor.org/info/rfc8785/#section-3.2.4-4)

## [4\.](https://www.rfc-editor.org/info/rfc8785/\#section-4) [IANA Considerations](https://www.rfc-editor.org/info/rfc8785/\#name-iana-considerations)

This document has no IANA actions. [¶](https://www.rfc-editor.org/info/rfc8785/#section-4-1)

## [5\.](https://www.rfc-editor.org/info/rfc8785/\#section-5) [Security Considerations](https://www.rfc-editor.org/info/rfc8785/\#name-security-considerations)

It is crucial to perform sanity checks on input data to avoid
overflowing buffers and similar things that could affect the
integrity of the system. [¶](https://www.rfc-editor.org/info/rfc8785/#section-5-1)

When JCS is applied to signature schemes like the one described
in [Appendix F](https://www.rfc-editor.org/info/rfc8785/#impl.guidelines),
applications MUST perform the following operations
before acting
upon received data: [¶](https://www.rfc-editor.org/info/rfc8785/#section-5-2)

1. Parse the JSON data and verify that it adheres to I-JSON. [¶](https://www.rfc-editor.org/info/rfc8785/#section-5-3.1)
2. Verify the data for correctness according to the conventions defined
    by the
    ecosystem where it is to be used. This also includes locating the
    property holding the signature data. [¶](https://www.rfc-editor.org/info/rfc8785/#section-5-3.2)
3. Verify the signature. [¶](https://www.rfc-editor.org/info/rfc8785/#section-5-3.3)

If any of these steps fail, the operation in progress
MUST be aborted. [¶](https://www.rfc-editor.org/info/rfc8785/#section-5-4)

## [6\.](https://www.rfc-editor.org/info/rfc8785/\#section-6) [References](https://www.rfc-editor.org/info/rfc8785/\#name-references)

### [6.1.](https://www.rfc-editor.org/info/rfc8785/\#section-6.1) [Normative References](https://www.rfc-editor.org/info/rfc8785/\#name-normative-references)

\[ECMA-262\]ECMA International, "ECMAScript 2019 Language Specification", Standard ECMA-262 10th Edition, June 2019, < [https://www.ecma-international.org/ecma-262/10.0/index.html](https://www.ecma-international.org/ecma-262/10.0/index.html) >. \[IEEE754\]IEEE, "IEEE Standard for Floating-Point Arithmetic", IEEE 754-2019, DOI 10.1109/IEEESTD.2019.8766229, < [https://ieeexplore.ieee.org/document/8766229](https://ieeexplore.ieee.org/document/8766229) >. \[RFC2119\]Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10.17487/RFC2119, March 1997, < [https://www.rfc-editor.org/info/rfc2119](https://www.rfc-editor.org/info/rfc2119) >. \[RFC7493\]Bray, T., Ed., "The I-JSON Message Format", RFC 7493, DOI 10.17487/RFC7493, March 2015, < [https://www.rfc-editor.org/info/rfc7493](https://www.rfc-editor.org/info/rfc7493) >. \[RFC8174\]Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, DOI 10.17487/RFC8174, May 2017, < [https://www.rfc-editor.org/info/rfc8174](https://www.rfc-editor.org/info/rfc8174) >. \[RFC8259\]Bray, T., Ed., "The JavaScript Object Notation (JSON) Data Interchange Format", STD 90, RFC 8259, DOI 10.17487/RFC8259, December 2017, < [https://www.rfc-editor.org/info/rfc8259](https://www.rfc-editor.org/info/rfc8259) >. \[UCNORM\]The Unicode Consortium, "Unicode Normalization Forms", < [https://www.unicode.org/reports/tr15/](https://www.unicode.org/reports/tr15/) >. \[UNICODE\]The Unicode Consortium, "The Unicode Standard", < [https://www.unicode.org/versions/latest/](https://www.unicode.org/versions/latest/) >.

### [6.2.](https://www.rfc-editor.org/info/rfc8785/\#section-6.2) [Informative References](https://www.rfc-editor.org/info/rfc8785/\#name-informative-references)

\[JSONCOMP\]Rundgren, A., ""Comparable" JSON (JSONCOMP)", Work in Progress, Internet-Draft, draft-rundgren-comparable-json-04, 13 February 2019, < [https://tools.ietf.org/html/draft-rundgren-comparable-json-04](https://tools.ietf.org/html/draft-rundgren-comparable-json-04) >. \[KEYBASE\]Keybase, "Canonical Packings for JSON and Msgpack", < [https://keybase.io/docs/api/1.0/canonical\_packings](https://keybase.io/docs/api/1.0/canonical_packings) >. \[NODEJS\]OpenJS Foundation, "Node.js", < [https://nodejs.org](https://nodejs.org/) >. \[OPENAPI\]OpenAPI Initiative, "The OpenAPI Specification: a broadly adopted industry standard for describing modern APIs", < [https://www.openapis.org/](https://www.openapis.org/) >. \[RFC4648\]Josefsson, S., "The Base16, Base32, and Base64 Data Encodings", RFC 4648, DOI 10.17487/RFC4648, October 2006, < [https://www.rfc-editor.org/info/rfc4648](https://www.rfc-editor.org/info/rfc4648) >. \[RFC7515\]Jones, M., Bradley, J., and N. Sakimura, "JSON Web Signature (JWS)", RFC 7515, DOI 10.17487/RFC7515, May 2015, < [https://www.rfc-editor.org/info/rfc7515](https://www.rfc-editor.org/info/rfc7515) >. \[RFC7638\]Jones, M. and N. Sakimura, "JSON Web Key (JWK) Thumbprint", RFC 7638, DOI 10.17487/RFC7638, September 2015, < [https://www.rfc-editor.org/info/rfc7638](https://www.rfc-editor.org/info/rfc7638) >. \[RYU\]"Ryu floating point number serializing algorithm", commit 27d3c55, May 2020, < [https://github.com/ulfjack/ryu](https://github.com/ulfjack/ryu) >. \[V8\]Google LLC, "What is V8?", < [https://v8.dev/](https://v8.dev/) >. \[XMLDSIG\]W3C, "XML Signature Syntax and Processing Version 1.1", W3C Recommendation, April 2013, < [https://www.w3.org/TR/xmldsig-core1/](https://www.w3.org/TR/xmldsig-core1/) >.

## [Appendix A.](https://www.rfc-editor.org/info/rfc8785/\#section-appendix.a) [ECMAScript Sample Canonicalizer](https://www.rfc-editor.org/info/rfc8785/\#name-ecmascript-sample-canonical)

Below is an example of a JCS canonicalizer for usage with
ECMAScript-based systems: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.a-1)

```javascript
  ////////////////////////////////////////////////////////////
  // Since the primary purpose of this code is highlighting //
  // the core of the JCS algorithm, error handling and      //
  // UTF-8 generation were not implemented.                 //
  ////////////////////////////////////////////////////////////
  var canonicalize = function(object) {

      var buffer = '';
      serialize(object);
      return buffer;

      function serialize(object) {
          if (object === null || typeof object !== 'object' ||
              object.toJSON != null) {
              /////////////////////////////////////////////////
              // Primitive type or toJSON, use "JSON"        //
              /////////////////////////////////////////////////
              buffer += JSON.stringify(object);

          } else if (Array.isArray(object)) {
              /////////////////////////////////////////////////
              // Array - Maintain element order              //
              /////////////////////////////////////////////////
              buffer += '[';\
              let next = false;\
              object.forEach((element) => {\
                  if (next) {\
                      buffer += ',';\
                  }\
                  next = true;\
                  /////////////////////////////////////////\
                  // Array element - Recursive expansion //\
                  /////////////////////////////////////////\
                  serialize(element);\
              });\
              buffer += ']';

          } else {
              /////////////////////////////////////////////////
              // Object - Sort properties before serializing //
              /////////////////////////////////////////////////
              buffer += '{';
              let next = false;
              Object.keys(object).sort().forEach((property) => {
                  if (next) {
                      buffer += ',';
                  }
                  next = true;
                  /////////////////////////////////////////////
                  // Property names are strings, use "JSON"  //
                  /////////////////////////////////////////////
                  buffer += JSON.stringify(property);
                  buffer += ':';
                  //////////////////////////////////////////
                  // Property value - Recursive expansion //
                  //////////////////////////////////////////
                  serialize(object[property]);
              });
              buffer += '}';
          }
      }
  };
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.a-2)

## [Appendix B.](https://www.rfc-editor.org/info/rfc8785/\#section-appendix.b) [Number Serialization Samples](https://www.rfc-editor.org/info/rfc8785/\#name-number-serialization-sample)

The following table holds a set of ECMAScript-compatible number
serialization samples,
including some edge cases. The column
"IEEE 754" refers to the internal
ECMAScript representation of the "Number" data type, which is based on
the
IEEE 754 \[ [IEEE754](https://www.rfc-editor.org/info/rfc8785/#IEEE754)\] standard using
64-bit (double-precision) values,
here expressed in hexadecimal. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.b-1)

| IEEE 754 | JSON Representation | Comment |
| --- | --- | --- |
| `0000000000000000` | `0` | `Zero` |
| `8000000000000000` | `0` | `Minus zero` |
| `0000000000000001` | `5e-324` | `Min pos number` |
| `8000000000000001` | `-5e-324` | `Min neg number` |
| `7fefffffffffffff` | `1.7976931348623157e+308` | `Max pos number` |
| `ffefffffffffffff` | `-1.7976931348623157e+308` | `Max neg number` |
| `4340000000000000` | `9007199254740992` | `Max pos<br>int    (1)` |
| `c340000000000000` | `-9007199254740992` | `Max neg<br>int    (1)` |
| `4430000000000000` | `295147905179352830000` | `~2**68         (2)<br>` |
| `7fffffffffffffff` |  | `NaN            (3)` |
| `7ff0000000000000` |  | `Infinity       (3)` |
| `44b52d02c7e14af5` | `9.999999999999997e+22` |  |
| `44b52d02c7e14af6` | `1e+23` |  |
| `44b52d02c7e14af7` | `1.0000000000000001e+23` |  |
| `444b1ae4d6e2ef4e` | `999999999999999700000` |  |
| `444b1ae4d6e2ef4f` | `999999999999999900000` |  |
| `444b1ae4d6e2ef50` | `1e+21` |  |
| `3eb0c6f7a0b5ed8c` | `9.999999999999997e-7` |  |
| `3eb0c6f7a0b5ed8d` | `0.000001` |  |
| `41b3de4355555553` | `333333333.3333332` |  |
| `41b3de4355555554` | `333333333.33333325` |  |
| `41b3de4355555555` | `333333333.3333333` |  |
| `41b3de4355555556` | `333333333.3333334` |  |
| `41b3de4355555557` | `333333333.33333343` |  |
| `becbf647612f3696` | `-0.0000033333333333333333` |  |
| `43143ff3c1cb0959` | `1424953923781206.2` | `Round to even  (4)` |

[Table 1](https://www.rfc-editor.org/info/rfc8785/#table-1):
[ECMAScript-Compatible JSON Number Serialization Samples](https://www.rfc-editor.org/info/rfc8785/#name-ecmascript-compatible-json-)

Notes: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.b-3)

(1)
For maximum compliance with the ECMAScript "JSON" object,
values that are to be interpreted as true integers
SHOULD be in the range -9007199254740991 to
9007199254740991.
However, how numbers are used in applications does not affect the
JCS algorithm. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.b-4.1)(2)
Although a set of specific integers like 2\*\*68 could be regarded as
having
extended precision, the JCS/ECMAScript number serialization
algorithm does not take this into consideration. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.b-4.2)(3)
Values out of range are not permitted in JSON.
See [Section 3.2.2.3](https://www.rfc-editor.org/info/rfc8785/#json.ser.number). [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.b-4.3)(4)
This number is exactly 1424953923781206.25 but will, after the "Note
2" rule
mentioned in [Section 3.2.2.3](https://www.rfc-editor.org/info/rfc8785/#json.ser.number), be
truncated and
rounded to the closest even value. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.b-4.4)

For a more exhaustive validation of a JCS number serializer, you may
test against a file (currently) available in the development portal
(see [Appendix I](https://www.rfc-editor.org/info/rfc8785/#json.development)) containing a
large set of sample values. Another option is running V8 \[ [V8](https://www.rfc-editor.org/info/rfc8785/#V8)\] as a live reference together with a
program generating a substantial amount of random IEEE 754 values. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.b-5)

## [Appendix C.](https://www.rfc-editor.org/info/rfc8785/\#section-appendix.c) [Canonicalized JSON as "Wire Format"](https://www.rfc-editor.org/info/rfc8785/\#name-canonicalized-json-as-wire-)

Since the result from the canonicalization process (see [Section 3.2.4](https://www.rfc-editor.org/info/rfc8785/#json.utf8)) is fully valid JSON, it can
also be used as "Wire Format". However, this is just an option since
cryptographic schemes based on JCS, in most cases, would not depend on
that externally supplied JSON data already being canonicalized. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.c-1)

In fact, the ECMAScript standard way of serializing objects using
"JSON.stringify()" produces a
more "logical" format, where properties are
kept in the order they were created or received. The
example below shows an address record that could benefit from
ECMAScript standard serialization: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.c-2)

```json
  {
    "name": "John Doe",
    "address": "2000 Sunset Boulevard",
    "city": "Los Angeles",
    "zip": "90001",
    "state": "CA"
  }
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.c-3)

Using canonicalization, the properties above would be output in the
order
"address", "city", "name", "state", and "zip", which adds fuzziness
to the data from a human (developer or technical support) perspective.
Canonicalization also converts JSON data into a single line of text,
which may
be less than ideal for debugging and logging. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.c-4)

## [Appendix D.](https://www.rfc-editor.org/info/rfc8785/\#section-appendix.d) [Dealing with Big Numbers](https://www.rfc-editor.org/info/rfc8785/\#name-dealing-with-big-numbers)

There are several issues associated with the
JSON number type, here illustrated by the following
sample object: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.d-1)

```json
  {
    "giantNumber": 1.4e+9999,
    "payMeThis": 26000.33,
    "int64Max": 9223372036854775807
  }
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.d-2)

Although the sample above conforms to JSON \[ [RFC8259](https://www.rfc-editor.org/info/rfc8785/#RFC8259)\],
applications would normally use different native data types for
storing
"giantNumber" and "int64Max". In addition, monetary data like
"payMeThis" would
presumably not rely on floating-point data types due to rounding
issues with respect
to decimal arithmetic. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.d-3)

The established way of handling this kind of "overloading" of the
JSON number type (at least in an extensible manner) is through
mapping mechanisms, instructing parsers what to do with different
properties
based on their name. However, this greatly limits the value of using
the
JSON number type outside of its original, somewhat constrained
JavaScript context.
The ECMAScript "JSON" object does not support mappings to the JSON
number type either. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.d-4)

Due to the above, numbers that do not have a natural place in the
current
JSON ecosystem MUST be wrapped using the JSON string
type. This is close to
a de facto standard for open systems. This is also applicable for
other data types that do not have direct support in JSON, like
"DateTime"
objects as described in [Appendix E](https://www.rfc-editor.org/info/rfc8785/#string.subtypes). [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.d-5)

Aided by a system using the JSON string type, be it programmatic like [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.d-6)

```
  var obj = JSON.parse('{"giantNumber": "1.4e+9999"}');
  var biggie = new BigNumber(obj.giantNumber);
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.d-7)

or declarative schemes like OpenAPI \[ [OPENAPI](https://www.rfc-editor.org/info/rfc8785/#OPENAPI)\],
JCS imposes no limits on applications, including when using
ECMAScript. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.d-8)

## [Appendix E.](https://www.rfc-editor.org/info/rfc8785/\#section-appendix.e) [String Subtype Handling](https://www.rfc-editor.org/info/rfc8785/\#name-string-subtype-handling)

Due to the limited set of data types featured in JSON, the JSON string
type is commonly used for holding subtypes. This can, depending on
JSON parsing method, lead to interoperability problems, which
MUST be dealt with by JCS-compliant applications
targeting a wider audience. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-1)

Assume you want to parse a JSON object where the schema
designer assigned the property "big" for holding a "BigInt" subtype
and
"time" for holding a "DateTime" subtype, while "val" is supposed to be
a JSON number
compliant with JCS. The following example shows such an object: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-2)

```json
  {
    "time": "2019-01-28T07:45:10Z",
    "big": "055",
    "val": 3.5
  }
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-3)

Parsing of this object can be accomplished by the following
ECMAScript statement: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-4)

```
  var object = JSON.parse(JSON_object_featured_as_a_string);
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-5)

After parsing, the actual data can be extracted, which for subtypes,
also involves a conversion step using the result of the parsing process
(an ECMAScript object) as input: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-6)

```
  ... = new Date(object.time); // Date object
  ... = BigInt(object.big);    // Big integer
  ... = object.val;            // JSON/JS number
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-7)

Note that the "BigInt" data type is currently only natively supported
by V8 \[ [V8](https://www.rfc-editor.org/info/rfc8785/#V8)\]. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-8)

Canonicalization of "object" using the sample code in [Appendix A](https://www.rfc-editor.org/info/rfc8785/#canonicalize.js) would return the
following string: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-9)

```json
  {"big":"055","time":"2019-01-28T07:45:10Z","val":3.5}
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-10)

Although this is (with respect to JCS) technically correct, there is
another way of parsing JSON data, which also can be used with
ECMAScript as shown below: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-11)

```
  // "BigInt" requires the following code to become JSON serializable
  BigInt.prototype.toJSON = function() {
      return this.toString();
  };

  // JSON parsing using a "stream"-based method
  var object = JSON.parse(JSON_object_featured_as_a_string,
      (k,v) => k == 'time' ? new Date(v) : k == 'big' ? BigInt(v) : v
  );
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-12)

If you now apply the canonicalizer in [Appendix A](https://www.rfc-editor.org/info/rfc8785/#canonicalize.js) to "object", the following string would be
generated: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-13)

```json
  {"big":"55","time":"2019-01-28T07:45:10.000Z","val":3.5}
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-14)

In this case, the string arguments for "big" and "time" have changed
with respect to the original,
presumably making an application depending on JCS fail. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-15)

The reason for the deviation is that in stream- and schema-based JSON
parsers,
the original string argument is typically replaced on the fly
by the native subtype that, when serialized, may exhibit a different
and platform-dependent pattern. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-16)

That is, stream- and schema-based parsing MUST treat
subtypes as "pure" (immutable) JSON string types and perform the
actual conversion to the designated native type in a subsequent step.
In modern programming platforms like Go, Java, and C#, this can be
achieved with moderate efforts by combining annotations, getters, and
setters. Below is an example in C#/Json.NET showing a part of a class
that is serializable as a JSON object: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-17)

```
  // The "pure" string solution uses a local
  // string variable for JSON serialization while
  // exposing another type to the application
  [JsonProperty("amount")]
  private string _amount;

  [JsonIgnore]
  public decimal Amount {
      get { return decimal.Parse(_amount); }
      set { _amount = value.ToString(); }
  }
```

[¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-18)

In an application, "Amount" can be accessed as any other property
while it is actually represented by a quoted string in JSON contexts. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-19)

Note: The example above also addresses the constraints on numeric data
implied by I-JSON (the C# "decimal" data type has quite different
characteristics compared to IEEE 754 double precision). [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.e-20)

## [E.1.](https://www.rfc-editor.org/info/rfc8785/\#section-e.1) [Subtypes in Arrays](https://www.rfc-editor.org/info/rfc8785/\#name-subtypes-in-arrays)

Since the JSON array construct permits mixing arbitrary JSON data
types,
custom parsing and serialization code may be required
to cope with subtypes anyway. [¶](https://www.rfc-editor.org/info/rfc8785/#section-e.1-1)

## [Appendix F.](https://www.rfc-editor.org/info/rfc8785/\#section-appendix.f) [Implementation Guidelines](https://www.rfc-editor.org/info/rfc8785/\#name-implementation-guidelines)

The optimal solution is integrating support for JCS directly
in JSON serializers (parsers need no changes).
That is, canonicalization would just be an additional "mode"
for a JSON serializer. However, this is currently not the case.
Fortunately, JCS support can be introduced through externally supplied
canonicalizer software acting as a post processor to existing
JSON serializers. This arrangement also relieves the JCS implementer
from
having to deal with how underlying data is to be represented in JSON. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-1)

The post processor concept enables signature creation schemes like the
following: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-2)

1. Create the data to be signed. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-3.1)
2. Serialize the data using existing JSON tools. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-3.2)
3. Let the external canonicalizer process the serialized data and
    return canonicalized result data. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-3.3)
4. Sign the canonicalized data. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-3.4)
5. Add the resulting signature value to the original JSON data
    through a designated signature property. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-3.5)
6. Serialize the completed (now signed) JSON object using existing
    JSON tools. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-3.6)

A compatible signature verification scheme would then be as follows: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-4)

1. Parse the signed JSON data using existing JSON tools. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-5.1)
2. Read and save the signature value from the designated signature
    property. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-5.2)
3. Remove the signature property from the parsed JSON object. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-5.3)
4. Serialize the remaining JSON data using existing JSON tools. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-5.4)
5. Let the external canonicalizer process the serialized data and
    return canonicalized result data. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-5.5)
6. Verify that the canonicalized data matches the saved signature
    value
    using the algorithm and key used for creating the signature. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-5.6)

A canonicalizer like above is effectively only a "filter", potentially
usable with
a multitude of quite different cryptographic schemes. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-6)

Using a JSON serializer with integrated JCS support, the serialization
performed
before the canonicalization step could be eliminated for both
processes. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.f-7)

## [Appendix G.](https://www.rfc-editor.org/info/rfc8785/\#section-appendix.g) [Open-Source Implementations](https://www.rfc-editor.org/info/rfc8785/\#name-open-source-implementations)

The following open-source implementations have been verified to be
compatible with JCS: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.g-1)

- JavaScript: < [https://www.npmjs.com/package/canonicalize](https://www.npmjs.com/package/canonicalize) > [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.g-2.1)
- Java: < [https://github.com/erdtman/java-json-canonicalization](https://github.com/erdtman/java-json-canonicalization) > [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.g-2.2)
- Go: < [https://github.com/cyberphone/json-canonicalization/tree/master/go](https://github.com/cyberphone/json-canonicalization/tree/master/go) > [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.g-2.3)
- .NET/C#: < [https://github.com/cyberphone/json-canonicalization/tree/master/dotnet](https://github.com/cyberphone/json-canonicalization/tree/master/dotnet) > [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.g-2.4)
- Python: < [https://github.com/cyberphone/json-canonicalization/tree/master/python3](https://github.com/cyberphone/json-canonicalization/tree/master/python3) > [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.g-2.5)

## [Appendix H.](https://www.rfc-editor.org/info/rfc8785/\#section-appendix.h) [Other JSON Canonicalization Efforts](https://www.rfc-editor.org/info/rfc8785/\#name-other-json-canonicalization)

There are (and have been) other efforts creating "Canonical JSON".
Below is a list of URLs to some of them: [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.h-1)

- < [https://tools.ietf.org/html/draft-staykov-hu-json-canonical-form-00](https://tools.ietf.org/html/draft-staykov-hu-json-canonical-form-00) > [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.h-2.1)
- < [https://gibson042.github.io/canonicaljson-spec/](https://gibson042.github.io/canonicaljson-spec/) > [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.h-2.2)
- < [http://wiki.laptop.org/go/Canonical\_JSON](http://wiki.laptop.org/go/Canonical_JSON) > [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.h-2.3)

The listed efforts all build on text-level JSON-to-JSON
transformations. The primary feature of text-level canonicalization is
that it can be made neutral to the flavor of JSON used. However, such
schemes also imply major changes to the JSON parsing process, which is
a likely hurdle for adoption. Albeit at the expense of certain JSON
and application constraints, JCS was designed to be compatible with
existing JSON tools. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.h-3)

## [Appendix I.](https://www.rfc-editor.org/info/rfc8785/\#section-appendix.i) [Development Portal](https://www.rfc-editor.org/info/rfc8785/\#name-development-portal)

The JCS specification is currently developed at:
< [https://github.com/cyberphone/ietf-json-canon](https://github.com/cyberphone/ietf-json-canon) >. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.i-1)

JCS source code and extensive test data is available at:
< [https://github.com/cyberphone/json-canonicalization](https://github.com/cyberphone/json-canonicalization) >. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.i-2)

## [Acknowledgements](https://www.rfc-editor.org/info/rfc8785/\#name-acknowledgements)

Building on ECMAScript number serialization was
originally proposed by James Manger. This
ultimately led to the
adoption of the entire ECMAScript serialization scheme for JSON
primitives. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.j-1)

Other people who have contributed with valuable input to this
specification include
Scott Ananian,
Tim Bray,
Ben Campbell,
Adrian Farell,
Richard Gibson,
Bron Gondwana,
John-Mark Gurney,
Mike Jones,John Levine,
Mark Miller,
Matthew Miller,
Mark Nottingham,
Mike Samuel,
Jim Schaad,
Robert Tupelo-Schneck,
and Michal Wadas. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.j-2)

For carrying out real-world concept verification, the software and
support for number serialization provided by
Ulf Adams,
Tanner Gooding,
and Remy Oudompheng
was very helpful. [¶](https://www.rfc-editor.org/info/rfc8785/#section-appendix.j-3)

## [Authors' Addresses](https://www.rfc-editor.org/info/rfc8785/\#name-authors-addresses)

Anders Rundgren

Independent

Montpellier

France

Email: [anders.rundgren.net@gmail.com](mailto:anders.rundgren.net@gmail.com)

URI: [https://www.linkedin.com/in/andersrundgren/](https://www.linkedin.com/in/andersrundgren/)

Bret Jordan

Broadcom

1320 Ridder Park Drive

San Jose, CA95131

United States of America

Email: [bret.jordan@broadcom.com](mailto:bret.jordan@broadcom.com)

Samuel Erdtman

Spotify AB

Birger Jarlsgatan 61, 4tr

SE-113 56Stockholm

Sweden

Email: [erdtman@spotify.com](mailto:erdtman@spotify.com)
