---
url: https://publicsuffix.org/learn/
retrieved: 2026-10-03
command: firecrawl scrape https://publicsuffix.org/learn/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Learn more about the Public Suffix List
---
## Learn more about the Public Suffix List

The Public Suffix List is a cross-vendor initiative to provide an accurate list of domain name suffixes, maintained by the hard work of Mozilla volunteers and by submissions from registries, to whom we are very grateful.


The usefulness of this can be seen if we take the example of cookies. In the past, browsers used an algorithm which only denied setting wide-ranging cookies for top-level domains with no dots (e.g. `com` or `org`). However, this did not work for top-level domains where only third-level registrations are allowed (e.g. `co.uk`). In these cases, websites could set a cookie for `.co.uk` which would be passed onto every website registered under `co.uk`.


Since there was and remains no algorithmic method of finding the highest level at which a domain may be registered for a particular top-level domain (the policies differ with each registry), the only method is to create a list. This is the aim of the Public Suffix List.


Software using the Public Suffix List will be able to determine cookie inheritance boundaries between domains, preventing cookies set on one domain from being accessible to other domains under the same public suffix. This protects users from cross-domain cookie setting while still allowing individual domains to set their own cookies.


As well as this, the Public Suffix List can also be used to support features such as site grouping in browsers. By knowing where the user-controlled section of the domain name begins and ends, browsers can group cookies and history entries by site in a way that couldn't easily be done before.


Some use the PSL to determine what is a valid domain name and what isn't. **This is dangerous**. gTLDs and ccTLDs are constantly updating, coming and going - and certainly not static. If the PSL is incorporated in a static manner, and your software does not regularly receive PSL updates, it will erroneously think that valid TLDs are not valid, or conversely treat decommissioned TLDs that should be invalid as valid. The DNS should be the proper source for this information, despite the performance benefits of some local source to pre-empt network latency. If you must use the PSL for this purpose, please do not bake static copies of the PSL into your software without update mechanisms that are frequently checking for updates and incorporating them.


### Uses

These are some of the uses of the list we know about. If you are using it for something else, you are encouraged to tell us, because it helps us to assess the potential impact of changes. For that, you can use the [psl-discuss](https://groups.google.com/forum/#!forum/publicsuffix-discuss) mailing list, where we consider issues related to the maintenance, format and semantics of the list. Note: please _\*do not\*_ use this mailing list to [request additions](https://publicsuffix.org/submit/) to the PSL's data.


#### Firefox

- Restricting cookie setting

- Restricting the setting of the document.domain property

- Sorting in the download manager

- Sorting in the cookie manager

- Searching in history

- Domain highlighting in the URL bar


In the future it may be used for, for example, restricting DOM Storage allowances on a per-domain basis.


#### Chromium/Google Chrome ( [pre-processing](https://chromium.googlesource.com/chromium/src/+/master/net/tools/tld_cleanup/tld_cleanup.cc), [DAFSA builder](https://chromium.googlesource.com/chromium/src/+/master/net/tools/dafsa/make_dafsa.py), [parser](https://chromium.googlesource.com/chromium/src/+/master/net/base/registry_controlled_domains/registry_controlled_domain.cc))

- Restricting cookie setting

- Determining whether entered text is a search or a website URL

- Determining whether wildcard subdomains are allowed in [Origin Trial](https://github.com/GoogleChrome/OriginTrials) tokens


#### Opera

- Restricting cookie setting

- Restricting the setting of the document.domain property


#### Internet Explorer

- Restricting cookie setting
- Domain highlighting in the URL bar
- Zone determination
- ActiveX opt-in list security restriction

#### Other Apps

[Qt](https://www.qt.io/) uses it to restrict cookie setting from version 4.7.2 onwards.


[Crawler-Commons](https://github.com/crawler-commons/crawler-commons) is a suite of tools for building a web crawler, and it uses the PSL.


Network firewalls use the PSL to validate wildcard patterns in egress filtering, preventing
overly broad allowlists like `*.github.io` while permitting safe wildcards like `*.github.com`.


### Libraries

#### C

- [regdom-libs](https://github.com/usrflo/registered-domain-libs/) includes libraries for working with the Public Suffix List (also supports Perl and PHP)
- [libpsl](https://github.com/rockdaboot/libpsl), a fast offline PSL lookup library in C
- [Faup](http://www.github.com/stricaud/faup), a command-line tool with a C library and Python bindings

#### C\#

- [Nager.PublicSuffix](https://github.com/tinohager/Nager.PublicSuffix)

#### C++

- [Upa URL](https://github.com/upa-url/upa)

#### Elixir

- [public\_sufx](https://github.com/reisub/public_sufx)

#### Erlang

- [publicsuffix\_erlang](https://github.com/sinkovsky/publicsuffix_erlang)

#### Gleam

- [psl](https://github.com/cassiascheffer/psl)

#### Go

- [x/net/publicsuffix](https://godoc.org/golang.org/x/net/publicsuffix)
- [tldextract](https://github.com/joeguo/tldextract)
- [publicsuffix-go](https://simonecarletti.com/code/publicsuffix-go/)

#### Haskell

- [publicsuffix-haskell](https://github.com/wereHamster/publicsuffix-haskell)

#### Java

- [regdom-libs](https://github.com/hamano/regdom4j/)
- [Guava](https://github.com/google/guava) \- Google's core Java library has a [PSL-using class](https://google.github.io/guava/releases/snapshot/api/docs/com/google/common/net/InternetDomainName.html)
- [public-suffix-list](https://github.com/whois-server-list/public-suffix-list)

#### JavaScript

- [publicsuffixlist.js](https://github.com/gorhill/publicsuffixlist.js)
- [tld.js](https://github.com/oncletom/tld.js)

#### Lua

- [lua-psl](https://github.com/daurnimator/lua-psl)

#### .NET

- [Louw.PublicSuffix](https://github.com/louislouw/Louw.PublicSuffix)

#### Objective-C

- [KKDomain](https://github.com/kejinlu/KKDomain)

#### Perl

- [Domain::PublicSuffix](https://metacpan.org/pod/Domain::PublicSuffix)

#### PHP

- [php-domain-parser](https://github.com/jeremykendall/php-domain-parser)

#### Python

- [publicsuffix2](https://pypi.python.org/pypi/publicsuffix2/)
- [publicsuffixlist](https://pypi.python.org/pypi/publicsuffixlist)
- [tldextract](https://pypi.python.org/pypi/tldextract/)

#### R

- [pslr](https://gitlab.com/bart-turczynski/pslr)

#### Raku

- [PublicSuffix](https://raku.land/zef:jjatria/PublicSuffix)

#### Ruby

- [publicsuffix-ruby](https://github.com/weppos/publicsuffix-ruby)

#### Rust

- [publicsuffix](https://github.com/rushmorem/publicsuffix)
- [psl](https://github.com/addr-rs/psl)
- [addr](https://github.com/addr-rs/addr)
- [psl-types](https://github.com/addr-rs/psl-types)

#### Swift

- [Dashlane/SwiftDomainParser](https://github.com/Dashlane/SwiftDomainParser)
- [ameshkov/swift-psl](https://github.com/ameshkov/swift-psl)

#### TypeScript

- [tldts](https://github.com/remusao/tldts)

There's also a list of libraries in various languages in the comments on this [Stack Overflow question](http://stackoverflow.com/questions/288810/get-the-subdomain-from-a-url).


### Standards

- [DMARC](http://dmarc.org/)
- [CAB Forum Baseline Requirements](http://cabforum.org/).
The Baseline Requirements ban the issuance of wildcard
certs where the wildcard is the next label immediately after a
registry-controlled label, and suggests using the "ICANN DOMAINS" section
of the Public Suffix List for determining what's registry-controlled.

- [HTML 5](http://www.w3.org/TR/html5/) (document.domain)


### Other

- Let's Encrypt uses it for [rate limiting](https://letsencrypt.org/docs/rate-limits/)
applications to their CA. If you just need an exception from their rate
limits, please do not request a change to the PSL, but instead use their
form, linked from [their\\
documentation](https://letsencrypt.org/docs/rate-limits/). This is a faster way to achieve what you want, and the
PSL is really not intended as a means to work around third-party limits.

- [Cloudflare](https://cloudflare.com/) uses the PSL in a number of ways,
but most notably limits a domain to be available in only one account unless
present in the PSL. Again, third-party limits are not something the PSL was
designed for, so addressing account splitting with Cloudflare directly is the
appropriate solution.

- The [Tranco](https://tranco-list.eu/) service that is widely used
by security researchers uses the PSL as a means to aggregate domain listings
sourced from Alexa, Majestic and Cisco Umbrella.
