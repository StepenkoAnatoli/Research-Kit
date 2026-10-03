---
url: https://encoding.spec.whatwg.org/
retrieved: 2026-10-03
command: firecrawl scrape https://encoding.spec.whatwg.org/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Encoding Standard
---
[![WHATWG](https://resources.whatwg.org/logo-encoding.svg)](https://whatwg.org/)

# Encoding

Living Standard — Last Updated 21 May 2026

Participate:
[GitHub whatwg/encoding](https://github.com/whatwg/encoding) ( [new issue](https://github.com/whatwg/encoding/issues/new/choose), [open issues](https://github.com/whatwg/encoding/issues))
[Chat on Matrix](https://whatwg.org/chat)Commits:
[GitHub whatwg/encoding/commits](https://github.com/whatwg/encoding/commits)[Snapshot as of this commit](https://encoding.spec.whatwg.org/commit-snapshots/a985b62a9b45c17da3e17a9f0a0b4e30c34c4a8a/ "You can also press the 'y' key")[@encodings](https://twitter.com/encodings)Tests:
[web-platform-tests encoding/](https://github.com/web-platform-tests/wpt/tree/master/encoding) ( [ongoing work](https://github.com/web-platform-tests/wpt/labels/encoding))
Translations (non-normative):
[日本語](https://triple-underscore.github.io/Encoding-ja.html)[简体中文](https://htmlspecs.com/encoding/)[한국어](https://ko.htmlspecs.com/encoding/)

## Abstract

The Encoding Standard defines encodings and their JavaScript API.

## 1\. Preface

The UTF-8 encoding is the most appropriate encoding for interchange of Unicode, the
universal coded character set. Therefore, for new protocols and formats, as well as
existing formats deployed in new contexts, this specification requires (and defines) the
UTF-8 encoding.

The other (legacy) encodings have been defined to some extent in the past. However,
user agents have not always implemented them in the same way, have not always used the
same labels, and often differ in dealing with undefined and former proprietary areas of
encodings. This specification addresses those gaps so that new user agents do not have to
reverse engineer encoding implementations and existing user agents can converge.

In particular, this specification defines all those encodings, their algorithms to go
from bytes to scalar values and back, and their canonical names and identifying labels.
This specification also defines an API to expose part of the encoding algorithms to
JavaScript.

User agents have also significantly deviated from the labels listed in the
[IANA Character Sets registry](https://www.iana.org/assignments/character-sets/character-sets.xhtml).
To stop spreading legacy encodings further, this specification is exhaustive about the
aforementioned details and therefore has no need for the registry. In particular, this
specification does not provide a mechanism for extending any aspect of encodings.

## 2\. Security background

There is a set of encoding security issues when the producer and consumer do not agree on the
encoding in use, or on the way a given encoding is to be implemented. For instance, an attack was
reported in 2011 where a [Shift\_JIS](https://encoding.spec.whatwg.org/#shift_jis) leading byte 0x82 was used to “mask” a 0x22 trailing byte
in a JSON resource of which an attacker could control some field. The producer did not see the
problem even though this is an illegal byte combination. The consumer decoded it as a single
U+FFFD (�) and therefore changed the overall interpretation as U+0022 (") is an important delimiter.
Decoders of encodings that use multiple bytes for scalar values now require that in case of an
illegal byte combination, a scalar value in the range U+0000 to U+007F, inclusive, cannot be
“masked”. For the aforementioned sequence the output would be U+FFFD U+0022. (As an unfortunate
exception to this, the [gb18030 decoder](https://encoding.spec.whatwg.org/#gb18030-decoder) will “mask” up to one such byte at
[end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream).)

This is a larger issue for encodings that map anything that is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte) to something
that is not an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), when there is no leading byte present. These are
“ASCII-incompatible” encodings and other than [ISO-2022-JP](https://encoding.spec.whatwg.org/#iso-2022-jp) and [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le), which are
unfortunately required due to deployed content, they are not supported. (Investigation is
[ongoing](https://github.com/whatwg/encoding/issues/8)
whether more labels of other such encodings can be mapped to the [replacement](https://encoding.spec.whatwg.org/#replacement) encoding, rather
than the unknown encoding fallback.) An example attack is injecting carefully crafted content into a
resource and then encouraging the user to override the encoding, resulting in, e.g., script
execution.

Encoders used by URLs found in HTML and HTML’s form feature can also result in slight information
loss when an encoding is used that cannot represent all scalar values. E.g., when a resource uses
the [windows-1252](https://encoding.spec.whatwg.org/#windows-1252) encoding a server will not be able to distinguish between an end user
entering “💩” and “&#128169;” into a form.

The problems outlined here go away when exclusively using UTF-8, which is one of the many reasons
that is now the mandatory encoding for all things.

See also the [Browser UI](https://encoding.spec.whatwg.org/#browser-ui) chapter.

## 3\. Terminology

This specification depends on the Infra Standard. [\[INFRA\]](https://encoding.spec.whatwg.org/#biblio-infra "Infra Standard")

Hexadecimal numbers are prefixed with "0x".

In equations, all numbers are integers, addition is represented by "+", subtraction by "−",
multiplication by "×", integer division by "/" (returns the quotient), modulo by "%" (returns the
remainder of an integer division), logical left shifts by "<<", logical right shifts by ">>",
bitwise AND by "&", and bitwise OR by "\|".

For logical right shifts operands must have at least twenty-one bits precision.

* * *

An I/O queue is a type of [list](https://infra.spec.whatwg.org/#list) with
[items](https://infra.spec.whatwg.org/#list-item) of a particular type (i.e., [bytes](https://infra.spec.whatwg.org/#byte) or [scalar values](https://infra.spec.whatwg.org/#scalar-value)).
End-of-queue is a special [item](https://infra.spec.whatwg.org/#list-item) that can be
present in [I/O queues](https://encoding.spec.whatwg.org/#concept-stream) of any type and it signifies that there are no more
[items](https://infra.spec.whatwg.org/#list-item) in the queue.

There are two ways to use an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream): in immediate mode, to represent I/O data
stored in memory, and in streaming mode, to represent data coming in from the network. Immediate
queues have [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) as their last item, whereas streaming queues need not have it, and
so their [read](https://encoding.spec.whatwg.org/#concept-stream-read) operation might block.



It is expected that streaming [I/O queues](https://encoding.spec.whatwg.org/#concept-stream) will be created empty, and that new
[items](https://infra.spec.whatwg.org/#list-item) will be [pushed](https://encoding.spec.whatwg.org/#concept-stream-push) to it as data comes in from the
network. When the underlying network stream closes, an [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) item is to be
[pushed](https://encoding.spec.whatwg.org/#concept-stream-push) into the queue.



Since reading from a streaming [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) might block, streaming
[I/O queues](https://encoding.spec.whatwg.org/#concept-stream) are not to be used from an [event loop](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop). They are to be used
[in parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel) instead.

To read an [item](https://infra.spec.whatwg.org/#list-item) from an
[I/O queue](https://encoding.spec.whatwg.org/#concept-stream) ioQueue, run these steps:

1. If ioQueue [is empty](https://infra.spec.whatwg.org/#list-is-empty), then wait until its [size](https://infra.spec.whatwg.org/#list-size) is
    at least 1.



2. If ioQueue\[0\] is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream).



3. [Remove](https://infra.spec.whatwg.org/#list-remove) ioQueue\[0\] and return it.


To [read](https://encoding.spec.whatwg.org/#concept-stream-read) a number number of [items](https://infra.spec.whatwg.org/#list-item) from
ioQueue, run these steps:

1. Let readItems be « ».



2. Perform the following step number times:


1. [Append](https://infra.spec.whatwg.org/#list-append) to readItems the result of
       [reading](https://encoding.spec.whatwg.org/#concept-stream-read) an item from ioQueue.
3. [Remove](https://infra.spec.whatwg.org/#list-remove) [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) from readItems.



4. Return readItems.


To peek a number number of [items](https://infra.spec.whatwg.org/#list-item)
from an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) ioQueue, run these steps:

1. Wait until either ioQueue’s [size](https://infra.spec.whatwg.org/#list-size) is equal to or greater than
    number, or ioQueue [contains](https://infra.spec.whatwg.org/#list-contain) [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), whichever
    comes first.



2. Let prefix be « ».



3. [For each](https://infra.spec.whatwg.org/#list-iterate) n in [the range](https://infra.spec.whatwg.org/#the-range) 1 to number, inclusive:


1. If ioQueue\[n\] is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), [break](https://infra.spec.whatwg.org/#iteration-break).



2. Otherwise, [append](https://infra.spec.whatwg.org/#list-append) ioQueue\[n\] to prefix.
4. Return prefix.


To push an [item](https://infra.spec.whatwg.org/#list-item) item to an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) ioQueue, run these steps:

1. If the last [item](https://infra.spec.whatwg.org/#list-item) in ioQueue is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream):


1. If item is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), do nothing.



2. Otherwise, [insert](https://infra.spec.whatwg.org/#list-insert) item before the last [item](https://infra.spec.whatwg.org/#list-item) in
       ioQueue.
2. Otherwise, [append](https://infra.spec.whatwg.org/#list-append) item to ioQueue.


To [push](https://encoding.spec.whatwg.org/#concept-stream-push) a sequence of items to an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) ioQueue is to push each item in the sequence to ioQueue, in the given order.

To restore an [item](https://infra.spec.whatwg.org/#list-item) other
than [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) to an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream), perform the [list](https://infra.spec.whatwg.org/#list) [prepend](https://infra.spec.whatwg.org/#list-prepend) operation. To [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) a [list](https://infra.spec.whatwg.org/#list) of
[items](https://infra.spec.whatwg.org/#list-item) excluding [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) to an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream), insert those
items, in the given order, before the first item in the queue.

Inserting the bytes « 0xF0, 0x9F » in an I/O queue
« 0x92 0xA9, [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) », results in an I/O queue
« 0xF0, 0x9F, 0x92 0xA9, [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) ». The next item to be read would be 0xF0.

To convert an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) ioQueue into a
[list](https://infra.spec.whatwg.org/#list), [string](https://infra.spec.whatwg.org/#string), or [byte sequence](https://infra.spec.whatwg.org/#byte-sequence), return the result of
[reading](https://encoding.spec.whatwg.org/#concept-stream-read) an indefinite number of [items](https://infra.spec.whatwg.org/#list-item) from
ioQueue.

To convert a [list](https://infra.spec.whatwg.org/#list), [string](https://infra.spec.whatwg.org/#string), or
[byte sequence](https://infra.spec.whatwg.org/#byte-sequence) input into an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream), run these steps:

1. [Assert](https://infra.spec.whatwg.org/#assert): input is not a [list](https://infra.spec.whatwg.org/#list) or it does not
    [contain](https://infra.spec.whatwg.org/#list-contain) [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream).



2. Return an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) containing the [items](https://infra.spec.whatwg.org/#list-item) in input,
    in order, followed by [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream).


The Infra standard is expected to define some infrastructure around type conversions.
See [whatwg/infra issue #319](https://github.com/whatwg/infra/issues/319). [\[INFRA\]](https://encoding.spec.whatwg.org/#biblio-infra "Infra Standard")

[I/O queues](https://encoding.spec.whatwg.org/#concept-stream) are defined as [lists](https://infra.spec.whatwg.org/#list), not
[queues](https://infra.spec.whatwg.org/#queue), because they feature a [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) operation. However,
this restore operation is an internal detail of the algorithms in this specification, and is not to
be used by other standards. Implementations are free to find alternative ways to implement such
algorithms, as detailed in [Implementation considerations](https://encoding.spec.whatwg.org/#implementation-considerations).

* * *

To obtain a scalar value from surrogates, given a [leading surrogate](https://infra.spec.whatwg.org/#leading-surrogate) leading and a [trailing surrogate](https://infra.spec.whatwg.org/#trailing-surrogate) trailing, return
0x10000 + ((leading − 0xD800) << 10) + (trailing − 0xDC00).

* * *

To create a `Uint8Array` object, given an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) ioQueue and a [realm](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#realm) realm:

1. Let bytes be the result of [converting](https://encoding.spec.whatwg.org/#from-i-o-queue-convert) ioQueue into a byte sequence.



2. Return the result of [creating](https://webidl.spec.whatwg.org/#arraybufferview-create) a `Uint8Array` object from
    bytes in realm.


## 4\. Encodings

An encoding defines a mapping from a [scalar value](https://infra.spec.whatwg.org/#scalar-value) sequence to
a [byte](https://infra.spec.whatwg.org/#byte) sequence (and vice versa). Each [encoding](https://encoding.spec.whatwg.org/#encoding) has a
name, and one or more
labels.

This specification defines three [encodings](https://encoding.spec.whatwg.org/#encoding) with the same
names as _encoding schemes_ defined in the Unicode standard: [UTF-8](https://encoding.spec.whatwg.org/#utf-8), [UTF-16LE](https://encoding.spec.whatwg.org/#utf-16le), and
[UTF-16BE](https://encoding.spec.whatwg.org/#utf-16be). The [encodings](https://encoding.spec.whatwg.org/#encoding) differ from the _encoding schemes_ by byte order
mark (also known as BOM) handling not being part of the [encodings](https://encoding.spec.whatwg.org/#encoding) themselves and
instead being part of wrapper algorithms in this specification, whereas byte order mark handling is
part of the definition of the _encoding schemes_ in the Unicode Standard. [UTF-8](https://encoding.spec.whatwg.org/#utf-8) used
together with the [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) algorithm matches the _encoding scheme_ of the same name.
This specification does not provide wrapper algorithms that would combine with [UTF-16LE](https://encoding.spec.whatwg.org/#utf-16le) and
[UTF-16BE](https://encoding.spec.whatwg.org/#utf-16be) to match the similarly-named _encoding schemes_. [\[UNICODE\]](https://encoding.spec.whatwg.org/#biblio-unicode "The Unicode Standard")

### 4.1. Encoders and decoders

Each [encoding](https://encoding.spec.whatwg.org/#encoding) has an associated decoder and most of them have an
associated encoder. Instances of [decoders](https://encoding.spec.whatwg.org/#decoder) and [encoders](https://encoding.spec.whatwg.org/#encoder) have a
handler algorithm and might also have state. A [handler](https://encoding.spec.whatwg.org/#handler) algorithm takes an input
[I/O queue](https://encoding.spec.whatwg.org/#concept-stream) and an [item](https://infra.spec.whatwg.org/#list-item), and returns
finished, one or more [items](https://infra.spec.whatwg.org/#list-item), error
optionally with a [code point](https://infra.spec.whatwg.org/#code-point), or continue.

The [replacement](https://encoding.spec.whatwg.org/#replacement) and [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le) [encodings](https://encoding.spec.whatwg.org/#encoding) have
no [encoder](https://encoding.spec.whatwg.org/#encoder).

An error mode as used below is "`replacement`" or "`fatal`" for
a [decoder](https://encoding.spec.whatwg.org/#decoder) and "`fatal`" or "`html`" for an [encoder](https://encoding.spec.whatwg.org/#encoder).

An XML processor would set [error mode](https://encoding.spec.whatwg.org/#error-mode) to "`fatal`".
[\[XML\]](https://encoding.spec.whatwg.org/#biblio-xml "Extensible Markup Language (XML) 1.0 (Fifth Edition)")

"`html`" exists as [error mode](https://encoding.spec.whatwg.org/#error-mode) due to HTML forms requiring a
non-terminating legacy [encoder](https://encoding.spec.whatwg.org/#encoder). The "`html`" [error mode](https://encoding.spec.whatwg.org/#error-mode) causes
a sequence to be emitted that cannot be distinguished from legitimate input and can therefore lead
to silent data loss. Developers are strongly encouraged to use the [UTF-8](https://encoding.spec.whatwg.org/#utf-8) [encoding](https://encoding.spec.whatwg.org/#encoding) to prevent this from happening. [\[HTML\]](https://encoding.spec.whatwg.org/#biblio-html "HTML Standard")

* * *

To process a queue
given an [encoding](https://encoding.spec.whatwg.org/#encoding)’s [decoder](https://encoding.spec.whatwg.org/#decoder) or [encoder](https://encoding.spec.whatwg.org/#encoder) instance
encoderDecoder, [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) input, [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) output, and [error mode](https://encoding.spec.whatwg.org/#error-mode) mode:

1. While true:


1. Let result be the result of [processing an item](https://encoding.spec.whatwg.org/#concept-encoding-process) with the result of
       [reading](https://encoding.spec.whatwg.org/#concept-stream-read) from input, encoderDecoder, input,
       output, and mode.



2. If result is not [continue](https://encoding.spec.whatwg.org/#continue), then return result.

To process an item
given an [item](https://infra.spec.whatwg.org/#list-item) item, [encoding](https://encoding.spec.whatwg.org/#encoding)’s [encoder](https://encoding.spec.whatwg.org/#encoder) or
[decoder](https://encoding.spec.whatwg.org/#decoder) instance encoderDecoder, [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) input,
[I/O queue](https://encoding.spec.whatwg.org/#concept-stream) output, and [error mode](https://encoding.spec.whatwg.org/#error-mode) mode:

1. [Assert](https://infra.spec.whatwg.org/#assert): encoderDecoder is not an [encoder](https://encoding.spec.whatwg.org/#encoder) instance or
    mode is not "`replacement`".



2. [Assert](https://infra.spec.whatwg.org/#assert): encoderDecoder is not a [decoder](https://encoding.spec.whatwg.org/#decoder) instance or
    mode is not "`html`".



3. [Assert](https://infra.spec.whatwg.org/#assert): encoderDecoder is not an [encoder](https://encoding.spec.whatwg.org/#encoder) instance or
    item is not a [surrogate](https://infra.spec.whatwg.org/#surrogate).



4. Let result be the result of running encoderDecoder’s [handler](https://encoding.spec.whatwg.org/#handler) on
    input and item.



5. If result is [finished](https://encoding.spec.whatwg.org/#finished):


1. [Push](https://encoding.spec.whatwg.org/#concept-stream-push) [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) to output.



2. Return result.
6. Otherwise, if result is one or more [items](https://infra.spec.whatwg.org/#list-item):


1. [Assert](https://infra.spec.whatwg.org/#assert): encoderDecoder is not a [decoder](https://encoding.spec.whatwg.org/#decoder) instance or
       result does not contain any [surrogates](https://infra.spec.whatwg.org/#surrogate).



2. [Push](https://encoding.spec.whatwg.org/#concept-stream-push) result to output.
7. Otherwise, if result is an [error](https://encoding.spec.whatwg.org/#error), switch on mode and run the
    associated steps:


"`replacement`"

    [Push](https://encoding.spec.whatwg.org/#concept-stream-push) U+FFFD (�) to output.


    "`html`"

    [Push](https://encoding.spec.whatwg.org/#concept-stream-push) 0x26 (&), 0x23 (#), followed by the shortest sequence of 0x30 (0) to
    0x39 (9), inclusive, representing result’s [code point](https://infra.spec.whatwg.org/#code-point)’s
    [value](https://infra.spec.whatwg.org/#code-point-value) in base ten, followed by 0x3B (;) to output.


    "`fatal`"

    Return result.


8. Return [continue](https://encoding.spec.whatwg.org/#continue).


### 4.2. Names and labels

The table below lists all [encodings](https://encoding.spec.whatwg.org/#encoding)
and their [labels](https://encoding.spec.whatwg.org/#label) user agents must support.
User agents must not support any other [encodings](https://encoding.spec.whatwg.org/#encoding)
or [labels](https://encoding.spec.whatwg.org/#label).

For each encoding, [ASCII-lowercasing](https://infra.spec.whatwg.org/#ascii-lowercase) its
[name](https://encoding.spec.whatwg.org/#name) yields one of its [labels](https://encoding.spec.whatwg.org/#label).

Authors must use the [UTF-8](https://encoding.spec.whatwg.org/#utf-8) [encoding](https://encoding.spec.whatwg.org/#encoding) and must use its
( [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive)) "`utf-8`" [label](https://encoding.spec.whatwg.org/#label) to identify it.

New protocols and formats, as well as existing formats deployed in new contexts, must use the
[UTF-8](https://encoding.spec.whatwg.org/#utf-8) [encoding](https://encoding.spec.whatwg.org/#encoding) exclusively. If these protocols and formats need to expose the
[encoding](https://encoding.spec.whatwg.org/#encoding)’s [name](https://encoding.spec.whatwg.org/#name) or [label](https://encoding.spec.whatwg.org/#label), they must expose it
as "`utf-8`".

To
get an encoding
from a string label, run these steps:

1. Remove any leading and trailing [ASCII whitespace](https://infra.spec.whatwg.org/#ascii-whitespace) from
    label.



2. If label is an [ASCII case-insensitive](https://infra.spec.whatwg.org/#ascii-case-insensitive) match for any of the labels listed
    in the table below, then return the corresponding [encoding](https://encoding.spec.whatwg.org/#encoding); otherwise return failure.


This is a more basic and restrictive algorithm of mapping labels to
[encodings](https://encoding.spec.whatwg.org/#encoding) than
[section 1.4 of Unicode Technical Standard #22](https://www.unicode.org/reports/tr22/tr22-8.html#Charset_Alias_Matching)
prescribes, as that is necessary to be compatible with deployed content.

| Name | Labels |
| --- | --- |
| [The Encoding](https://encoding.spec.whatwg.org/#the-encoding) |
| [UTF-8](https://encoding.spec.whatwg.org/#utf-8) | "`unicode-1-1-utf-8`" |
| "`unicode11utf8`" |
| "`unicode20utf8`" |
| "`utf-8`" |
| "`utf8`" |
| "`x-unicode20utf8`" |
| [Legacy single-byte encodings](https://encoding.spec.whatwg.org/#legacy-single-byte-encodings) |
| [IBM866](https://encoding.spec.whatwg.org/#ibm866) | "`866`" |
| "`cp866`" |
| "`csibm866`" |
| "`ibm866`" |
| [ISO-8859-2](https://encoding.spec.whatwg.org/#iso-8859-2) | "`csisolatin2`" |
| "`iso-8859-2`" |
| "`iso-ir-101`" |
| "`iso8859-2`" |
| "`iso88592`" |
| "`iso_8859-2`" |
| "`iso_8859-2:1987`" |
| "`l2`" |
| "`latin2`" |
| [ISO-8859-3](https://encoding.spec.whatwg.org/#iso-8859-3) | "`csisolatin3`" |
| "`iso-8859-3`" |
| "`iso-ir-109`" |
| "`iso8859-3`" |
| "`iso88593`" |
| "`iso_8859-3`" |
| "`iso_8859-3:1988`" |
| "`l3`" |
| "`latin3`" |
| [ISO-8859-4](https://encoding.spec.whatwg.org/#iso-8859-4) | "`csisolatin4`" |
| "`iso-8859-4`" |
| "`iso-ir-110`" |
| "`iso8859-4`" |
| "`iso88594`" |
| "`iso_8859-4`" |
| "`iso_8859-4:1988`" |
| "`l4`" |
| "`latin4`" |
| [ISO-8859-5](https://encoding.spec.whatwg.org/#iso-8859-5) | "`csisolatincyrillic`" |
| "`cyrillic`" |
| "`iso-8859-5`" |
| "`iso-ir-144`" |
| "`iso8859-5`" |
| "`iso88595`" |
| "`iso_8859-5`" |
| "`iso_8859-5:1988`" |
| [ISO-8859-6](https://encoding.spec.whatwg.org/#iso-8859-6) | "`arabic`" |
| "`asmo-708`" |
| "`csiso88596e`" |
| "`csiso88596i`" |
| "`csisolatinarabic`" |
| "`ecma-114`" |
| "`iso-8859-6`" |
| "`iso-8859-6-e`" |
| "`iso-8859-6-i`" |
| "`iso-ir-127`" |
| "`iso8859-6`" |
| "`iso88596`" |
| "`iso_8859-6`" |
| "`iso_8859-6:1987`" |
| [ISO-8859-7](https://encoding.spec.whatwg.org/#iso-8859-7) | "`csisolatingreek`" |
| "`ecma-118`" |
| "`elot_928`" |
| "`greek`" |
| "`greek8`" |
| "`iso-8859-7`" |
| "`iso-ir-126`" |
| "`iso8859-7`" |
| "`iso88597`" |
| "`iso_8859-7`" |
| "`iso_8859-7:1987`" |
| "`sun_eu_greek`" |
| [ISO-8859-8](https://encoding.spec.whatwg.org/#iso-8859-8) | "`csiso88598e`" |
| "`csisolatinhebrew`" |
| "`hebrew`" |
| "`iso-8859-8`" |
| "`iso-8859-8-e`" |
| "`iso-ir-138`" |
| "`iso8859-8`" |
| "`iso88598`" |
| "`iso_8859-8`" |
| "`iso_8859-8:1988`" |
| "`visual`" |
| [ISO-8859-8-I](https://encoding.spec.whatwg.org/#iso-8859-8-i) | "`csiso88598i`" |
| "`iso-8859-8-i`" |
| "`logical`" |
| [ISO-8859-10](https://encoding.spec.whatwg.org/#iso-8859-10) | "`csisolatin6`" |
| "`iso-8859-10`" |
| "`iso-ir-157`" |
| "`iso8859-10`" |
| "`iso885910`" |
| "`l6`" |
| "`latin6`" |
| [ISO-8859-13](https://encoding.spec.whatwg.org/#iso-8859-13) | "`iso-8859-13`" |
| "`iso8859-13`" |
| "`iso885913`" |
| [ISO-8859-14](https://encoding.spec.whatwg.org/#iso-8859-14) | "`iso-8859-14`" |
| "`iso8859-14`" |
| "`iso885914`" |
| [ISO-8859-15](https://encoding.spec.whatwg.org/#iso-8859-15) | "`csisolatin9`" |
| "`iso-8859-15`" |
| "`iso8859-15`" |
| "`iso885915`" |
| "`iso_8859-15`" |
| "`l9`" |
| [ISO-8859-16](https://encoding.spec.whatwg.org/#iso-8859-16) | "`iso-8859-16`" |
| [KOI8-R](https://encoding.spec.whatwg.org/#koi8-r) | "`cskoi8r`" |
| "`koi`" |
| "`koi8`" |
| "`koi8-r`" |
| "`koi8_r`" |
| [KOI8-U](https://encoding.spec.whatwg.org/#koi8-u) | "`koi8-ru`" |
| "`koi8-u`" |
| [macintosh](https://encoding.spec.whatwg.org/#macintosh) | "`csmacintosh`" |
| "`mac`" |
| "`macintosh`" |
| "`x-mac-roman`" |
| [windows-874](https://encoding.spec.whatwg.org/#windows-874) | "`dos-874`" |
| "`iso-8859-11`" |
| "`iso8859-11`" |
| "`iso885911`" |
| "`tis-620`" |
| "`windows-874`" |
| [windows-1250](https://encoding.spec.whatwg.org/#windows-1250) | "`cp1250`" |
| "`windows-1250`" |
| "`x-cp1250`" |
| [windows-1251](https://encoding.spec.whatwg.org/#windows-1251) | "`cp1251`" |
| "`windows-1251`" |
| "`x-cp1251`" |
| [windows-1252](https://encoding.spec.whatwg.org/#windows-1252) <br>See [below](https://encoding.spec.whatwg.org/#note-latin1-ascii) for the relationship to historical<br>"Latin1" and "ASCII" concepts. | "`ansi_x3.4-1968`" |
| "`ascii`" |
| "`cp1252`" |
| "`cp819`" |
| "`csisolatin1`" |
| "`ibm819`" |
| "`iso-8859-1`" |
| "`iso-ir-100`" |
| "`iso8859-1`" |
| "`iso88591`" |
| "`iso_8859-1`" |
| "`iso_8859-1:1987`" |
| "`l1`" |
| "`latin1`" |
| "`us-ascii`" |
| "`windows-1252`" |
| "`x-cp1252`" |
| [windows-1253](https://encoding.spec.whatwg.org/#windows-1253) | "`cp1253`" |
| "`windows-1253`" |
| "`x-cp1253`" |
| [windows-1254](https://encoding.spec.whatwg.org/#windows-1254) | "`cp1254`" |
| "`csisolatin5`" |
| "`iso-8859-9`" |
| "`iso-ir-148`" |
| "`iso8859-9`" |
| "`iso88599`" |
| "`iso_8859-9`" |
| "`iso_8859-9:1989`" |
| "`l5`" |
| "`latin5`" |
| "`windows-1254`" |
| "`x-cp1254`" |
| [windows-1255](https://encoding.spec.whatwg.org/#windows-1255) | "`cp1255`" |
| "`windows-1255`" |
| "`x-cp1255`" |
| [windows-1256](https://encoding.spec.whatwg.org/#windows-1256) | "`cp1256`" |
| "`windows-1256`" |
| "`x-cp1256`" |
| [windows-1257](https://encoding.spec.whatwg.org/#windows-1257) | "`cp1257`" |
| "`windows-1257`" |
| "`x-cp1257`" |
| [windows-1258](https://encoding.spec.whatwg.org/#windows-1258) | "`cp1258`" |
| "`windows-1258`" |
| "`x-cp1258`" |
| [x-mac-cyrillic](https://encoding.spec.whatwg.org/#x-mac-cyrillic) | "`x-mac-cyrillic`" |
| "`x-mac-ukrainian`" |
| [Legacy multi-byte Chinese (simplified) encodings](https://encoding.spec.whatwg.org/#legacy-multi-byte-chinese-(simplified)-encodings) |
| [GBK](https://encoding.spec.whatwg.org/#gbk) | "`chinese`" |
| "`csgb2312`" |
| "`csiso58gb231280`" |
| "`gb2312`" |
| "`gb_2312`" |
| "`gb_2312-80`" |
| "`gbk`" |
| "`iso-ir-58`" |
| "`x-gbk`" |
| [gb18030](https://encoding.spec.whatwg.org/#gb18030) | "`gb18030`" |
| [Legacy multi-byte Chinese (traditional) encodings](https://encoding.spec.whatwg.org/#legacy-multi-byte-chinese-(traditional)-encodings) |
| [Big5](https://encoding.spec.whatwg.org/#big5) | "`big5`" |
| "`big5-hkscs`" |
| "`cn-big5`" |
| "`csbig5`" |
| "`x-x-big5`" |
| [Legacy multi-byte Japanese encodings](https://encoding.spec.whatwg.org/#legacy-multi-byte-japanese-encodings) |
| [EUC-JP](https://encoding.spec.whatwg.org/#euc-jp) | "`cseucpkdfmtjapanese`" |
| "`euc-jp`" |
| "`x-euc-jp`" |
| [ISO-2022-JP](https://encoding.spec.whatwg.org/#iso-2022-jp) | "`csiso2022jp`" |
| "`iso-2022-jp`" |
| [Shift\_JIS](https://encoding.spec.whatwg.org/#shift_jis) | "`csshiftjis`" |
| "`ms932`" |
| "`ms_kanji`" |
| "`shift-jis`" |
| "`shift_jis`" |
| "`sjis`" |
| "`windows-31j`" |
| "`x-sjis`" |
| [Legacy multi-byte Korean encodings](https://encoding.spec.whatwg.org/#legacy-multi-byte-korean-encodings) |
| [EUC-KR](https://encoding.spec.whatwg.org/#euc-kr) | "`cseuckr`" |
| "`csksc56011987`" |
| "`euc-kr`" |
| "`iso-ir-149`" |
| "`korean`" |
| "`ks_c_5601-1987`" |
| "`ks_c_5601-1989`" |
| "`ksc5601`" |
| "`ksc_5601`" |
| "`windows-949`" |
| [Legacy miscellaneous encodings](https://encoding.spec.whatwg.org/#legacy-miscellaneous-encodings) |
| [replacement](https://encoding.spec.whatwg.org/#replacement) | "`csiso2022kr`" |
| "`hz-gb-2312`" |
| "`iso-2022-cn`" |
| "`iso-2022-cn-ext`" |
| "`iso-2022-kr`" |
| "`replacement`" |
| [UTF-16BE](https://encoding.spec.whatwg.org/#utf-16be) | "`unicodefffe`" |
| "`utf-16be`" |
| [UTF-16LE](https://encoding.spec.whatwg.org/#utf-16le) | "`csunicode`" |
| "`iso-10646-ucs-2`" |
| "`ucs-2`" |
| "`unicode`" |
| "`unicodefeff`" |
| "`utf-16`" |
| "`utf-16le`" |
| [x-user-defined](https://encoding.spec.whatwg.org/#x-user-defined) | "`x-user-defined`" |

All [encodings](https://encoding.spec.whatwg.org/#encoding) and their [labels](https://encoding.spec.whatwg.org/#label) are also available as
non-normative [encodings.json](https://encoding.spec.whatwg.org/encodings.json) resource.

The set of supported [encodings](https://encoding.spec.whatwg.org/#encoding) is primarily based
on the intersection of the sets supported by major browser engines when the development of this
standard started, while removing encodings that were rarely used legitimately but that could be used
in attacks. The inclusion of some encodings is questionable in the light of anecdotal evidence of
the level of use by existing Web content. That is, while they have been broadly supported by
browsers, it is unclear if they are broadly used by Web content. However, an effort has not been
made to eagerly remove [single-byte encodings](https://encoding.spec.whatwg.org/#single-byte-encoding) that were broadly supported by browsers or are
part of the ISO 8859 series. In particular, the necessity of the inclusion of [IBM866](https://encoding.spec.whatwg.org/#ibm866),
[macintosh](https://encoding.spec.whatwg.org/#macintosh), [x-mac-cyrillic](https://encoding.spec.whatwg.org/#x-mac-cyrillic), [ISO-8859-3](https://encoding.spec.whatwg.org/#iso-8859-3), [ISO-8859-10](https://encoding.spec.whatwg.org/#iso-8859-10), [ISO-8859-14](https://encoding.spec.whatwg.org/#iso-8859-14),
and [ISO-8859-16](https://encoding.spec.whatwg.org/#iso-8859-16) is doubtful for the purpose of supporting existing content, but there are no
plans to remove these.

The [windows-1252](https://encoding.spec.whatwg.org/#windows-1252) [encoding](https://encoding.spec.whatwg.org/#encoding) has various [labels](https://encoding.spec.whatwg.org/#label), such as
"`latin1`", "`iso-8859-1`", and "`ascii`", which have historically
been confusing for developers. On the web, and in any software that seeks to be web-compatible by
implementing this standard, these are synonyms: "`latin1`" and "`ascii`" are
just labels for [windows-1252](https://encoding.spec.whatwg.org/#windows-1252), and any software following this standard will, for example,
decode 0x80 as U+20AC (€) when asked for the "Latin1" or "ASCII" decoding of that byte.



Software that does not follow this standard does not always give the same answers. The root of
this is that the original document that specified Latin1 (ISO/IEC 8859-1) did not provide any
mappings for bytes in the inclusive ranges 0x00 to 0x1F or 0x7F to 0x9F. Similarly, the original
documents that specified ASCII (ISO/IEC 646, among others) did not provide any mappings for bytes
in the inclusive range 0x80 to 0xFF. This means different software has chosen different code point
mappings for those bytes when asked to use Latin1 or ASCII encodings. Web browsers and
browser-compatible software have chosen to map those bytes according to [windows-1252](https://encoding.spec.whatwg.org/#windows-1252), which
is a superset of both, and this choice was codified in this standard. Other software throws errors,
or uses [isomorphic decoding](https://infra.spec.whatwg.org/#isomorphic-decode), or other mappings. [\[ISO8859-1\]](https://encoding.spec.whatwg.org/#biblio-iso8859-1 "Information technology — 8-bit single-byte coded graphic character sets — Part 1: Latin alphabet No. 1") [\[ISO646\]](https://encoding.spec.whatwg.org/#biblio-iso646 "Information technology — ISO 7-bit coded character set for information interchange")

As such, implementers and developers need to be careful whenever they are using libraries which
expose APIs in terms of "Latin1" or "ASCII". It’s very possible such libraries will not give
answers in line with this standard, if they have chosen other behaviors for the bytes which were
left undefined in the original specifications.

### 4.3. Output encodings

To get an output encoding from an [encoding](https://encoding.spec.whatwg.org/#encoding) encoding, run these steps:

1. If encoding is [replacement](https://encoding.spec.whatwg.org/#replacement) or [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le), then return
    [UTF-8](https://encoding.spec.whatwg.org/#utf-8).



2. Return encoding.


The [get an output encoding](https://encoding.spec.whatwg.org/#get-an-output-encoding) algorithm is useful for URL parsing and HTML
form submission, which both need exactly this.

## 5\. Indexes

Most legacy [encodings](https://encoding.spec.whatwg.org/#encoding) make use of an index. An
[index](https://encoding.spec.whatwg.org/#index) is an ordered list of entries, each entry consisting of a pointer and a
corresponding code point. Within an [index](https://encoding.spec.whatwg.org/#index) pointers are unique and code points can be
duplicated.

An efficient implementation likely has two
[indexes](https://encoding.spec.whatwg.org/#index) per [encoding](https://encoding.spec.whatwg.org/#encoding). One optimized for its
[decoder](https://encoding.spec.whatwg.org/#decoder) and one for its [encoder](https://encoding.spec.whatwg.org/#encoder).

To find the pointers and their corresponding code points in an [index](https://encoding.spec.whatwg.org/#index),
let lines be the result of splitting the resource’s contents on U+000A LF.
Then remove each item in lines that is the empty string or starts with U+0023 (#).
Then the pointers and their corresponding code points are found by splitting each item in lines on U+0009 TAB.
The first subitem is the pointer (as a decimal number) and the second is the corresponding code point (as a hexadecimal number).
Other subitems are not relevant.

To signify changes an [index](https://encoding.spec.whatwg.org/#index) includes an
_Identifier_ and a _Date_. If an _Identifier_ has
changed, so has the [index](https://encoding.spec.whatwg.org/#index).

The index code point for pointer in
index is the code point corresponding to
pointer in index, or null if
pointer is not in index.

The index pointer for codePoint in
index is the _first_ pointer corresponding to
codePoint in index, or null if
codePoint is not in index.

There is a non-normative visualization for each [index](https://encoding.spec.whatwg.org/#index) other than
[index gb18030 ranges](https://encoding.spec.whatwg.org/#index-gb18030-ranges) and [index ISO-2022-JP katakana](https://encoding.spec.whatwg.org/#index-iso-2022-jp-katakana). [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208) also has an
alternative [Shift\_JIS](https://encoding.spec.whatwg.org/#shift_jis) visualization. Additionally, there is visualization of the Basic
Multilingual Plane coverage of each index other than [index gb18030 ranges](https://encoding.spec.whatwg.org/#index-gb18030-ranges) and
[index ISO-2022-JP katakana](https://encoding.spec.whatwg.org/#index-iso-2022-jp-katakana).



The legend for the visualizations is:



- Unmapped


- Two bytes in UTF-8


- Two bytes in UTF-8, code point follows immediately the code point of
previous pointer


- Three bytes in UTF-8 (non-PUA)


- Three bytes in UTF-8 (non-PUA), code point follows immediately the
code point of previous pointer


- Private Use


- Private Use, code point follows immediately the code point of previous
pointer


- Four bytes in UTF-8


- Four bytes in UTF-8, code point follows immediately the code point
of previous pointer


- Duplicate code point already mapped at an earlier index


- CJK Compatibility Ideograph


- CJK Unified Ideographs Extension A



These are the [indexes](https://encoding.spec.whatwg.org/#index) defined by this
specification, excluding [index single-byte](https://encoding.spec.whatwg.org/#index-single-byte), which have their own table:

| [Index](https://encoding.spec.whatwg.org/#index) | Notes |
| --- | --- |
| index Big5 | [index-big5.txt](https://encoding.spec.whatwg.org/index-big5.txt) | [index Big5 visualization](https://encoding.spec.whatwg.org/big5.html) | [index Big5 BMP coverage](https://encoding.spec.whatwg.org/big5-bmp.html) | This matches the Big5 standard in combination with the<br> Hong Kong Supplementary Character Set and other common extensions. |
| index EUC-KR | [index-euc-kr.txt](https://encoding.spec.whatwg.org/index-euc-kr.txt) | [index EUC-KR visualization](https://encoding.spec.whatwg.org/euc-kr.html) | [index EUC-KR BMP coverage](https://encoding.spec.whatwg.org/euc-kr-bmp.html) | This matches the KS X 1001 standard and the Unified Hangul Code, more commonly known together<br> as Windows Codepage 949. It covers the Hangul Syllables block of Unicode in its entirety. The<br> Hangul block whose top left corner in the visualization is at pointer 9026 is in the Unicode<br> order. Taken separately, the rest of the Hangul syllables in this index are in the Unicode order,<br> too. |
| index gb18030 | [index-gb18030.txt](https://encoding.spec.whatwg.org/index-gb18030.txt) | [index gb18030 visualization](https://encoding.spec.whatwg.org/gb18030.html) | [index gb18030 BMP coverage](https://encoding.spec.whatwg.org/gb18030-bmp.html) | This matches the GB18030-2022 standard for code points encoded as two bytes, except for<br> 0xA3 0xA0 which maps to U+3000 IDEOGRAPHIC SPACE to be compatible with deployed content. This<br> index covers the CJK Unified Ideographs block of Unicode in its entirety. Entries from that block<br> that are above or to the left of (the first) U+3000 in the visualization are in the Unicode order. |
| index gb18030 ranges | [index-gb18030-ranges.txt](https://encoding.spec.whatwg.org/index-gb18030-ranges.txt) | This [index](https://encoding.spec.whatwg.org/#index) works different from all others. Listing all code points would result<br> in over a million items whereas they can be represented neatly in 207 ranges combined with trivial<br> limit checks. It therefore only superficially matches the GB18030-2000 standard for code points<br> encoded as four bytes. The change for the GB18030-2005 revision is handled inline by the<br> [index gb18030 ranges code point](https://encoding.spec.whatwg.org/#index-gb18030-ranges-code-point) and [index gb18030 ranges pointer](https://encoding.spec.whatwg.org/#index-gb18030-ranges-pointer) algorithms below<br> that accompany this index. And the changes for the GB18030-2022 revision are handled differently<br> again to not further increase the number of byte sequences mapping to Private Use code points. The<br> relevant Private Use code points are mapped in the [gb18030 encoder](https://encoding.spec.whatwg.org/#gb18030-encoder) directly through a side<br> table to preserve compatibility with how they were mapped before. |
| index jis0208 | [index-jis0208.txt](https://encoding.spec.whatwg.org/index-jis0208.txt) | [index jis0208 visualization](https://encoding.spec.whatwg.org/jis0208.html), [Shift\_JIS visualization](https://encoding.spec.whatwg.org/shift_jis.html) | [index jis0208 BMP coverage](https://encoding.spec.whatwg.org/jis0208-bmp.html) | This is the JIS X 0208 standard including formerly proprietary<br> extensions from IBM and NEC. |
| index jis0212 | [index-jis0212.txt](https://encoding.spec.whatwg.org/index-jis0212.txt) | [index jis0212 visualization](https://encoding.spec.whatwg.org/jis0212.html) | [index jis0212 BMP coverage](https://encoding.spec.whatwg.org/jis0212-bmp.html) | This is the JIS X 0212 standard. It is only used by the [EUC-JP decoder](https://encoding.spec.whatwg.org/#euc-jp-decoder)<br> due to lack of widespread support elsewhere. |
| index ISO-2022-JP katakana | [index-iso-2022-jp-katakana.txt](https://encoding.spec.whatwg.org/index-iso-2022-jp-katakana.txt) | This maps halfwidth to fullwidth katakana as per Unicode Normalization Form KC, except that<br> U+FF9E (ﾞ) and U+FF9F (ﾟ) map to U+309B (゛) and U+309C (゜) rather than U+3099 (◌゙) and<br> U+309A (◌゚). It is only used by the [ISO-2022-JP encoder](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder). [\[UNICODE\]](https://encoding.spec.whatwg.org/#biblio-unicode "The Unicode Standard") |

The index gb18030 ranges code point for pointer is
the return value of these steps:

1. If pointer is greater than 39419 and less than 189000, or pointer is
    greater than 1237575, then return null.



2. If pointer is 7457, then return code point U+E7C7.



3. Let offset be the last pointer in [index gb18030 ranges](https://encoding.spec.whatwg.org/#index-gb18030-ranges) that is less than
    or equal to pointer and let codePointOffset be its corresponding code point.



4. Return a code point whose value is
    codePointOffset \+ pointer − offset.


The index gb18030 ranges pointer for codePoint is
the return value of these steps:

1. If codePoint is U+E7C7, then return pointer 7457.



2. Let offset be the last code point in [index gb18030 ranges](https://encoding.spec.whatwg.org/#index-gb18030-ranges) that is less
    than or equal to codePoint and let pointerOffset be its corresponding
    pointer.



3. Return a pointer whose value is
    pointerOffset \+ codePoint − offset.


The index Shift\_JIS pointer for codePoint is the return value of these
steps:

1. Let index be [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208) excluding all entries whose pointer is in
    the range 8272 to 8835, inclusive.



The [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208) contains duplicate code points so the exclusion of
    these entries causes later code points to be used.



2. Return the [index pointer](https://encoding.spec.whatwg.org/#index-pointer) for codePoint in index.


The index Big5 pointer for codePoint is the return value of
these steps:

1. Let index be [index Big5](https://encoding.spec.whatwg.org/#index-big5) excluding all entries whose pointer is less
    than (0xA1 - 0x81) × 157.



Avoid returning Hong Kong Supplementary Character Set extensions literally.



2. If codePoint is U+2550 (═), U+255E (╞), U+2561 (╡), U+256A (╪), U+5341 (十), or
    U+5345 (卅), then return the _last_ pointer corresponding to codePoint in
    index.



There are other duplicate code points, but for those the _first_ pointer is
    to be used.



3. Return the [index pointer](https://encoding.spec.whatwg.org/#index-pointer) for codePoint in index.


* * *

All [indexes](https://encoding.spec.whatwg.org/#index) are also available as a non-normative
[indexes.json](https://encoding.spec.whatwg.org/indexes.json) resource. ( [Index gb18030 ranges](https://encoding.spec.whatwg.org/#index-gb18030-ranges) has a slightly
different format here, to be able to represent ranges.)

## 6\. Hooks for standards

The algorithms defined below ( [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode), [UTF-8 decode without BOM](https://encoding.spec.whatwg.org/#utf-8-decode-without-bom),
[UTF-8 decode without BOM or fail](https://encoding.spec.whatwg.org/#utf-8-decode-without-bom-or-fail), and [UTF-8 encode](https://encoding.spec.whatwg.org/#utf-8-encode)) are intended for usage by other
standards.



For decoding, [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) is to be used by new formats. For identifiers or byte
sequences within a format or protocol, use [UTF-8 decode without BOM](https://encoding.spec.whatwg.org/#utf-8-decode-without-bom) or
[UTF-8 decode without BOM or fail](https://encoding.spec.whatwg.org/#utf-8-decode-without-bom-or-fail).



For encoding, [UTF-8 encode](https://encoding.spec.whatwg.org/#utf-8-encode) is to be used.



Standards are to ensure that the input I/O queues they pass to [UTF-8 encode](https://encoding.spec.whatwg.org/#utf-8-encode) (as well as
the legacy [encode](https://encoding.spec.whatwg.org/#encode)) are effectively I/O queues of scalar values, i.e., they contain no
[surrogates](https://infra.spec.whatwg.org/#surrogate).



These hooks (as well as [decode](https://encoding.spec.whatwg.org/#decode) and [encode](https://encoding.spec.whatwg.org/#encode)) will block until the input I/O queue
has been consumed in its entirety. In order to use the output tokens as they are pushed into the
stream, callers are to invoke the hooks with an empty output I/O queue and read from it
[in parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel). Note that some care is needed when using
[UTF-8 decode without BOM or fail](https://encoding.spec.whatwg.org/#utf-8-decode-without-bom-or-fail), as any error found during decoding will prevent the
[end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) item from ever being pushed into the output I/O queue.

To UTF-8 decode an I/O queue of bytes ioQueue given an optional I/O
queue of scalar values output (default « »), run these steps:

1. Let buffer be the result of [peeking](https://encoding.spec.whatwg.org/#i-o-queue-peek) three bytes from
    ioQueue, converted to a byte sequence.



2. If buffer is 0xEF 0xBB 0xBF, then [read](https://encoding.spec.whatwg.org/#concept-stream-read) three bytes from
    ioQueue. (Do nothing with those bytes.)



3. [Process a queue](https://encoding.spec.whatwg.org/#concept-encoding-run) with an instance of [UTF-8](https://encoding.spec.whatwg.org/#utf-8)’s [decoder](https://encoding.spec.whatwg.org/#decoder),
    ioQueue, output, and "`replacement`".



4. Return output.


To UTF-8 decode without BOM an I/O queue of bytes ioQueue given an
optional I/O queue of scalar values output (default « »), run these steps:

1. [Process a queue](https://encoding.spec.whatwg.org/#concept-encoding-run) with an instance of [UTF-8](https://encoding.spec.whatwg.org/#utf-8)’s [decoder](https://encoding.spec.whatwg.org/#decoder),
    ioQueue, output, and "`replacement`".



2. Return output.


To UTF-8 decode without BOM or fail an I/O queue of bytes ioQueue
given an optional I/O queue of scalar values output (default « »), run these steps:

1. Let potentialError be the result of [processing a queue](https://encoding.spec.whatwg.org/#concept-encoding-run) with an instance of
    [UTF-8](https://encoding.spec.whatwg.org/#utf-8)’s [decoder](https://encoding.spec.whatwg.org/#decoder), ioQueue, output, and
    "`fatal`".



2. If potentialError is an [error](https://encoding.spec.whatwg.org/#error), then return failure.



3. Return output.


* * *

To UTF-8 encode an I/O queue of scalar values ioQueue given an
optional I/O queue of bytes output (default « »), return the result of
[encoding](https://encoding.spec.whatwg.org/#encode) ioQueue with encoding [UTF-8](https://encoding.spec.whatwg.org/#utf-8) and output.

### 6.1. Legacy hooks for standards

Standards are strongly discouraged from using [decode](https://encoding.spec.whatwg.org/#decode), [BOM sniff](https://encoding.spec.whatwg.org/#bom-sniff), and
[encode](https://encoding.spec.whatwg.org/#encode), except as needed for compatibility. Standards needing these legacy hooks will
most likely also need to use [get an encoding](https://encoding.spec.whatwg.org/#concept-encoding-get) (to turn a label into an [encoding](https://encoding.spec.whatwg.org/#encoding))
and [get an output encoding](https://encoding.spec.whatwg.org/#get-an-output-encoding) (to turn an [encoding](https://encoding.spec.whatwg.org/#encoding) into another
[encoding](https://encoding.spec.whatwg.org/#encoding) that is suitable to pass into [encode](https://encoding.spec.whatwg.org/#encode)).



For the extremely niche case of URL percent-encoding, custom encoder error handling is needed.
The [get an encoder](https://encoding.spec.whatwg.org/#get-an-encoder) and [encode or fail](https://encoding.spec.whatwg.org/#encode-or-fail) algorithms are to be used for that. Other
algorithms are not to be used directly.

To decode an I/O queue of bytes ioQueue given a fallback encoding
encoding and an optional I/O queue of scalar values output (default « »), run
these steps:

1. Let BOMEncoding be the result of [BOM sniffing](https://encoding.spec.whatwg.org/#bom-sniff) ioQueue.



2. If BOMEncoding is non-null:




1. Set encoding to BOMEncoding.



2. [Read](https://encoding.spec.whatwg.org/#concept-stream-read) three bytes from ioQueue, if BOMEncoding is
       [UTF-8](https://encoding.spec.whatwg.org/#utf-8); otherwise [read](https://encoding.spec.whatwg.org/#concept-stream-read) two bytes. (Do nothing with those bytes.)



For compatibility with deployed content, the byte order mark is more authoritative
than anything else. In a context where HTTP is used this is in violation of the semantics of the
\``Content-Type`\` header.



3. [Process a queue](https://encoding.spec.whatwg.org/#concept-encoding-run) with an instance of encoding’s [decoder](https://encoding.spec.whatwg.org/#decoder),
    ioQueue, output, and "`replacement`".



4. Return output.


To BOM sniff an I/O queue of bytes ioQueue, run these steps:

1. Let BOM be the result of [peeking](https://encoding.spec.whatwg.org/#i-o-queue-peek) 3 bytes from
    ioQueue, converted to a byte sequence.



2. For each of the rows in the table below, starting with the first one and going down, if
    BOM [starts with](https://infra.spec.whatwg.org/#byte-sequence-starts-with) the bytes given in the first column, then
    return the [encoding](https://encoding.spec.whatwg.org/#encoding) given in the cell in the second column of that row. Otherwise,
    return null.





| Byte order mark | Encoding |
| --- | --- |
| 0xEF 0xBB 0xBF | [UTF-8](https://encoding.spec.whatwg.org/#utf-8) |
| 0xFE 0xFF | [UTF-16BE](https://encoding.spec.whatwg.org/#utf-16be) |
| 0xFF 0xFE | [UTF-16LE](https://encoding.spec.whatwg.org/#utf-16le) |


This hook is a workaround for the fact that [decode](https://encoding.spec.whatwg.org/#decode) has no way to communicate
back to the caller that it has found a byte order mark and is therefore not using the provided
encoding. The hook is to be invoked before [decode](https://encoding.spec.whatwg.org/#decode), and it will return an encoding
corresponding to the byte order mark found, or null otherwise.

* * *

To encode an I/O queue of scalar values ioQueue given an encoding
encoding and an optional I/O queue of bytes output (default « »), run these
steps:

1. Let encoder be the result of [getting an encoder](https://encoding.spec.whatwg.org/#get-an-encoder) from encoding.



2. [Process a queue](https://encoding.spec.whatwg.org/#concept-encoding-run) with encoder, ioQueue, output, and
    "`html`".



3. Return output.


This is a legacy hook for HTML forms. Layering [UTF-8 encode](https://encoding.spec.whatwg.org/#utf-8-encode) on top
is safe as it never triggers [errors](https://encoding.spec.whatwg.org/#error). [\[HTML\]](https://encoding.spec.whatwg.org/#biblio-html "HTML Standard")

* * *

To get an encoder from an
[encoding](https://encoding.spec.whatwg.org/#encoding) encoding:

1. [Assert](https://infra.spec.whatwg.org/#assert): encoding is not [replacement](https://encoding.spec.whatwg.org/#replacement) or [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le).



2. Return an instance of encoding’s [encoder](https://encoding.spec.whatwg.org/#encoder).


To encode or fail an I/O queue of scalar values ioQueue given an
[encoder](https://encoding.spec.whatwg.org/#encoder) instance encoder and an I/O queue of bytes output, run
these steps:

1. Let potentialError be the result of [processing a queue](https://encoding.spec.whatwg.org/#concept-encoding-run) with
    encoder, ioQueue, output, and "`fatal`".



2. [Push](https://encoding.spec.whatwg.org/#concept-stream-push) [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) to output.



3. If potentialError is an [error](https://encoding.spec.whatwg.org/#error), then return [error](https://encoding.spec.whatwg.org/#error)’s
    [code point](https://infra.spec.whatwg.org/#code-point)’s [value](https://infra.spec.whatwg.org/#code-point-value).



4. Return null.


This is a legacy hook for URL percent-encoding. The caller will have to keep an
[encoder](https://encoding.spec.whatwg.org/#encoder) instance alive as the [ISO-2022-JP encoder](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder) can be in two different
states when returning an [error](https://encoding.spec.whatwg.org/#error). That also means that if the caller emits bytes to encode the
error in some way, these have to be in the range 0x00 to 0x7F, inclusive, excluding 0x0E, 0x0F,
0x1B, 0x5C, and 0x7E. [\[URL\]](https://encoding.spec.whatwg.org/#biblio-url "URL Standard")

In particular, if upon returning an [error](https://encoding.spec.whatwg.org/#error) the [ISO-2022-JP encoder](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder) is in the
[Roman](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-roman) state, the caller cannot output 0x5C (\\) as it will not
decode as U+005C (\\). For this reason, applications using [encode or fail](https://encoding.spec.whatwg.org/#encode-or-fail) for unintended
purposes ought to take care to prevent the use of the [ISO-2022-JP encoder](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder) in combination
with replacement schemes, such as those of JavaScript and CSS, that use U+005C (\\) as part of the
replacement syntax (e.g., `\u2603`) or make sure to pass the replacement syntax through
the encoder (in contrast to URL percent-encoding).



The return value is either the number representing the [code point](https://infra.spec.whatwg.org/#code-point) that could not be
encoded or null, if there was no [error](https://encoding.spec.whatwg.org/#error). When it returns non-null the caller will have to
invoke it again, supplying the same [encoder](https://encoding.spec.whatwg.org/#encoder) instance and a new output I/O queue.

## 7\. API

This section uses terminology from Web IDL. Browser user agents must support this API. JavaScript
implementations should support this API. Other user agents or programming languages are encouraged
to use an API suitable to their needs, which might not be this one. [\[WEBIDL\]](https://encoding.spec.whatwg.org/#biblio-webidl "Web IDL Standard")

The following example uses the `TextEncoder` object to encode
an array of strings into an
`ArrayBuffer`. The result is a
`Uint8Array` containing the number
of strings (as a `Uint32Array`),
followed by the length of the first string (as a
`Uint32Array`), the
[UTF-8](https://encoding.spec.whatwg.org/#utf-8) encoded string data, the length of the second string (as
a `Uint32Array`), the string data,
and so on.


```javascript
function encodeArrayOfStrings(strings) {
  var encoder, encoded, len, bytes, view, offset;

  encoder = new TextEncoder();
  encoded = [];

  len = Uint32Array.BYTES_PER_ELEMENT;
  for (var i = 0; i < strings.length; i++) {
    len += Uint32Array.BYTES_PER_ELEMENT;
    encoded[i] = encoder.encode(strings[i]);
    len += encoded[i].byteLength;
  }

  bytes = new Uint8Array(len);
  view = new DataView(bytes.buffer);
  offset = 0;

  view.setUint32(offset, strings.length);
  offset += Uint32Array.BYTES_PER_ELEMENT;
  for (var i = 0; i < encoded.length; i += 1) {
    len = encoded[i].byteLength;
    view.setUint32(offset, len);
    offset += Uint32Array.BYTES_PER_ELEMENT;
    bytes.set(encoded[i], offset);
    offset += len;
  }
  return bytes.buffer;
}
```

The following example decodes an `ArrayBuffer` containing data encoded in the
format produced by the previous example, or an equivalent algorithm for encodings other than
[UTF-8](https://encoding.spec.whatwg.org/#utf-8), back into an array of strings.



```javascript
function decodeArrayOfStrings(buffer, encoding) {
  var decoder, view, offset, num_strings, strings, len;

  decoder = new TextDecoder(encoding);
  view = new DataView(buffer);
  offset = 0;
  strings = [];

  num_strings = view.getUint32(offset);
  offset += Uint32Array.BYTES_PER_ELEMENT;
  for (var i = 0; i < num_strings; i++) {
    len = view.getUint32(offset);
    offset += Uint32Array.BYTES_PER_ELEMENT;
    strings[i] = decoder.decode(
      new DataView(view.buffer, offset, len));
    offset += len;
  }
  return strings;
}
```

### 7.1. Interface mixin `TextDecoderCommon`

```
interface mixin TextDecoderCommon {
  readonly attribute DOMString encoding;
  readonly attribute boolean fatal;
  readonly attribute boolean ignoreBOM;
};
```

The `TextDecoderCommon` interface mixin defines common getters that are shared between
`TextDecoder` and `TextDecoderStream` objects. These objects have an associated:

encodingAn [encoding](https://encoding.spec.whatwg.org/#encoding).


 decoderA [decoder](https://encoding.spec.whatwg.org/#decoder) instance.


 I/O queueAn [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of bytes.


 ignore BOMA boolean, initially false.


 BOM seenA boolean, initially false.


 error modeAn [error mode](https://encoding.spec.whatwg.org/#error-mode), initially "`replacement`".



The serialize I/O queue algorithm, given a
`TextDecoderCommon`decoder and an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of scalar values
ioQueue, runs these steps:

1. Let output be the empty string.



2. While true:


1. Let item be the result of [reading](https://encoding.spec.whatwg.org/#concept-stream-read) from ioQueue.



2. If item is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return output.



3. If decoder’s [encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding) is [UTF-8](https://encoding.spec.whatwg.org/#utf-8) or
       [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le), and decoder’s [ignore BOM](https://encoding.spec.whatwg.org/#textdecoder-ignore-bom-flag) and
       [BOM seen](https://encoding.spec.whatwg.org/#textdecoder-bom-seen-flag) are false:


      1. Set decoder’s [BOM seen](https://encoding.spec.whatwg.org/#textdecoder-bom-seen-flag) to true.



      2. If item is U+FEFF BOM, then [continue](https://infra.spec.whatwg.org/#iteration-continue).
4. Append item to output.

This algorithm is intentionally different with respect to BOM handling from
the [decode](https://encoding.spec.whatwg.org/#decode) algorithm used by the rest of the platform to give API users more
control.

* * *

The `encoding`
getter steps are to return [this](https://webidl.spec.whatwg.org/#this)’s [encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding)’s
[name](https://encoding.spec.whatwg.org/#name), [ASCII lowercased](https://infra.spec.whatwg.org/#ascii-lowercase).

The `fatal` getter
steps are to return true if [this](https://webidl.spec.whatwg.org/#this)’s [error mode](https://encoding.spec.whatwg.org/#textdecoder-error-mode) is
"`fatal`"; otherwise false.

The
`ignoreBOM`
getter steps are to return [this](https://webidl.spec.whatwg.org/#this)’s [ignore BOM](https://encoding.spec.whatwg.org/#textdecoder-ignore-bom-flag).

### 7.2. Interface `TextDecoder`

```
dictionary TextDecoderOptions {
  boolean fatal = false;
  boolean ignoreBOM = false;
};

dictionary TextDecodeOptions {
  boolean stream = false;
};

[Exposed=*]
interface TextDecoder {
  constructor(optional DOMString label = "utf-8", optional TextDecoderOptions options = {});

  USVString decode(optional AllowSharedBufferSource input, optional TextDecodeOptions options = {});
};
TextDecoder includes TextDecoderCommon;
```

A `TextDecoder` object has an associated
do not flush, which is a boolean,
initially false.

`decoder = new TextDecoder([label = "utf-8" [, options]])`

Returns a new `TextDecoder` object.


If label is either not a label or is a [label](https://encoding.spec.whatwg.org/#label) for
[replacement](https://encoding.spec.whatwg.org/#replacement), [throws](https://webidl.spec.whatwg.org/#dfn-throw) a `RangeError`.



`decoder . encoding`

Returns [encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding)’s [name](https://encoding.spec.whatwg.org/#name), lowercased.



`decoder . fatal`

Returns true if [error mode](https://encoding.spec.whatwg.org/#textdecoder-error-mode) is "`fatal`"; otherwise
false.



`decoder . ignoreBOM`

Returns the value of [ignore BOM](https://encoding.spec.whatwg.org/#textdecoder-ignore-bom-flag).



`decoder . decode([input [, options]])`

Returns the result of running [encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding)’s [decoder](https://encoding.spec.whatwg.org/#decoder).
The method can be invoked zero or more times with options’s `stream` set to
true, and then once without options’s `stream` (or set to false), to process
a fragmented input. If the invocation without options’s `stream` (or set to
false) has no input, it’s clearest to omit both arguments.



```javascript
var string = "", decoder = new TextDecoder(encoding), buffer;
while(buffer = next_chunk()) {
  string += decoder.decode(buffer, {stream:true});
}
string += decoder.decode(); // end-of-queue
```

If the [error mode](https://encoding.spec.whatwg.org/#textdecoder-error-mode) is "`fatal`" and
[encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding)’s [decoder](https://encoding.spec.whatwg.org/#decoder) returns [error](https://encoding.spec.whatwg.org/#error),
[throws](https://webidl.spec.whatwg.org/#dfn-throw) a `TypeError`.

The
`new TextDecoder(label, options)`
constructor steps are:

1. Let encoding be the result of [getting an encoding](https://encoding.spec.whatwg.org/#concept-encoding-get) from label.



2. If encoding is failure or [replacement](https://encoding.spec.whatwg.org/#replacement), then [throw](https://webidl.spec.whatwg.org/#dfn-throw) a `RangeError`.



3. Set [this](https://webidl.spec.whatwg.org/#this)’s [encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding) to encoding.



4. If options\["`fatal`"\] is true, then set [this](https://webidl.spec.whatwg.org/#this)’s
    [error mode](https://encoding.spec.whatwg.org/#textdecoder-error-mode) to "`fatal`".



5. Set [this](https://webidl.spec.whatwg.org/#this)’s [ignore BOM](https://encoding.spec.whatwg.org/#textdecoder-ignore-bom-flag) to
    options\["`ignoreBOM`"\].


The `decode(input, options)`
method steps are:

1. If [this](https://webidl.spec.whatwg.org/#this)’s [do not flush](https://encoding.spec.whatwg.org/#textdecoder-do-not-flush-flag) is false, then set [this](https://webidl.spec.whatwg.org/#this)’s
    [decoder](https://encoding.spec.whatwg.org/#textdecodercommon-decoder) to a new instance of [this](https://webidl.spec.whatwg.org/#this)’s
    [encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding)’s [decoder](https://encoding.spec.whatwg.org/#decoder), [this](https://webidl.spec.whatwg.org/#this)’s
    [I/O queue](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue) to the [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of bytes
    « [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) », and [this](https://webidl.spec.whatwg.org/#this)’s [BOM seen](https://encoding.spec.whatwg.org/#textdecoder-bom-seen-flag) to false.



2. Set [this](https://webidl.spec.whatwg.org/#this)’s [do not flush](https://encoding.spec.whatwg.org/#textdecoder-do-not-flush-flag) to
    options\["`stream`"\].



3. If input is given, then [push](https://encoding.spec.whatwg.org/#concept-stream-push) a
    [copy of](https://webidl.spec.whatwg.org/#dfn-get-buffer-source-copy) input to [this](https://webidl.spec.whatwg.org/#this)’s
    [I/O queue](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue).



Implementations are strongly encouraged to use an implementation strategy that
    avoids this copy. When doing so they will have to make sure that changes to input do
    not affect future calls to [`decode()`](https://encoding.spec.whatwg.org/#dom-textdecoder-decode).



The memory exposed by `SharedArrayBuffer`
    objects does not adhere to data race freedom properties required by the memory model of
    programming languages typically used for implementations. When implementing, take care to use the
    appropriate facilities when accessing memory exposed by `SharedArrayBuffer` objects.



4. Let output be the [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of scalar values
    « [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) ».



5. While true:


1. Let item be the result of [reading](https://encoding.spec.whatwg.org/#concept-stream-read) from [this](https://webidl.spec.whatwg.org/#this)’s
       [I/O queue](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue).



2. If item is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [this](https://webidl.spec.whatwg.org/#this)’s
       [do not flush](https://encoding.spec.whatwg.org/#textdecoder-do-not-flush-flag) is true, then return the result of running
       [serialize I/O queue](https://encoding.spec.whatwg.org/#concept-td-serialize) with [this](https://webidl.spec.whatwg.org/#this) and output.



      The way streaming works is to not handle [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) here when
       [this](https://webidl.spec.whatwg.org/#this)’s [do not flush](https://encoding.spec.whatwg.org/#textdecoder-do-not-flush-flag) is true and to not set it to false. That way
       in a subsequent invocation [this](https://webidl.spec.whatwg.org/#this)’s [decoder](https://encoding.spec.whatwg.org/#textdecodercommon-decoder) is not set anew in
       the first step of the algorithm and its state is preserved.



3. Otherwise:


      1. Let result be the result of [processing an item](https://encoding.spec.whatwg.org/#concept-encoding-process) with item,
          [this](https://webidl.spec.whatwg.org/#this)’s [decoder](https://encoding.spec.whatwg.org/#textdecodercommon-decoder), [this](https://webidl.spec.whatwg.org/#this)’s
          [I/O queue](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue), output, and [this](https://webidl.spec.whatwg.org/#this)’s
          [error mode](https://encoding.spec.whatwg.org/#textdecoder-error-mode).



      2. If result is [finished](https://encoding.spec.whatwg.org/#finished), then return the result of running
          [serialize I/O queue](https://encoding.spec.whatwg.org/#concept-td-serialize) with [this](https://webidl.spec.whatwg.org/#this) and output.



      3. Otherwise, if result is [error](https://encoding.spec.whatwg.org/#error), [throw](https://webidl.spec.whatwg.org/#dfn-throw) a `TypeError`.

### 7.3. Interface mixin `TextEncoderCommon`

```
interface mixin TextEncoderCommon {
  readonly attribute DOMString encoding;
};
```

The `TextEncoderCommon` interface mixin defines common getters that are shared between
`TextEncoder` and `TextEncoderStream` objects.

The `encoding`
getter steps are to return "`utf-8`".

### 7.4. Interface `TextEncoder`

```
dictionary TextEncoderEncodeIntoResult {
  unsigned long long read;
  unsigned long long written;
};

[Exposed=*]
interface TextEncoder {
  constructor();

  [NewObject] Uint8Array encode(optional USVString input = "");
  TextEncoderEncodeIntoResult encodeInto(USVString source, [AllowShared] Uint8Array destination);
};
TextEncoder includes TextEncoderCommon;
```

A `TextEncoder` object offers no label argument as it only
supports [UTF-8](https://encoding.spec.whatwg.org/#utf-8). It also offers no `stream` option as no [encoder](https://encoding.spec.whatwg.org/#encoder)
requires buffering of scalar values.

* * *

`encoder = new TextEncoder()`

Returns a new `TextEncoder` object.



`encoder . encoding`

Returns "`utf-8`".



`encoder . encode([input = ""])`

Returns the result of running [UTF-8](https://encoding.spec.whatwg.org/#utf-8)’s [encoder](https://encoding.spec.whatwg.org/#encoder).



`encoder . encodeInto(source, destination)`

Runs the [UTF-8 encoder](https://encoding.spec.whatwg.org/#utf-8-encoder) on source, stores the result of that operation into
destination, and returns the progress made as an object wherein
`read` is the number of converted [code units](https://infra.spec.whatwg.org/#code-unit) of
source and `written` is the number of bytes modified in
destination.

The
`new TextEncoder()`
constructor steps are to do nothing.

The `encode(input)` method steps are:

1. [Convert](https://encoding.spec.whatwg.org/#to-i-o-queue-convert) input to an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of scalar
    values.



2. Let output be the [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of bytes « [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) ».



3. While true:


1. Let item be the result of
       [reading](https://encoding.spec.whatwg.org/#concept-stream-read) from input.



2. Let result be the result of [processing an item](https://encoding.spec.whatwg.org/#concept-encoding-process) with item, an
       instance of the [UTF-8 encoder](https://encoding.spec.whatwg.org/#utf-8-encoder), input, output, and
       "`fatal`".



3. [Assert](https://infra.spec.whatwg.org/#assert): result is not an [error](https://encoding.spec.whatwg.org/#error).



      The [UTF-8 encoder](https://encoding.spec.whatwg.org/#utf-8-encoder) cannot return [error](https://encoding.spec.whatwg.org/#error).



4. If result is [finished](https://encoding.spec.whatwg.org/#finished), then return the result of
       [creating a `Uint8Array` object](https://encoding.spec.whatwg.org/#create-a-uint8array-object) given output and [this](https://webidl.spec.whatwg.org/#this)’s
       [relevant realm](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-realm).

The
`encodeInto(source, destination)`
method steps are:

1. Let read be 0.



2. Let written be 0.



3. Let encoder be an instance of the [UTF-8 encoder](https://encoding.spec.whatwg.org/#utf-8-encoder).



4. Let unused be the [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of scalar values « [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) ».



The [handler](https://encoding.spec.whatwg.org/#handler) algorithm invoked below requires this argument, but it is not
    used by the [UTF-8 encoder](https://encoding.spec.whatwg.org/#utf-8-encoder).



5. [Convert](https://encoding.spec.whatwg.org/#to-i-o-queue-convert) source to an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of scalar
    values.



6. While true:


1. Let item be the result of [reading](https://encoding.spec.whatwg.org/#concept-stream-read) from source.



2. Let result be the result of running encoder’s [handler](https://encoding.spec.whatwg.org/#handler) on
       unused and item.



3. If result is [finished](https://encoding.spec.whatwg.org/#finished), then [break](https://infra.spec.whatwg.org/#iteration-break).



4. Otherwise:


      1. If destination’s [byte length](https://webidl.spec.whatwg.org/#buffersource-byte-length) −
          written is greater than or equal to the number of bytes in result:


         1. If item is greater than U+FFFF, then increment read by 2.



         2. Otherwise, increment read by 1.



         3. [Write](https://webidl.spec.whatwg.org/#arraybufferview-write) the bytes in result into
             destination, with [_startingOffset_](https://webidl.spec.whatwg.org/#arraybufferview-write-startingoffset) set to
             written.



            See the
             [warning for `SharedArrayBuffer` objects](https://encoding.spec.whatwg.org/#sharedarraybuffer-warning)
             above.



         4. Increment written by the number of bytes in result.
      2. Otherwise, [break](https://infra.spec.whatwg.org/#iteration-break).
7. Return «\[ "`read`" → read,\
    "`written`" → written \]».


The [encodeInto()](https://encoding.spec.whatwg.org/#dom-textencoder-encodeinto) method can
be used to encode a string into an existing `ArrayBuffer` object. Various details below are left
as an exercise for the reader, but this demonstrates an approach one could take to use this method:



```javascript
function convertString(buffer, input, callback) {
  let bufferSize = 256,
      bufferStart = malloc(buffer, bufferSize),
      writeOffset = 0,
      readOffset = 0;
  while (true) {
    const view = new Uint8Array(buffer, bufferStart + writeOffset, bufferSize - writeOffset),
          {read, written} = cachedEncoder.encodeInto(input.substring(readOffset), view);
    readOffset += read;
    writeOffset += written;
    if (readOffset === input.length) {
      callback(bufferStart, writeOffset);
      free(buffer, bufferStart);
      return;
    }
    bufferSize *= 2;
    bufferStart = realloc(buffer, bufferStart, bufferSize);
  }
}
```

### 7.5. Interface `TextDecoderStream`

```
[Exposed=*]
interface TextDecoderStream {
  constructor(optional DOMString label = "utf-8", optional TextDecoderOptions options = {});
};
TextDecoderStream includes TextDecoderCommon;
TextDecoderStream includes GenericTransformStream;
```

`decoder = new
 TextDecoderStream([label =\
 "utf-8" [, options]])`

Returns a new `TextDecoderStream` object.


If label is either not a label or is a [label](https://encoding.spec.whatwg.org/#label) for
[replacement](https://encoding.spec.whatwg.org/#replacement), [throws](https://webidl.spec.whatwg.org/#dfn-throw) a `RangeError`.



`decoder . encoding`

Returns [encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding)’s [name](https://encoding.spec.whatwg.org/#name), lowercased.



`decoder . fatal`

Returns true if [error mode](https://encoding.spec.whatwg.org/#textdecoder-error-mode) is "`fatal`", and
false otherwise.



`decoder . ignoreBOM`

Returns the value of [ignore BOM](https://encoding.spec.whatwg.org/#textdecoder-ignore-bom-flag).



`decoder . readable`

Returns a [readable stream](https://streams.spec.whatwg.org/#readable-stream) whose [chunks](https://streams.spec.whatwg.org/#chunk) are strings resulting from running
[encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding)’s [decoder](https://encoding.spec.whatwg.org/#decoder) on the chunks written to
`writable`.



`decoder . writable`

Returns a [writable stream](https://streams.spec.whatwg.org/#writable-stream) which accepts
`AllowSharedBufferSource` chunks and runs
them through [encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding)’s [decoder](https://encoding.spec.whatwg.org/#decoder) before making them
available to `readable`.



Typically this will be used via the `pipeThrough()` method on a
`ReadableStream` source.



```javascript
var decoder = new TextDecoderStream(encoding);
byteReadable
  .pipeThrough(decoder)
  .pipeTo(textWritable);
```

If the [error mode](https://encoding.spec.whatwg.org/#textdecoder-error-mode) is "`fatal`" and
[encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding)’s [decoder](https://encoding.spec.whatwg.org/#decoder) returns [error](https://encoding.spec.whatwg.org/#error), both
`readable` and `writable` will be errored with a
`TypeError`.

The
`new TextDecoderStream(label, options)`
constructor steps are:

1. Let encoding be the result of [getting an encoding](https://encoding.spec.whatwg.org/#concept-encoding-get) from label.



2. If encoding is failure or [replacement](https://encoding.spec.whatwg.org/#replacement), then [throw](https://webidl.spec.whatwg.org/#dfn-throw) a `RangeError`.



3. Let errorMode be "`fatal`" if
    options\["`fatal`"\] is true; otherwise "`replacement`".



4. [Set up a text decoder stream](https://encoding.spec.whatwg.org/#set-up-a-text-decoder-stream) with [this](https://webidl.spec.whatwg.org/#this), encoding,
    errorMode, and options\["`ignoreBOM`"\].


To set up a text decoder stream given a `TextDecoderStream` object
stream, an optional [encoding](https://encoding.spec.whatwg.org/#encoding) encoding (default [UTF-8](https://encoding.spec.whatwg.org/#utf-8)), an optional
[error mode](https://encoding.spec.whatwg.org/#error-mode) errorMode (default "`replacement`"), and an optional
boolean ignoreBOM (default false), run these steps:

01. [Assert](https://infra.spec.whatwg.org/#assert): encoding is not [replacement](https://encoding.spec.whatwg.org/#replacement).



02. Set stream’s [encoding](https://encoding.spec.whatwg.org/#textdecoder-encoding) to encoding.



03. Set stream’s [error mode](https://encoding.spec.whatwg.org/#textdecoder-error-mode) to errorMode.



04. Set stream’s [ignore BOM](https://encoding.spec.whatwg.org/#textdecoder-ignore-bom-flag) to ignoreBOM.



05. Set stream’s [decoder](https://encoding.spec.whatwg.org/#textdecodercommon-decoder) to a new instance of
     encoding’s [decoder](https://encoding.spec.whatwg.org/#decoder).



06. Set stream’s [I/O queue](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue) to a new [I/O\\
     queue](https://encoding.spec.whatwg.org/#concept-stream).



07. Let transformAlgorithm be an algorithm which takes a chunk argument
     and runs the [decode and enqueue a chunk](https://encoding.spec.whatwg.org/#decode-and-enqueue-a-chunk) algorithm with stream and
     chunk.



08. Let flushAlgorithm be an algorithm which takes no arguments and runs the [flush\\
     and enqueue](https://encoding.spec.whatwg.org/#flush-and-enqueue) algorithm with stream.



09. Let transformStream be a [new](https://webidl.spec.whatwg.org/#new)`TransformStream`.



10. [Set up](https://streams.spec.whatwg.org/#transformstream-set-up) transformStream with
     [transformAlgorithm](https://streams.spec.whatwg.org/#transformstream-set-up-transformalgorithm) set to
     transformAlgorithm and
     [flushAlgorithm](https://streams.spec.whatwg.org/#transformstream-set-up-flushalgorithm) set to
     flushAlgorithm.



11. Set stream’s [transform](https://streams.spec.whatwg.org/#generictransformstream-transform) to
     transformStream.


The decode and enqueue a chunk algorithm, given a `TextDecoderStream` object
decoder and a chunk, runs these steps:

1. Let bufferSource be the result of
    [converting](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) chunk to an
    `AllowSharedBufferSource`.



2. [Push](https://encoding.spec.whatwg.org/#concept-stream-push) a [copy of](https://webidl.spec.whatwg.org/#dfn-get-buffer-source-copy) bufferSource to
    decoder’s [I/O queue](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue).



See the
    [warning for `SharedArrayBuffer` objects](https://encoding.spec.whatwg.org/#sharedarraybuffer-warning) above.



3. Let output be the [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of scalar values
    « [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) ».



4. While true:


1. Let item be the result of [reading](https://encoding.spec.whatwg.org/#concept-stream-read) from decoder’s
       [I/O queue](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue).



2. If item is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream):


      1. Let outputChunk be the result of running [serialize I/O queue](https://encoding.spec.whatwg.org/#concept-td-serialize) with
          decoder and output.



      2. If outputChunk is not the empty string, then
          [enqueue](https://streams.spec.whatwg.org/#transformstream-enqueue) outputChunk in decoder’s
          [transform](https://streams.spec.whatwg.org/#generictransformstream-transform).



      3. Return.
3. Let result be the result of [processing an item](https://encoding.spec.whatwg.org/#concept-encoding-process) with item,
       decoder’s [decoder](https://encoding.spec.whatwg.org/#textdecodercommon-decoder), decoder’s
       [I/O queue](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue), output, and decoder’s
       [error mode](https://encoding.spec.whatwg.org/#textdecoder-error-mode).



4. If result is [error](https://encoding.spec.whatwg.org/#error), then [throw](https://webidl.spec.whatwg.org/#dfn-throw) a `TypeError`.

The flush and enqueue algorithm, which handles the end of data from the input
`ReadableStream` object, given a `TextDecoderStream` object decoder, runs these
steps:

1. Let output be the [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of scalar values
    « [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) ».



2. While true:


1. Let item be the result of [reading](https://encoding.spec.whatwg.org/#concept-stream-read) from decoder’s
       [I/O queue](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue).



2. Let result be the result of [processing an item](https://encoding.spec.whatwg.org/#concept-encoding-process) with item,
       decoder’s [decoder](https://encoding.spec.whatwg.org/#textdecodercommon-decoder), decoder’s
       [I/O queue](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue), output, and decoder’s
       [error mode](https://encoding.spec.whatwg.org/#textdecoder-error-mode).



3. If result is [finished](https://encoding.spec.whatwg.org/#finished):


      1. Let outputChunk be the result of running [serialize I/O queue](https://encoding.spec.whatwg.org/#concept-td-serialize) with
          decoder and output.



      2. If outputChunk is not the empty string, then
          [enqueue](https://streams.spec.whatwg.org/#transformstream-enqueue) outputChunk in decoder’s
          [transform](https://streams.spec.whatwg.org/#generictransformstream-transform).



      3. Return.
4. Otherwise, if result is [error](https://encoding.spec.whatwg.org/#error), [throw](https://webidl.spec.whatwg.org/#dfn-throw) a `TypeError`.

### 7.6. Interface `TextEncoderStream`

```
[Exposed=*]
interface TextEncoderStream {
  constructor();
};
TextEncoderStream includes TextEncoderCommon;
TextEncoderStream includes GenericTransformStream;
```

A `TextEncoderStream` object has an associated:

encoderAn [encoder](https://encoding.spec.whatwg.org/#encoder) instance.


 leading surrogateNull or a [leading surrogate](https://infra.spec.whatwg.org/#leading-surrogate), initially null.



A `TextEncoderStream` object offers no label argument as it
only supports [UTF-8](https://encoding.spec.whatwg.org/#utf-8).

`encoder = new TextEncoderStream()`

Returns a new `TextEncoderStream` object.



`encoder . encoding`

Returns "`utf-8`".



`encoder . readable`

Returns a [readable stream](https://streams.spec.whatwg.org/#readable-stream) whose [chunks](https://streams.spec.whatwg.org/#chunk) are `Uint8Array`s resulting from running
[UTF-8](https://encoding.spec.whatwg.org/#utf-8)’s [encoder](https://encoding.spec.whatwg.org/#encoder) on the chunks written to `writable`.



`encoder . writable`

Returns a [writable stream](https://streams.spec.whatwg.org/#writable-stream) which accepts string chunks and runs them through
[UTF-8](https://encoding.spec.whatwg.org/#utf-8)’s [encoder](https://encoding.spec.whatwg.org/#encoder) before making them available to
`readable`.



Typically this will be used via the `pipeThrough()` method on a
`ReadableStream` source.



```javascript
textReadable
  .pipeThrough(new TextEncoderStream())
  .pipeTo(byteWritable);
```

The
`new TextEncoderStream()`
constructor steps are:

1. Set [this](https://webidl.spec.whatwg.org/#this)’s [encoder](https://encoding.spec.whatwg.org/#textencoderstream-encoder) to an instance of the
    [UTF-8 encoder](https://encoding.spec.whatwg.org/#utf-8-encoder).



2. Let transformAlgorithm be an algorithm which takes a chunk argument
    and runs the [encode and enqueue a chunk](https://encoding.spec.whatwg.org/#encode-and-enqueue-a-chunk) algorithm with [this](https://webidl.spec.whatwg.org/#this) and chunk.



3. Let flushAlgorithm be an algorithm which runs the [encode and flush](https://encoding.spec.whatwg.org/#encode-and-flush)
    algorithm with [this](https://webidl.spec.whatwg.org/#this).



4. Let transformStream be a [new](https://webidl.spec.whatwg.org/#new)`TransformStream`.



5. [Set up](https://streams.spec.whatwg.org/#transformstream-set-up) transformStream with
    [transformAlgorithm](https://streams.spec.whatwg.org/#transformstream-set-up-transformalgorithm) set to
    transformAlgorithm and
    [flushAlgorithm](https://streams.spec.whatwg.org/#transformstream-set-up-flushalgorithm) set to
    flushAlgorithm.



6. Set [this](https://webidl.spec.whatwg.org/#this)’s [transform](https://streams.spec.whatwg.org/#generictransformstream-transform) to transformStream.


* * *

The encode and enqueue a chunk algorithm, given a `TextEncoderStream` object
encoder and chunk, runs these steps:

1. Let input be the result of [converting](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) chunk to a `DOMString`.



2. [Convert](https://encoding.spec.whatwg.org/#to-i-o-queue-convert) input to an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of
    [code units](https://infra.spec.whatwg.org/#code-unit).



`DOMString`, as well as an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of code units rather than scalar
    values, are used here so that a surrogate pair that is split between chunks can be reassembled into
    the appropriate scalar value. The behavior is otherwise identical to `USVString`. In particular,
    lone surrogates will be replaced with U+FFFD (�).



3. Let output be the [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of bytes « [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) ».



4. While true:


1. Let item be the result of [reading](https://encoding.spec.whatwg.org/#concept-stream-read) from input.



2. If item is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream):


      1. [Convert](https://encoding.spec.whatwg.org/#from-i-o-queue-convert) output into a byte sequence.



      2. If output [is not empty](https://infra.spec.whatwg.org/#list-is-empty):


         1. Let chunk be the result of [creating a `Uint8Array` object](https://encoding.spec.whatwg.org/#create-a-uint8array-object)
             given output and encoder’s [relevant realm](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-realm).



         2. [Enqueue](https://streams.spec.whatwg.org/#transformstream-enqueue) chunk into encoder’s
             [transform](https://streams.spec.whatwg.org/#generictransformstream-transform).
      3. Return.
3. Let result be the result of executing the [convert code unit to scalar\\
       value](https://encoding.spec.whatwg.org/#convert-code-unit-to-scalar-value) algorithm with encoder, item and input.



4. If result is not [continue](https://encoding.spec.whatwg.org/#continue), then [process an item](https://encoding.spec.whatwg.org/#concept-encoding-process) with
       result, encoder’s [encoder](https://encoding.spec.whatwg.org/#textencoderstream-encoder), input,
       output, and "`fatal`".

The convert code unit to scalar value algorithm, given a `TextEncoderStream` object
encoder, a [code unit](https://infra.spec.whatwg.org/#code-unit) item, and an [I/O queue](https://encoding.spec.whatwg.org/#concept-stream) of code units
input, runs these steps:

1. If encoder’s [leading surrogate](https://encoding.spec.whatwg.org/#textencoderstream-pending-high-surrogate) is non-null:


1. Let leadingSurrogate be encoder’s
       [leading surrogate](https://encoding.spec.whatwg.org/#textencoderstream-pending-high-surrogate).



2. Set encoder’s [leading surrogate](https://encoding.spec.whatwg.org/#textencoderstream-pending-high-surrogate) to null.



3. If item is a [trailing surrogate](https://infra.spec.whatwg.org/#trailing-surrogate), then return a
       [scalar value from surrogates](https://encoding.spec.whatwg.org/#scalar-value-from-surrogates) given leadingSurrogate and item.



4. [Restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) item to input.



5. Return U+FFFD (�).
2. If item is a [leading surrogate](https://infra.spec.whatwg.org/#leading-surrogate), then set encoder’s
    [leading surrogate](https://encoding.spec.whatwg.org/#textencoderstream-pending-high-surrogate) to item and return [continue](https://encoding.spec.whatwg.org/#continue).



3. If item is a [trailing surrogate](https://infra.spec.whatwg.org/#trailing-surrogate), then return U+FFFD (�).



4. Return item.


This is equivalent to the " [convert](https://infra.spec.whatwg.org/#javascript-string-convert) a [string](https://infra.spec.whatwg.org/#string) into a
[scalar value string](https://infra.spec.whatwg.org/#scalar-value-string)" algorithm from the Infra Standard, but allows for surrogate pairs
that are split between strings. [\[INFRA\]](https://encoding.spec.whatwg.org/#biblio-infra "Infra Standard")

The encode and flush algorithm, given a `TextEncoderStream` object
encoder, runs these steps:

1. If encoder’s [leading surrogate](https://encoding.spec.whatwg.org/#textencoderstream-pending-high-surrogate) is non-null:


1. Let chunk be the result of [creating a `Uint8Array` object](https://encoding.spec.whatwg.org/#create-a-uint8array-object) given
       « 0xEF, 0xBF, 0xBD » and encoder’s [relevant realm](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-realm).



      This is U+FFFD (�) in [UTF-8](https://encoding.spec.whatwg.org/#utf-8) bytes.



2. [Enqueue](https://streams.spec.whatwg.org/#transformstream-enqueue) chunk into encoder’s
       [transform](https://streams.spec.whatwg.org/#generictransformstream-transform).

## 8\. The encoding

### 8.1. UTF-8

#### 8.1.1. UTF-8 decoder

A byte order mark has priority over a label as it has been found to be more accurate
in deployed content. Therefore it is not part of the [UTF-8 decoder](https://encoding.spec.whatwg.org/#utf-8-decoder) algorithm, but rather the
[decode](https://encoding.spec.whatwg.org/#decode) and [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) algorithms.

[UTF-8](https://encoding.spec.whatwg.org/#utf-8)’s [decoder](https://encoding.spec.whatwg.org/#decoder) has an associated:

UTF-8 code pointUTF-8 bytes seenUTF-8 bytes neededEach a number, initially 0.


 UTF-8 lower boundaryA byte, initially 0x80.


 UTF-8 upper boundaryA byte, initially 0xBF.



[UTF-8](https://encoding.spec.whatwg.org/#utf-8)’s [decoder](https://encoding.spec.whatwg.org/#decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given
ioQueue and byte, runs these steps:

01. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [UTF-8 bytes needed](https://encoding.spec.whatwg.org/#utf-8-bytes-needed) is not 0, then set
     [UTF-8 bytes needed](https://encoding.spec.whatwg.org/#utf-8-bytes-needed) to 0 and return [error](https://encoding.spec.whatwg.org/#error).



02. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



03. If [UTF-8 bytes needed](https://encoding.spec.whatwg.org/#utf-8-bytes-needed) is 0, based on byte:


    0x00 to 0x7F



    Return a code point whose value is byte.



    0xC2 to 0xDF



    1. Set [UTF-8 bytes needed](https://encoding.spec.whatwg.org/#utf-8-bytes-needed) to 1.



    2. Set [UTF-8 code point](https://encoding.spec.whatwg.org/#utf-8-code-point) to byte & 0x1F.



       The five least significant bits of byte.



0xE0 to 0xEF



    1. If byte is 0xE0, then set [UTF-8 lower boundary](https://encoding.spec.whatwg.org/#utf-8-lower-boundary) to 0xA0.



    2. If byte is 0xED, then set [UTF-8 upper boundary](https://encoding.spec.whatwg.org/#utf-8-upper-boundary) to 0x9F.



    3. Set [UTF-8 bytes needed](https://encoding.spec.whatwg.org/#utf-8-bytes-needed) to 2.



    4. Set [UTF-8 code point](https://encoding.spec.whatwg.org/#utf-8-code-point) to byte & 0xF.



       The four least significant bits of byte.



0xF0 to 0xF4



    1. If byte is 0xF0, then set [UTF-8 lower boundary](https://encoding.spec.whatwg.org/#utf-8-lower-boundary) to 0x90.



    2. If byte is 0xF4, then set [UTF-8 upper boundary](https://encoding.spec.whatwg.org/#utf-8-upper-boundary) to 0x8F.



    3. Set [UTF-8 bytes needed](https://encoding.spec.whatwg.org/#utf-8-bytes-needed) to 3.



    4. Set [UTF-8 code point](https://encoding.spec.whatwg.org/#utf-8-code-point) to byte & 0x7.



       The three least significant bits of byte.



Otherwise



Return [error](https://encoding.spec.whatwg.org/#error).


Return [continue](https://encoding.spec.whatwg.org/#continue).



04. If byte is not in the range [UTF-8 lower boundary](https://encoding.spec.whatwg.org/#utf-8-lower-boundary) to
     [UTF-8 upper boundary](https://encoding.spec.whatwg.org/#utf-8-upper-boundary), inclusive:


    1. Set [UTF-8 code point](https://encoding.spec.whatwg.org/#utf-8-code-point),
        [UTF-8 bytes needed](https://encoding.spec.whatwg.org/#utf-8-bytes-needed), and [UTF-8 bytes seen](https://encoding.spec.whatwg.org/#utf-8-bytes-seen) to 0,
        set [UTF-8 lower boundary](https://encoding.spec.whatwg.org/#utf-8-lower-boundary) to 0x80, and set
        [UTF-8 upper boundary](https://encoding.spec.whatwg.org/#utf-8-upper-boundary) to 0xBF.



    2. [Restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) byte to ioQueue.



    3. Return [error](https://encoding.spec.whatwg.org/#error).
05. Set [UTF-8 lower boundary](https://encoding.spec.whatwg.org/#utf-8-lower-boundary) to 0x80 and
     [UTF-8 upper boundary](https://encoding.spec.whatwg.org/#utf-8-upper-boundary) to 0xBF.



06. Set [UTF-8 code point](https://encoding.spec.whatwg.org/#utf-8-code-point) to ( [UTF-8 code point](https://encoding.spec.whatwg.org/#utf-8-code-point) << 6) \|
     (byte & 0x3F)



    Shift the existing bits of [UTF-8 code point](https://encoding.spec.whatwg.org/#utf-8-code-point) left by six
     places and set the newly-vacated six least significant bits to the six least significant bits of
     byte.



07. Increase [UTF-8 bytes seen](https://encoding.spec.whatwg.org/#utf-8-bytes-seen) by one.



08. If [UTF-8 bytes seen](https://encoding.spec.whatwg.org/#utf-8-bytes-seen) is not equal to [UTF-8 bytes needed](https://encoding.spec.whatwg.org/#utf-8-bytes-needed), then return
     [continue](https://encoding.spec.whatwg.org/#continue).



09. Let codePoint be [UTF-8 code point](https://encoding.spec.whatwg.org/#utf-8-code-point).



10. Set [UTF-8 code point](https://encoding.spec.whatwg.org/#utf-8-code-point),
     [UTF-8 bytes needed](https://encoding.spec.whatwg.org/#utf-8-bytes-needed), and [UTF-8 bytes seen](https://encoding.spec.whatwg.org/#utf-8-bytes-seen) to 0.



11. Return a code point whose value is codePoint.


The constraints in the [UTF-8 decoder](https://encoding.spec.whatwg.org/#utf-8-decoder) above match
“Best Practices for Using U+FFFD” from the Unicode standard. No other
behavior is permitted per the Encoding Standard (other algorithms that
achieve the same result are fine, even encouraged).
[\[UNICODE\]](https://encoding.spec.whatwg.org/#biblio-unicode "The Unicode Standard")

#### 8.1.2. UTF-8 encoder

[UTF-8](https://encoding.spec.whatwg.org/#utf-8)’s [encoder](https://encoding.spec.whatwg.org/#encoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given unused and
codePoint, runs these steps:

1. If codePoint is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



2. If codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), then return a byte whose value is
    codePoint.



3. Set count and offset based on the
    range codePoint is in:


   U+0080 to U+07FF, inclusive

    1 and 0xC0

    U+0800 to U+FFFF, inclusive

    2 and 0xE0

    U+10000 to U+10FFFF, inclusive

    3 and 0xF0


4. Let bytes be a byte sequence whose first byte is
    (codePoint >\> (6 × count)) \+ offset.



5. While count is greater than 0:


   1. Set temp to
       codePoint >\> (6 × (count − 1)).



   2. Append to bytes 0x80 \| (temp & 0x3F).



   3. Decrease count by one.
6. Return bytes bytes, in order.


This algorithm has identical results to the one described in the Unicode standard. It
is included here for completeness. [\[UNICODE\]](https://encoding.spec.whatwg.org/#biblio-unicode "The Unicode Standard")

## 9\. Legacy single-byte encodings

An [encoding](https://encoding.spec.whatwg.org/#encoding) where each byte is either a single code point or
nothing, is a single-byte encoding.
[Single-byte encodings](https://encoding.spec.whatwg.org/#single-byte-encoding) share the
[decoder](https://encoding.spec.whatwg.org/#decoder) and [encoder](https://encoding.spec.whatwg.org/#encoder). Index single-byte,
as referenced by the [single-byte decoder](https://encoding.spec.whatwg.org/#single-byte-decoder) and
[single-byte encoder](https://encoding.spec.whatwg.org/#single-byte-encoder), is defined by the following table, and
depends on the [single-byte encoding](https://encoding.spec.whatwg.org/#single-byte-encoding) in use. All but two
[single-byte encodings](https://encoding.spec.whatwg.org/#single-byte-encoding) have a
unique [index](https://encoding.spec.whatwg.org/#index).

|     |     |     |     |
| --- | --- | --- | --- |
| IBM866 | [index-ibm866.txt](https://encoding.spec.whatwg.org/index-ibm866.txt) | [index IBM866 visualization](https://encoding.spec.whatwg.org/ibm866.html) | [index IBM866 BMP coverage](https://encoding.spec.whatwg.org/ibm866-bmp.html) |
| ISO-8859-2 | [index-iso-8859-2.txt](https://encoding.spec.whatwg.org/index-iso-8859-2.txt) | [index ISO-8859-2 visualization](https://encoding.spec.whatwg.org/iso-8859-2.html) | [index ISO-8859-2 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-2-bmp.html) |
| ISO-8859-3 | [index-iso-8859-3.txt](https://encoding.spec.whatwg.org/index-iso-8859-3.txt) | [index ISO-8859-3 visualization](https://encoding.spec.whatwg.org/iso-8859-3.html) | [index ISO-8859-3 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-3-bmp.html) |
| ISO-8859-4 | [index-iso-8859-4.txt](https://encoding.spec.whatwg.org/index-iso-8859-4.txt) | [index ISO-8859-4 visualization](https://encoding.spec.whatwg.org/iso-8859-4.html) | [index ISO-8859-4 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-4-bmp.html) |
| ISO-8859-5 | [index-iso-8859-5.txt](https://encoding.spec.whatwg.org/index-iso-8859-5.txt) | [index ISO-8859-5 visualization](https://encoding.spec.whatwg.org/iso-8859-5.html) | [index ISO-8859-5 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-5-bmp.html) |
| ISO-8859-6 | [index-iso-8859-6.txt](https://encoding.spec.whatwg.org/index-iso-8859-6.txt) | [index ISO-8859-6 visualization](https://encoding.spec.whatwg.org/iso-8859-6.html) | [index ISO-8859-6 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-6-bmp.html) |
| ISO-8859-7 | [index-iso-8859-7.txt](https://encoding.spec.whatwg.org/index-iso-8859-7.txt) | [index ISO-8859-7 visualization](https://encoding.spec.whatwg.org/iso-8859-7.html) | [index ISO-8859-7 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-7-bmp.html) |
| ISO-8859-8 | [index-iso-8859-8.txt](https://encoding.spec.whatwg.org/index-iso-8859-8.txt) | [index ISO-8859-8 visualization](https://encoding.spec.whatwg.org/iso-8859-8.html) | [index ISO-8859-8 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-8-bmp.html) |
| ISO-8859-8-I |
| ISO-8859-10 | [index-iso-8859-10.txt](https://encoding.spec.whatwg.org/index-iso-8859-10.txt) | [index ISO-8859-10 visualization](https://encoding.spec.whatwg.org/iso-8859-10.html) | [index ISO-8859-10 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-10-bmp.html) |
| ISO-8859-13 | [index-iso-8859-13.txt](https://encoding.spec.whatwg.org/index-iso-8859-13.txt) | [index ISO-8859-13 visualization](https://encoding.spec.whatwg.org/iso-8859-13.html) | [index ISO-8859-13 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-13-bmp.html) |
| ISO-8859-14 | [index-iso-8859-14.txt](https://encoding.spec.whatwg.org/index-iso-8859-14.txt) | [index ISO-8859-14 visualization](https://encoding.spec.whatwg.org/iso-8859-14.html) | [index ISO-8859-14 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-14-bmp.html) |
| ISO-8859-15 | [index-iso-8859-15.txt](https://encoding.spec.whatwg.org/index-iso-8859-15.txt) | [index ISO-8859-15 visualization](https://encoding.spec.whatwg.org/iso-8859-15.html) | [index ISO-8859-15 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-15-bmp.html) |
| ISO-8859-16 | [index-iso-8859-16.txt](https://encoding.spec.whatwg.org/index-iso-8859-16.txt) | [index ISO-8859-16 visualization](https://encoding.spec.whatwg.org/iso-8859-16.html) | [index ISO-8859-16 BMP coverage](https://encoding.spec.whatwg.org/iso-8859-16-bmp.html) |
| KOI8-R | [index-koi8-r.txt](https://encoding.spec.whatwg.org/index-koi8-r.txt) | [index KOI8-R visualization](https://encoding.spec.whatwg.org/koi8-r.html) | [index KOI8-R BMP coverage](https://encoding.spec.whatwg.org/koi8-r-bmp.html) |
| KOI8-U | [index-koi8-u.txt](https://encoding.spec.whatwg.org/index-koi8-u.txt) | [index KOI8-U visualization](https://encoding.spec.whatwg.org/koi8-u.html) | [index KOI8-U BMP coverage](https://encoding.spec.whatwg.org/koi8-u-bmp.html) |
| macintosh | [index-macintosh.txt](https://encoding.spec.whatwg.org/index-macintosh.txt) | [index macintosh visualization](https://encoding.spec.whatwg.org/macintosh.html) | [index macintosh BMP coverage](https://encoding.spec.whatwg.org/macintosh-bmp.html) |
| windows-874 | [index-windows-874.txt](https://encoding.spec.whatwg.org/index-windows-874.txt) | [index windows-874 visualization](https://encoding.spec.whatwg.org/windows-874.html) | [index windows-874 BMP coverage](https://encoding.spec.whatwg.org/windows-874-bmp.html) |
| windows-1250 | [index-windows-1250.txt](https://encoding.spec.whatwg.org/index-windows-1250.txt) | [index windows-1250 visualization](https://encoding.spec.whatwg.org/windows-1250.html) | [index windows-1250 BMP coverage](https://encoding.spec.whatwg.org/windows-1250-bmp.html) |
| windows-1251 | [index-windows-1251.txt](https://encoding.spec.whatwg.org/index-windows-1251.txt) | [index windows-1251 visualization](https://encoding.spec.whatwg.org/windows-1251.html) | [index windows-1251 BMP coverage](https://encoding.spec.whatwg.org/windows-1251-bmp.html) |
| windows-1252 | [index-windows-1252.txt](https://encoding.spec.whatwg.org/index-windows-1252.txt) | [index windows-1252 visualization](https://encoding.spec.whatwg.org/windows-1252.html) | [index windows-1252 BMP coverage](https://encoding.spec.whatwg.org/windows-1252-bmp.html) |
| windows-1253 | [index-windows-1253.txt](https://encoding.spec.whatwg.org/index-windows-1253.txt) | [index windows-1253 visualization](https://encoding.spec.whatwg.org/windows-1253.html) | [index windows-1253 BMP coverage](https://encoding.spec.whatwg.org/windows-1253-bmp.html) |
| windows-1254 | [index-windows-1254.txt](https://encoding.spec.whatwg.org/index-windows-1254.txt) | [index windows-1254 visualization](https://encoding.spec.whatwg.org/windows-1254.html) | [index windows-1254 BMP coverage](https://encoding.spec.whatwg.org/windows-1254-bmp.html) |
| windows-1255 | [index-windows-1255.txt](https://encoding.spec.whatwg.org/index-windows-1255.txt) | [index windows-1255 visualization](https://encoding.spec.whatwg.org/windows-1255.html) | [index windows-1255 BMP coverage](https://encoding.spec.whatwg.org/windows-1255-bmp.html) |
| windows-1256 | [index-windows-1256.txt](https://encoding.spec.whatwg.org/index-windows-1256.txt) | [index windows-1256 visualization](https://encoding.spec.whatwg.org/windows-1256.html) | [index windows-1256 BMP coverage](https://encoding.spec.whatwg.org/windows-1256-bmp.html) |
| windows-1257 | [index-windows-1257.txt](https://encoding.spec.whatwg.org/index-windows-1257.txt) | [index windows-1257 visualization](https://encoding.spec.whatwg.org/windows-1257.html) | [index windows-1257 BMP coverage](https://encoding.spec.whatwg.org/windows-1257-bmp.html) |
| windows-1258 | [index-windows-1258.txt](https://encoding.spec.whatwg.org/index-windows-1258.txt) | [index windows-1258 visualization](https://encoding.spec.whatwg.org/windows-1258.html) | [index windows-1258 BMP coverage](https://encoding.spec.whatwg.org/windows-1258-bmp.html) |
| x-mac-cyrillic | [index-x-mac-cyrillic.txt](https://encoding.spec.whatwg.org/index-x-mac-cyrillic.txt) | [index x-mac-cyrillic visualization](https://encoding.spec.whatwg.org/x-mac-cyrillic.html) | [index x-mac-cyrillic BMP coverage](https://encoding.spec.whatwg.org/x-mac-cyrillic-bmp.html) |

[ISO-8859-8](https://encoding.spec.whatwg.org/#iso-8859-8) and [ISO-8859-8-I](https://encoding.spec.whatwg.org/#iso-8859-8-i) are
distinct [encoding](https://encoding.spec.whatwg.org/#encoding) [names](https://encoding.spec.whatwg.org/#name), because
[ISO-8859-8](https://encoding.spec.whatwg.org/#iso-8859-8) has influence on the layout direction. And although
historically this might have been the case for [ISO-8859-6](https://encoding.spec.whatwg.org/#iso-8859-6) and
"ISO-8859-6-I" as well, that is no longer true.

### 9.1. single-byte decoder

[Single-byte encodings](https://encoding.spec.whatwg.org/#single-byte-encoding)’s [decoder](https://encoding.spec.whatwg.org/#decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given
unused and byte, runs these steps:

1. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



2. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), then return a code point whose value is
    byte.



3. Let codePoint be the [index code point](https://encoding.spec.whatwg.org/#index-code-point)
    for byte − 0x80 in [index single-byte](https://encoding.spec.whatwg.org/#index-single-byte).



4. If codePoint is null, then return [error](https://encoding.spec.whatwg.org/#error).



5. Return a code point whose value is codePoint.


### 9.2. single-byte encoder

[Single-byte encodings](https://encoding.spec.whatwg.org/#single-byte-encoding)’s [encoder](https://encoding.spec.whatwg.org/#encoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given
unused and codePoint, runs these steps:

1. If codePoint is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



2. If codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), then return a byte whose value is
    codePoint.



3. Let pointer be the [index pointer](https://encoding.spec.whatwg.org/#index-pointer) for codePoint in
    [index single-byte](https://encoding.spec.whatwg.org/#index-single-byte).



4. If pointer is null, then return [error](https://encoding.spec.whatwg.org/#error) with codePoint.



5. Return a byte whose value is pointer \+ 0x80.


## 10\. Legacy multi-byte Chinese (simplified) encodings

### 10.1. GBK

#### 10.1.1. GBK decoder

[GBK](https://encoding.spec.whatwg.org/#gbk)’s [decoder](https://encoding.spec.whatwg.org/#decoder) is [gb18030](https://encoding.spec.whatwg.org/#gb18030)’s [decoder](https://encoding.spec.whatwg.org/#decoder).

#### 10.1.2. GBK encoder

[GBK](https://encoding.spec.whatwg.org/#gbk)’s [encoder](https://encoding.spec.whatwg.org/#encoder) is [gb18030](https://encoding.spec.whatwg.org/#gb18030)’s [encoder](https://encoding.spec.whatwg.org/#encoder)
with its [is GBK](https://encoding.spec.whatwg.org/#gbk-flag) set to true.

Not fully aliasing [GBK](https://encoding.spec.whatwg.org/#gbk) with [gb18030](https://encoding.spec.whatwg.org/#gb18030)
is a conservative move to decrease the chances of breaking legacy servers and other
consumers of content generated with [GBK](https://encoding.spec.whatwg.org/#gbk)’s [encoder](https://encoding.spec.whatwg.org/#encoder).

### 10.2. gb18030

#### 10.2.1. gb18030 decoder

[gb18030](https://encoding.spec.whatwg.org/#gb18030)’s [decoder](https://encoding.spec.whatwg.org/#decoder) has an associated:

gb18030 firstgb18030 secondgb18030 thirdEach a byte, initially 0x00.



[gb18030](https://encoding.spec.whatwg.org/#gb18030)’s [decoder](https://encoding.spec.whatwg.org/#decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given
ioQueue and byte, runs these steps:

1. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first), [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second),
    and [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third) are 0x00, then return [finished](https://encoding.spec.whatwg.org/#finished).



2. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), and [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first), [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second),
    or [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third) is not 0x00, then set [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first), [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second), and
    [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third) to 0x00, and return [error](https://encoding.spec.whatwg.org/#error).



3. If [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third) is not 0x00:


   1. If byte is not in the range 0x30 to 0x39, inclusive:


      1. [Restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) « [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second), [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third), byte » to
          ioQueue.



      2. Set [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first), [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second), and [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third) to 0x00.



      3. Return [error](https://encoding.spec.whatwg.org/#error).
   2. Let codePoint be the [index gb18030 ranges code point](https://encoding.spec.whatwg.org/#index-gb18030-ranges-code-point) for
       (( [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first) − 0x81) × (10 × 126 × 10)) +
       (( [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second) − 0x30) × (10 × 126)) +
       (( [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third) − 0x81) × 10) + byte − 0x30.



   3. Set [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first), [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second), and [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third) to 0x00.



   4. If codePoint is null, then return [error](https://encoding.spec.whatwg.org/#error).



   5. Return a code point whose value is codePoint.
4. If [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second) is not 0x00:


   1. If byte is in the range 0x81 to 0xFE, inclusive, then set [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third)
       to byte and return [continue](https://encoding.spec.whatwg.org/#continue).



   2. [Restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) « [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second), byte » to ioQueue, set
       [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first) and [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second) to 0x00, and return [error](https://encoding.spec.whatwg.org/#error).
5. If [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first) is not 0x00:


   01. If byte is in the range 0x30 to 0x39, inclusive, then set [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second)
        to byte and return [continue](https://encoding.spec.whatwg.org/#continue).



   02. Let leading be [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first).



   03. Set [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first) to 0x00.



   04. Let pointer be null.



   05. Let offset be 0x40 if byte is less than 0x7F; otherwise 0x41.



   06. If byte is in the range 0x40 to 0x7E, inclusive, or 0x80 to 0xFE, inclusive,
        then set pointer to
        (leading − 0x81) × 190 + (byte − offset).



   07. Let codePoint be null if pointer is null; otherwise the
        [index code point](https://encoding.spec.whatwg.org/#index-code-point) for pointer in [index gb18030](https://encoding.spec.whatwg.org/#index-gb18030).



   08. If codePoint is non-null, then return a code point whose value is
        codePoint.



   09. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), then [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) byte to
        ioQueue.



   10. Return [error](https://encoding.spec.whatwg.org/#error).
6. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), then return a code point whose value is
    byte.



7. If byte is 0x80, then return code point U+20AC (€).



8. If byte is in the range 0x81 to 0xFE, inclusive, then set [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first) to
    byte and return [continue](https://encoding.spec.whatwg.org/#continue).



9. Return [error](https://encoding.spec.whatwg.org/#error).


#### 10.2.2. gb18030 encoder

[gb18030](https://encoding.spec.whatwg.org/#gb18030)’s [encoder](https://encoding.spec.whatwg.org/#encoder) has an associated is GBK, which is a
boolean, initially false.

[gb18030](https://encoding.spec.whatwg.org/#gb18030)’s [encoder](https://encoding.spec.whatwg.org/#encoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given unused and
codePoint, runs these steps:

01. If codePoint is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



02. If codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), then return a byte whose value is
     codePoint.



03. If codePoint is U+E5E5, then return [error](https://encoding.spec.whatwg.org/#error) with codePoint.



    [Index gb18030](https://encoding.spec.whatwg.org/#index-gb18030) maps 0xA3 0xA0 to U+3000 IDEOGRAPHIC SPACE rather than U+E5E5
     for compatibility with deployed content. Therefore it cannot roundtrip.



04. If [is GBK](https://encoding.spec.whatwg.org/#gbk-flag) is true and codePoint is U+20AC (€), then return byte 0x80.



05. If there is a row in the table below whose first column is codePoint, then return
     the two bytes on the same row listed in the second column:





    | Code point | Bytes |
    | --- | --- |
    | U+E78D | 0xA6 0xD9 |
    | U+E78E | 0xA6 0xDA |
    | U+E78F | 0xA6 0xDB |
    | U+E790 | 0xA6 0xDC |
    | U+E791 | 0xA6 0xDD |
    | U+E792 | 0xA6 0xDE |
    | U+E793 | 0xA6 0xDF |
    | U+E794 | 0xA6 0xEC |
    | U+E795 | 0xA6 0xED |
    | U+E796 | 0xA6 0xF3 |
    | U+E81E | 0xFE 0x59 |
    | U+E826 | 0xFE 0x61 |
    | U+E82B | 0xFE 0x66 |
    | U+E82C | 0xFE 0x67 |
    | U+E832 | 0xFE 0x6D |
    | U+E843 | 0xFE 0x7E |
    | U+E854 | 0xFE 0x90 |
    | U+E864 | 0xFE 0xA0 |


    This asymmetric encoder table preserves compatibility with the GB18030-2005
     standard. See also the explanation at [index gb18030 ranges](https://encoding.spec.whatwg.org/#index-gb18030-ranges).



06. Let pointer be the [index pointer](https://encoding.spec.whatwg.org/#index-pointer) for codePoint in
     [index gb18030](https://encoding.spec.whatwg.org/#index-gb18030).



07. If pointer is non-null:


    1. Let leading be pointer / 190 + 0x81.



    2. Let trailing be pointer % 190.



    3. Let offset be 0x40 if trailing is less than 0x3F,
        otherwise 0x41.



    4. Return two bytes whose values are leading and
        trailing \+ offset.
08. If [is GBK](https://encoding.spec.whatwg.org/#gbk-flag) is true, then return [error](https://encoding.spec.whatwg.org/#error) with codePoint.



09. Set pointer to the
     [index gb18030 ranges pointer](https://encoding.spec.whatwg.org/#index-gb18030-ranges-pointer) for codePoint.



10. Let byte1 be pointer / (10 × 126 × 10).



11. Set pointer to pointer % (10 × 126 × 10).



12. Let byte2 be pointer / (10 × 126).



13. Set pointer to pointer % (10 × 126).



14. Let byte3 be pointer / 10.



15. Let byte4 be pointer % 10.



16. Return four bytes whose values are byte1 \+ 0x81,
     byte2 \+ 0x30, byte3 \+ 0x81,
     byte4 \+ 0x30.


## 11\. Legacy multi-byte Chinese (traditional) encodings

### 11.1. Big5

#### 11.1.1. Big5 decoder

[Big5](https://encoding.spec.whatwg.org/#big5)’s [decoder](https://encoding.spec.whatwg.org/#decoder) has an associated Big5 leading, which
is a byte, initially 0x00.

[Big5](https://encoding.spec.whatwg.org/#big5)’s [decoder](https://encoding.spec.whatwg.org/#decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given ioQueue and
byte, runs these steps:

1. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [Big5 leading](https://encoding.spec.whatwg.org/#big5-lead) is not 0x00, then set
    [Big5 leading](https://encoding.spec.whatwg.org/#big5-lead) to 0x00 and return [error](https://encoding.spec.whatwg.org/#error).



2. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [Big5 leading](https://encoding.spec.whatwg.org/#big5-lead) is 0x00, then return
    [finished](https://encoding.spec.whatwg.org/#finished).



3. If [Big5 leading](https://encoding.spec.whatwg.org/#big5-lead) is not 0x00:


   01. Let leading be [Big5 leading](https://encoding.spec.whatwg.org/#big5-lead).



   02. Set [Big5 leading](https://encoding.spec.whatwg.org/#big5-lead) to 0x00.



   03. Let pointer be null.



   04. Let offset be 0x40 if byte is less than 0x7F; otherwise 0x62.



   05. If byte is in the range 0x40 to 0x7E, inclusive, or 0xA1 to 0xFE, inclusive,
        then set pointer to
        (leading − 0x81) × 157 + (byte − offset).



   06. If there is a row in the table below whose first column is pointer, then return
        the _two_ code points listed in its second column (the third column is irrelevant):





       | Pointer | Code points | Notes |
       | --- | --- | --- |
       | 1133 | U+00CA U+0304 | Ê̄ (LATIN CAPITAL LETTER E WITH CIRCUMFLEX AND MACRON) |
       | 1135 | U+00CA U+030C | Ê̌ (LATIN CAPITAL LETTER E WITH CIRCUMFLEX AND CARON) |
       | 1164 | U+00EA U+0304 | ê̄ (LATIN SMALL LETTER E WITH CIRCUMFLEX AND MACRON) |
       | 1166 | U+00EA U+030C | ê̌ (LATIN SMALL LETTER E WITH CIRCUMFLEX AND CARON) |


       Since [indexes](https://encoding.spec.whatwg.org/#index) are limited to
        single code points this table is used for these pointers.



   07. Let codePoint be null if pointer is null; otherwise the
        [index code point](https://encoding.spec.whatwg.org/#index-code-point) for pointer in [index Big5](https://encoding.spec.whatwg.org/#index-big5).



   08. If codePoint is non-null, then return a code point whose value is
        codePoint.



   09. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) byte to
        ioQueue.



   10. Return [error](https://encoding.spec.whatwg.org/#error).
4. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), then return a code point whose value is
    byte.



5. If byte is in the range 0x81 to 0xFE, inclusive, then set
    [Big5 leading](https://encoding.spec.whatwg.org/#big5-lead) to byte and return [continue](https://encoding.spec.whatwg.org/#continue).



6. Return [error](https://encoding.spec.whatwg.org/#error).


#### 11.1.2. Big5 encoder

[Big5](https://encoding.spec.whatwg.org/#big5)’s [encoder](https://encoding.spec.whatwg.org/#encoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given unused and
codePoint, runs these steps:

1. If codePoint is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



2. If codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), then return a byte whose value is
    codePoint.



3. Let pointer be the [index Big5 pointer](https://encoding.spec.whatwg.org/#index-big5-pointer) for codePoint.



4. If pointer is null, then return [error](https://encoding.spec.whatwg.org/#error) with codePoint.



5. Let leading be pointer / 157 + 0x81.



6. Let trailing be pointer % 157.



7. Let offset be 0x40 if trailing is less than 0x3F,
    otherwise 0x62.



8. Return two bytes whose values are leading and
    trailing \+ offset.


## 12\. Legacy multi-byte Japanese encodings

### 12.1. EUC-JP

#### 12.1.1. EUC-JP decoder

[EUC-JP](https://encoding.spec.whatwg.org/#euc-jp)’s [decoder](https://encoding.spec.whatwg.org/#decoder) has an associated:

EUC-JP jis0212A boolean, initially false.


 EUC-JP leadingA byte, initially 0x00.



[EUC-JP](https://encoding.spec.whatwg.org/#euc-jp)’s [decoder](https://encoding.spec.whatwg.org/#decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given
ioQueue and byte, runs these steps:

1. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead) is not 0x00, then set
    [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead) to 0x00 and return [error](https://encoding.spec.whatwg.org/#error).



2. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead) is 0x00, then return
    [finished](https://encoding.spec.whatwg.org/#finished).



3. If [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead) is 0x8E and byte is in the range 0xA1 to 0xDF,
    inclusive, then set [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead) to 0x00 and return a code point whose value is
    0xFF61 − 0xA1 + byte.



4. If [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead) is 0x8F and byte is in the range 0xA1 to 0xFE,
    inclusive, then set [EUC-JP jis0212](https://encoding.spec.whatwg.org/#euc-jp-jis0212-flag) to true, set [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead) to byte,
    and return [continue](https://encoding.spec.whatwg.org/#continue).



5. If [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead) is not 0x00:


   1. Let leading be [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead).



   2. Set [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead) to 0x00.



   3. Let codePoint be null.



   4. If leading and byte are both in the range 0xA1 to 0xFE, inclusive, then
       set codePoint to the [index code point](https://encoding.spec.whatwg.org/#index-code-point) for
       (leading − 0xA1) × 94 + byte − 0xA1
       in [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208) if [EUC-JP jis0212](https://encoding.spec.whatwg.org/#euc-jp-jis0212-flag) is false and in
       [index jis0212](https://encoding.spec.whatwg.org/#index-jis0212) otherwise.



   5. Set [EUC-JP jis0212](https://encoding.spec.whatwg.org/#euc-jp-jis0212-flag) to false.



   6. If codePoint is non-null, then return a code point whose value is
       codePoint.



   7. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), then [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) byte to
       ioQueue.



   8. Return [error](https://encoding.spec.whatwg.org/#error).
6. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), then return a code point whose value is
    byte.



7. If byte is 0x8E, 0x8F, or in the range 0xA1 to 0xFE, inclusive, then set
    [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead) to byte and return [continue](https://encoding.spec.whatwg.org/#continue).



8. Return [error](https://encoding.spec.whatwg.org/#error).


#### 12.1.2. EUC-JP encoder

[EUC-JP](https://encoding.spec.whatwg.org/#euc-jp)’s [encoder](https://encoding.spec.whatwg.org/#encoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given unused and
codePoint, runs these steps:

01. If codePoint is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



02. If codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), then return a byte whose value is
     codePoint.



03. If codePoint is U+00A5 (¥), then return byte 0x5C.



04. If codePoint is U+203E (‾), then return byte 0x7E.



05. If codePoint is in the range U+FF61 (｡) to U+FF9F (ﾟ), inclusive, then return two
     bytes whose values are 0x8E and codePoint − 0xFF61 + 0xA1.



06. If codePoint is U+2212 (−), then set it to U+FF0D (－).



07. Let pointer be the [index pointer](https://encoding.spec.whatwg.org/#index-pointer) for codePoint in
     [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208).



    If pointer is non-null, it is less than 8836 due to the nature of
     [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208) and the [index pointer](https://encoding.spec.whatwg.org/#index-pointer) operation.



08. If pointer is null, then return [error](https://encoding.spec.whatwg.org/#error) with codePoint.



09. Let leading be pointer / 94 + 0xA1.



10. Let trailing be pointer % 94 + 0xA1.



11. Return two bytes whose values are leading and trailing.


### 12.2. ISO-2022-JP

#### 12.2.1. ISO-2022-JP decoder

[ISO-2022-JP](https://encoding.spec.whatwg.org/#iso-2022-jp)’s [decoder](https://encoding.spec.whatwg.org/#decoder) has an associated:

ISO-2022-JP decoder stateA state, initially [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-ascii).


 ISO-2022-JP decoder output stateA state, initially [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-ascii).


 ISO-2022-JP leadingA byte, initially 0x00.


 ISO-2022-JP outputA boolean, initially false.



[ISO-2022-JP](https://encoding.spec.whatwg.org/#iso-2022-jp)’s [decoder](https://encoding.spec.whatwg.org/#decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given
ioQueue and byte, runs these steps, switching on
[ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state):

ASCII

Based on byte:



0x1B



Set [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to
[escape start](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-escape-start) and return
[continue](https://encoding.spec.whatwg.org/#continue).



0x00 to 0x7F, excluding 0x0E, 0x0F, and 0x1B



Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false and return a code point whose
value is byte.



[end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream)

Return [finished](https://encoding.spec.whatwg.org/#finished).



Otherwise



Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false and return [error](https://encoding.spec.whatwg.org/#error).


Roman

Based on byte:



0x1B



Set [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to
[escape start](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-escape-start) and return
[continue](https://encoding.spec.whatwg.org/#continue).



0x5C



Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false and return code point U+00A5 (¥).



0x7E



Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false and return code point U+203E (‾).



0x00 to 0x7F, excluding 0x0E, 0x0F, 0x1B, 0x5C, and 0x7E



Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false and return a code point whose
value is byte.



[end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream)

Return [finished](https://encoding.spec.whatwg.org/#finished).



Otherwise



Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false and return [error](https://encoding.spec.whatwg.org/#error).


katakana

Based on byte:


0x1B



Set [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to
[escape start](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-escape-start) and return
[continue](https://encoding.spec.whatwg.org/#continue).



0x21 to 0x5F



Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false and return a code point whose
value is 0xFF61 − 0x21 + byte.



[end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream)

Return [finished](https://encoding.spec.whatwg.org/#finished).



Otherwise



Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false and return [error](https://encoding.spec.whatwg.org/#error).


Leading byte

Based on byte:


0x1B



Set [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to
[escape start](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-escape-start) and return
[continue](https://encoding.spec.whatwg.org/#continue).



0x21 to 0x7E



Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false, [ISO-2022-JP leading](https://encoding.spec.whatwg.org/#iso-2022-jp-lead) to byte,
[ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to [trailing byte](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-trail-byte),
and return [continue](https://encoding.spec.whatwg.org/#continue).



[end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream)

Return [finished](https://encoding.spec.whatwg.org/#finished).



Otherwise



Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false and return [error](https://encoding.spec.whatwg.org/#error).


Trailing byte

Based on byte:


0x1B



Set [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to
[escape start](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-escape-start) and return [error](https://encoding.spec.whatwg.org/#error).



0x21 to 0x7E



1. Set the [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to
    [leading byte](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-lead-byte).



2. Let pointer be
    ( [ISO-2022-JP leading](https://encoding.spec.whatwg.org/#iso-2022-jp-lead) − 0x21) × 94 + byte − 0x21.



3. Let codePoint be the [index code point](https://encoding.spec.whatwg.org/#index-code-point) for
    pointer in [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208).



4. If codePoint is null, then return [error](https://encoding.spec.whatwg.org/#error).



5. Return a code point whose value is codePoint.



[end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream)

Set the [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to
[leading byte](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-lead-byte) and return [error](https://encoding.spec.whatwg.org/#error).



Otherwise



Set [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to
[leading byte](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-lead-byte) and return
[error](https://encoding.spec.whatwg.org/#error).


Escape start

1. If byte is either 0x24 or 0x28, then set
    [ISO-2022-JP leading](https://encoding.spec.whatwg.org/#iso-2022-jp-lead) to byte, [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to
    [escape](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-escape), and return [continue](https://encoding.spec.whatwg.org/#continue).



2. If byte is not [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) byte to ioQueue.



3. Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false, [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to
    [ISO-2022-JP decoder output state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-output-state), and return [error](https://encoding.spec.whatwg.org/#error).



Escape

1. Let leading be [ISO-2022-JP leading](https://encoding.spec.whatwg.org/#iso-2022-jp-lead) and set
    [ISO-2022-JP leading](https://encoding.spec.whatwg.org/#iso-2022-jp-lead) to 0x00.



2. Let state be null.



3. If leading is 0x28 and byte is 0x42, then set
    state to [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-ascii).



4. If leading is 0x28 and byte is 0x4A, then set
    state to [Roman](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-roman).



5. If leading is 0x28 and byte is 0x49, then set
    state to [katakana](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-katakana).



6. If leading is 0x24 and byte is either 0x40 or 0x42,
    then set state to [leading byte](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-lead-byte).



7. If state is non-null:


   1. Set [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) and
       [ISO-2022-JP decoder output state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-output-state) to state.



   2. Let output be the value of [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag).



   3. Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to true.



   4. Return [continue](https://encoding.spec.whatwg.org/#continue), if output is false, and
       [error](https://encoding.spec.whatwg.org/#error) otherwise.
8. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) leading to
    ioQueue; otherwise, [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) « leading, byte » to
    ioQueue.



9. Set [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag) to false,
    [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state) to [ISO-2022-JP decoder output state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-output-state)
    and return [error](https://encoding.spec.whatwg.org/#error).



#### 12.2.2. ISO-2022-JP encoder

The [ISO-2022-JP encoder](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder) is the only [encoder](https://encoding.spec.whatwg.org/#encoder) for which the concatenation of
multiple outputs can result in an [error](https://encoding.spec.whatwg.org/#error) when run through the corresponding
[decoder](https://encoding.spec.whatwg.org/#decoder).



Encoding U+00A5 (¥) gives 0x1B 0x28 0x4A
0x5C 0x1B 0x28 0x42. Doing that twice, concatenating the results, and then decoding yields U+00A5
U+FFFD U+00A5.

[ISO-2022-JP](https://encoding.spec.whatwg.org/#iso-2022-jp)’s [encoder](https://encoding.spec.whatwg.org/#encoder) has an associated
ISO-2022-JP encoder state which is ASCII,
Roman, or
jis0208, initially
[ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-ascii).

[ISO-2022-JP](https://encoding.spec.whatwg.org/#iso-2022-jp)’s [encoder](https://encoding.spec.whatwg.org/#encoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given
ioQueue and codePoint, runs these steps:

01. If codePoint is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) is not
     [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-ascii), then set [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) to
     [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-ascii) and return three bytes 0x1B 0x28 0x42.



02. If codePoint is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) is
     [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-ascii), then return [finished](https://encoding.spec.whatwg.org/#finished).



03. If [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) is [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-ascii) or
     [Roman](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-roman), and codePoint is U+000E, U+000F, or
     U+001B, then return [error](https://encoding.spec.whatwg.org/#error) with U+FFFD (�).



    This returns U+FFFD (�) rather than codePoint to prevent attacks.



04. If [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) is [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-ascii) and
     codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), then return a byte whose value is
     codePoint.



05. If [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) is [Roman](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-roman) and
     codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), excluding U+005C (\\) and U+007E (~), or is
     U+00A5 (¥) or U+203E (‾):


    1. If codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), then return a byte whose value is
        codePoint.



    2. If codePoint is U+00A5 (¥), then return byte 0x5C.



    3. If codePoint is U+203E (‾), then return byte 0x7E.
06. If codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), and [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state)
     is not [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-ascii), then [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) codePoint to
     ioQueue, set [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) to
     [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-ascii), and return three bytes 0x1B 0x28 0x42.



07. If codePoint is either U+00A5 (¥) or U+203E (‾), and
     [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) is not [Roman](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-roman), then
     [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) codePoint to ioQueue, set [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) to
     [Roman](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-roman), and return three bytes 0x1B 0x28 0x4A.



08. If codePoint is U+2212 (−), then set it to U+FF0D (－).



09. If codePoint is in the range U+FF61 (｡) to U+FF9F (ﾟ), inclusive, then set it to
     the [index code point](https://encoding.spec.whatwg.org/#index-code-point) for codePoint − 0xFF61 in
     [index ISO-2022-JP katakana](https://encoding.spec.whatwg.org/#index-iso-2022-jp-katakana).



10. Let pointer be the [index pointer](https://encoding.spec.whatwg.org/#index-pointer) for codePoint in
     [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208).



    If pointer is non-null, it is less than 8836 due to the nature of
     [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208) and the [index pointer](https://encoding.spec.whatwg.org/#index-pointer) operation.



11. If pointer is null:


    1. If [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) is [jis0208](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-jis0208),
        then [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) codePoint to ioQueue, set
        [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) to [ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-ascii), and return three
        bytes 0x1B 0x28 0x42.



    2. Return [error](https://encoding.spec.whatwg.org/#error) with codePoint.
12. If [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) is not [jis0208](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-jis0208),
     then [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) codePoint to ioQueue, set
     [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) to [jis0208](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-jis0208), and return
     three bytes 0x1B 0x24 0x42.



13. Let leading be pointer / 94 + 0x21.



14. Let trailing be pointer % 94 + 0x21.



15. Return two bytes whose values are leading and trailing.


### 12.3. Shift\_JIS

#### 12.3.1. Shift\_JIS decoder

[Shift\_JIS](https://encoding.spec.whatwg.org/#shift_jis)’s [decoder](https://encoding.spec.whatwg.org/#decoder) has an associated
Shift\_JIS leading, which is a byte, initially 0x00.

[Shift\_JIS](https://encoding.spec.whatwg.org/#shift_jis)’s [decoder](https://encoding.spec.whatwg.org/#decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given ioQueue and
byte, runs these steps:

1. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [Shift\_JIS leading](https://encoding.spec.whatwg.org/#shift_jis-lead) is not 0x00, then set
    [Shift\_JIS leading](https://encoding.spec.whatwg.org/#shift_jis-lead) to 0x00 and return [error](https://encoding.spec.whatwg.org/#error).



2. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [Shift\_JIS leading](https://encoding.spec.whatwg.org/#shift_jis-lead) is 0x00, then return
    [finished](https://encoding.spec.whatwg.org/#finished).



3. If [Shift\_JIS leading](https://encoding.spec.whatwg.org/#shift_jis-lead) is not 0x00:


   01. Let leading be [Shift\_JIS leading](https://encoding.spec.whatwg.org/#shift_jis-lead).



   02. Set [Shift\_JIS leading](https://encoding.spec.whatwg.org/#shift_jis-lead) to 0x00.



   03. Let pointer be null.



   04. Let offset be 0x40 if byte is less than 0x7F; otherwise 0x41.



   05. Let leadingOffset be 0x81 if leading is less than 0xA0; otherwise
        0xC1.



   06. If byte is in the range 0x40 to 0x7E, inclusive, or 0x80 to 0xFC, inclusive,
        then set pointer to
        (leading − leadingOffset) × 188 + byte − offset.



   07. If pointer is in the range 8836 to 10715, inclusive, then return a code point
        whose value is 0xE000 − 8836 + pointer.



       This is interoperable legacy from Windows known as EUDC.



   08. Let codePoint be null if pointer is null; otherwise the
        [index code point](https://encoding.spec.whatwg.org/#index-code-point) for pointer in [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208).



   09. If codePoint is non-null, then return a code point whose value is
        codePoint.



   10. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), then [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) byte to
        ioQueue.



   11. Return [error](https://encoding.spec.whatwg.org/#error).
4. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte) or 0x80, then return a code point whose value is
    byte.



5. If byte is in the range 0xA1 to 0xDF, inclusive, then return a code point whose
    value is 0xFF61 − 0xA1 + byte.



6. If byte is in the range 0x81 to 0x9F, inclusive, or 0xE0 to 0xFC, inclusive, then
    set [Shift\_JIS leading](https://encoding.spec.whatwg.org/#shift_jis-lead) to byte and return [continue](https://encoding.spec.whatwg.org/#continue).



7. Return [error](https://encoding.spec.whatwg.org/#error).


#### 12.3.2. Shift\_JIS encoder

[Shift\_JIS](https://encoding.spec.whatwg.org/#shift_jis)’s [encoder](https://encoding.spec.whatwg.org/#encoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given unused and
codePoint, runs these steps:

01. If codePoint is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



02. If codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point) or U+0080, then return a byte whose
     value is codePoint.



03. If codePoint is U+00A5 (¥), then return byte 0x5C.



04. If codePoint is U+203E (‾), then return byte 0x7E.



05. If codePoint is in the range U+FF61 (｡) to U+FF9F (ﾟ), inclusive, then return a
     byte whose value is codePoint − 0xFF61 + 0xA1.



06. If codePoint is U+2212 (−), then set it to U+FF0D (－).



07. Let pointer be the [index Shift\_JIS pointer](https://encoding.spec.whatwg.org/#index-shift_jis-pointer) for codePoint.



08. If pointer is null, then return [error](https://encoding.spec.whatwg.org/#error) with codePoint.



09. Let leading be pointer / 188.



10. Let leadingOffset be 0x81 if leading is less than 0x1F; otherwise 0xC1.



11. Let trailing be pointer % 188.



12. Let offset be 0x40 if trailing is less than 0x3F; otherwise 0x41.



13. Return two bytes whose values are leading \+ leadingOffset and
     trailing \+ offset.


## 13\. Legacy multi-byte Korean encodings

### 13.1. EUC-KR

#### 13.1.1. EUC-KR decoder

[EUC-KR](https://encoding.spec.whatwg.org/#euc-kr)’s [decoder](https://encoding.spec.whatwg.org/#decoder) has an associated EUC-KR leading,
which is a byte, initially 0x00.

[EUC-KR](https://encoding.spec.whatwg.org/#euc-kr)’s [decoder](https://encoding.spec.whatwg.org/#decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given ioQueue and
byte, runs these steps:

1. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [EUC-KR leading](https://encoding.spec.whatwg.org/#euc-kr-lead) is not 0x00, then set
    [EUC-KR leading](https://encoding.spec.whatwg.org/#euc-kr-lead) to 0x00 and return [error](https://encoding.spec.whatwg.org/#error).



2. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [EUC-KR leading](https://encoding.spec.whatwg.org/#euc-kr-lead) is 0x00, then return
    [finished](https://encoding.spec.whatwg.org/#finished).



3. If [EUC-KR leading](https://encoding.spec.whatwg.org/#euc-kr-lead) is not 0x00:


   1. Let leading be [EUC-KR leading](https://encoding.spec.whatwg.org/#euc-kr-lead).



   2. Set [EUC-KR leading](https://encoding.spec.whatwg.org/#euc-kr-lead) to 0x00.



   3. Let pointer be null.



   4. If byte is in the range 0x41 to 0xFE, inclusive, then set pointer
       to (leading − 0x81) × 190 + (byte − 0x41).



   5. Let codePoint be null if pointer is null; otherwise the
       [index code point](https://encoding.spec.whatwg.org/#index-code-point) for pointer in [index EUC-KR](https://encoding.spec.whatwg.org/#index-euc-kr).



   6. If codePoint is non-null, then return a code point whose value is
       codePoint.



   7. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), then [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) byte to
       ioQueue.



   8. Return [error](https://encoding.spec.whatwg.org/#error).
4. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), then return a code point whose value is
    byte.



5. If byte is in the range 0x81 to 0xFE, inclusive, then set [EUC-KR leading](https://encoding.spec.whatwg.org/#euc-kr-lead) to
    byte and return [continue](https://encoding.spec.whatwg.org/#continue).



6. Return [error](https://encoding.spec.whatwg.org/#error).


#### 13.1.2. EUC-KR encoder

[EUC-KR](https://encoding.spec.whatwg.org/#euc-kr)’s [encoder](https://encoding.spec.whatwg.org/#encoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given unused and
codePoint, runs these steps:

1. If codePoint is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



2. If codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), then return a byte whose value is
    codePoint.



3. Let pointer be the [index pointer](https://encoding.spec.whatwg.org/#index-pointer) for codePoint in
    [index EUC-KR](https://encoding.spec.whatwg.org/#index-euc-kr).



4. If pointer is null, then return [error](https://encoding.spec.whatwg.org/#error) with codePoint.



5. Let leading be pointer / 190 + 0x81.



6. Let trailing be pointer % 190 + 0x41.



7. Return two bytes whose values are leading and trailing.


## 14\. Legacy miscellaneous encodings

### 14.1. replacement

The [replacement](https://encoding.spec.whatwg.org/#replacement) [encoding](https://encoding.spec.whatwg.org/#encoding) exists to prevent certain
attacks that abuse a mismatch between [encodings](https://encoding.spec.whatwg.org/#encoding) supported on
the server and the client.

#### 14.1.1. replacement decoder

[replacement](https://encoding.spec.whatwg.org/#replacement)’s [decoder](https://encoding.spec.whatwg.org/#decoder) has an associated
replacement error returned, which is a boolean,
initially false.

[replacement](https://encoding.spec.whatwg.org/#replacement)’s [decoder](https://encoding.spec.whatwg.org/#decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given unused and
byte, runs these steps:

1. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



2. If [replacement error returned](https://encoding.spec.whatwg.org/#replacement-error-returned-flag) is false, then set [replacement error returned](https://encoding.spec.whatwg.org/#replacement-error-returned-flag) to
    true and return [error](https://encoding.spec.whatwg.org/#error).



3. Return [finished](https://encoding.spec.whatwg.org/#finished).


### 14.2. Common infrastructure for [UTF-16BE/LE](https://encoding.spec.whatwg.org/\#utf-16be-le)

UTF-16BE/LE is [UTF-16BE](https://encoding.spec.whatwg.org/#utf-16be) or [UTF-16LE](https://encoding.spec.whatwg.org/#utf-16le).

#### 14.2.1. shared UTF-16 decoder

A byte order mark has priority over a label as it has been found to be more accurate
in deployed content. Therefore it is not part of the [shared UTF-16 decoder](https://encoding.spec.whatwg.org/#shared-utf-16-decoder) algorithm, but
rather the [decode](https://encoding.spec.whatwg.org/#decode) algorithm.

[shared UTF-16 decoder](https://encoding.spec.whatwg.org/#shared-utf-16-decoder) has an associated:

UTF-16 leading byteNull or a byte, initially null.


 UTF-16 leading surrogateNull or a [leading surrogate](https://infra.spec.whatwg.org/#leading-surrogate), initially null.


 is UTF-16BE decoderA boolean, initially false.



[shared UTF-16 decoder](https://encoding.spec.whatwg.org/#shared-utf-16-decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given ioQueue and
byte, runs these steps:

1. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and either [UTF-16 leading byte](https://encoding.spec.whatwg.org/#utf-16-lead-byte) or
    [UTF-16 leading surrogate](https://encoding.spec.whatwg.org/#utf-16-lead-surrogate) is non-null, then set [UTF-16 leading byte](https://encoding.spec.whatwg.org/#utf-16-lead-byte) and
    [UTF-16 leading surrogate](https://encoding.spec.whatwg.org/#utf-16-lead-surrogate) to null, and return [error](https://encoding.spec.whatwg.org/#error).



2. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream) and [UTF-16 leading byte](https://encoding.spec.whatwg.org/#utf-16-lead-byte) and
    [UTF-16 leading surrogate](https://encoding.spec.whatwg.org/#utf-16-lead-surrogate) are null, then return [finished](https://encoding.spec.whatwg.org/#finished).



3. If [UTF-16 leading byte](https://encoding.spec.whatwg.org/#utf-16-lead-byte) is null, then set [UTF-16 leading byte](https://encoding.spec.whatwg.org/#utf-16-lead-byte) to
    byte and return [continue](https://encoding.spec.whatwg.org/#continue).



4. Let codeUnit be the result of:


   [is UTF-16BE decoder](https://encoding.spec.whatwg.org/#utf-16be-decoder-flag) is true



   ( [UTF-16 leading byte](https://encoding.spec.whatwg.org/#utf-16-lead-byte) << 8) + byte.


   [is UTF-16BE decoder](https://encoding.spec.whatwg.org/#utf-16be-decoder-flag) is false



   (byte << 8) + [UTF-16 leading byte](https://encoding.spec.whatwg.org/#utf-16-lead-byte).


5. Set [UTF-16 leading byte](https://encoding.spec.whatwg.org/#utf-16-lead-byte) to null.



6. If [UTF-16 leading surrogate](https://encoding.spec.whatwg.org/#utf-16-lead-surrogate) is non-null:


   1. Let leadingSurrogate be [UTF-16 leading surrogate](https://encoding.spec.whatwg.org/#utf-16-lead-surrogate).



   2. Set [UTF-16 leading surrogate](https://encoding.spec.whatwg.org/#utf-16-lead-surrogate) to null.



   3. If codeUnit is a [trailing surrogate](https://infra.spec.whatwg.org/#trailing-surrogate), then return a
       [scalar value from surrogates](https://encoding.spec.whatwg.org/#scalar-value-from-surrogates) given leadingSurrogate and codeUnit.



   4. Let byte1 be codeUnit >\> 8.



   5. Let byte2 be codeUnit & 0x00FF.



   6. Let bytes be a [list](https://infra.spec.whatwg.org/#list) of two bytes whose values are byte1
       and byte2, if [is UTF-16BE decoder](https://encoding.spec.whatwg.org/#utf-16be-decoder-flag) is true; otherwise byte2 and
       byte1.



   7. [Restore](https://encoding.spec.whatwg.org/#concept-stream-prepend) bytes to ioQueue and return [error](https://encoding.spec.whatwg.org/#error).
7. If codeUnit is a [leading surrogate](https://infra.spec.whatwg.org/#leading-surrogate), then set
    [UTF-16 leading surrogate](https://encoding.spec.whatwg.org/#utf-16-lead-surrogate) to codeUnit and return [continue](https://encoding.spec.whatwg.org/#continue).



8. If codeUnit is a [trailing surrogate](https://infra.spec.whatwg.org/#trailing-surrogate), then return [error](https://encoding.spec.whatwg.org/#error).



9. Return code point codeUnit.


### 14.3. UTF-16BE

#### 14.3.1. UTF-16BE decoder

[UTF-16BE](https://encoding.spec.whatwg.org/#utf-16be)’s [decoder](https://encoding.spec.whatwg.org/#decoder) is [shared UTF-16 decoder](https://encoding.spec.whatwg.org/#shared-utf-16-decoder) with
its [is UTF-16BE decoder](https://encoding.spec.whatwg.org/#utf-16be-decoder-flag) set to true.

### 14.4. UTF-16LE

"`utf-16`" is a [label](https://encoding.spec.whatwg.org/#label) for [UTF-16LE](https://encoding.spec.whatwg.org/#utf-16le) to deal with
deployed content.

#### 14.4.1. UTF-16LE decoder

[UTF-16LE](https://encoding.spec.whatwg.org/#utf-16le)’s [decoder](https://encoding.spec.whatwg.org/#decoder) is [shared UTF-16 decoder](https://encoding.spec.whatwg.org/#shared-utf-16-decoder).

### 14.5. x-user-defined

While technically this is a [single-byte encoding](https://encoding.spec.whatwg.org/#single-byte-encoding),
it is defined separately as it can be implemented algorithmically.

#### 14.5.1. x-user-defined decoder

[x-user-defined](https://encoding.spec.whatwg.org/#x-user-defined)’s [decoder](https://encoding.spec.whatwg.org/#decoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given unused and
byte, runs these steps:

1. If byte is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



2. If byte is an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte), then return a code point whose value is
    byte.



3. Return a code point whose value is 0xF780 + byte − 0x80.


#### 14.5.2. x-user-defined encoder

[x-user-defined](https://encoding.spec.whatwg.org/#x-user-defined)’s [encoder](https://encoding.spec.whatwg.org/#encoder)’s [handler](https://encoding.spec.whatwg.org/#handler), given unused and
codePoint, runs these steps:

1. If codePoint is [end-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), then return [finished](https://encoding.spec.whatwg.org/#finished).



2. If codePoint is an [ASCII code point](https://infra.spec.whatwg.org/#ascii-code-point), then return a byte whose value is
    codePoint.



3. If codePoint is in the range U+F780 to U+F7FF, inclusive, then return a byte
    whose value is codePoint − 0xF780 + 0x80.



4. Return [error](https://encoding.spec.whatwg.org/#error) with codePoint.


## 15\. Browser UI

Browsers are encouraged to not enable overriding the encoding of a resource. If such a feature is
nonetheless present, browsers should not offer [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le) as an option, due to the
aforementioned security issues. Browsers should also disable this feature if the resource was
decoded using [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le).

## Implementation considerations

Instead of supporting [I/O queues](https://encoding.spec.whatwg.org/#concept-stream) with arbitrary [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend), the
[decoders](https://encoding.spec.whatwg.org/#decoder) for [encodings](https://encoding.spec.whatwg.org/#encoding) in this standard could be implemented with:

1. The ability to unread the current byte.



2. A single-byte buffer for [gb18030](https://encoding.spec.whatwg.org/#gb18030) (an [ASCII byte](https://infra.spec.whatwg.org/#ascii-byte)) and [ISO-2022-JP](https://encoding.spec.whatwg.org/#iso-2022-jp) (0x24 or
    0x28).



   For [gb18030](https://encoding.spec.whatwg.org/#gb18030) when hitting a
    bogus byte while [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third) is not 0x00, [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second) could be moved into the
    single-byte buffer to be returned next, and [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third) would be the new
    [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first), checked for not being 0x00 after the single-byte buffer was returned and
    emptied. This is possible as the range for the first and third byte in [gb18030](https://encoding.spec.whatwg.org/#gb18030) is
    identical.


The [ISO-2022-JP encoder](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder) needs [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state) as additional state, but
other than that, none of the [encoders](https://encoding.spec.whatwg.org/#encoder) for [encodings](https://encoding.spec.whatwg.org/#encoding) in this standard
require additional state or buffers.

## Acknowledgments

There have been a lot of people that have helped make encodings more
interoperable over the years and thereby furthered the goals of this
standard. Likewise many people have helped making this standard what it is
today.

With that, many thanks to
Adam Rice,
Alan Chaney,
Alexander Shtuchkin,
Allen Wirfs-Brock,
Andreu Botella,
Aneesh Agrawal,
Arkadiusz Michalski,
Asmus Freytag,
Ben Noordhuis,
Bnaya Peretz,
Boris Zbarsky,
Bruno Haible,
Cameron McCormack,
Charles McCathieNeville,
Christopher Foo,
CodifierNL,
David Carlisle,
Domenic Denicola,
Dominique Hazaël-Massieux,
Doug Ewell,
Erik van der Poel,
譚永鋒 (Frank Yung-Fong Tang),
Glenn Maynard,
Gordon P. Hemsley,
Henri Sivonen,
Ian Hickson,
J. King,
James Graham,
Jeffrey Yasskin,
John Tamplin,
Joshua Bell,
村井純 (Jun Murai),
신정식 (Jungshik Shin),
Jxck,
강 성훈 (Kang Seonghoon),
川幡太一 (Kawabata Taichi),
Ken Lunde,
Ken Whistler,
Kenneth Russell,
田村健人 (Kent Tamura),
Leif Halvard Silli,
Luke Wagner,
Maciej Hirsz,
Makoto Kato,
Mark Callow,
Mark Crispin,
Mark Davis,
Martin Dürst,
Masatoshi Kimura,
Mattias Buelens,
Ms2ger,
Nigel Megitt,
Nigel Tao,
Norbert Lindenberg,
Øistein E. Andersen,
Peter Krefting,
Philip Jägenstedt,
Philip Taylor,
Richard Ishida,
Robbert Broersma,
Robert Mustacchi,
Ryan Dahl,
Sam Sneddon,
Shawn Steele,
Simon Montagu,
Simon Pieters,
Simon Sapin,
Stephen Checkoway,
寺田健 (Takeshi Terada),
Vyacheslav Matva,
Wolf Lammen, and
成瀬ゆい (Yui Naruse)
for being awesome.

This standard is written by [Anne van Kesteren](https://annevankesteren.nl/)
( [Apple](https://www.apple.com/), [annevk@annevk.nl](mailto:annevk@annevk.nl)).
The [API](https://encoding.spec.whatwg.org/#api) chapter was initially written by Joshua Bell
( [Google](https://www.google.com/)).

## Intellectual property rights

Copyright © WHATWG (Apple, Google, Mozilla, Microsoft). This work is licensed under a [Creative Commons Attribution 4.0\\
International License](https://creativecommons.org/licenses/by/4.0/). To the extent portions of it are incorporated into source code, such
portions in the source code are licensed under the [BSD 3-Clause License](https://opensource.org/licenses/BSD-3-Clause) instead.

This is the Living Standard. Those
interested in the patent-review version should view the
[Living Standard Review Draft](https://encoding.spec.whatwg.org/review-drafts/2025-06/).

## Index

### Terms defined by this specification

- [Big5](https://encoding.spec.whatwg.org/#big5), in § 11
- [Big5 decoder](https://encoding.spec.whatwg.org/#big5-decoder), in § 11.1
- [Big5 encoder](https://encoding.spec.whatwg.org/#big5-encoder), in § 11.1.1
- [Big5 leading](https://encoding.spec.whatwg.org/#big5-lead), in § 11.1.1
- [BOM seen](https://encoding.spec.whatwg.org/#textdecoder-bom-seen-flag), in § 7.1
- [BOM sniff](https://encoding.spec.whatwg.org/#bom-sniff), in § 6.1
- constructor()
  - [constructor for TextDecoder](https://encoding.spec.whatwg.org/#dom-textdecoder), in § 7.2
  - [constructor for TextDecoderStream](https://encoding.spec.whatwg.org/#dom-textdecoderstream), in § 7.5
  - [constructor for TextEncoder](https://encoding.spec.whatwg.org/#dom-textencoder), in § 7.4
  - [constructor for TextEncoderStream](https://encoding.spec.whatwg.org/#dom-textencoderstream), in § 7.6
- constructor(label)
  - [constructor for TextDecoder](https://encoding.spec.whatwg.org/#dom-textdecoder), in § 7.2
  - [constructor for TextDecoderStream](https://encoding.spec.whatwg.org/#dom-textdecoderstream), in § 7.5
- constructor(label, options)
  - [constructor for TextDecoder](https://encoding.spec.whatwg.org/#dom-textdecoder), in § 7.2
  - [constructor for TextDecoderStream](https://encoding.spec.whatwg.org/#dom-textdecoderstream), in § 7.5
- [continue](https://encoding.spec.whatwg.org/#continue), in § 4.1
- convert
  - [dfn for from I/O queue](https://encoding.spec.whatwg.org/#from-i-o-queue-convert), in § 3
  - [dfn for to I/O queue](https://encoding.spec.whatwg.org/#to-i-o-queue-convert), in § 3
- [convert code unit to scalar value](https://encoding.spec.whatwg.org/#convert-code-unit-to-scalar-value), in § 7.6
- [create a Uint8Array object](https://encoding.spec.whatwg.org/#create-a-uint8array-object), in § 3
- [decode](https://encoding.spec.whatwg.org/#decode), in § 6.1
- [decode()](https://encoding.spec.whatwg.org/#dom-textdecoder-decode), in § 7.2
- [decode and enqueue a chunk](https://encoding.spec.whatwg.org/#decode-and-enqueue-a-chunk), in § 7.5
- [decode(input)](https://encoding.spec.whatwg.org/#dom-textdecoder-decode), in § 7.2
- [decode(input, options)](https://encoding.spec.whatwg.org/#dom-textdecoder-decode), in § 7.2
- decoder
  - [definition of](https://encoding.spec.whatwg.org/#decoder), in § 4.1
  - [dfn for TextDecoderCommon](https://encoding.spec.whatwg.org/#textdecodercommon-decoder), in § 7.1
- [do not flush](https://encoding.spec.whatwg.org/#textdecoder-do-not-flush-flag), in § 7.2
- [encode](https://encoding.spec.whatwg.org/#encode), in § 6.1
- [encode()](https://encoding.spec.whatwg.org/#dom-textencoder-encode), in § 7.4
- [encode and enqueue a chunk](https://encoding.spec.whatwg.org/#encode-and-enqueue-a-chunk), in § 7.6
- [encode and flush](https://encoding.spec.whatwg.org/#encode-and-flush), in § 7.6
- [encode(input)](https://encoding.spec.whatwg.org/#dom-textencoder-encode), in § 7.4
- [encodeInto(source, destination)](https://encoding.spec.whatwg.org/#dom-textencoder-encodeinto), in § 7.4
- [encode or fail](https://encoding.spec.whatwg.org/#encode-or-fail), in § 6.1
- encoder
  - [definition of](https://encoding.spec.whatwg.org/#encoder), in § 4.1
  - [dfn for TextEncoderStream](https://encoding.spec.whatwg.org/#textencoderstream-encoder), in § 7.6
- encoding
  - [attribute for TextDecoderCommon](https://encoding.spec.whatwg.org/#dom-textdecoder-encoding), in § 7.1
  - [attribute for TextEncoderCommon](https://encoding.spec.whatwg.org/#dom-textencoder-encoding), in § 7.3
  - [definition of](https://encoding.spec.whatwg.org/#encoding), in § 4
  - [dfn for TextDecoderCommon](https://encoding.spec.whatwg.org/#textdecoder-encoding), in § 7.1
- [End-of-queue](https://encoding.spec.whatwg.org/#end-of-stream), in § 3
- [error](https://encoding.spec.whatwg.org/#error), in § 4.1
- error mode
  - [definition of](https://encoding.spec.whatwg.org/#error-mode), in § 4.1
  - [dfn for TextDecoderCommon](https://encoding.spec.whatwg.org/#textdecoder-error-mode), in § 7.1
- [EUC-JP](https://encoding.spec.whatwg.org/#euc-jp), in § 12
- [EUC-JP decoder](https://encoding.spec.whatwg.org/#euc-jp-decoder), in § 12.1
- [EUC-JP encoder](https://encoding.spec.whatwg.org/#euc-jp-encoder), in § 12.1.1
- [EUC-JP jis0212](https://encoding.spec.whatwg.org/#euc-jp-jis0212-flag), in § 12.1.1
- [EUC-JP leading](https://encoding.spec.whatwg.org/#euc-jp-lead), in § 12.1.1
- [EUC-KR](https://encoding.spec.whatwg.org/#euc-kr), in § 13
- [EUC-KR decoder](https://encoding.spec.whatwg.org/#euc-kr-decoder), in § 13.1
- [EUC-KR encoder](https://encoding.spec.whatwg.org/#euc-kr-encoder), in § 13.1.1
- [EUC-KR leading](https://encoding.spec.whatwg.org/#euc-kr-lead), in § 13.1.1
- fatal
  - [attribute for TextDecoderCommon](https://encoding.spec.whatwg.org/#dom-textdecoder-fatal), in § 7.1
  - [dict-member for TextDecoderOptions](https://encoding.spec.whatwg.org/#dom-textdecoderoptions-fatal), in § 7.2
- [finished](https://encoding.spec.whatwg.org/#finished), in § 4.1
- [flush and enqueue](https://encoding.spec.whatwg.org/#flush-and-enqueue), in § 7.5
- [gb18030](https://encoding.spec.whatwg.org/#gb18030), in § 10.1.2
- [gb18030 decoder](https://encoding.spec.whatwg.org/#gb18030-decoder), in § 10.2
- [gb18030 encoder](https://encoding.spec.whatwg.org/#gb18030-encoder), in § 10.2.1
- [gb18030 first](https://encoding.spec.whatwg.org/#gb18030-first), in § 10.2.1
- [gb18030 second](https://encoding.spec.whatwg.org/#gb18030-second), in § 10.2.1
- [gb18030 third](https://encoding.spec.whatwg.org/#gb18030-third), in § 10.2.1
- [GBK](https://encoding.spec.whatwg.org/#gbk), in § 10
- [GBK decoder](https://encoding.spec.whatwg.org/#gbk-decoder), in § 10.1
- [GBK encoder](https://encoding.spec.whatwg.org/#gbk-encoder), in § 10.1.1
- [get an encoder](https://encoding.spec.whatwg.org/#get-an-encoder), in § 6.1
- [get an encoding](https://encoding.spec.whatwg.org/#concept-encoding-get), in § 4.2
- [get an output encoding](https://encoding.spec.whatwg.org/#get-an-output-encoding), in § 4.3
- [getting an encoder](https://encoding.spec.whatwg.org/#get-an-encoder), in § 6.1
- [getting an encoding](https://encoding.spec.whatwg.org/#concept-encoding-get), in § 4.2
- [handler](https://encoding.spec.whatwg.org/#handler), in § 4.1
- [IBM866](https://encoding.spec.whatwg.org/#ibm866), in § 9
- [ignore BOM](https://encoding.spec.whatwg.org/#textdecoder-ignore-bom-flag), in § 7.1
- ignoreBOM
  - [attribute for TextDecoderCommon](https://encoding.spec.whatwg.org/#dom-textdecoder-ignorebom), in § 7.1
  - [dict-member for TextDecoderOptions](https://encoding.spec.whatwg.org/#dom-textdecoderoptions-ignorebom), in § 7.2
- [index](https://encoding.spec.whatwg.org/#index), in § 5
- [index Big5](https://encoding.spec.whatwg.org/#index-big5), in § 5
- [index Big5 pointer](https://encoding.spec.whatwg.org/#index-big5-pointer), in § 5
- [index code point](https://encoding.spec.whatwg.org/#index-code-point), in § 5
- [index EUC-KR](https://encoding.spec.whatwg.org/#index-euc-kr), in § 5
- [index gb18030](https://encoding.spec.whatwg.org/#index-gb18030), in § 5
- [index gb18030 ranges](https://encoding.spec.whatwg.org/#index-gb18030-ranges), in § 5
- [index gb18030 ranges code point](https://encoding.spec.whatwg.org/#index-gb18030-ranges-code-point), in § 5
- [index gb18030 ranges pointer](https://encoding.spec.whatwg.org/#index-gb18030-ranges-pointer), in § 5
- [index ISO-2022-JP katakana](https://encoding.spec.whatwg.org/#index-iso-2022-jp-katakana), in § 5
- [index jis0208](https://encoding.spec.whatwg.org/#index-jis0208), in § 5
- [index jis0212](https://encoding.spec.whatwg.org/#index-jis0212), in § 5
- [index pointer](https://encoding.spec.whatwg.org/#index-pointer), in § 5
- [index Shift\_JIS pointer](https://encoding.spec.whatwg.org/#index-shift_jis-pointer), in § 5
- [Index single-byte](https://encoding.spec.whatwg.org/#index-single-byte), in § 9
- I/O queue
  - [definition of](https://encoding.spec.whatwg.org/#concept-stream), in § 3
  - [dfn for TextDecoderCommon](https://encoding.spec.whatwg.org/#textdecodercommon-i-o-queue), in § 7.1
- [is GBK](https://encoding.spec.whatwg.org/#gbk-flag), in § 10.2.2
- [ISO-2022-JP](https://encoding.spec.whatwg.org/#iso-2022-jp), in § 12.1.2
- [ISO-2022-JP decoder](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder), in § 12.2
- [ISO-2022-JP decoder ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-ascii), in § 12.2.1
- [ISO-2022-JP decoder escape](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-escape), in § 12.2.1
- [ISO-2022-JP decoder escape start](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-escape-start), in § 12.2.1
- [ISO-2022-JP decoder katakana](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-katakana), in § 12.2.1
- [ISO-2022-JP decoder leading byte](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-lead-byte), in § 12.2.1
- [ISO-2022-JP decoder output state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-output-state), in § 12.2.1
- [ISO-2022-JP decoder Roman](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-roman), in § 12.2.1
- [ISO-2022-JP decoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-state), in § 12.2.1
- [ISO-2022-JP decoder trailing byte](https://encoding.spec.whatwg.org/#iso-2022-jp-decoder-trail-byte), in § 12.2.1
- [ISO-2022-JP encoder](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder), in § 12.2.1
- [ISO-2022-JP encoder ASCII](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-ascii), in § 12.2.2
- [ISO-2022-JP encoder jis0208](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-jis0208), in § 12.2.2
- [ISO-2022-JP encoder Roman](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-roman), in § 12.2.2
- [ISO-2022-JP encoder state](https://encoding.spec.whatwg.org/#iso-2022-jp-encoder-state), in § 12.2.2
- [ISO-2022-JP leading](https://encoding.spec.whatwg.org/#iso-2022-jp-lead), in § 12.2.1
- [ISO-2022-JP output](https://encoding.spec.whatwg.org/#iso-2022-jp-output-flag), in § 12.2.1
- [ISO-8859-10](https://encoding.spec.whatwg.org/#iso-8859-10), in § 9
- [ISO-8859-13](https://encoding.spec.whatwg.org/#iso-8859-13), in § 9
- [ISO-8859-14](https://encoding.spec.whatwg.org/#iso-8859-14), in § 9
- [ISO-8859-15](https://encoding.spec.whatwg.org/#iso-8859-15), in § 9
- [ISO-8859-16](https://encoding.spec.whatwg.org/#iso-8859-16), in § 9
- [ISO-8859-2](https://encoding.spec.whatwg.org/#iso-8859-2), in § 9
- [ISO-8859-3](https://encoding.spec.whatwg.org/#iso-8859-3), in § 9
- [ISO-8859-4](https://encoding.spec.whatwg.org/#iso-8859-4), in § 9
- [ISO-8859-5](https://encoding.spec.whatwg.org/#iso-8859-5), in § 9
- [ISO-8859-6](https://encoding.spec.whatwg.org/#iso-8859-6), in § 9
- [ISO-8859-7](https://encoding.spec.whatwg.org/#iso-8859-7), in § 9
- [ISO-8859-8](https://encoding.spec.whatwg.org/#iso-8859-8), in § 9
- [ISO-8859-8-I](https://encoding.spec.whatwg.org/#iso-8859-8-i), in § 9
- [is UTF-16BE decoder](https://encoding.spec.whatwg.org/#utf-16be-decoder-flag), in § 14.2.1
- [KOI8-R](https://encoding.spec.whatwg.org/#koi8-r), in § 9
- [KOI8-U](https://encoding.spec.whatwg.org/#koi8-u), in § 9
- [label](https://encoding.spec.whatwg.org/#label), in § 4
- [leading surrogate](https://encoding.spec.whatwg.org/#textencoderstream-pending-high-surrogate), in § 7.6
- [macintosh](https://encoding.spec.whatwg.org/#macintosh), in § 9
- [name](https://encoding.spec.whatwg.org/#name), in § 4
- [peek](https://encoding.spec.whatwg.org/#i-o-queue-peek), in § 3
- [process an item](https://encoding.spec.whatwg.org/#concept-encoding-process), in § 4.1
- [process a queue](https://encoding.spec.whatwg.org/#concept-encoding-run), in § 4.1
- [processing an item](https://encoding.spec.whatwg.org/#concept-encoding-process), in § 4.1
- [processing a queue](https://encoding.spec.whatwg.org/#concept-encoding-run), in § 4.1
- [push](https://encoding.spec.whatwg.org/#concept-stream-push), in § 3
- read
  - [dfn for I/O queue](https://encoding.spec.whatwg.org/#concept-stream-read), in § 3
  - [dict-member for TextEncoderEncodeIntoResult](https://encoding.spec.whatwg.org/#dom-textencoderencodeintoresult-read), in § 7.4
- [replacement](https://encoding.spec.whatwg.org/#replacement), in § 14
- [replacement decoder](https://encoding.spec.whatwg.org/#replacement-decoder), in § 14.1
- [replacement error returned](https://encoding.spec.whatwg.org/#replacement-error-returned-flag), in § 14.1.1
- [restore](https://encoding.spec.whatwg.org/#concept-stream-prepend), in § 3
- [scalar value from surrogates](https://encoding.spec.whatwg.org/#scalar-value-from-surrogates), in § 3
- [serialize I/O queue](https://encoding.spec.whatwg.org/#concept-td-serialize), in § 7.1
- [set up a text decoder stream](https://encoding.spec.whatwg.org/#set-up-a-text-decoder-stream), in § 7.5
- [shared UTF-16 decoder](https://encoding.spec.whatwg.org/#shared-utf-16-decoder), in § 14.2
- [Shift\_JIS](https://encoding.spec.whatwg.org/#shift_jis), in § 12.2.2
- [Shift\_JIS decoder](https://encoding.spec.whatwg.org/#shift_jis-decoder), in § 12.3
- [Shift\_JIS encoder](https://encoding.spec.whatwg.org/#shift_jis-encoder), in § 12.3.1
- [Shift\_JIS leading](https://encoding.spec.whatwg.org/#shift_jis-lead), in § 12.3.1
- [single-byte decoder](https://encoding.spec.whatwg.org/#single-byte-decoder), in § 9
- [single-byte encoder](https://encoding.spec.whatwg.org/#single-byte-encoder), in § 9.1
- [single-byte encoding](https://encoding.spec.whatwg.org/#single-byte-encoding), in § 9
- [stream](https://encoding.spec.whatwg.org/#dom-textdecodeoptions-stream), in § 7.2
- [TextDecodeOptions](https://encoding.spec.whatwg.org/#textdecodeoptions), in § 7.2
- [TextDecoder](https://encoding.spec.whatwg.org/#textdecoder), in § 7.2
- [TextDecoder()](https://encoding.spec.whatwg.org/#dom-textdecoder), in § 7.2
- [TextDecoderCommon](https://encoding.spec.whatwg.org/#textdecodercommon), in § 7.1
- [TextDecoder(label)](https://encoding.spec.whatwg.org/#dom-textdecoder), in § 7.2
- [TextDecoder(label, options)](https://encoding.spec.whatwg.org/#dom-textdecoder), in § 7.2
- [TextDecoderOptions](https://encoding.spec.whatwg.org/#textdecoderoptions), in § 7.2
- [TextDecoderStream](https://encoding.spec.whatwg.org/#textdecoderstream), in § 7.5
- [TextDecoderStream()](https://encoding.spec.whatwg.org/#dom-textdecoderstream), in § 7.5
- [TextDecoderStream(label)](https://encoding.spec.whatwg.org/#dom-textdecoderstream), in § 7.5
- [TextDecoderStream(label, options)](https://encoding.spec.whatwg.org/#dom-textdecoderstream), in § 7.5
- [TextEncoder](https://encoding.spec.whatwg.org/#textencoder), in § 7.4
- [TextEncoder()](https://encoding.spec.whatwg.org/#dom-textencoder), in § 7.4
- [TextEncoderCommon](https://encoding.spec.whatwg.org/#textencodercommon), in § 7.3
- [TextEncoderEncodeIntoResult](https://encoding.spec.whatwg.org/#dictdef-textencoderencodeintoresult), in § 7.4
- [TextEncoderStream](https://encoding.spec.whatwg.org/#textencoderstream), in § 7.6
- [TextEncoderStream()](https://encoding.spec.whatwg.org/#dom-textencoderstream), in § 7.6
- [UTF-16BE](https://encoding.spec.whatwg.org/#utf-16be), in § 14.2.1
- [UTF-16BE decoder](https://encoding.spec.whatwg.org/#utf-16be-decoder), in § 14.3
- [UTF-16BE/LE](https://encoding.spec.whatwg.org/#utf-16be-le), in § 14.2
- [UTF-16LE](https://encoding.spec.whatwg.org/#utf-16le), in § 14.3.1
- [UTF-16 leading byte](https://encoding.spec.whatwg.org/#utf-16-lead-byte), in § 14.2.1
- [UTF-16 leading surrogate](https://encoding.spec.whatwg.org/#utf-16-lead-surrogate), in § 14.2.1
- [UTF-16LE decoder](https://encoding.spec.whatwg.org/#utf-16le-decoder), in § 14.4
- [UTF-8](https://encoding.spec.whatwg.org/#utf-8), in § 8
- [UTF-8 bytes needed](https://encoding.spec.whatwg.org/#utf-8-bytes-needed), in § 8.1.1
- [UTF-8 bytes seen](https://encoding.spec.whatwg.org/#utf-8-bytes-seen), in § 8.1.1
- [UTF-8 code point](https://encoding.spec.whatwg.org/#utf-8-code-point), in § 8.1.1
- [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode), in § 6
- [UTF-8 decoder](https://encoding.spec.whatwg.org/#utf-8-decoder), in § 8.1
- [UTF-8 decode without BOM](https://encoding.spec.whatwg.org/#utf-8-decode-without-bom), in § 6
- [UTF-8 decode without BOM or fail](https://encoding.spec.whatwg.org/#utf-8-decode-without-bom-or-fail), in § 6
- [UTF-8 encode](https://encoding.spec.whatwg.org/#utf-8-encode), in § 6
- [UTF-8 encoder](https://encoding.spec.whatwg.org/#utf-8-encoder), in § 8.1.1
- [UTF-8 lower boundary](https://encoding.spec.whatwg.org/#utf-8-lower-boundary), in § 8.1.1
- [UTF-8 upper boundary](https://encoding.spec.whatwg.org/#utf-8-upper-boundary), in § 8.1.1
- [windows-1250](https://encoding.spec.whatwg.org/#windows-1250), in § 9
- [windows-1251](https://encoding.spec.whatwg.org/#windows-1251), in § 9
- [windows-1252](https://encoding.spec.whatwg.org/#windows-1252), in § 9
- [windows-1253](https://encoding.spec.whatwg.org/#windows-1253), in § 9
- [windows-1254](https://encoding.spec.whatwg.org/#windows-1254), in § 9
- [windows-1255](https://encoding.spec.whatwg.org/#windows-1255), in § 9
- [windows-1256](https://encoding.spec.whatwg.org/#windows-1256), in § 9
- [windows-1257](https://encoding.spec.whatwg.org/#windows-1257), in § 9
- [windows-1258](https://encoding.spec.whatwg.org/#windows-1258), in § 9
- [windows-874](https://encoding.spec.whatwg.org/#windows-874), in § 9
- [written](https://encoding.spec.whatwg.org/#dom-textencoderencodeintoresult-written), in § 7.4
- [x-mac-cyrillic](https://encoding.spec.whatwg.org/#x-mac-cyrillic), in § 9
- [x-user-defined](https://encoding.spec.whatwg.org/#x-user-defined), in § 14.4.1
- [x-user-defined decoder](https://encoding.spec.whatwg.org/#x-user-defined-decoder), in § 14.5
- [x-user-defined encoder](https://encoding.spec.whatwg.org/#x-user-defined-encoder), in § 14.5.1

### Terms defined by reference

- \[ECMASCRIPT\]defines the following terms:
  - realm
- \[HTML\]defines the following terms:
  - event loop
  - in parallel
  - relevant realm
- \[INFRA\]defines the following terms:
  - append
  - ASCII byte
  - ASCII case-insensitive
  - ASCII code point
  - ASCII lowercase
  - ASCII whitespace
  - assert
  - break
  - byte
  - byte sequence
  - code point
  - code unit
  - contain
  - continue
  - convert
  - for each
  - insert
  - is empty
  - is not empty
  - isomorphic decode
  - item
  - leading surrogate
  - list
  - prepend
  - queue
  - remove
  - scalar value
  - scalar value string
  - size
  - starts with
  - string
  - surrogate
  - the range
  - trailing surrogate
  - value
- \[STREAMS\]defines the following terms:
  - GenericTransformStream
  - ReadableStream
  - TransformStream
  - chunk
  - enqueue
  - flushAlgorithm
  - pipeThrough(transform)
  - readable
  - readable stream
  - set up
  - transform
  - transformAlgorithm
  - writable
  - writable stream
- \[WEBIDL\]defines the following terms:
  - AllowShared
  - AllowSharedBufferSource
  - ArrayBuffer
  - DOMString
  - NewObject
  - RangeError
  - TypeError
  - USVString
  - Uint32Array
  - Uint8Array
  - boolean
  - byte length
  - converted to an IDL value
  - create
  - get a copy of the buffer source
  - new
  - startingOffset
  - this
  - throw
  - unsigned long long
  - write

## References

### Normative References

\[ECMASCRIPT\]
 [ECMAScript Language Specification](https://tc39.es/ecma262/multipage/). URL: [https://tc39.es/ecma262/multipage/](https://tc39.es/ecma262/multipage/)\[HTML\]
 Anne van Kesteren; et al. [HTML Standard](https://html.spec.whatwg.org/multipage/). Living Standard. URL: [https://html.spec.whatwg.org/multipage/](https://html.spec.whatwg.org/multipage/)\[INFRA\]
 Anne van Kesteren; Domenic Denicola. [Infra Standard](https://infra.spec.whatwg.org/). Living Standard. URL: [https://infra.spec.whatwg.org/](https://infra.spec.whatwg.org/)\[STREAMS\]
 Adam Rice; et al. [Streams Standard](https://streams.spec.whatwg.org/). Living Standard. URL: [https://streams.spec.whatwg.org/](https://streams.spec.whatwg.org/)\[UNICODE\]
 [The Unicode Standard](https://www.unicode.org/versions/latest/). URL: [https://www.unicode.org/versions/latest/](https://www.unicode.org/versions/latest/)\[WEBIDL\]
 Edgar Chen; Timothy Gu. [Web IDL Standard](https://webidl.spec.whatwg.org/). Living Standard. URL: [https://webidl.spec.whatwg.org/](https://webidl.spec.whatwg.org/)

### Non-Normative References

\[ISO646\]
 [Information technology — ISO 7-bit coded character set for information interchange](https://www.iso.org/standard/4777.html). December 1991. Published. URL: [https://www.iso.org/standard/4777.html](https://www.iso.org/standard/4777.html)\[ISO8859-1\]
 [Information technology — 8-bit single-byte coded graphic character sets — Part 1: Latin alphabet No. 1](https://www.iso.org/standard/28245.html). April 1998. Published. URL: [https://www.iso.org/standard/28245.html](https://www.iso.org/standard/28245.html)\[URL\]
 Anne van Kesteren. [URL Standard](https://url.spec.whatwg.org/). Living Standard. URL: [https://url.spec.whatwg.org/](https://url.spec.whatwg.org/)\[XML\]
 Tim Bray; et al. [Extensible Markup Language (XML) 1.0 (Fifth Edition)](https://www.w3.org/TR/xml/). 26 November 2008. REC. URL: [https://www.w3.org/TR/xml/](https://www.w3.org/TR/xml/)

## IDL Index

```
interface mixin TextDecoderCommon {
  readonly attribute DOMString encoding;
  readonly attribute boolean fatal;
  readonly attribute boolean ignoreBOM;
};

dictionary TextDecoderOptions {
  boolean fatal = false;
  boolean ignoreBOM = false;
};

dictionary TextDecodeOptions {
  boolean stream = false;
};

[Exposed=*]
interface TextDecoder {
  constructor(optional DOMString label = "utf-8", optional TextDecoderOptions options = {});

  USVString decode(optional AllowSharedBufferSource input, optional TextDecodeOptions options = {});
};
TextDecoder includes TextDecoderCommon;

interface mixin TextEncoderCommon {
  readonly attribute DOMString encoding;
};

dictionary TextEncoderEncodeIntoResult {
  unsigned long long read;
  unsigned long long written;
};

[Exposed=*]
interface TextEncoder {
  constructor();

  [NewObject] Uint8Array encode(optional USVString input = "");
  TextEncoderEncodeIntoResult encodeInto(USVString source, [AllowShared] Uint8Array destination);
};
TextEncoder includes TextEncoderCommon;

[Exposed=*]
interface TextDecoderStream {
  constructor(optional DOMString label = "utf-8", optional TextDecoderOptions options = {});
};
TextDecoderStream includes TextDecoderCommon;
TextDecoderStream includes GenericTransformStream;

[Exposed=*]
interface TextEncoderStream {
  constructor();
};
TextEncoderStream includes TextEncoderCommon;
TextEncoderStream includes GenericTransformStream;
```

**✔** MDN

[TextDecoder/TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/TextDecoder "The TextDecoder() constructor returns a newly created TextDecoder object for the encoding specified in parameter.")

In all current engines.

Firefox19+Safari10.1+Chrome38+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js11.0.0+

**✔** MDN

[TextDecoder/decode](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/decode "The TextDecoder.decode() method returns a string containing text decoded from the buffer passed as a parameter.")

In all current engines.

Firefox19+Safari10.1+Chrome38+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js11.0.0+

**✔** MDN

[TextDecoder/encoding](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/encoding "The TextDecoder.encoding read-only property returns a string containing the name of the decoding algorithm used by the specific decoder object.")

In all current engines.

Firefox19+Safari10.1+Chrome38+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js8.3.0+

**✔** MDN

[TextDecoder/fatal](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/fatal "The fatal read-only property of the TextDecoder interface is a Boolean indicating whether the error mode is fatal.")

In all current engines.

Firefox36+Safari10.1+Chrome38+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js8.3.0+

**✔** MDN

[TextDecoder/ignoreBOM](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/ignoreBOM "The ignoreBOM read-only property of the TextDecoder interface is a Boolean indicating whether the byte order mark is ignored.")

In all current engines.

Firefox63+Safari10.1+Chrome38+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js8.3.0+

**✔** MDN

[TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder "The TextDecoder interface represents a decoder for a specific text encoding, such as UTF-8, ISO-8859-2, KOI8-R, GBK, etc. A decoder takes a stream of bytes as input and emits a stream of code points.")

In all current engines.

Firefox19+Safari10.1+Chrome38+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js11.0.0+

**✔** MDN

[TextDecoderStream/TextDecoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream/TextDecoderStream "The TextDecoderStream() constructor creates a new TextDecoderStream object which is used to convert a stream of text in a binary encoding into strings.")

In all current engines.

Firefox105+Safari14.1+Chrome71+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js16.6.0+

**✔** MDN

[TextDecoderStream/encoding](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream/encoding "The encoding read-only property of the TextDecoderStream interface returns a string containing the name of the encoding algorithm used by the specific decoder.")

In all current engines.

Firefox105+Safari14.1+Chrome71+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js16.6.0+

**✔** MDN

[TextDecoderStream/fatal](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream/fatal "The fatal read-only property of the TextDecoderStream interface is a boolean indicating if the error mode of the TextDecoderStream object is set to fatal.")

In all current engines.

Firefox105+Safari14.1+Chrome71+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js16.6.0+

**✔** MDN

[TextDecoderStream/ignoreBOM](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream/ignoreBOM "The ignoreBOM read-only property of the TextDecoderStream interface returns a boolean indicating if the byte order mark (BOM) is to be ignored.")

In all current engines.

Firefox105+Safari14.1+Chrome71+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js16.6.0+

**✔** MDN

[TextDecoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream "The TextDecoderStream interface of the Encoding API converts a stream of text in a binary encoding, such as UTF-8 etc., to a stream of strings. It is the streaming equivalent of TextDecoder.")

In all current engines.

Firefox105+Safari14.1+Chrome71+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js18.0.0+

**✔** MDN

[TextEncoder/TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/TextEncoder "The TextEncoder() constructor returns a newly created TextEncoder object that will generate a byte stream with UTF-8 encoding.")

In all current engines.

Firefox18+Safari10.1+Chrome38+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js11.0.0+

**✔** MDN

[TextEncoder/encode](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encode "The TextEncoder.encode() method takes a string as input, and returns a Uint8Array containing the text given in parameters encoded with the specific method for that TextEncoder object.")

In all current engines.

Firefox18+Safari10.1+Chrome38+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js8.3.0+

**✔** MDN

[TextEncoder/encodeInto](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encodeInto "The TextEncoder.encodeInto() method takes a string to encode and a destination Uint8Array to put resulting UTF-8 encoded text into, and returns a dictionary object indicating the progress of the encoding. This is potentially more performant than the older encode() method — especially when the target buffer is a view into a Wasm heap.")

In all current engines.

Firefox66+Safari14.1+Chrome74+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile50+

* * *

Node.js12.11.0+

**✔** MDN

[TextEncoder/encoding](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encoding "The TextEncoder.encoding read-only property returns a string containing the name of the encoding algorithm used by the specific encoder.")

In all current engines.

Firefox18+Safari10.1+Chrome38+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js8.3.0+

[TextEncoderStream/encoding](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream/encoding "The encoding read-only property of the TextEncoderStream interface returns a string containing the name of the encoding algorithm used by the current TextEncoderStream object.")

In all current engines.

Firefox105+Safari14.1+Chrome71+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js16.6.0+

**✔** MDN

[TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder "The TextEncoder interface takes a stream of code points as input and emits a stream of UTF-8 bytes.")

In all current engines.

Firefox18+Safari10.1+Chrome38+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js11.0.0+

**✔** MDN

[TextEncoderStream/TextEncoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream/TextEncoderStream "The TextEncoderStream() constructor creates a new TextEncoderStream object which is used to convert a stream of strings into bytes using UTF-8 encoding.")

In all current engines.

Firefox105+Safari14.1+Chrome71+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js16.6.0+

**✔** MDN

[TextEncoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream "The TextEncoderStream interface of the Encoding API converts a stream of strings into bytes in the UTF-8 encoding. It is the streaming equivalent of TextEncoder.")

In all current engines.

Firefox105+Safari14.1+Chrome71+

* * *

Opera?Edge79+

* * *

Edge (Legacy)?IENone

* * *

Firefox for Android?iOS Safari?Chrome for Android?Android WebView?Samsung Internet?Opera Mobile?

* * *

Node.js18.0.0+
