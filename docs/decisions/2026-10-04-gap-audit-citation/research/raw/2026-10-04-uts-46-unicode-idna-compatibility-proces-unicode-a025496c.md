---
url: https://www.unicode.org/reports/tr46/
retrieved: 2026-10-04
command: firecrawl scrape https://www.unicode.org/reports/tr46/ --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: UTS #46: Unicode IDNA Compatibility Processing
---
## Unicode® Technical Standard \#46

# Unicode IDNA Compatibility Processing

|     |     |
| --- | --- |
| Version | 18.0.0 |
| Editors | Mark Davis ( [mark@unicode.org](mailto:mark@unicode.org)),<br> Markus Scherer ( [markus.icu@gmail.com](mailto:markus.icu@gmail.com)) |
| Date | 2026-08-31 |
| This Version | [https://www.unicode.org/reports/tr46/tr46-36.html](https://www.unicode.org/reports/tr46/tr46-36.html) |
| Previous Version | [https://www.unicode.org/reports/tr46/tr46-35.html](https://www.unicode.org/reports/tr46/tr46-35.html) |
| Latest Version | [https://www.unicode.org/reports/tr46/](https://www.unicode.org/reports/tr46/) |
| Latest Proposed Update | [https://www.unicode.org/reports/tr46/proposed.html](https://www.unicode.org/reports/tr46/proposed.html) |
| Revision | [36](https://www.unicode.org/reports/tr46/#Modifications) |

### _Summary_

_Client software, such as browsers and emailers, faced a_
_difficult transition from the version of international domain names_
_approved in 2003 (IDNA2003), to the revision approved in 2010_
_(IDNA2008)._
_The specification in this document has been providing a mechanism_
_that minimizes the impact of this transition for client software,_
_allowing client software to access domains that are valid under_
_either system._

_The specification provides two main features: One is a_
_comprehensive mapping to support current user expectations for_
_casing and other variants of domain names. Such a mapping is allowed_
_by IDNA2008. The second is a compatibility mechanism that supports_
_the existing domain names that were allowed under IDNA2003. This_
_second feature was intended to improve client behavior during the_
_transition period._

### _Status_

_This document has been reviewed by Unicode members and other_
_interested parties, and has been approved for publication by the_
_Unicode Consortium. This is a stable document and may be used as_
_reference material or cited as a normative reference by other_
_specifications._

> _**A Unicode Technical Standard (UTS)** is an independent_
> _specification. Conformance to the Unicode Standard does not imply_
> _conformance to any UTS._

_Please submit corrigenda and other comments with the online_
_reporting form \[ [Feedback](https://www.unicode.org/reporting.html)\]._
_Related information that is useful in understanding this document is_
_found in the [References](https://www.unicode.org/reports/tr46/#References). For the latest_
_version of the Unicode Standard, see \[ [Unicode](https://www.unicode.org/versions/latest/)\]. For a_
_list of current Unicode Technical Reports, see \[ [Reports](https://www.unicode.org/reports/)\]. For more_
_information about versions of the Unicode Standard, see \[ [Versions](https://www.unicode.org/versions/)\]._

### _[Contents](https://www.unicode.org/reports/tr46/\#Contents)_

- 1 [Introduction](https://www.unicode.org/reports/tr46/#Introduction)
  - 1.1 [IDNA2003](https://www.unicode.org/reports/tr46/#IDNA2003-Section)
  - 1.2 [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008-Section)
  - 1.3 [Transition\\
     Considerations](https://www.unicode.org/reports/tr46/#Transition_Considerations)
    - 1.3.1 [Mapping](https://www.unicode.org/reports/tr46/#Mapping)
    - 1.3.2 [Deviations](https://www.unicode.org/reports/tr46/#Deviations)
      - Table 1. [Deviation Characters](https://www.unicode.org/reports/tr46/#Table_Deviation_Characters)
- 2 [Unicode IDNA\\
Compatibility Processing](https://www.unicode.org/reports/tr46/#Compatibility_Processing)
  - 2.1 [Display of Internationalized\\
     Domain Names](https://www.unicode.org/reports/tr46/#Display)
  - 2.2 [Registries](https://www.unicode.org/reports/tr46/#Registries)
  - 2.3 [Notation](https://www.unicode.org/reports/tr46/#Notation)
- 3 [Conformance](https://www.unicode.org/reports/tr46/#Conformance)
  - 3.1 [STD3 Rules](https://www.unicode.org/reports/tr46/#STD3_Rules)
- 4 [Processing](https://www.unicode.org/reports/tr46/#Processing)
  - 4.1 [Validity Criteria](https://www.unicode.org/reports/tr46/#Validity_Criteria)
    - 4.1.1 [UseSTD3ASCIIRules](https://www.unicode.org/reports/tr46/#UseSTD3ASCIIRules)
    - 4.1.2 [Right-to-Left\\
       Scripts](https://www.unicode.org/reports/tr46/#Right_to_Left_Scripts)
  - 4.2 [ToASCII](https://www.unicode.org/reports/tr46/#ToASCII)
  - 4.3 [ToUnicode](https://www.unicode.org/reports/tr46/#ToUnicode)
  - 4.4 [Preprocessing\\
     for IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008_Preprocessing)
  - 4.5 [Implementation\\
     Notes](https://www.unicode.org/reports/tr46/#Implementation_Notes)
    - Table 2. [Examples of Processing](https://www.unicode.org/reports/tr46/#Table_Example_Processing)
- 5 [IDNA Mapping Table](https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table)
  - Table 2b. [Data File\\
     Fields](https://www.unicode.org/reports/tr46/#Table_Data_File_Fields)
- 6 [Mapping Table\\
Derivation](https://www.unicode.org/reports/tr46/#Mapping_Table_Derivation)
  - [Step 1: Define a base\\
     mapping](https://www.unicode.org/reports/tr46/#TableDerivationStep1)
  - [Step 2: Specify the\\
     base valid set](https://www.unicode.org/reports/tr46/#TableDerivationStep2)
    - [Table 3. Base Valid\\
       Set](https://www.unicode.org/reports/tr46/#Table_Base_Valid_Set)
  - [Step 3: Specify the\\
     base exclusion set](https://www.unicode.org/reports/tr46/#TableDerivationStep3)
  - [Step 4: Specify the\\
     deviation set](https://www.unicode.org/reports/tr46/#TableDerivationStep4)
  - [Step 5: Specify\\
     changes for backward compatibility](https://www.unicode.org/reports/tr46/#TableDerivationStep5)
  - [Step 6: Produce the\\
     initial Status and Mapping values](https://www.unicode.org/reports/tr46/#TableDerivationStep6)
  - [Step 7: Produce the\\
     final Status and Mapping values](https://www.unicode.org/reports/tr46/#TableDerivationStep7)
- 7 [IDNA Comparison](https://www.unicode.org/reports/tr46/#IDNAComparison)
- 8 [Conformance Testing](https://www.unicode.org/reports/tr46/#Conformance_Testing)
  - 8.1 [Format](https://www.unicode.org/reports/tr46/#Format)
  - 8.2 [Testing Conformance](https://www.unicode.org/reports/tr46/#Testing_Conformance)
  - 8.3 [Migration](https://www.unicode.org/reports/tr46/#Migration)
- 9 [IDNA Derived Property](https://www.unicode.org/reports/tr46/#IDNA_Derived_Property)
- [Acknowledgments](https://www.unicode.org/reports/tr46/#Acknowledgements)
- [References](https://www.unicode.org/reports/tr46/#References)
- [Modifications](https://www.unicode.org/reports/tr46/#Modifications)

* * *

## 1 [Introduction](https://www.unicode.org/reports/tr46/\#Introduction)

One of the great strengths of domain names is universality. The URL https://Apple.com goes to Apple's
website from anywhere in the world, using any browser. The email
address  mark@unicode.org can be
used to send email to an editor of this specification from anywhere
in the world, using any emailer.


Initially, domain names were restricted to ASCII characters. This was
a significant burden on people using other characters. Suppose, for
example, that the domain name system had been invented by Greeks, and
one could only use Greek characters in URLs. Rather than apple.com, one would have to write
something like αππλε.κομ. An English
speaker would not only have to be acquainted with Greek characters,
but would also have to pick those Greek letters that would correspond
to the desired English letters. One would have to guess at the
spelling of particular words, because there are not exact matches
between scripts.


Most of the world’s population faced this situation until recently,
because their languages use non-ASCII characters. A system was
introduced in 2003 for internationalized domain names (IDN). This
system is called _Internationalizing Domain Names for_
_Applications_, or IDNA2003 for short. This mechanism supports IDNs by
means of a client software transformation into a format known as
Punycode. A revision of IDNA was approved in 2010 (IDNA2008). This
revision has a number of incompatibilities with IDNA2003.


The incompatibilities forced implementers of client software,
such as browsers and emailers, to face difficult choices during the
transition period as registries shifted from IDNA2003 to IDNA2008. This
document specifies a mechanism that has minimized the impact of this
transition for client software, allowing client software to access
domains that are valid under either system.

The specification provides two main features. The first is a
comprehensive mapping to support current user expectations for casing
and other variants of domain names. Such a mapping is allowed by
IDNA2008. The second feature is a compatibility mechanism that
supports the existing domain names that were allowed under IDNA2003.
This second feature was intended to improve client behavior during the
transition period.
Although the transition is complete and transitional processing is now deprecated,
the mapping and processing defined in this specification,
and the validation based on the latest version of Unicode,
remain valuable and in widespread use.

This specification contains both normative and
informative material. Only the conformance clauses and the text that
they directly or indirectly reference are considered normative.

### 1.1 [IDNA2003](https://www.unicode.org/reports/tr46/\#IDNA2003-Section)

The series of RFCs collectively known as IDNA2003 \[ [IDNA2003](https://www.unicode.org/reports/tr46/#IDNA2003)\] allows domain names to contain
non-ASCII Unicode characters, which includes not only the characters
needed for Latin-script languages other than English (such as Å, Ħ,
or Þ), but also different scripts, such as Greek, Cyrillic, Tamil, or
Korean. An internationalized domain name such as Bücher.de can then be used in an
"internationalized" URL, called an IRI, such as http://Bücher.de#titel.


The IDNA mechanism for allowing non-ASCII Unicode characters in
domain names involves applying the following steps to each label in
the domain name that contains Unicode characters:

1. Transforming (mapping) a Unicode string to remove case and
    other variant differences.
2. Checking the resulting string for validity, according to
    certain rules.
3. Transforming the Unicode characters into a DNS-compatible
    ASCII string using a specialized encoding called _Punycode_ \[ [RFC3492](https://www.unicode.org/reports/tr46/#RFC3492)\].


For example, typing the IRI http://Bücher.de
into the address bar of any modern browser goes to a corresponding
site, even though the "ü" is not an ASCII character. This
works because the IDN in that IRI resolves to the Punycode string
which is actually stored by the DNS for that site. Similarly, when a
browser interprets a web page containing a link such as <a
href="http://Bücher.de">, the appropriate site is
reached. (In this document, phrases such as "a browser
interprets" refer to domain names parsed out of IRIs entered in
an address bar _as well as_ to those contained in links
internal to HTML text.)


In the case of IDN Bücher.de, the
Punycode value actually used for the domain names on the wire is xn--bcher-kva.de. The Punycode version is
also typically transformed back into Unicode form for display. The
resulting display string will be a string which has already been
mapped according to the IDNA2003 rules. This example results in a
display string for the IRI that has been casefolded to lowercase:


> http://Bücher.de → http://xn--bcher-kva.de → http://bücher.de

A major limitation of IDNA2003 is its restriction to the repertoire
of characters in Unicode 3.2, which means that some modern languages
are excluded or not fully supported. Furthermore, within the
constraints of IDNA2003, there is no simple way to extend the
repertoire. IDNA2003 also does not make it clear to users of
registries exactly which string they are registering for a domain
name (between Bücher.de and bücher.de, for example).


### 1.2 [IDNA2008](https://www.unicode.org/reports/tr46/\#IDNA2008-Section)

In early 2010, a new version of IDNA was approved. Like IDNA2003,
this version consists of a collection of RFCs and is called IDNA2008
\[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\]. IDNA2008 is intended to solve the
major problems in IDNA2003. It extends the valid repertoire of
characters in domain names, and establishes an automatic process for
updating to future versions of the Unicode Standard. Furthermore, it
defines the concept of a valid domain name clearly, so that
registrants understand exactly what domain name string is being
registered.


Processing in IDNA2008 is identical to IDNA2003 for many common
domain names. Both IDNA2003 and IDNA2008 transform a Unicode domain
name in an IRI (like  http://öbb.at)
to the Punycode version (like http://xn--bb-eka.at).
However, IDNA2008 does not maintain strict backward compatibility
with IDNA2003. The main differences are:


- **Additions.** Some IDNs are invalid in IDNA2003, but
valid in IDNA2008.
- **Subtractions.** Some IDNs are valid in IDNA2003, but
invalid in IDNA2008.
- **Deviations.** Some IDNs are valid in both, but resolve
to different destinations.

### 1.3 [Transition Considerations](https://www.unicode.org/reports/tr46/\#Transition_Considerations)

The differences between IDNA2008 and IDNA2003 may cause
interoperability and security problems. They affect extremely common
characters, such as all uppercase characters, all halfwidth or
fullwidth characters (commonly used in Japan, China, and Korea), and
certain other characters like the German _eszett_ (U+00DF ß
LATIN SMALL LETTER SHARP S) and Greek _final sigma_ (U+03C2 ς
GREEK SMALL LETTER FINAL SIGMA).
Note that for the “deviation” characters like the sharp s and the sigma,
the industry has fully transitioned to IDNA2008 behavior,
and transitional processing has been deprecated.


#### 1.3.1 [Mapping](https://www.unicode.org/reports/tr46/\#Mapping)

IDNA2003 requires a mapping phase, which maps ÖBB.at
to öbb.at, for example. Mapping
typically involves mapping uppercase characters to their lowercase
pairs, but it also involves other types of mappings between
equivalent characters, such as mapping halfwidth _katakana_
characters to normal _katakana_ characters in Japanese. The
mapping phase in IDNA2003 was included to match the case insensitivity of
ASCII domain names. Users are accustomed to having both CNN.com and cnn.com
work identically. They expect domain names with accents to have the
same casing behavior, so that ÖBB.at
is the same as öbb.at. There are
variations similar to case differences in other scripts. The IDNA2003
mapping is based on data specified in the Unicode Standard, Version
3.2; this mapping was later formalized as the Unicode property \[ [NFKC\_Casefold](https://www.unicode.org/reports/tr46/#NFKC_CaseFold)\].


Note that case-folding generates a stable form of a string that
erases functional case-differences. It is _not_ the same as
lowercasing. In particular, the lowercase Cherokee characters added
in Unicode Version 8.0 are case-folded to their uppercase
counterparts.


IDNA2008 does not require a mapping phase, but does _permit_ one
(called "Local Mapping" or "Custom Mapping"). For
more information on the permitted mappings, see the _Protocol_
document of \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\], _Section 4.2,_
_Permitted Character and Label Validation_ and _Section 5.2,_
_Conversion to Unicode_.


The UTS #46 specification defines a mapping consistent with the
normative requirements of the IDNA2008 protocol, and which is
mostly compatible with IDNA2003.
For client software, this
provides behavior that is the most consistent with user expectations
about the handling of domain names with existing data—namely, that
domain names are case-insensitive.

#### 1.3.2 [Deviations](https://www.unicode.org/reports/tr46/\#Deviations)

There are a few situations where the use of IDNA2008 without
compatibility mapping will result in the resolution of IDNs to
different IP addresses from in IDNA2003, unless the registry or
registrant takes special action. This affects a very small number of
characters, but because these characters are very common in
particular languages, a significant number of domain names in those
languages are affected. This set of characters is referred to as
"Deviations" and is shown in _Table 1, [Deviation Characters](https://www.unicode.org/reports/tr46/#Table_Deviation_Characters)_,
illustrated in the context of IRIs.


Table 1. [Deviation Characters](https://www.unicode.org/reports/tr46/#Table_Deviation_Characters)

| Char | Example | IDNA2003 Result | IDNA2008 Result |
| --- | --- | --- | --- |
| ß<br>`00DF` | href="http://faß.de" | http://fass.de →<br>http://fass.de | http://faß.de →<br>http://xn--fa-hia.de |
| ς<br>`03C2` | href="http://βόλος.com" | http://βόλοσ.com →<br>http://xn--nxasmq6b.com | http://βόλος.com →<br>http://xn--nxasmm1c.com |
| ZWJ<br>`200D` | href="http://ශ්‍රී.com" | http://ශ්රී.com<br> →<br>http://xn--10cl1a0b.com | http://ශ්‍රී.com<br> →<br>http://xn--10cl1a0b660p.com |
| ZWNJ<br>`200C` | href="http://نامه‌ای.com" | http://نامهای.com<br> →<br>http://xn--mgba3gch31f.com | http://نامه‌ای.com<br> →<br>http://xn--mgba3gch31f060k.com |

For more information on the rationale for the occurrence of these
Deviations in IDNA2008, see the \[ [IDN FAQ](https://www.unicode.org/reports/tr46/#IDN_FAQ)\].


The differences in interpretation of Deviation characters result in
potential for security exploits. Consider a scenario involving http://www.sparkasse-gießen.de, a German
IRI containing an IDN for "Gießen Savings and Loan".


1. Alice's browser supports IDNA2003. Under those rules, http://www.sparkasse-gießen.de is mapped to
    http://www.sparkasse-giessen.de,
    which leads to a site with the IP address **01.23.45.67**.
2. She visits her friend Bob, and checks her bank statement on
    his browser. His browser supports IDNA2008. Under those rules, http://www.sparkasse-gießen.de is also
    valid, but converts to a different Punycode domain name in http://www.xn--sparkasse-gieen-2ib.de. This
    can lead to a different site with the IP address **101.123.145.167**,
    a spoof site.


> Alice ends up at the phishing site, supplies her bank
> password, and her money is stolen. While the .DE registar (DENIC)
> might have a policy about bundling all of the variants of ß together
> (so that they all have the same owner) it is not required of
> registries. It is unlikely that all registries will have and enforce
> such a bundling policy in all such cases.

There are two Deviations of particular concern. IDNA2008 allows
the joiner characters (ZWJ and ZWNJ) in labels. By contrast, these
are removed by the mapping in IDNA2003. When used in the intended
contexts in particular scripts, the joiner characters produce a
noticeable change in displayed text. However, when used between any
other characters in those scripts, or in any other scripts, they are
invisible. For example, when used between the Latin characters
"a" and "b" there is no visible different: the
sequence "a<ZWJ>b" looks just like "ab".

Because of the visual confusability introduced by the joiner
characters, IDNA2008 provides a special category for them called
CONTEXTJ, and only permits CONTEXTJ characters in limited contexts:
certain sequences of Arabic or Indic characters. However,
applications that perform IDNA2008 lookup are not required to check
for these contexts, so overall security is dependent on registries
having correct implementations. Moreover, the IDNA2008 context
restrictions do not catch most cases where distinct domain names have
visually confusable appearances because of ZWJ and ZWNJ.

Note that for these “deviations”,
the industry has fully transitioned to IDNA2008 behavior,
and transitional processing has been deprecated.

## 2 [Unicode\  IDNA Compatibility Processing](https://www.unicode.org/reports/tr46/\#Compatibility_Processing)

To satisfy user expectations for mapping, and (originally) provide
compatibility with IDNA2003, this document specifies a mapping for
use with IDNA2008. In addition, this document provides a Unicode algorithm for a
standardized processing that allows conformant implementations to
minimize the security and interoperability problems caused by the
differences between IDNA2003 and IDNA2008. This Unicode IDNA
Compatibility Processing is structured according to IDNA2003
principles, but extends those principles to Unicode 5.2 and later. It
also incorporates the repertoire extensions provided by IDNA2008.

UTS #46 can be used
purely as a preprocessing (local mapping) for IDNA2008 by claiming
conformance specifically to _Conformance Clause [C3](https://www.unicode.org/reports/tr46/#C3)_.


By using this Compatibility Processing, a domain name such as ÖBB.at will be mapped to the valid domain
name öbb.at, thus matching user
expectation for case behavior in domain names. For transitional use,
the Compatibility Processing also allows domain names containing
symbols and punctuation that were valid in IDNA2003, such as √.com (which has an associated web page).
Such domain names containing symbols will gradually disappear as
registries shift to IDNA2008.


Implementations may also restrict or flag (in a UI) domain names that
include symbols and punctuation. For more information, see _Unicode_
_Technical Report # 36, Unicode Security Considerations_ \[ [UTR36](https://www.unicode.org/reports/tr46/#UTR36)\].


Using the Unicode IDNA Compatibility Processing to transform an
IDN into a form suitable for DNS lookup is similar to the tactic of
"try IDNA2008 then try IDNA2003". However, this approach
avoids a potentially problematic dual lookup. It allows browsers and
other clients, such as search engines, to have a single processing
step, without the burden of maintaining two different implementations
and multiple tables. It accounts for a number of edge cases that
would cause problems, and provides a stable definition with
predictable results.

The Unicode IDNA Compatibility Processing also provides
alternate mappings for the Deviation characters. This facilitates the
transition from IDNA2003 to IDNA2008. It is up to the registries to
decide how to handle the transition, for example, by either bundling
or blocking the Deviation characters that they support.
**In practice, for the deviation characters, the transition is complete.**
**All major implementations have switched to nontransitional processing of the four deviation characters.**

The term "registries" includes far more than top-level
registries, such as for **.de** or **.com**.
For example, **.blogspot.com** has more domain names
registered than most top-level registries. There may be different
policies in place for a registry and any of its subregistries. Thus
millions of registries need to be considered in a transition
strategy, not just hundreds.


In lookup software, transitions may be fine-grained: for
example, it may be possible to transition to IDNA2008 rules regarding
Deviations for **.subdomain.com** at a given point but
not for **.com**, or vice versa.
If **.tld**
bundles or blocks the Deviation characters, then clients could
transition Deviations for **.tld**,
but not for (say) **.subdomain.tld**.
Moreover, client software with a UI, such as the address bar in a
browser, could provide more options for the transition. A full
discussion of such transition strategies is outside of the scope of
this document.


During the interim, authors of documents, such as HTML
documents, can unambiguously refer to the IDNA2008 interpretation of
characters by explicitly using the Punycode form of the domain name
label.

There are two slightly different compatibility mechanisms for domain
names during a transition and afterward. UTS #46 therefore specifies
two specific types of processing: Transitional Processing
( _Conformance Clause [C1](https://www.unicode.org/reports/tr46/#C1)_)
and Nontransitional Processing
( _Conformance Clause [C2](https://www.unicode.org/reports/tr46/#C2)_).
The only difference between them is the handling
of the four Deviation characters.


Summarized briefly, UTS #46 builds upon IDNA2008 in three
areas:

- **Mapping.** The UTS #46 mapping is used to
maintain maximal compatibility and meet user expectations. It is
conformant to IDNA2008, which allows for mapping input.
- **Symbols and Punctuation.** UTS #46 supports
processing of symbols and punctuation.
Registries which implement IDNA2008
will simply refuse the DNS lookups of IDNs with symbols.

- **Deviations (deprecated).** UTS #46 provides two ways of
handling these to support a transition. Transitional Processing (deprecated)
had been recommended to be used immediately before a DNS lookup in the
circumstances where the registry does not guarantee a strategy of
bundling or blocking. Nontransitional Processing, which is fully
compatible with IDNA2008, should be used in all cases.

For a demonstration of differences between IDNA2003, IDNA2008, and
the Unicode IDNA Compatibility Processing, see the \[ [DemoIDN](https://www.unicode.org/reports/tr46/#DemoIDN)\].

UTS #46 does not change any of the terms defined in IDNA2008, such as
A-Label or U-Label.


Neither the Unicode IDNA Compatibility Processing nor IDNA2008
address security problems associated with confusables (the so-called
"paypal.com" problem).
IDNA2008 disallows certain symbols and punctuation characters that
can be used for spoofing, such as spoofs of the slash character
("/"). However, these are an extremely small fraction of
the confusable characters used for spoofing. Moreover, confusable
characters themselves account for a small proportion of phishing
problems: most are cases like "secure-wellsfargo.com". For
more information, see \[ [Bortzmeyer](https://www.unicode.org/reports/tr46/#Bortzmeyer)\] and the
\[ [IDN FAQ](https://www.unicode.org/reports/tr46/#IDN_FAQ)\]. It is strongly recommended that _Unicode_
_Technical Report #36, Unicode Security Considerations_ \[ [UTR36](https://www.unicode.org/reports/tr46/#UTR36)\] and _Unicode Technical Standard_
_#39, Unicode Security Mechanisms_ \[ [UTS39](https://www.unicode.org/reports/tr46/#UTS39)\] be
consulted for information on dealing with confusables, both for
client software and registries. In particular, \[ [UTS39](https://www.unicode.org/reports/tr46/#UTS39)\]
provides information that can be used to drastically reduce the
number of confusables when dealing with international domain names,
much beyond what IDNA2008 does. See also the \[ [DemoConf](https://www.unicode.org/reports/tr46/#DemoConf)\].


### 2.1 [Display of\  Internationalized Domain Names](https://www.unicode.org/reports/tr46/\#Display)

IDNA2003 applications customarily display the processed string to the
user. This improves security by reducing the opportunity for visual
confusability. Thus, for example, the URL http://googIe.com
(with a capital I in place of the L) is revealed as http://googie.com.


### 2.2 [Registries](https://www.unicode.org/reports/tr46/\#Registries)

This specification is primarily targeted at applications doing lookup
of IDNs. There is, however, one strong recommendation for registries:
_do not allow the registration of labels that are invalid_
_according to Nontransitional Processing, and_
_do use bundling or blocking for_
_labels containing confusable characters_.


These tactics can be described as follows:

- **Bundling**:
If two or more labels are different, but confusable,
and more than one is registered,
the registrant for each must be the same.
- **Blocking**:
If two or more labels are different, but confusable,
allow the registration of only one, and block the others.
Registries that do not allow any Deviation
characters at all count as **blocking**.

> **Note:** Some implementations outside Unicode
> use different terminology for these strategies.
> In particular, in the ICANN Root Zone Label Generation Rules \[ [RZLGR5](https://www.unicode.org/reports/tr46/#RZLGR5)\],
> the term _allocatable variant_ of X is used for labels that can be bundled with X,
> and the term _blocked variant_ is used for a mutually exclusive label.

The label that is actually registered and inserted into a registry
has always been processed. For example, xn--bcher-kva
corresponds to bücher. However, it may
be useful for a registry to also ask for "unprocessed" labels, such
as Bücher, as part of the registration
process, so that they are aware of the registrant's intent. However,
such unprocessed labels must be handled carefully:


- Storing the unprocessed label as the sequence of characters
that the registrant really wanted to apply for.
- Processing the unprocessed label, and displaying the
processed label to the registrant for confirmation.
- Proceeding with the regular registration process using
_only_ the processed label.


### 2.3 [Notation](https://www.unicode.org/reports/tr46/\#Notation)

Sets of code points are defined using properties and the syntax of _Unicode_
_Technical Standard #18, Unicode Regular Expressions_ \[ [UTS18](https://www.unicode.org/reports/tr46/#UTS18)\]. For example, the set of combining marks is
represented by the syntax
`\p{gc=M}`
. Additionally, the "+" indicates the addition of elements
to a set, for clarity.


In this document, a _label_ is a substring of a domain name.
That substring is bounded on both sides by either the start or the
end of the string, or any of the following characters, called _label-separators_:


1. U+002E ( . ) FULL STOP
2. U+FF0E ( ． ) FULLWIDTH FULL STOP
3. U+3002 ( 。 ) IDEOGRAPHIC FULL STOP
4. U+FF61 ( ｡ ) HALFWIDTH IDEOGRAPHIC FULL STOP

Many people use the terms "domain names" and "host
names" interchangeably. This document follows \[ [RFC3490](https://www.unicode.org/reports/tr46/#RFC3490)\] in use of the term "domain
name".

A _Bidi domain name_ is a domain name containing at least one character
with Bidi\_Class R, AL, or AN.
See \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\] RFC 5893, Section 1.4.

## 3 [Conformance](https://www.unicode.org/reports/tr46/\#Conformance)

The requirements for conformance on implementations of the **Unicode**
**IDNA Compatibility Processing** algorithm are stated in the following
clauses. An implementation can claim conformance to any or all of
these clauses independently.


**[C1](https://www.unicode.org/reports/tr46/#C1) (deprecated)**. _Given a_
_version of Unicode and a [Unicode\_\
_String](https://www.unicode.org/glossary/#unicode_string), a conformant implementation of **Transitional**_
_**Processing** shall replicate the results given by applying the_
_Transitional Processing algorithm specified by Section 4, [Processing](https://www.unicode.org/reports/tr46/#Processing)_.


**[C2](https://www.unicode.org/reports/tr46/#C2)**. _Given a_
_version of Unicode and a [Unicode\_\
_String](https://www.unicode.org/glossary/#unicode_string), a conformant implementation of **Nontransitional**_
_**Processing** shall replicate the results given by applying the_
_Nontransitional Processing algorithm specified by Section 4, [Processing](https://www.unicode.org/reports/tr46/#Processing)_.


**[C3](https://www.unicode.org/reports/tr46/#C3)**. _Given a_
_version of Unicode and a [Unicode\_\
_String](https://www.unicode.org/glossary/#unicode_string), a conformant implementation of **Preprocessing**_
_**for IDNA2008** shall replicate the results specified by Section 4.4,_
_[Preprocessing for IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008_Preprocessing)_.


These specifications are _logical_ ones, designed to be
straightforward to describe. An actual implementation is free to use
different methods as long the result is the same as that specified by
the logical algorithm.


Any conformant implementation may also have _tighter_ validity
criteria than those imposed by _Section 4.1, [Validity Criteria](https://www.unicode.org/reports/tr46/#Validity_Criteria)_. For example, an
application could disallow or warn of domain name labels with certain
characteristics, such as:


- labels with certain combinations of scripts (Safari)
- labels with characters outside of the user's specified
languages (IE)
- labels with certain confusable characters (Firefox)
- labels that are detected by the Google Safe Browsing API \[ [SafeBrowsing](https://www.unicode.org/reports/tr46/#SafeBrowsing)\]

- labels that do not meet the validity requirements of
IDNA2008
- labels produced by toUnicode that would not meet the label
validity requirements if toASCII were performed.
- labels containing characters which are not contained in the
[General\\
Security Profile for Identifiers](https://www.unicode.org/reports/tr39/#General_Security_Profile) from _Unicode Technical_
_Standard #39, Unicode Security Mechanisms_ \[ [UTS39](https://www.unicode.org/reports/tr46/#UTS39)\]

- labels that do not satisfy _Restriction Level 4, [Moderately\_\
_Restrictive](https://www.unicode.org/reports/tr39/#moderately_restrictive)_ from _Unicode Technical Standard #39, Unicode_
_Security Mechanisms_ \[ [UTS39](https://www.unicode.org/reports/tr46/#UTS39)\]


For more information, see _Unicode Technical Report #36,_
_Unicode Security Considerations_ \[ [UTR36](https://www.unicode.org/reports/tr46/#UTR36)\] and _Unicode_
_Technical Standard #39, Unicode Security Mechanisms_ \[ [UTS39](https://www.unicode.org/reports/tr46/#UTS39)\].


### 3.1 [STD3 Rules](https://www.unicode.org/reports/tr46/\#STD3_Rules)

IDNA2003 provides for a flag, **UseSTD3ASCIIRules**,
that allows for implementations to choose whether or not to abide by
the rules in \[ [STD3](https://www.unicode.org/reports/tr46/#STD3)\]. These rules exclude ASCII
characters outside the set consisting of A-Z, a-z, 0-9, and U+002D (
\- ) HYPHEN-MINUS. For example, some browsers also allow characters
such as U+005F ( \_ ) LOW LINE _(underbar)_ in domain names,
and thus use
a custom set of valid ASCII characters when
checking the _[Validity Criteria](https://www.unicode.org/reports/tr46/#Validity_Criteria)_.


## 4 [Processing](https://www.unicode.org/reports/tr46/\#Processing)

The input to Unicode IDNA Compatibility Processing is a prospective _domain\_name_
string expressed in Unicode, and a choice of Transitional or
Nontransitional Processing. The domain name consists of a sequence of
labels with dot separators, such as "Bücher.de". For more information about the composition of a
URL, see Section 3.5 of \[ [STD13](https://www.unicode.org/reports/tr46/#STD13)\].


**Main Processing Steps**

The following steps, performed in order, successively alter the input
_domain\_name_ string and then output it as a converted Unicode
string, plus a flag to indicate whether there was an error. Even if
an error occurs, the conversion of the string is performed as much as
is possible.


**Input**

- A prospective _domain\_name_ expressed as a sequence
of Unicode code points

- A boolean flag: _UseSTD3ASCIIRules_
- A boolean flag: _CheckHyphens_
- A boolean flag: _CheckBidi_
- A boolean flag: _CheckJoiners_
- A boolean flag: _Transitional\_Processing_ (deprecated)
- A boolean flag: _IgnoreInvalidPunycode_

**Processing**

1. [Map](https://www.unicode.org/reports/tr46/#ProcessingStepMap). For each code
    point in the _domain\_name_ string, look up the Status value in
    _Section 5, [IDNA Mapping Table](https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table "IDNA_Mapping_Table")_, and take the
    following actions:

   - **disallowed**: Leave the code point
      unchanged in the string.
      Note: The Convert/Validate step below checks for disallowed characters,
      _after_ mapping and normalization.
   - **ignored**: Remove the code point from the
      string. This is equivalent to mapping the code point to an empty
      string.
   - **mapped**:
      If _Transitional\_Processing_ (deprecated) and
      the code point is U+1E9E capital sharp s (ẞ),
      then replace the code point in the string by “ss”. Otherwise:


      Replace the code point in the
      string by the value for the mapping in _Section 5, [IDNA\_\
     _Mapping Table](https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table "IDNA_Mapping_Table")_.
   - **deviation**:

     - If _Transitional\_Processing_ (deprecated), replace the code
        point in the string by the value for the mapping in _Section 5, [IDNA Mapping Table](https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table "IDNA_Mapping_Table")_.

     - Otherwise, leave the code
        point unchanged in the string.
   - **valid**: Leave the code point unchanged in
      the string.
2. [Normalize](https://www.unicode.org/reports/tr46/#ProcessingStepNormalize).
    Normalize the _domain\_name_ string to Unicode Normalization
    Form C.
3. [Break](https://www.unicode.org/reports/tr46/#ProcessingStepBreak). Break the
    string into labels at U+002E ( . ) FULL STOP.
4. [Convert/Validate](https://www.unicode.org/reports/tr46/#ProcessingStepConvertValidate). For
    each label in the _domain\_name_ string:


   - [If the label starts with “xn--”](https://www.unicode.org/reports/tr46/#ProcessingStepPunycode):

     1. If the label contains any non-ASCII code point (i.e., a code point greater than U+007F), record that there was an error, and continue with the next label.
     2. Attempt to convert the rest of the label to Unicode
         according to _Punycode_ \[ [RFC3492](https://www.unicode.org/reports/tr46/#RFC3492)\].
         If that conversion fails
         **and** if not _IgnoreInvalidPunycode_,
         record that there was an error, and
         continue with the next label. Otherwise replace the original
         label in the string by the results of the conversion.

     3. If the label is empty,
         or if the label contains only ASCII code points,
         record that there was an error.
     4. Verify that the label meets the validity criteria in _Section_
        _4.1, [Validity Criteria](https://www.unicode.org/reports/tr46/#Validity_Criteria)_
         for Nontransitional Processing. If any of the validity criteria
         are not satisfied, record that there was an error.
   - [If the label does not start\\
      with “xn--”](https://www.unicode.org/reports/tr46/#ProcessingStepNonPunycode):

     - Verify that the label meets the validity criteria in _Section_
       _4.1, [Validity Criteria](https://www.unicode.org/reports/tr46/#Validity_Criteria)_
        for the input Processing choice (Transitional or
        Nontransitional). If any of the validity criteria are not
        satisfied, record that there was an error.

Any input _domain\_name_ string that does not record an error has
been successfully processed according to this specification.
Conversely, if an input _domain\_name_ string causes an error,
then the processing of the input _domain\_name_ string fails.
Determining what to do with error input is up to the caller, and not
in the scope of this document. The processing is
idempotent—reapplying the processing to the output will make no
further changes. For examples, see _Table 2, [Examples of Transitional\_\
_Processing](https://www.unicode.org/reports/tr46/#Table_Example_Processing)_.


Implementations may make further modifications to the resulting
Unicode string when showing it to the user. For example, it is
recommended that disallowed characters be replaced by a U+FFFD to
make them visible to the user. Similarly, labels that fail processing
during step 4 may be marked by the insertion of a U+FFFD or
other visual device.

With either Transitional or
Nontransitional Processing, sources already in Punycode are validated
without mapping. In particular, Punycode containing Deviation
characters, such as href="xn--fu-hia.de"
(for fuß.de) is not remapped. This provides a mechanism allowing
explicit use of Deviation characters even during a transition period.


### 4.1 [Validity\  Criteria](https://www.unicode.org/reports/tr46/\#Validity_Criteria)

Each of the following criteria must be satisfied for a non-empty label:

1. The label must be in Unicode Normalization Form NFC.
2. If _CheckHyphens_, the label must not contain a U+002D HYPHEN-MINUS character
    in both the third and fourth positions.
3. If _CheckHyphens_, the label must neither begin nor end with a U+002D
    HYPHEN-MINUS character.
4. If not _CheckHyphens_, the label must not begin with “xn--”.
5. The label must not contain a U+002E ( . ) FULL STOP.
6. The label must not begin with a combining mark, that is:
    General\_Category=Mark.
7. Each code point in the label must only have certain Status
    values according to _Section 5, [IDNA\_\
_Mapping Table](https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table "IDNA_Mapping_Table")_:

1. For Transitional Processing (deprecated), each value must be **valid**.

2. For Nontransitional Processing, each value must be either
       **valid** or **deviation**.
3. In addition,
       if **UseSTD3ASCIIRules=true** and
       the code point is an ASCII code point (U+0000..U+007F),
       then it must be a lowercase letter (a-z), a digit (0-9),
       or a hyphen-minus (U+002D).
       (Note: This excludes uppercase ASCII A-Z which are
       **mapped** in UTS #46 and **disallowed** in IDNA2008.)
8. If _CheckJoiners_, the label must satisify the
    **ContextJ rules** from _Appendix A,_
    in _The Unicode Code Points_
_and Internationalized Domain Names for Applications (IDNA)_
    \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\].
9. If _CheckBidi_, and if the domain name is a
    _Bidi domain name_, then the label must satisfy all
    six of the numbered conditions in
    \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\] RFC 5893, Section 2.

The first 6 criteria are from \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\],
except for the fourth criterion.
Criterion #2 in particular is meant to
allow for future label extensions beyond just xn--, such as for future
versions of IDNA. Some implementations appear to consider such extentions
unlikely, and allow labels
such as "r3---sn-apo3qvuoxuxbt-j5pe".

Any particular application _may_ have tighter validity
criteria, as discussed in _Section 3, [Conformance](https://www.unicode.org/reports/tr46/#Conformance)_.

#### 4.1.1 [UseSTD3ASCIIRules](https://www.unicode.org/reports/tr46/\#UseSTD3ASCIIRules)

Starting with Unicode 16.0, **UseSTD3ASCIIRules=true** is
handled only in the Validity Criteria.
An implementation may choose to allow additional ASCII characters but should always
consider ASCII lowercase letters, digits, and the hyphen-minus (`[\u002Da-z0-9]`)
as **valid**.

> **Note:** ASCII
> characters may have resulted from a mapping: for example, a
> U+005F ( \_ ) LOW LINE _(underbar)_ may have originally been a
> U+FF3F ( ＿ ) FULLWIDTH LOW LINE.

#### 4.1.2 [Right-to-Left\  Scripts](https://www.unicode.org/reports/tr46/\#Right_to_Left_Scripts)

In addition, the label should meet the requirements for right-to-left
characters specified in the Right-to-Left Scripts document of \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\], and for the CONTEXTJ requirements in
the Protocol document of \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\]. It is
strongly recommended that _Unicode Technical Report #36,_
_Unicode Security Considerations_ \[ [UTR36](https://www.unicode.org/reports/tr46/#UTR36)\] and _Unicode_
_Technical Standard #39, Unicode Security Mechanisms_\[ [UTS39](https://www.unicode.org/reports/tr46/#UTS39)\] be consulted for information on dealing
with confusables, and for characters that should be excluded from
identifiers. Note that the recommended exclusions are a superset of
those in \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\].


### 4.2 [ToASCII](https://www.unicode.org/reports/tr46/\#ToASCII)

The operation corresponding to ToASCII of \[ [RFC3490](https://www.unicode.org/reports/tr46/#RFC3490)\]
is defined by the following steps:


**Input**

- A prospective _domain\_name_ expressed as a sequence
of Unicode code points
- A boolean flag: _CheckHyphens_
- A boolean flag: _CheckBidi_
- A boolean flag: _CheckJoiners_
- A boolean flag: _UseSTD3ASCIIRules_
- A boolean flag: _Transitional\_Processing_ (deprecated)
- A boolean flag: _VerifyDnsLength_
- A boolean flag: _IgnoreInvalidPunycode_

**Processing**

1. To the input _domain\_name_, apply the **Processing**
**Steps** in _Section 4, [Processing](https://www.unicode.org/reports/tr46/#Processing)_,
    using the input boolean flags _Transitional\_Processing_, _CheckHyphens_, _CheckBidi_, _CheckJoiners_, and _UseSTD3ASCIIRules_. This may record an error.

2. Break the result into labels at U+002E FULL STOP.
3. Convert each label with non-ASCII characters into Punycode \[ [RFC3492](https://www.unicode.org/reports/tr46/#RFC3492)\], and
    prefix by “xn--”. This may record an error.

4. If the _VerifyDnsLength_ flag is true, then verify DNS
    length restrictions. This may record an error. For more information,
    see \[ [STD13](https://www.unicode.org/reports/tr46/#STD13)\] and\[ [STD3](https://www.unicode.org/reports/tr46/#STD3)\].

1. The length of the domain name, excluding the root label
       and its dot, is from 1 to 253.
2. The length of each label is from 1 to 63.


      - Note: Technically, a complete domain name ends with
         an empty label for the DNS root
         (see \[ [STD13](https://www.unicode.org/reports/tr46/#STD13)\] \[ [RFC1034](https://www.unicode.org/reports/tr46/#RFC1034)\] section 3).
         This empty label, and the trailing dot, is almost always omitted.
      - When _VerifyDnsLength_ is false, the empty root label is passed through.
      - When _VerifyDnsLength_ is true, the empty root label is disallowed.
         This corresponds to the syntax in \[ [RFC1034](https://www.unicode.org/reports/tr46/#RFC1034)\]
         [section 3.5 Preferred name syntax](https://www.rfc-editor.org/rfc/rfc1034.html#section-3.5)
         which also defines the label length restrictions.
5. If an error was recorded in steps 1-4, then the operation
    has failed and a failure value is returned. No DNS lookup should be
    done.
6. Otherwise join the labels using U+002E FULL STOP as a
    separator, and return the result.

Implementations are advised to apply additional tests to these
labels, such as those described in _Unicode Technical Report_
_#36, Unicode Security Considerations_ \[ [UTR36](https://www.unicode.org/reports/tr46/#UTR36)\]
and _Unicode Technical Standard #39, Unicode Security_
_Mechanisms_ \[ [UTS39](https://www.unicode.org/reports/tr46/#UTS39)\], and take appropriate
actions. For example, a label with mixed scripts or confusables may
be called out in the UI. Note that the use of Punycode to signal
problems may be counter-productive, as described in \[ [UTR36](https://www.unicode.org/reports/tr46/#UTR36)\].


### **4.3 [ToUnicode](https://www.unicode.org/reports/tr46/\#ToUnicode)**

The operation corresponding to ToUnicode of \[ [RFC3490](https://www.unicode.org/reports/tr46/#RFC3490)\]
is defined by the following steps:


**Input**

- A prospective _domain\_name_ expressed as a sequence
of Unicode code points

- A boolean flag: _CheckHyphens_
- A boolean flag: _CheckBidi_
- A boolean flag: _CheckJoiners_
- A boolean flag: _UseSTD3ASCIIRules_
- A boolean flag: _Transitional\_Processing_ (deprecated)
- A boolean flag: _IgnoreInvalidPunycode_

**Processing**

1. To the input _domain\_name_, apply the **Processing**
**Steps** in _Section 4, [Processing](https://www.unicode.org/reports/tr46/#Processing)_,
    using the input boolean flags _Transitional\_Processing_, _CheckHyphens_, _CheckBidi_, _CheckJoiners_, and _UseSTD3ASCIIRules_. This may record an error.
2. Like \[ [RFC3490](https://www.unicode.org/reports/tr46/#RFC3490)\], this will always
    produce a converted Unicode string. Unlike ToASCII of \[ [RFC3490](https://www.unicode.org/reports/tr46/#RFC3490)\], this always signals whether or not
    there was an error.


Implementations are advised to apply additional tests to these
labels, such as those described in _Unicode Technical Report_
_#36, Unicode Security Considerations_ \[ [UTR36](https://www.unicode.org/reports/tr46/#UTR36)\]
and _Unicode Technical Standard #39, Unicode Security_
_Mechanisms_\[ [UTS39](https://www.unicode.org/reports/tr46/#UTS39)\], and take
appropriate actions. For example, a label with mixed scripts or
confusables may be called out in the UI. Note that the use of
Punycode to signal problems may be counter-productive, as described
in \[ [UTR36](https://www.unicode.org/reports/tr46/#UTR36)\].


### 4.4 [Preprocessing\  for IDNA2008](https://www.unicode.org/reports/tr46/\#IDNA2008_Preprocessing)

The table specified in _Section 5, [IDNA\_\
_Mapping Table](https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table "IDNA_Mapping_Table")_ may also be used for a pure preprocessing step for
IDNA2008, mapping a Unicode string for input directly to the
algorithm specified in IDNA2008.


Preprocessing for IDNA2008 is specified as follows:

> Apply the _Section 4.3, [ToUnicode](https://www.unicode.org/reports/tr46/#ToUnicode)_
> processing to the Unicode string.

Note that this preprocessing allows some characters that are
invalid according to IDNA2008. However, the IDNA2008 processing will
catch those characters. For example, a Unicode string containing a
character listed as DISALLOWED in IDNA2008, such as U+2665 (♥) BLACK
HEART SUIT, will pass the preprocessing step without an error, but
subsequent application of the IDNA2008 processing will fail with an
error, indicating that the string is not a valid IDN according to
IDNA2008.

### 4.5 [Implementation\  Notes](https://www.unicode.org/reports/tr46/\#Implementation_Notes)

A number of optimizations can be applied to the Unicode IDNA
Compatibility Processing. These optimizations can improve
performance, reduce table size, make use of existing NFKC transform
mechanisms, and so on. For example:

- There is an NFC check in _Section 4.1, [Validity Criteria](https://www.unicode.org/reports/tr46/#Validity_Criteria)_. However, it only
needs to be applied to labels that were converted from Punycode into
Unicode in [Step 3](https://www.unicode.org/reports/tr46/#TableDerivationStep3).

- A simple way to do much of the validity checking in _Section_
_4.1, [Validity Criteria](https://www.unicode.org/reports/tr46/#Validity_Criteria)_
is to reapply Steps 1 and 2, and verify that the result does not
change.

- Because the four label separators are all mapped to U+002E (
. ) FULL STOP by [Step 1](https://www.unicode.org/reports/tr46/#TableDerivationStep1), the
parsing of labels in Steps 3 and 4 only need to detect U+002E ( . )
FULL STOP, and not the other label separators defined in IDNA \[ [RFC3490](https://www.unicode.org/reports/tr46/#RFC3490)\].


Note that the input _domain\_name_ string for the Unicode IDNA
Compatibility Processing must have had all escaped Unicode code
points converted to Unicode code points. For example,
`U+5341`
( 十 ) CJK UNIFIED IDEOGRAPH-5341 could have been escaped as any of
the following:


- &#x5341; an HTML numeric character reference
(NCR)
- \\u5341 a Javascript escapes
- %E5%8D%81 a URI/IRI %-escape

Examples are shown in _Table 2, [Examples of Processing](https://www.unicode.org/reports/tr46/#Table_Example_Processing):_

Table 2. [Examples of Processing](https://www.unicode.org/reports/tr46/#Table_Example_Processing)

| Input | [Map](https://www.unicode.org/reports/tr46/#ProcessingStepMap) | [Normalize](https://www.unicode.org/reports/tr46/#ProcessingStepNormalize) | [Convert](https://www.unicode.org/reports/tr46/#ProcessingStepConvertValidate) | Validate | Comment |
| --- | --- | --- | --- | --- | --- |
| Bloß.de | bloss.de | = | _n/a_ | **_ok_** | **Transitional (deprecated):** maps uppercase and sharp s |
| bloß.de | = | _n/a_ | **_ok_** | **Nontransitional:** maps uppercase |
| BLOẞ.de | bloß.de | = | _n/a_ | **_ok_** | Maps uppercase |
| xn--blo-7ka.de | = | = | bloß.de | **_ok_** | Punycode is not mapped, so ß never changes (whether<br> transitional or not). |
| u¨.com | = | ü.com | _n/a_ | **_ok_** | [Normalize](https://www.unicode.org/reports/tr46/#ProcessingStepNormalize) changes _u_<br>_\+ umlaut_ to _ü_ |
| xn--tda.com | = | = | ü.com | **_ok_** | Punycode **xn--tda** changes to _ü_ |
| xn--u-ccb.com | = | = | u¨.com | **_error_** | Punycode is not mapped, but _is_ validated. Because<br> _u + umlaut_ is not NFC, it fails. |
| a⒈com | **_error_** | **_error_** | **_error_** | **_error_** | The character "⒈" is **disallowed**,<br> because it would produce a dot when mapped. |
| xn--a-ecp.ru | xn--a-ecp.ru | = | a⒈.ru | **_error_** | Punycode **xn--a-ecp** = a⒈, which fails<br> validation. |
| xn--0.pt | xn--0.pt | = | **_error_** | **_error_** | Punycode **xn--0** is invalid. |
| 日本語。ＪＰ | 日本語.jp | = | _n/a_ | **_ok_** | Fullwidth characters are remapped, including 。 |
| ☕.us | = | = | _n/a_ | **_ok_** | Post-Unicode 3.2 characters are allowed. |

## 5 [IDNA\  Mapping Table](https://www.unicode.org/reports/tr46/\#IDNA_Mapping_Table)

For each code point in Unicode, the IDNA Mapping Table provides
one of the following Status values:

- **valid**: the code point is valid, and not
modified.
- **ignored**: the code point is removed: this is
equivalent to mapping the code point to an empty string.
- **mapped**: the code point is replaced in the
string by the value for the mapping.
- **deviation**: the code point is either mapped
or valid, depending on whether the processing is transitional or
not.
- **disallowed:** the code point is not allowed.

If this Status value is **mapped** or **deviation**, the table also
supplies a mapping value for that code point.


A table is provided for each version of Unicode starting with Unicode
5.1 under \[ [IDNA-Table](https://www.unicode.org/reports/tr46/#IDNATable)\].
Each table for a version of the Unicode Standard will always be
backward compatible with previous versions of the table: only
characters with the Status value **disallowed** may
change in Status or Mapping value,
with the following exception:

- As part of the deprecation of transitional processing,
the following exceptional change has been made in Unicode 15.1:
  - Before Unicode 15.1, U+1E9E capital sharp s (ẞ) was
     unconditionally **mapped** to “ss”,
     consistent with transitional processing which
     maps U+00DF small sharp s (ß) also to “ss”.
  - Since Unicode 15.1, _when using nontransitional processing_,
     capital sharp s is **mapped** to small sharp s,
     which is treated as **valid**
     under nontransitional processing.
     This is the new Mapping value in the table.


     When using _transitional_ processing (deprecated),
     U+1E9E capital sharp s (ẞ) continues to be
     **mapped** to “ss”,
     just like the **deviation** mapping for
     U+00DF small sharp s (ß).
     This is handled during processing.

Unlike the IDNA2008 table, this
table is designed to be applied to the entire domain name, not just
to individual labels. That design provides for the IDNA2003 handling
of label separators. In particular, the table is constructed to
forbid problematic characters such as U+2488 ( ⒈ ) DIGIT ONE FULL
STOP, whose decompositions contain a "dot".


The Unicode IDNA Compatibility Processing is based on the Unicode
character mapping property \[ [NFKC\_Casefold](https://www.unicode.org/reports/tr46/#NFKC_CaseFold)\].
_Section 6, [Mapping\_\
_Table Derivation](https://www.unicode.org/reports/tr46/#Mapping_Table_Derivation)_ describes the derivation of these tables. Like
derived properties in the Unicode Character Database, the description
of the derivation is informative. Only the data in IDNA Mapping Table
is normative for the application of this specification.


The files use a semicolon-delimited format similar to those in the
Unicode Character Database \[ [UAX44](https://www.unicode.org/reports/tr46/#UAX44)\]. The field
values are listed in _Table 2b, [Data File Fields](https://www.unicode.org/reports/tr46/#Table_Data_File_Fields)_:


Table 2b. [Data File Fields](https://www.unicode.org/reports/tr46/#Table_Data_File_Fields)

| Num | Field | Description |
| --- | --- | --- |
| 0 | Code point(s) | Hex value or range of values. |
| 1 | Status | **valid**, **ignored**, **mapped**,<br> **deviation**, or **disallowed** |
| 2 | Mapping | Hex value(s). Only present if the Status is **ignored**,<br> **mapped**, or **deviation**. |
| 3 | IDNA2008 Status | There are two values: **NV8** and **XV8**. **NV8**<br> is only present if the Status is **valid** but the<br> character is excluded by IDNA2008 from all domain names for all<br> versions of Unicode. **XV8** is present when the character is<br> excluded by IDNA2008 for the **_current_**<br> version of Unicode. These are not normative values. |

_Example:_

```
0000..002C    ; valid      ;      ; NV8    # 1.1  <control-0000>..COMMA
002D..002E    ; valid                      # 1.1  HYPHEN-MINUS..FULL STOP
002F          ; valid      ;      ; NV8    # 1.1  SOLIDUS
0030..0039    ; valid                      # 1.1  DIGIT ZERO..DIGIT NINE
003A..0040    ; valid      ;      ; NV8    # 1.1  COLON..COMMERCIAL AT
0041          ; mapped     ; 0061          # 1.1  LATIN CAPITAL LETTER A
...
0080..009F    ; disallowed                 # 1.1  <control-0080>..<control-009F>
...
00A1..00A7    ; valid      ;      ; NV8    # 1.1  INVERTED EXCLAMATION MARK..SECTION SIGN
...
00AD          ; ignored                    # 1.1  SOFT HYPHEN
...
00DF          ; deviation  ; 0073 0073     # 1.1  LATIN SMALL LETTER SHARP S
...
19DA          ; valid      ;      ; XV8    # 5.2  NEW TAI LUE THAM DIGIT ONE
...

```

## 6 [Mapping\  Table Derivation](https://www.unicode.org/reports/tr46/\#Mapping_Table_Derivation)

The following describes the derivation of the mapping table. This
description has nothing to do with the actual mapping of labels in _Section_
_4, [Processing](https://www.unicode.org/reports/tr46/#Processing "Processing")_.
Instead, this section describes the derivation of the table in
Section 5, [IDNA\\
Mapping Table](https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table "IDNA_Mapping_Table"). That table is then normatively used for mapping in _Section_
_4, [Processing](https://www.unicode.org/reports/tr46/#Processing "Processing")_.


The derivation is described as a series of steps. [Step 1](https://www.unicode.org/reports/tr46/#TableDerivationStep1) defines a base mapping;
Steps [2](https://www.unicode.org/reports/tr46/#TableDerivationStep2), [3](https://www.unicode.org/reports/tr46/#TableDerivationStep3), and [4](https://www.unicode.org/reports/tr46/#TableDerivationStep4) define three sets of characters.
[Step 5](https://www.unicode.org/reports/tr46/#TableDerivationStep5) will modify the base
mapping or the sets of characters as needed to maintain backward
compatiblity. The mapping and sets are all used in [Step 6](https://www.unicode.org/reports/tr46/#TableDerivationStep6) to produce the mapping and
Status values for the table.
[Step 7](https://www.unicode.org/reports/tr46/#TableDerivationStep7) removes characters whose mappings contain characters that are not valid. Each numbered
step may have substeps: for example, [Step\\
1](https://www.unicode.org/reports/tr46/#TableDerivationStep1) consists of Steps 1.1 through 1.2.


If a Unicode property changes in a future version in a way that would
affect backward compatibility,
a corresponding clause will be added
to [Step 5](https://www.unicode.org/reports/tr46/#TableDerivationStep5) to maintain
compatibility. For more information on compatibility, see _Section_
_5, [IDNA\_\
_Mapping Table](https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table "IDNA_Mapping_Table")_.


### **[Step 1: Define a base mapping](https://www.unicode.org/reports/tr46/\#TableDerivationStep1)**

This step specifies a _base mapping_, which is a mapping from
each Unicode code point to sequences of zero or more code points. The
value resulting from mapping a particular code point C is called the
_base mapping value o_ f C. The base mapping value for C may be
identical to C.


1. Map the following exceptional characters:
1. Map label separator characters to U+002E ( . ) FULL STOP:
      - U+FF0E ( ． ) FULLWIDTH FULL STOP
      - U+3002 ( 。 ) IDEOGRAPHIC FULL STOP
      - U+FF61 ( ｡ ) HALFWIDTH IDEOGRAPHIC FULL STOP
2. Map all Bidi\_Control characters to themselves
3. Map U+1E9E (ẞ) LATIN CAPITAL LETTER SHARP S to
       U+00DF (ß) LATIN SMALL LETTER SHARP S
2. Map each _other_ character to its NFKC\_Casefold value
    \[ [NFKC\_Casefold](https://www.unicode.org/reports/tr46/#NFKC_CaseFold)\].


Unicode 6.3 adds Bidi\_Control characters that were not present
in Unicode 3.2. To preserve the intent of IDNA2003 in disallowing
Bidi\_Control characters rather than just ignoring them, Step 1.1.b
was added. This step causes Step 6.3 to disallow all Bidi\_Control
characters.

Step 1.1.b only affects 5 new characters added in Unicode 6.3.
It would also impact any new Bidi\_Control characters in future
versions of the standard.

Step 1.1.c (added in Unicode 15.1)
maps the capital sharp s (ẞ) to the small sharp s (ß) rather than to ss
because all major implementations have adopted nontransitional processing,
which does not map ß to ss as in NFKC\_Casefold.

### **[Step 2: Specify the base valid set](https://www.unicode.org/reports/tr46/\#TableDerivationStep2)**

The base valid set is defined by the sequential list of additions and
subtractions in _Table 3, [Base\_\
_Valid Set](https://www.unicode.org/reports/tr46/#Table_Base_Valid_Set)_. This definition is based on the principles of IDNA2003.
When applied to the repertoire of Unicode 3.2 characters, this
produces a set which is closely aligned with IDNA2003.


Table 3. [Base\\
Valid Set](https://www.unicode.org/reports/tr46/#Table_Base_Valid_Set)

| Formal Set Notation | Description |
| --- | --- |
| `\P{Changes_When_NFKC_Casefolded}` | Start with characters that are equal to their \[ [NFKC\_Casefold](https://www.unicode.org/reports/tr46/#NFKC_CaseFold)\] value. This criterion<br> excludes uppercase letters, for example, as well as characters that<br> are unstable under NFKC normalization, and default ignorable code<br> points.<br> <br>Note that according to Perl/Java syntax, \\P means the inverse of<br>\\p, so these are the characters that _do not_ change when<br>individually mapped according to \[ [NFKC\_Casefold](https://www.unicode.org/reports/tr46/#NFKC_CaseFold)\]. |
| `+ \u00DF` | Add LATIN SMALL LETTER SHARP S (ß). |
| `- \p{c} - \p{z}` | Remove Unassigned, Controls, Private Use, Format,<br> Surrogate, and Whitespace. |
| `<br>					- \p{IDS_Unary_Operator}<br>					- \p{IDS_Binary_Operator}<br>					- \p{IDS_Trinary_Operator}` | Remove ideographic description characters. |
| `+ \p{ascii} - [\u002E]` | Add all ASCII except<br> for "." |

### **[Step 3: Specify the base exclusion\** **set](https://www.unicode.org/reports/tr46/\#TableDerivationStep3)**

The base exclusion set consists of the following code points:

- U+FFFC OBJECT REPLACEMENT CHARACTER
- U+FFFD REPLACEMENT CHARACTER
- U+E0001..U+E007F Tag characters (includes some unassigned code points)

### **[Step 4: Specify the deviation set](https://www.unicode.org/reports/tr46/\#TableDerivationStep4)**

This is the set of characters that deviate between IDNA2003 and
IDNA2008.

- U+200C ZERO WIDTH NON-JOINER
- U+200D ZERO WIDTH JOINER
- U+00DF ( ß ) LATIN SMALL LETTER SHARP S
- U+03C2 ( ς ) GREEK SMALL LETTER FINAL SIGMA

### **[Step 5: Specify changes for backward compatibility](https://www.unicode.org/reports/tr46/\#TableDerivationStep5)**

This set is currently empty. Adjustments to the above sets or
base mapping will be made in this section if the steps would cause an
already existing character to change Status or mapping under a future
version of Unicode, so that backward compatibility is maintained.

### **[Step 6: Produce the initial Status\** **and Mapping values](https://www.unicode.org/reports/tr46/\#TableDerivationStep6)**

For each code point:

1. If the code point is in the **deviation** set

   - the Status is **deviation** and the mapping
      value is the base mapping value for that code point.
2. Otherwise, if the code point is in the base exclusion set or
    is unassigned
   - the Status is **disallowed** and there is no
      mapping value in the table.
3. Otherwise, if the code point is not a label separator _and_
    some code point in its base mapping value is not in the base valid
    set

   - the Status is **disallowed** and there is no
      mapping value in the table.
4. Otherwise, if the base mapping value is an empty string
   - the Status is **ignored** and there is no
      mapping value in the table.
5. Otherwise, if the base mapping value is the same as the code
    point
   - the Status is **valid** and there is no
      mapping value in the table.
6. Otherwise,

   - the Status is **mapped** and the mapping
      value is the base mapping value for that code point.

### **[Step 7: Produce the final Status\** **and Mapping values](https://www.unicode.org/reports/tr46/\#TableDerivationStep7)**

After processing all code points in previous steps:

1. Iterate through the set of characters with a Status of **mapped**.
    Any whose mapping values are not wholly in the union of the
    **valid** set and the **deviation** set,
    make **disallowed**.

2. Recursively apply these actions until there are no more
    Status changes.

For example, for Unicode 15.1, the set of characters set to
disallowed in [Step 7](https://www.unicode.org/reports/tr46/#TableDerivationStep7) consists of
the following:


- U+FE12 ( ︒ ) PRESENTATION FORM FOR VERTICAL IDEOGRAPHIC FULL
STOP

> **Note:** Characters such as U+2488 ( ⒈ ) DIGIT ONE FULL STOP are
> disallowed by Step 6.3.

## 7 [IDNA Comparison](https://www.unicode.org/reports/tr46/\#IDNAComparison)

Until [Unicode 15.1](https://www.unicode.org/reports/tr46/tr46-31.html#IDNAComparison),
this section provided a detailed comparison of the differences between
IDNA2003, UTS #46, and IDNA2008.
Due to the end of the transition period, starting with Unicode 16.0,
the Mapping Table Derivation no longer takes IDNA2003 mappings into account;
therefore that information is no longer applicable.

Unicode provides a
[derived property file matching IDNA2008](https://www.unicode.org/reports/tr46/#IDNA_Derived_Property).
Compared with IDNA2008,
UTS #46 mostly adds mappings and considers punctuation and symbols valid.
For more information see
_Section 2, [Unicode IDNA Compatibility Processing](https://www.unicode.org/reports/tr46/#Compatibility_Processing)_
and consult the [IDNA Mapping Table](https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table).

## 8 [Conformance\  Testing](https://www.unicode.org/reports/tr46/\#Conformance_Testing)

A conformance testing file (IdnaTestV2.txt) is provided for each
version of Unicode starting with Unicode 6.0
under \[ [IDNA-Table](https://www.unicode.org/reports/tr46/#IDNATable)\]. It only
provides test cases for **UseSTD3ASCIIRules=true**.


### 8.1 [Format](https://www.unicode.org/reports/tr46/\#Format)

The test file is UTF-8, with certain characters escaped using the
\\uXXXX or \\x{XXXX} convention for readability. The details are in the header of the test file.

### 8.2 [Testing Conformance](https://www.unicode.org/reports/tr46/\#Testing_Conformance)

To test for conformance to UTS #46, an implementation will perform the toUnicode, toAsciiN, and toAsciiT
operations on the source string, then verify the resulting strings and relevant Status values. The details are in the header of the test file.

Implementations may be more strict than the default settings for UTS46.
In particular, an implementation conformant to IDNA2008 would disallow the input for lines marked with NV8. Implementations need only record that there is an error: they need not reproduce the precise Status codes (after removing any ignored Status values).

### 8.3 [Migration](https://www.unicode.org/reports/tr46/\#Migration)

#### 16.0

The test file for version 16.0 corrects some mistakes in the generation of status values
and makes some improvements.

- Starting with Unicode 16.0,
the test format uses `""` to mean the empty string.
This is in contrast to a blank field value, which continues to have a different meaning.
For example:


```
""; ; [X4_2]; ; [A4_1, A4_2]; ;  #
\u200C; ; [C1]; xn--0ug; ; ""; [A4_1, A4_2] #
```


See the header of the test data file for details.
- One or more new source strings are ill-formed, containing an unpaired surrogate,
so that status value A3 is covered by test cases.
- The status values V4-V6 have been renumbered to V5-V7,
in order to match the insertion of validity criterion 4 in Unicode 15.1.
- Status value U1 is set instead of V7 for
ASCII characters other than lowercase letters (a-z), digits (0-9), or hyphen-minus (U+002D),
as had been suggested by the file header comments.
- The file header comments about several status values have been corrected or clarified.

#### 11.0

The test format and file name changed in Version 11.0 so that it could express a variety of different combinations of input options that people needed. The new format allows the testing implementation to test for precisely the results of its combination of supported flags, by filtering out Status codes that correspond to an unsupported input flag. The value XV8 was also removed, since it was not very useful in practice.

The following illustrate the differences between the old and new format. The set of examples is not exhaustive, but shows how there is more information available for the same examples.

Sample lines in test data format prior to 11.0:

```
T;  Faß.de;     faß.de;     fass.de
N;  Faß.de;     faß.de;     xn--fa-hia.de
B;  Bücher.de;  bücher.de;  xn--bcher-kva.de
B;  à\u05D0;    [B5 B6];    [B5 B6]
B;  a。。b;      [A4_2];     [A4_2]
```

Sample lines in test data format since 11.0:

```
Faß.de;     faß.de;     [];       xn--fa-hia.de;     ;  fass.de;
Bücher.de;  bücher.de;  [];       xn--bcher-kva.de;  ;  ;
à\u05D0;    àא;         [B5 B6];  xn--0ca24w;        ;  ;
a。。b;      a..b;       [A4_2];   a..b;              ;  ;
```

## 9 [IDNA\  Derived Property](https://www.unicode.org/reports/tr46/\#IDNA_Derived_Property)

To facilitate comparison between versions of the Unicode Character Database
and to highlight the implications for the addition of new characters and changes of character properties,
the Unicode Technical Committee has prepared a collection of IDNA Derived Property
data files.
Since Unicode 17.0, the version-specific Idna2008.txt data file
is posted in the versioned \[ [IDNA-Table](https://www.unicode.org/reports/tr46/#IDNATable)\] directory.
Before Unicode 17.0,
these data files were posted at \[ [IDNA-Derived](https://www.unicode.org/reports/tr46/#IDNADerived)\].

For each version of the Unicode Standard starting with Unicode 6.1.0,
the value of the enumerated IDNA2008\_Category property is calculated and listed explicitly
in a separate data file.
This property matches the "IDNA Derived Property" as defined in RFC 5892
(see \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\]).
The explicit listing is provided as a convenience for implementers. It is the
result of performing
the exact calculations defined in RFC 5892 concurrent with the release
of each version of the Unicode Character Database.

RFC 5892 gives a list of code points for which the derivation is overridden
by exceptional values. All known exceptions are applied when a data file is
created, but exceptions added in future updates of the IDNA protocol
are not applied retroactively.

The format of these IDNA Derived Property data files is modeled
closely on that specified in Appendix B.1 of RFC 5892, except that the comment
section of each line is not truncated at column 72. For example, excerpted from
RFC 5892:

```
007B..00B6  ; DISALLOWED  # LEFT CURLY BRACKET..PILCROW SIGN
00B7        ; CONTEXTO    # MIDDLE DOT
00B8..00DE  ; DISALLOWED  # CEDILLA..LATIN CAPITAL LETTER THORN
00DF..00F6  ; PVALID      # LATIN SMALL LETTER SHARP S..LATIN SMALL LETT

```

Compare the same ranges excerpted from the data files:

```
007B..00B6  ; DISALLOWED  # LEFT CURLY BRACKET..PILCROW SIGN
00B7        ; CONTEXTO    # MIDDLE DOT
00B8..00DE  ; DISALLOWED  # CEDILLA..LATIN CAPITAL LETTER THORN
00DF..00F6  ; PVALID      # LATIN SMALL LETTER SHARP S..LATIN SMALL LETTER O WITH DIAERESIS

```

This close match in format is designed to simplify scripted
comparison between these IDNA Derived Property data files posted at unicode.org
and other existing calculated listings based on RFC 5892 that have been
posted at IANA or elsewhere.

## [Acknowledgments](https://www.unicode.org/reports/tr46/\#Acknowledgements)

Mark Davis and Michel Suignard authored the bulk of the original text of this
document, under direction from the Unicode Technical Committee. For
their contributions of ideas or text to this specification, the
editors thank Julie Allen, Matitiahu Allouche, Peter Constable, Craig
Cummings, Martin Dürst, Peter Edberg, Asmus Freytag, Deborah Goldsmith, Laurentiu
Iancu, Gervase Markham, Simon Montagu, Lisa Moore, Eric Muller,
Simon Sapin, Murray Sargent, Markus Scherer,
Jungshik Shin, Henri Sivonen, Shawn Steele,
Erik van der Poel, Chris Weber, and Ken Whistler.
The specification builds upon \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\],
developed in the IETF Idna-update working group, especially
contributions from Matitiahu Allouche, Harald Alvestrand, Vint Cerf,
Martin J. Dürst, Lisa Dusseault, Patrik Fältström, Paul Hoffman, Cary
Karp, John Klensin, and Peter Resnick, and also upon \[ [IDNA2003](https://www.unicode.org/reports/tr46/#IDNA2003)\], authored by Marc Blanchet, Adam
Costello, Patrik Fältström, and Paul Hoffman.


## [References](https://www.unicode.org/reports/tr46/\#References)

|     |     |
| --- | --- |
| \[ [Bortzmeyer](https://www.unicode.org/reports/tr46/#Bortzmeyer)\] | [http://www.bortzmeyer.org/idn-et-phishing.html](http://www.bortzmeyer.org/idn-et-phishing.html)<br>The most interesting studies cited there<br> (originally from Mike Beltzner of **Mozilla**) are:<br>- _[Decision Strategies and Susceptibility to\_<br>  _Phishing](http://cups.cs.cmu.edu/soups/2006/proceedings/p79_downs.pdf)_ by Downs, Holbrook & Cranor<br>- _[Why\_<br>  _Phishing Works](https://dl.acm.org/citation.cfm?id=1124772.1124861)_ by Dhamija, Tygar & Hearst<br>- _[Do Security Toolbars Actually Prevent Phishing\_<br>  _Attacks](http://www.simson.net/ref/2006/CHI-security-toolbar-final.pdf)_ by Wu, Miller & Garfinkel<br>- _[Phishing Tips and Techniques](http://www.cs.auckland.ac.nz/~pgut001/pubs/phishing.pdf)_ by Gutmann. |
| \[ [DemoConf](https://www.unicode.org/reports/tr46/#DemoConf)\] | [https://util.unicode.org/UnicodeJsps/confusables.jsp](https://util.unicode.org/UnicodeJsps/confusables.jsp) |
| \[ [DemoIDN](https://www.unicode.org/reports/tr46/#DemoIDN)\] | [https://util.unicode.org/UnicodeJsps/idna.jsp](https://util.unicode.org/UnicodeJsps/idna.jsp) |
| \[ [DemoIDNChars](https://www.unicode.org/reports/tr46/#DemoIDNChars)\] | [https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=\\p{age%3D3.2}-\\p{cn}-\\p{cs}-\\p{co}&abb=on&g=uts46+idna+idna2008](https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=\p{age%3D3.2}-\p{cn}-\p{cs}-\p{co}&abb=on&g=uts46+idna+idna2008) |
| \[ [IDNA2003](https://www.unicode.org/reports/tr46/#IDNA2003)\] | The IDNA2003 specification is defined by a<br> cluster of IETF RFCs:<br> <br>- IDNA \[ [RFC3490](https://www.unicode.org/reports/tr46/#RFC3490)\]<br>   <br>- Nameprep \[ [RFC3491](https://www.unicode.org/reports/tr46/#RFC3491)\]<br>   <br>- Punycode \[ [RFC3492](https://www.unicode.org/reports/tr46/#RFC3492)\]<br>   <br>- Stringprep \[ [RFC3454](https://www.unicode.org/reports/tr46/#RFC3454)\]. |
| \[ [IDNA2008](https://www.unicode.org/reports/tr46/#IDNA2008)\] | The IDNA2008 specification is defined by a<br> cluster of IETF RFCs:<br> <br>- Internationalized Domain Names for Applications (IDNA):<br>   Definitions and Document Framework<br>  <br>  [https://www.rfc-editor.org/info/rfc5890](https://www.rfc-editor.org/info/rfc5890)<br>- Internationalized Domain Names in Applications (IDNA)<br>   Protocol<br>  <br>  [https://www.rfc-editor.org/info/rfc5891](https://www.rfc-editor.org/info/rfc5891)<br>- The Unicode Code Points and Internationalized Domain<br>   Names for Applications (IDNA)<br>  <br>  [https://www.rfc-editor.org/info/rfc5892](https://www.rfc-editor.org/info/rfc5892)<br>- Right-to-Left Scripts for Internationalized Domain Names<br>   for Applications (IDNA)<br>  <br>  [https://www.rfc-editor.org/info/rfc5893](https://www.rfc-editor.org/info/rfc5893)<br> There is also an informative document:<br>- Internationalized Domain Names for Applications (IDNA):<br>   Background, Explanation, and Rationale<br>  <br>  [https://www.rfc-editor.org/info/rfc5894](https://www.rfc-editor.org/info/rfc5894) |
| \[ [IDNA-Derived](https://www.unicode.org/reports/tr46/#IDNADerived)\] | [https://www.unicode.org/Public/idna2008derived](https://www.unicode.org/Public/idna/idna2008derived) |
| \[ [IDNA-Table](https://www.unicode.org/reports/tr46/#IDNATable)\] | [https://www.unicode.org/Public/18.0.0/idna](https://www.unicode.org/Public/18.0.0/idna)<br> (Before Unicode 17.0: [https://www.unicode.org/Public/idna](https://www.unicode.org/Public/idna)) |
| \[ [IDN-FAQ](https://www.unicode.org/reports/tr46/#IDN_FAQ)\] | [https://www.unicode.org/faq/idn.html](https://www.unicode.org/faq/idn.html) |
| \[ [NFKC\_Casefold](https://www.unicode.org/reports/tr46/#NFKC_CaseFold)\] | The Unicode property specified in \[ [UAX44](https://www.unicode.org/reports/tr46/#UAX44)\], and defined by the data in [DerivedNormalizationProps.txt](https://www.unicode.org/Public/UCD/latest/ucd/DerivedNormalizationProps.txt)<br> (search for "NFKC\_Casefold"). |
| \[ [RFC1034](https://www.unicode.org/reports/tr46/#RFC1034)\] | P. Mockapetris<br> "Domain names - concepts and facilities", RFC 1034, November 1987.<br>[https://www.rfc-editor.org/info/rfc1034](https://www.rfc-editor.org/info/rfc1034) |
| \[ [RFC3454](https://www.unicode.org/reports/tr46/#RFC3454)\] | P. Hoffman, M. Blanchet.<br> "Preparation of Internationalized Strings<br> ("stringprep")", RFC 3454, December 2002.<br>[https://www.rfc-editor.org/info/rfc3454](https://www.rfc-editor.org/info/rfc3454) |
| \[ [RFC3490](https://www.unicode.org/reports/tr46/#RFC3490)\] | Faltstrom, P., Hoffman, P.<br> and A. Costello, "Internationalizing Domain Names in<br> Applications (IDNA)", RFC 3490, March 2003.<br>[https://www.rfc-editor.org/info/rfc3490](https://www.rfc-editor.org/info/rfc3490) |
| \[ [RFC3491](https://www.unicode.org/reports/tr46/#RFC3491)\] | Hoffman, P. and M. Blanchet,<br> "Nameprep: A Stringprep Profile for Internationalized Domain<br> Names (IDN)", RFC 3491, March 2003.<br>[https://www.rfc-editor.org/info/rfc3491](https://www.rfc-editor.org/info/rfc3491) |
| \[ [RFC3492](https://www.unicode.org/reports/tr46/#RFC3492)\] | Costello, A., "Punycode:<br> A Bootstring encoding of Unicode for Internationalized Domain Names<br> in Applications (IDNA)", RFC 3492, March 2003.<br>[https://www.rfc-editor.org/info/rfc3492](https://www.rfc-editor.org/info/rfc3492) |
| \[ [RZLGR5](https://www.unicode.org/reports/tr46/#RZLGR5)\] | Integration Panel,<br> "Root Zone Label Generation Rules — LGR-5", 22 May 2022.<br>[https://www.icann.org/sites/default/files/lgr/rz-lgr-5-overview-26may22-en.pdf](https://www.icann.org/sites/default/files/lgr/rz-lgr-5-overview-26may22-en.pdf) |
| \[ [SafeBrowsing](https://www.unicode.org/reports/tr46/#SafeBrowsing)\] | [http://code.google.com/apis/safebrowsing/](http://code.google.com/apis/safebrowsing/) |
| \[ [Stability](https://www.unicode.org/reports/tr46/#Stability)\] | Unicode Consortium Stability<br> Policies [https://www.unicode.org/policies/stability\_policy.html](https://www.unicode.org/policies/stability_policy.html) |
| \[ [STD3](https://www.unicode.org/reports/tr46/#STD3)\] | Braden, R.,<br> "Requirements for Internet Hosts -- Communication<br> Layers", STD 3, RFC 1122, and "Requirements for Internet<br> Hosts -- Application and Support", STD 3, RFC 1123, October<br> 1989.<br>[https://www.rfc-editor.org/info/std3](https://www.rfc-editor.org/info/std3) |
| \[ [STD13](https://www.unicode.org/reports/tr46/#STD13)\] | Mockapetris, P.,<br> "Domain names - concepts and facilities", STD 13, RFC<br> 1034 and "Domain names - implementation and<br> specification", STD 13, RFC 1035, November 1987.<br>[https://www.rfc-editor.org/info/std13](https://www.rfc-editor.org/info/std13) |
| \[ [UAX44](https://www.unicode.org/reports/tr46/#UAX44)\] | UAX #44: _Unicode_<br>_Character Database_<br>[https://www.unicode.org/reports/tr44/](https://www.unicode.org/reports/tr44/) |
| \[ [Unicode](https://www.unicode.org/reports/tr46/#Unicode)\] | The Unicode Standard<br>_For the latest version, see:_<br>[https://www.unicode.org/versions/latest/](https://www.unicode.org/versions/latest/) |
| \[ [UTR36](https://www.unicode.org/reports/tr46/#UTR36)\] | UTR #36: _Unicode_<br>_Security Considerations_<br>[https://www.unicode.org/reports/tr36/](https://www.unicode.org/reports/tr36/) |
| \[ [UTS18](https://www.unicode.org/reports/tr46/#UTS18)\] | UTS #18: _Unicode_<br>_Regular Expressions_ [https://www.unicode.org/reports/tr18/](https://www.unicode.org/reports/tr18/) |
| \[ [UTS39](https://www.unicode.org/reports/tr46/#UTS39)\] | UTS #39: _Unicode_<br>_Security Mechanisms_<br>[https://www.unicode.org/reports/tr39/](https://www.unicode.org/reports/tr39/) |

## [Modifications](https://www.unicode.org/reports/tr46/\#Modifications)

The following summarizes modifications from the previous
published version of this document.

### **Revision 36**

- **Reissued** for Unicode 18.0.0.

Modifications for previous versions are listed in those respective versions.

* * *

© 2010–2026 Unicode, Inc. This publication is protected by copyright, and permission must be obtained from Unicode, Inc. prior to any reproduction, modification, or other use not permitted by the [Terms of Use](https://www.unicode.org/copyright.html). Specifically, you may make copies of this publication and may annotate and translate it solely for personal or internal business purposes and not for public distribution, provided that any such permitted copies and modifications fully reproduce all copyright and other legal notices contained in the original. You may not make copies of or modifications to this publication for public distribution, or incorporate it in whole or in part into any product or publication without the express written permission of Unicode.

Use of all Unicode Products, including this publication, is governed by the Unicode [Terms of Use](https://www.unicode.org/copyright.html). The authors, contributors, and publishers have taken care in the preparation of this publication, but make no express or implied representation or warranty of any kind and assume no responsibility or liability for errors or omissions or for consequential or incidental damages that may arise therefrom. This publication is provided “AS-IS” without charge as a convenience to users.

Unicode and the Unicode Logo are registered trademarks of Unicode, Inc., in the United States and other countries.
