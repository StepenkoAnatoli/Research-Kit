---
url: https://schema.org/CreativeWork
retrieved: 2026-10-03
command: firecrawl scrape https://schema.org/CreativeWork --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: CreativeWork - Schema.org Type
---
**Note**: You are viewing the development
version of [Schema.org](https://schema.org/).
See [how we work](https://schema.org/docs/howwework.html) for more details.

[Schema.org](https://schema.org/)

- [Docs](https://schema.org/docs/documents.html)
- [Schemas](https://schema.org/docs/schemas.html)
- [Validate](https://validator.schema.org/)
- [About](https://schema.org/docs/about.html)

|     |     |     |
| --- | --- | --- |
| |     |     |
| --- | --- |
|  | × | | search |  |

# CreativeWork

A Schema.org Type

Usage:

[1M - 10M Domains\\
Based on monthly aggregations from Google's web index.](https://schema.org/docs/usage_stats.html)
(Google - August 2026)



[Thing](https://schema.org/Thing "Thing")




\>




[CreativeWork](https://schema.org/CreativeWork "CreativeWork")

**\[more...\]**

- Canonical URL: https://schema.org/CreativeWork
- [Check for open issues.](https://github.com/schemaorg/schemaorg/issues?q=is%3Aissue+is%3Aopen+CreativeWork)

The most generic kind of creative work, including books, movies, photographs, software programs, etc.

| Property | Expected Type | Description |
| --- | --- | --- |
| Properties from <br> <br> <br> [CreativeWork](https://schema.org/CreativeWork "CreativeWork") |
| `<br>    about` | [Thing](https://schema.org/Thing "Thing") | The subject matter of an object.<br> <br> <br> <br>Inverse property: <br> <br> <br> [subjectOf](https://schema.org/subjectOf "subjectOf") |
| `<br>    abstract` | [Text](https://schema.org/Text "Text") | An abstract is a short description that summarizes a [CreativeWork](https://schema.org/CreativeWork). |
| `<br>    accessMode` | [Text](https://schema.org/Text "Text") | The human sensory perceptual system or cognitive faculty through which a person may process or perceive the intellectual content of a resource, not including any adaptations of the content (e.g., text alternatives for images). Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessMode-vocabulary). |
| `<br>    accessModeSufficient` | [ItemList](https://schema.org/ItemList "ItemList") | A list of single or combined access modes that are sufficient to understand all the intellectual content of a resource, including any adaptations. Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessModeSufficient-vocabulary). |
| `<br>    accessibilityAPI` | [Text](https://schema.org/Text "Text") | Indicates that the resource is compatible with the referenced accessibility API. Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessibilityAPI-vocabulary). |
| `<br>    accessibilityControl` | [Text](https://schema.org/Text "Text") | Identifies input methods that are sufficient to fully control the described resource. Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessibilityControl-vocabulary). |
| `<br>    accessibilityFeature` | [Text](https://schema.org/Text "Text") | Content features of the resource, such as accessible media, alternatives and supported enhancements for accessibility. Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessibilityFeature-vocabulary). |
| `<br>    accessibilityHazard` | [Text](https://schema.org/Text "Text") | A characteristic of the described resource that is physiologically dangerous to some users. Related to WCAG 2.0 guideline 2.3. Values should be drawn from the [approved vocabulary](https://www.w3.org/2021/a11y-discov-vocab/latest/#accessibilityHazard-vocabulary). |
| `<br>    accessibilitySummary` | [Text](https://schema.org/Text "Text") | A human-readable summary of specific accessibility features or deficiencies, consistent with the other accessibility metadata but expressing subtleties such as "short descriptions are present but long descriptions will be needed for non-visual users" or "short descriptions are present and no long descriptions are needed". |
| `<br>    accountablePerson` | [Person](https://schema.org/Person "Person") | Specifies the Person that is legally accountable for the CreativeWork. |
| `<br>    acquireLicensePage` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[URL](https://schema.org/URL "URL") | Indicates a page documenting how licenses can be purchased or otherwise acquired, for the current item. |
| `<br>    aggregateRating` | [AggregateRating](https://schema.org/AggregateRating "AggregateRating") | The overall rating, based on a collection of reviews or ratings, of the item. |
| `<br>    alternativeHeadline` | [Text](https://schema.org/Text "Text") | A secondary title of the CreativeWork. |
| `<br>    archivedAt` | [URL](https://schema.org/URL "URL")  or <br>[WebPage](https://schema.org/WebPage "WebPage") | Indicates a page or other link involved in archival of a [CreativeWork](https://schema.org/CreativeWork). In the case of [MediaReview](https://schema.org/MediaReview), the items in a [MediaReviewItem](https://schema.org/MediaReviewItem) may often become inaccessible, but be archived by archival, journalistic, activist, or law enforcement organizations. In such cases, the referenced page may not directly publish the content. |
| `<br>    assesses` | [DefinedTerm](https://schema.org/DefinedTerm "DefinedTerm")  or <br>[Text](https://schema.org/Text "Text") | The item being described is intended to assess the competency or learning outcome defined by the referenced term. |
| `<br>    associatedMedia` | [MediaObject](https://schema.org/MediaObject "MediaObject") | A media object that encodes this CreativeWork. This property is a synonym for encoding. |
| `<br>    audience` | [Audience](https://schema.org/Audience "Audience") | An intended audience, i.e. a group for whom something was created.<br> Supersedes <br> <br> <br> <br> [serviceAudience](https://schema.org/serviceAudience "serviceAudience"). |
| `<br>    audio` | [AudioObject](https://schema.org/AudioObject "AudioObject")  or <br>[Clip](https://schema.org/Clip "Clip")  or <br>[MusicRecording](https://schema.org/MusicRecording "MusicRecording") | An embedded audio object. |
| `<br>    author` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | The author of this content or rating. Please note that author is special in that HTML 5 provides a special mechanism for indicating authorship via the rel tag. That is equivalent to this and may be used interchangeably. |
| `<br>    award` | [Text](https://schema.org/Text "Text") | An award won by or for this item.<br> Supersedes <br> <br> <br> <br> [awards](https://schema.org/awards "awards"). |
| `<br>    character` | [Person](https://schema.org/Person "Person") | Fictional person connected with a creative work. |
| `<br>    citation` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[Text](https://schema.org/Text "Text") | A citation or reference to another creative work, such as another publication, web page, scholarly article, etc. |
| `<br>    comment` | [Comment](https://schema.org/Comment "Comment") | Comments, typically from users. |
| `<br>    commentCount` | [Integer](https://schema.org/Integer "Integer") | The number of comments this CreativeWork (e.g. Article, Question or Answer) has received. This is most applicable to works published in Web sites with commenting system; additional comments may exist elsewhere. |
| `<br>    conditionsOfAccess` | [Text](https://schema.org/Text "Text") | Conditions that affect the availability of, or method(s) of access to, an item. Typically used for real world items such as an [ArchiveComponent](https://schema.org/ArchiveComponent) held by an [ArchiveOrganization](https://schema.org/ArchiveOrganization). This property is not suitable for use as a general Web access control mechanism. It is expressed only in natural language.<br>For example "Available by appointment from the Reading Room" or "Accessible only from logged-in accounts ". |
| `<br>    contentLocation` | [Place](https://schema.org/Place "Place") | The location depicted or described in the content. For example, the location in a photograph or painting. |
| `<br>    contentRating` | [Rating](https://schema.org/Rating "Rating")  or <br>[Text](https://schema.org/Text "Text") | Official rating of a piece of content—for example, 'MPAA PG-13'. |
| `<br>    contentReferenceTime` | [DateTime](https://schema.org/DateTime "DateTime") | The specific time described by a creative work, for works (e.g. articles, video objects etc.) that emphasise a particular moment within an Event. |
| `<br>    contributor` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | A secondary contributor to the CreativeWork or Event. |
| `<br>    copyrightHolder` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | The party holding the legal copyright to the CreativeWork. |
| `<br>    copyrightNotice` | [Text](https://schema.org/Text "Text") | Text of a notice appropriate for describing the copyright aspects of this Creative Work, ideally indicating the owner of the copyright for the Work. |
| `<br>    copyrightYear` | [Number](https://schema.org/Number "Number") | The year during which the claimed copyright for the CreativeWork was first asserted. |
| `<br>    correction` | [CorrectionComment](https://schema.org/CorrectionComment "CorrectionComment")  or <br>[Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | Indicates a correction to a [CreativeWork](https://schema.org/CreativeWork), either via a [CorrectionComment](https://schema.org/CorrectionComment), textually or in another document. |
| `<br>    countryOfOrigin` | [Country](https://schema.org/Country "Country") | The country of origin of something, including products as well as creative works such as movie and TV content.<br>In the case of TV and movie, this would be the country of the principle offices of the production company or individual responsible for the movie. For other kinds of [CreativeWork](https://schema.org/CreativeWork) it is difficult to provide fully general guidance, and properties such as [contentLocation](https://schema.org/contentLocation) and [locationCreated](https://schema.org/locationCreated) may be more applicable.<br>In the case of products, the country of origin of the product. The exact interpretation of this may vary by context and product type, and cannot be fully enumerated here. |
| `<br>    creativeWorkStatus` | [DefinedTerm](https://schema.org/DefinedTerm "DefinedTerm")  or <br>[Text](https://schema.org/Text "Text") | The status of a creative work in terms of its stage in a lifecycle. Example terms include Incomplete, Draft, Published, Obsolete. Some organizations define a set of terms for the stages of their publication lifecycle. |
| `<br>    creator` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | The creator/author of this CreativeWork. This is the same as the Author property for CreativeWork. |
| `<br>    creditText` | [Text](https://schema.org/Text "Text") | Text that can be used to credit person(s) and/or organization(s) associated with a published Creative Work. |
| `<br>    dateCreated` | [Date](https://schema.org/Date "Date")  or <br>[DateTime](https://schema.org/DateTime "DateTime") | The date on which the CreativeWork was created or the item was added to a DataFeed. |
| `<br>    dateModified` | [Date](https://schema.org/Date "Date")  or <br>[DateTime](https://schema.org/DateTime "DateTime") | The date on which the CreativeWork was most recently modified or when the item's entry was modified within a DataFeed. |
| `<br>    datePublished` | [Date](https://schema.org/Date "Date")  or <br>[DateTime](https://schema.org/DateTime "DateTime") | Date of first publication or broadcast. For example the date a [CreativeWork](https://schema.org/CreativeWork) was broadcast or a [Certification](https://schema.org/Certification) was issued. |
| `<br>    digitalSourceType` | [IPTCDigitalSourceEnumeration](https://schema.org/IPTCDigitalSourceEnumeration "IPTCDigitalSourceEnumeration") | Indicates an IPTCDigitalSourceEnumeration code indicating the nature of the digital source(s) for some [CreativeWork](https://schema.org/CreativeWork). |
| `<br>    discussionUrl` | [URL](https://schema.org/URL "URL") | A link to the page containing the comments of the CreativeWork. |
| `<br>    displayLocation` | [Place](https://schema.org/Place "Place") | The location at which an item can be viewed or experienced in-person. |
| `<br>    editEIDR` | [Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | An [EIDR](https://eidr.org/) (Entertainment Identifier Registry) [identifier](https://schema.org/identifier) representing a specific edit / edition for a work of film or television.<br>For example, the motion picture known as "Ghostbusters" whose [titleEIDR](https://schema.org/titleEIDR) is "10.5240/7EC7-228A-510A-053E-CBB8-J" has several edits, e.g. "10.5240/1F2A-E1C5-680A-14C6-E76B-I" and "10.5240/8A35-3BEE-6497-5D12-9E4F-3".<br>Since schema.org types like [Movie](https://schema.org/Movie) and [TVEpisode](https://schema.org/TVEpisode) can be used for both works and their multiple expressions, it is possible to use [titleEIDR](https://schema.org/titleEIDR) alone (for a general description), or alongside [editEIDR](https://schema.org/editEIDR) for a more edit-specific description. |
| `<br>    editor` | [Person](https://schema.org/Person "Person") | Specifies the Person who edited the CreativeWork. |
| `<br>    educationalAlignment` | [AlignmentObject](https://schema.org/AlignmentObject "AlignmentObject") | An alignment to an established educational framework.<br>This property should not be used where the nature of the alignment can be described using a simple property, for example to express that a resource [teaches](https://schema.org/teaches) or [assesses](https://schema.org/assesses) a competency. |
| `<br>    educationalLevel` | [DefinedTerm](https://schema.org/DefinedTerm "DefinedTerm")  or <br>[Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | The level in terms of progression through an educational or training context. Examples of educational levels include 'beginner', 'intermediate' or 'advanced', and formal sets of level indicators. |
| `<br>    educationalUse` | [DefinedTerm](https://schema.org/DefinedTerm "DefinedTerm")  or <br>[Text](https://schema.org/Text "Text") | The purpose of a work in the context of education; for example, 'assignment', 'group work'. |
| `<br>    encoding` | [MediaObject](https://schema.org/MediaObject "MediaObject") | A media object that encodes this CreativeWork. This property is a synonym for associatedMedia.<br> Supersedes <br> <br> <br> <br> [encodings](https://schema.org/encodings "encodings").<br> <br> <br>Inverse property: <br> <br> <br> [encodesCreativeWork](https://schema.org/encodesCreativeWork "encodesCreativeWork") |
| `<br>    encodingFormat` | [Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | Media type typically expressed using a MIME format (see [IANA site](http://www.iana.org/assignments/media-types/media-types.xhtml) and [MDN reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)), e.g. application/zip for a SoftwareApplication binary, audio/mpeg for .mp3 etc.<br>In cases where a [CreativeWork](https://schema.org/CreativeWork) has several media type representations, [encoding](https://schema.org/encoding) can be used to indicate each [MediaObject](https://schema.org/MediaObject) alongside particular [encodingFormat](https://schema.org/encodingFormat) information.<br>Unregistered or niche encoding and file formats can be indicated instead via the most appropriate URL, e.g. defining Web page or a Wikipedia/Wikidata entry.<br> Supersedes <br> <br> <br> <br> [fileFormat](https://schema.org/fileFormat "fileFormat"). |
| `<br>    exampleOfWork` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | A creative work that this work is an example/instance/realization/derivation of.<br> <br> <br> <br>Inverse property: <br> <br> <br> [workExample](https://schema.org/workExample "workExample") |
| `<br>    expires` | [Date](https://schema.org/Date "Date")  or <br>[DateTime](https://schema.org/DateTime "DateTime") | Date the content expires and is no longer useful or available. For example a [VideoObject](https://schema.org/VideoObject) or [NewsArticle](https://schema.org/NewsArticle) whose availability or relevance is time-limited, a [ClaimReview](https://schema.org/ClaimReview) fact check whose publisher wants to indicate that it may no longer be relevant (or helpful to highlight) after some date, or a [Certification](https://schema.org/Certification) the validity has expired. |
| `<br>    funder` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | A person or organization that supports (sponsors) something through some kind of financial contribution. |
| `<br>    funding` | [Grant](https://schema.org/Grant "Grant") | A [Grant](https://schema.org/Grant) that directly or indirectly provide funding or sponsorship for this item. See also [ownershipFundingInfo](https://schema.org/ownershipFundingInfo).<br> <br> <br> <br>Inverse property: <br> <br> <br> [fundedItem](https://schema.org/fundedItem "fundedItem") |
| `<br>    genre` | [DefinedTerm](https://schema.org/DefinedTerm "DefinedTerm")  or <br>[Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | Genre of the creative work, broadcast channel or group. |
| `<br>    hasPart` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | Indicates an item or CreativeWork that is part of this item, or CreativeWork (in some sense).<br> <br> <br> <br>Inverse property: <br> <br> <br> [isPartOf](https://schema.org/isPartOf "isPartOf") |
| `<br>    headline` | [Text](https://schema.org/Text "Text") | Headline of the article. |
| `<br>    inLanguage` | [Language](https://schema.org/Language "Language")  or <br>[Text](https://schema.org/Text "Text") | The language of the content or performance or used in an action. Please use one of the language codes from the [IETF BCP 47 standard](http://tools.ietf.org/html/bcp47). See also [availableLanguage](https://schema.org/availableLanguage).<br> Supersedes <br> <br> <br> <br> [language](https://schema.org/language "language"). |
| `<br>    interactionStatistic` | [InteractionCounter](https://schema.org/InteractionCounter "InteractionCounter") | The number of interactions for the CreativeWork using the WebSite or SoftwareApplication. The most specific child type of InteractionCounter should be used.<br> Supersedes <br> <br> <br> <br> [interactionCount](https://schema.org/interactionCount "interactionCount"). |
| `<br>    interactivityType` | [Text](https://schema.org/Text "Text") | The predominant mode of learning supported by the learning resource. Acceptable values are 'active', 'expositive', or 'mixed'. |
| `<br>    interpretedAsClaim` | [Claim](https://schema.org/Claim "Claim") | Used to indicate a specific claim contained, implied, translated or refined from the content of a [MediaObject](https://schema.org/MediaObject) or other [CreativeWork](https://schema.org/CreativeWork). The interpreting party can be indicated using [claimInterpreter](https://schema.org/claimInterpreter). |
| `<br>    isAccessibleForFree` | [Boolean](https://schema.org/Boolean "Boolean") | A flag to signal that the item, event, or place is accessible for free.<br> Supersedes <br> <br> <br> <br> [free](https://schema.org/free "free"). |
| `<br>    isBasedOn` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[Product](https://schema.org/Product "Product")  or <br>[URL](https://schema.org/URL "URL") | A resource from which this work is derived or from which it is a modification or adaptation.<br> Supersedes <br> <br> <br> <br> [isBasedOnUrl](https://schema.org/isBasedOnUrl "isBasedOnUrl"). |
| `<br>    isFamilyFriendly` | [Boolean](https://schema.org/Boolean "Boolean") | Indicates whether this content is family friendly. |
| `<br>    isPartOf` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[URL](https://schema.org/URL "URL") | Indicates an item or CreativeWork that this item, or CreativeWork (in some sense), is part of.<br> <br> <br> <br>Inverse property: <br> <br> <br> [hasPart](https://schema.org/hasPart "hasPart") |
| `<br>    keywords` | [DefinedTerm](https://schema.org/DefinedTerm "DefinedTerm")  or <br>[Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | Keywords or tags used to describe some item. Multiple textual entries in a keywords list are typically delimited by commas, or by repeating the property. |
| `<br>    learningResourceType` | [DefinedTerm](https://schema.org/DefinedTerm "DefinedTerm")  or <br>[Text](https://schema.org/Text "Text") | The predominant type or kind characterizing the learning resource. For example, 'presentation', 'handout'. |
| `<br>    license` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[URL](https://schema.org/URL "URL") | A license document that applies to this content, typically indicated by URL. |
| `<br>    locationCreated` | [Place](https://schema.org/Place "Place") | The location where the CreativeWork was created, which may not be the same as the location depicted in the CreativeWork. |
| `<br>    mainEntity` | [Thing](https://schema.org/Thing "Thing") | Indicates the primary entity described in some page or other CreativeWork.<br> <br> <br> <br>Inverse property: <br> <br> <br> [mainEntityOfPage](https://schema.org/mainEntityOfPage "mainEntityOfPage") |
| `<br>    maintainer` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | A maintainer of a [Dataset](https://schema.org/Dataset), software package ( [SoftwareApplication](https://schema.org/SoftwareApplication)), or other [Project](https://schema.org/Project). A maintainer is a [Person](https://schema.org/Person) or [Organization](https://schema.org/Organization) that manages contributions to, and/or publication of, some (typically complex) artifact. It is common for distributions of software and data to be based on "upstream" sources. When [maintainer](https://schema.org/maintainer) is applied to a specific version of something e.g. a particular version or packaging of a [Dataset](https://schema.org/Dataset), it is always possible that the upstream source has a different maintainer. The [isBasedOn](https://schema.org/isBasedOn) property can be used to indicate such relationships between datasets to make the different maintenance roles clear. Similarly in the case of software, a package may have dedicated maintainers working on integration into software distributions such as Ubuntu, as well as upstream maintainers of the underlying work. |
| `<br>    material` | [Product](https://schema.org/Product "Product")  or <br>[Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | A material that something is made from, e.g. leather, wool, cotton, paper. |
| `<br>    materialExtent` | [QuantitativeValue](https://schema.org/QuantitativeValue "QuantitativeValue")  or <br>[Text](https://schema.org/Text "Text") | The quantity of the materials being described or an expression of the physical space they occupy. |
| `<br>    mentions` | [Thing](https://schema.org/Thing "Thing") | Indicates that the CreativeWork contains a reference to, but is not necessarily about a concept. |
| `<br>    offers` | [Demand](https://schema.org/Demand "Demand")  or <br>[Offer](https://schema.org/Offer "Offer") | An offer to provide this item—for example, an offer to sell a product, rent the DVD of a movie, perform a service, or give away tickets to an event. Use [businessFunction](https://schema.org/businessFunction) to indicate the kind of transaction offered, i.e. sell, lease, etc. This property can also be used to describe a [Demand](https://schema.org/Demand). While this property is listed as expected on a number of common types, it can be used in others. In that case, using a second type, such as Product or a subtype of Product, can clarify the nature of the offer.<br> <br> <br> <br>Inverse property: <br> <br> <br> [itemOffered](https://schema.org/itemOffered "itemOffered") |
| `<br>    pattern` | [DefinedTerm](https://schema.org/DefinedTerm "DefinedTerm")  or <br>[Text](https://schema.org/Text "Text") | A pattern that something has, for example 'polka dot', 'striped', 'Canadian flag'. Values are typically expressed as text, although links to controlled value schemes are also supported. |
| `<br>    position` | [Integer](https://schema.org/Integer "Integer")  or <br>[Text](https://schema.org/Text "Text") | The position of an item in a series or sequence of items. |
| `<br>    producer` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | The person or organization who produced the work (e.g. music album, movie, TV/radio series etc.). |
| `<br>    provider` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | The service provider, service operator, or service performer; the goods producer. Another party (a seller) may offer those services or goods on behalf of the provider. A provider may also serve as the seller.<br> Supersedes <br> <br> <br> <br> [carrier](https://schema.org/carrier "carrier"). |
| `<br>    publication` | [PublicationEvent](https://schema.org/PublicationEvent "PublicationEvent") | A publication event associated with the item. |
| `<br>    publisher` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | The publisher of the article in question. |
| `<br>    publisherImprint` | [Organization](https://schema.org/Organization "Organization") | The publishing division which published the comic. |
| `<br>    publishingPrinciples` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[URL](https://schema.org/URL "URL") | The publishingPrinciples property indicates (typically via [URL](https://schema.org/URL)) a document describing the editorial principles of an [Organization](https://schema.org/Organization) (or individual, e.g. a [Person](https://schema.org/Person) writing a blog) that relate to their activities as a publisher, e.g. ethics or diversity policies. When applied to a [CreativeWork](https://schema.org/CreativeWork) (e.g. [NewsArticle](https://schema.org/NewsArticle)) the principles are those of the party primarily responsible for the creation of the [CreativeWork](https://schema.org/CreativeWork).<br>While such policies are most typically expressed in natural language, sometimes related information (e.g. indicating a [funder](https://schema.org/funder)) can be expressed using schema.org terminology. |
| `<br>    recordedAt` | [Event](https://schema.org/Event "Event") | The Event where the CreativeWork was recorded. The CreativeWork may capture all or part of the event.<br> <br> <br> <br>Inverse property: <br> <br> <br> [recordedIn](https://schema.org/recordedIn "recordedIn") |
| `<br>    releasedEvent` | [PublicationEvent](https://schema.org/PublicationEvent "PublicationEvent") | The place and time the release was issued, expressed as a PublicationEvent. |
| `<br>    review` | [Review](https://schema.org/Review "Review") | A review of the item.<br> Supersedes <br> <br> <br> <br> [reviews](https://schema.org/reviews "reviews"). |
| `<br>    schemaVersion` | [Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | Indicates (by URL or string) a particular version of a schema used in some CreativeWork. This property was created primarily to<br> indicate the use of a specific schema.org release, e.g. `10.0` as a simple string, or more explicitly via URL, `https://schema.org/docs/releases.html#v10.0`. There may be situations in which other schemas might usefully be referenced this way, e.g. `http://dublincore.org/specifications/dublin-core/dces/1999-07-02/` but this has not been carefully explored in the community. |
| `<br>    sdDatePublished` | [Date](https://schema.org/Date "Date") | Indicates the date on which the current structured data was generated / published. Typically used alongside [sdPublisher](https://schema.org/sdPublisher). |
| `<br>    sdLicense` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[URL](https://schema.org/URL "URL") | A license document that applies to this structured data, typically indicated by URL. |
| `<br>    sdPublisher` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | Indicates the party responsible for generating and publishing the current structured data markup, typically in cases where the structured data is derived automatically from existing published content but published on a different site. For example, student projects and open data initiatives often re-publish existing content with more explicitly structured metadata. The<br>[sdPublisher](https://schema.org/sdPublisher) property helps make such practices more explicit. |
| `<br>    size` | [DefinedTerm](https://schema.org/DefinedTerm "DefinedTerm")  or <br>[QuantitativeValue](https://schema.org/QuantitativeValue "QuantitativeValue")  or <br>[SizeSpecification](https://schema.org/SizeSpecification "SizeSpecification")  or <br>[Text](https://schema.org/Text "Text") | A standardized size of a product or creative work, specified either through a simple textual string (for example 'XL', '32Wx34L'), a QuantitativeValue with a unitCode, or a comprehensive and structured [SizeSpecification](https://schema.org/SizeSpecification); in other cases, the [width](https://schema.org/width), [height](https://schema.org/height), [depth](https://schema.org/depth) and [weight](https://schema.org/weight) properties may be more applicable. |
| `<br>    sourceOrganization` | [Organization](https://schema.org/Organization "Organization") | The Organization on whose behalf the creator was working. |
| `<br>    spatial` | [Place](https://schema.org/Place "Place") | The "spatial" property can be used in cases when more specific properties<br>(e.g. [locationCreated](https://schema.org/locationCreated), [spatialCoverage](https://schema.org/spatialCoverage), [contentLocation](https://schema.org/contentLocation)) are not known to be appropriate. |
| `<br>    spatialCoverage` | [Place](https://schema.org/Place "Place") | The spatialCoverage of a CreativeWork indicates the place(s) which are the focus of the content. It is a subproperty of<br> contentLocation intended primarily for more technical and detailed materials. For example with a Dataset, it indicates<br> areas that the dataset describes: a dataset of New York weather would have spatialCoverage which was the place: the state of New York. |
| `<br>    sponsor` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | A person or organization that supports a thing through a pledge, promise, or financial contribution. E.g. a sponsor of a Medical Study or a corporate sponsor of an event. |
| `<br>    teaches` | [DefinedTerm](https://schema.org/DefinedTerm "DefinedTerm")  or <br>[Text](https://schema.org/Text "Text") | The item being described is intended to help a person learn the competency or learning outcome defined by the referenced term. |
| `<br>    temporal` | [DateTime](https://schema.org/DateTime "DateTime")  or <br>[Text](https://schema.org/Text "Text") | The "temporal" property can be used in cases where more specific properties<br>(e.g. [temporalCoverage](https://schema.org/temporalCoverage), [dateCreated](https://schema.org/dateCreated), [dateModified](https://schema.org/dateModified), [datePublished](https://schema.org/datePublished)) are not known to be appropriate. |
| `<br>    temporalCoverage` | [DateTime](https://schema.org/DateTime "DateTime")  or <br>[Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | The temporalCoverage of a CreativeWork indicates the period that the content applies to, i.e. that it describes, either as a DateTime or as a textual string indicating a time period in [ISO 8601 time interval format](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals). In<br> the case of a Dataset it will typically indicate the relevant time period in a precise notation (e.g. for a 2011 census dataset, the year 2011 would be written "2011/2012"). Other forms of content, e.g. ScholarlyArticle, Book, TVSeries or TVEpisode, may indicate their temporalCoverage in broader terms - textually or via well-known URL.<br> Written works such as books may sometimes have precise temporal coverage too, e.g. a work set in 1939 - 1945 can be indicated in ISO 8601 interval format format via "1939/1945".<br>Open-ended date ranges can be written with ".." in place of the end date. For example, "2015-11/.." indicates a range beginning in November 2015 and with no specified final date. This is tentative and might be updated in future when ISO 8601 is officially updated.<br> Supersedes <br> <br> <br> <br> [datasetTimeInterval](https://schema.org/datasetTimeInterval "datasetTimeInterval"). |
| `<br>    text` | [Text](https://schema.org/Text "Text") | The textual content of this CreativeWork. |
| `<br>    thumbnail` | [ImageObject](https://schema.org/ImageObject "ImageObject") | Thumbnail image for an image or video. |
| `<br>    thumbnailUrl` | [URL](https://schema.org/URL "URL") | A thumbnail image relevant to the Thing. |
| `<br>    timeRequired` | [Duration](https://schema.org/Duration "Duration") | Approximate or typical time it usually takes to work with or through the content of this work for the typical or target audience. |
| `<br>    translationOfWork` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | The work that this work has been translated from. E.g. 物种起源 is a translationOf “On the Origin of Species”.<br> <br> <br> <br>Inverse property: <br> <br> <br> [workTranslation](https://schema.org/workTranslation "workTranslation") |
| `<br>    translator` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | Organization or person who adapts a creative work to different languages, regional differences and technical requirements of a target market, or that translates during some event. |
| `<br>    typicalAgeRange` | [Text](https://schema.org/Text "Text") | The typical expected age range, e.g. '7-9', '11-'. |
| `<br>    usageInfo` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[URL](https://schema.org/URL "URL") | The schema.org [usageInfo](https://schema.org/usageInfo) property indicates further information about a [CreativeWork](https://schema.org/CreativeWork). This property is applicable both to works that are freely available and to those that require payment or other transactions. It can reference additional information, e.g. community expectations on preferred linking and citation conventions, as well as purchasing details. For something that can be commercially licensed, usageInfo can provide detailed, resource-specific information about licensing options.<br>This property can be used alongside the license property which indicates license(s) applicable to some piece of content. The usageInfo property can provide information about other licensing options, e.g. acquiring commercial usage rights for an image that is also available under non-commercial creative commons licenses. |
| `<br>    version` | [Number](https://schema.org/Number "Number")  or <br>[Text](https://schema.org/Text "Text") | The version of the CreativeWork embodied by a specified resource. |
| `<br>    video` | [Clip](https://schema.org/Clip "Clip")  or <br>[VideoObject](https://schema.org/VideoObject "VideoObject") | An embedded video object. |
| `<br>    wordCount` | [Integer](https://schema.org/Integer "Integer") | The number of words in the text of the CreativeWork such as an Article, Book, etc. |
| `<br>    workExample` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | Example/instance/realization/derivation of the concept of this creative work. E.g. the paperback edition, first edition, or e-book.<br> <br> <br> <br>Inverse property: <br> <br> <br> [exampleOfWork](https://schema.org/exampleOfWork "exampleOfWork") |
| `<br>    workTranslation` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | A work that is a translation of the content of this work. E.g. 西遊記 has an English workTranslation “Journey to the West”, a German workTranslation “Monkeys Pilgerfahrt” and a Vietnamese translation Tây du ký bình khảo.<br> <br> <br> <br>Inverse property: <br> <br> <br> [translationOfWork](https://schema.org/translationOfWork "translationOfWork") |
| Properties from <br> <br> <br> [Thing](https://schema.org/Thing "Thing") |
| `<br>    additionalType` | [Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. Typically the value is a URI-identified RDF class, and in this case corresponds to the<br> use of rdf:type in RDF. Text values can be used sparingly, for cases where useful information can be added without their being an appropriate schema to reference. In the case of text values, the class label should follow the schema.org [style guide](https://schema.org/docs/styleguide.html). |
| `<br>    alternateName` | [Text](https://schema.org/Text "Text") | An alias for the item. |
| `<br>    description` | [Text](https://schema.org/Text "Text")  or <br>[TextObject](https://schema.org/TextObject "TextObject") | A description of the item. |
| `<br>    disambiguatingDescription` | [Text](https://schema.org/Text "Text") | A sub property of description. A short description of the item used to disambiguate from other, similar items. Information from other properties (in particular, name) may be necessary for the description to be useful for disambiguation. |
| `<br>    identifier` | [PropertyValue](https://schema.org/PropertyValue "PropertyValue")  or <br>[Text](https://schema.org/Text "Text")  or <br>[URL](https://schema.org/URL "URL") | The identifier property represents any kind of identifier for any kind of [Thing](https://schema.org/Thing), such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See [background notes](https://schema.org/docs/datamodel.html#identifierBg) for more details. |
| `<br>    image` | [ImageObject](https://schema.org/ImageObject "ImageObject")  or <br>[URL](https://schema.org/URL "URL") | An image of the item. This can be a [URL](https://schema.org/URL) or a fully described [ImageObject](https://schema.org/ImageObject). |
| `<br>    mainEntityOfPage` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[URL](https://schema.org/URL "URL") | Indicates a page (or other CreativeWork) for which this thing is the main entity being described. See [background notes](https://schema.org/docs/datamodel.html#mainEntityBackground) for details.<br> <br> <br> <br>Inverse property: <br> <br> <br> [mainEntity](https://schema.org/mainEntity "mainEntity") |
| `<br>    name` | [Text](https://schema.org/Text "Text") | The name of the item. |
| `<br>    owner` | [Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | A person or organization who owns this Thing.<br> <br> <br> <br>Inverse property: <br> <br> <br> [owns](https://schema.org/owns "owns") |
| `<br>    potentialAction` | [Action](https://schema.org/Action "Action") | Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role. |
| `<br>    sameAs` | [URL](https://schema.org/URL "URL") | URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Wikidata entry, or official website. |
| `<br>    subjectOf` | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[Event](https://schema.org/Event "Event") | A CreativeWork or Event about this Thing.<br> <br> <br> <br>Inverse property: <br> <br> <br> [about](https://schema.org/about "about") |
| `<br>    url` | [URL](https://schema.org/URL "URL") | URL of the item. |

Instances of


[CreativeWork](https://schema.org/CreativeWork "CreativeWork") may appear as a value for the following properties

| Property | On Types | Description |
| --- | --- | --- |
| [acquireLicensePage](https://schema.org/acquireLicensePage "acquireLicensePage") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | Indicates a page documenting how licenses can be purchased or otherwise acquired, for the current item. |
| [actionableFeedbackPolicy](https://schema.org/actionableFeedbackPolicy "actionableFeedbackPolicy") | [NewsMediaOrganization](https://schema.org/NewsMediaOrganization "NewsMediaOrganization")  or <br>[Organization](https://schema.org/Organization "Organization") | For a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization) or other news-related [Organization](https://schema.org/Organization), a statement about public engagement activities (for news media, the newsroom’s), including involving the public - digitally or otherwise -- in coverage decisions, reporting and activities after publication. |
| [appearance](https://schema.org/appearance "appearance") | [Claim](https://schema.org/Claim "Claim") | Indicates an occurrence of a [Claim](https://schema.org/Claim) in some [CreativeWork](https://schema.org/CreativeWork). |
| [backstory](https://schema.org/backstory "backstory") | [Article](https://schema.org/Article "Article") | For an [Article](https://schema.org/Article), typically a [NewsArticle](https://schema.org/NewsArticle), the backstory property provides a textual summary giving a brief explanation of why and how an article was created. In a journalistic setting this could include information about reporting process, methods, interviews, data sources, etc. |
| [cheatCode](https://schema.org/cheatCode "cheatCode") | [VideoGame](https://schema.org/VideoGame "VideoGame")  or <br>[VideoGameSeries](https://schema.org/VideoGameSeries "VideoGameSeries") | Cheat codes to the game. |
| [citation](https://schema.org/citation "citation") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | A citation or reference to another creative work, such as another publication, web page, scholarly article, etc. |
| [correctionsPolicy](https://schema.org/correctionsPolicy "correctionsPolicy") | [NewsMediaOrganization](https://schema.org/NewsMediaOrganization "NewsMediaOrganization")  or <br>[Organization](https://schema.org/Organization "Organization") | For an [Organization](https://schema.org/Organization) (e.g. [NewsMediaOrganization](https://schema.org/NewsMediaOrganization)), a statement describing (in news media, the newsroom’s) disclosure and correction policy for errors. |
| [discusses](https://schema.org/discusses "discusses") | [UserComments](https://schema.org/UserComments "UserComments") | Specifies the CreativeWork associated with the UserComment. |
| [diversityPolicy](https://schema.org/diversityPolicy "diversityPolicy") | [NewsMediaOrganization](https://schema.org/NewsMediaOrganization "NewsMediaOrganization")  or <br>[Organization](https://schema.org/Organization "Organization") | Statement on diversity policy by an [Organization](https://schema.org/Organization) e.g. a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization). For a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization), a statement describing the newsroom’s diversity policy on both staffing and sources, typically providing staffing data. |
| [documentation](https://schema.org/documentation "documentation") | [WebAPI](https://schema.org/WebAPI "WebAPI") | Further documentation describing the Web API in more detail. |
| [encodesCreativeWork](https://schema.org/encodesCreativeWork "encodesCreativeWork") | [MediaObject](https://schema.org/MediaObject "MediaObject") | The CreativeWork encoded by this media object. |
| [ethicsPolicy](https://schema.org/ethicsPolicy "ethicsPolicy") | [NewsMediaOrganization](https://schema.org/NewsMediaOrganization "NewsMediaOrganization")  or <br>[Organization](https://schema.org/Organization "Organization") | Statement about ethics policy, e.g. of a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization) regarding journalistic and publishing practices, or of a [Restaurant](https://schema.org/Restaurant), a page describing food source policies. In the case of a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization), an ethicsPolicy is typically a statement describing the personal, organizational, and corporate standards of behavior expected by the organization. |
| [exampleOfWork](https://schema.org/exampleOfWork "exampleOfWork") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | A creative work that this work is an example/instance/realization/derivation of. |
| [firstAppearance](https://schema.org/firstAppearance "firstAppearance") | [Claim](https://schema.org/Claim "Claim") | Indicates the first known occurrence of a [Claim](https://schema.org/Claim) in some [CreativeWork](https://schema.org/CreativeWork). |
| [fundedItem](https://schema.org/fundedItem "fundedItem") | [Grant](https://schema.org/Grant "Grant") | Indicates something directly or indirectly funded or sponsored through a [Grant](https://schema.org/Grant). See also [ownershipFundingInfo](https://schema.org/ownershipFundingInfo). |
| [gameTip](https://schema.org/gameTip "gameTip") | [VideoGame](https://schema.org/VideoGame "VideoGame") | Links to tips, tactics, etc. |
| [hasPart](https://schema.org/hasPart "hasPart") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | Indicates an item or CreativeWork that is part of this item, or CreativeWork (in some sense). |
| [isBasedOn](https://schema.org/isBasedOn "isBasedOn") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | A resource from which this work is derived or from which it is a modification or adaptation. |
| [isBasedOnUrl](https://schema.org/isBasedOnUrl "isBasedOnUrl") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | A resource that was used in the creation of this resource. This term can be repeated for multiple sources. For example, http://example.com/great-multiplication-intro.html. |
| [isPartOf](https://schema.org/isPartOf "isPartOf") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | Indicates an item or CreativeWork that this item, or CreativeWork (in some sense), is part of. |
| [itemOffered](https://schema.org/itemOffered "itemOffered") | [Demand](https://schema.org/Demand "Demand")  or <br>[Offer](https://schema.org/Offer "Offer") | An item being offered (or demanded). The transactional nature of the offer or demand is documented using [businessFunction](https://schema.org/businessFunction), e.g. sell, lease etc. While several common expected types are listed explicitly in this definition, others can be used. Using a second type, such as Product or a subtype of Product, can clarify the nature of the offer. |
| [license](https://schema.org/license "license") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | A license document that applies to this content, typically indicated by URL. |
| [lyrics](https://schema.org/lyrics "lyrics") | [MusicComposition](https://schema.org/MusicComposition "MusicComposition") | The words in the song. |
| [mainEntityOfPage](https://schema.org/mainEntityOfPage "mainEntityOfPage") | [Thing](https://schema.org/Thing "Thing") | Indicates a page (or other CreativeWork) for which this thing is the main entity being described. See [background notes](https://schema.org/docs/datamodel.html#mainEntityBackground) for details. |
| [masthead](https://schema.org/masthead "masthead") | [NewsMediaOrganization](https://schema.org/NewsMediaOrganization "NewsMediaOrganization") | For a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization), a link to the masthead page or a page listing top editorial management. |
| [messageAttachment](https://schema.org/messageAttachment "messageAttachment") | [Message](https://schema.org/Message "Message") | A CreativeWork attached to the message. |
| [missionCoveragePrioritiesPolicy](https://schema.org/missionCoveragePrioritiesPolicy "missionCoveragePrioritiesPolicy") | [NewsMediaOrganization](https://schema.org/NewsMediaOrganization "NewsMediaOrganization") | For a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization), a statement on coverage priorities, including any public agenda or stance on issues. |
| [noBylinesPolicy](https://schema.org/noBylinesPolicy "noBylinesPolicy") | [NewsMediaOrganization](https://schema.org/NewsMediaOrganization "NewsMediaOrganization") | For a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization) or other news-related [Organization](https://schema.org/Organization), a statement explaining when authors of articles are not named in bylines. |
| [ownershipFundingInfo](https://schema.org/ownershipFundingInfo "ownershipFundingInfo") | [NewsMediaOrganization](https://schema.org/NewsMediaOrganization "NewsMediaOrganization")  or <br>[Organization](https://schema.org/Organization "Organization") | For an [Organization](https://schema.org/Organization) (often but not necessarily a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization)), a description of organizational ownership structure; funding and grants. In a news/media setting, this is with particular reference to editorial independence. Note that the [funder](https://schema.org/funder) is also available and can be used to make basic funder information machine-readable. |
| [parentItem](https://schema.org/parentItem "parentItem") | [Answer](https://schema.org/Answer "Answer")  or <br>[Comment](https://schema.org/Comment "Comment")  or <br>[Question](https://schema.org/Question "Question") | The parent of a question, answer or item in general. Typically used for Q/A discussion threads e.g. a chain of comments with the first comment being an [Article](https://schema.org/Article) or other [CreativeWork](https://schema.org/CreativeWork). See also [comment](https://schema.org/comment) which points from something to a comment about it. |
| [publishingPrinciples](https://schema.org/publishingPrinciples "publishingPrinciples") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork")  or <br>[Organization](https://schema.org/Organization "Organization")  or <br>[Person](https://schema.org/Person "Person") | The publishingPrinciples property indicates (typically via [URL](https://schema.org/URL)) a document describing the editorial principles of an [Organization](https://schema.org/Organization) (or individual, e.g. a [Person](https://schema.org/Person) writing a blog) that relate to their activities as a publisher, e.g. ethics or diversity policies. When applied to a [CreativeWork](https://schema.org/CreativeWork) (e.g. [NewsArticle](https://schema.org/NewsArticle)) the principles are those of the party primarily responsible for the creation of the [CreativeWork](https://schema.org/CreativeWork).<br>While such policies are most typically expressed in natural language, sometimes related information (e.g. indicating a [funder](https://schema.org/funder)) can be expressed using schema.org terminology. |
| [recipeInstructions](https://schema.org/recipeInstructions "recipeInstructions") | [Recipe](https://schema.org/Recipe "Recipe") | A step in making the recipe, in the form of a single item (document, video, etc.) or an ordered list with HowToStep and/or HowToSection items. |
| [recordedIn](https://schema.org/recordedIn "recordedIn") | [Event](https://schema.org/Event "Event") | The CreativeWork that captured all or part of this Event. |
| [sdLicense](https://schema.org/sdLicense "sdLicense") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | A license document that applies to this structured data, typically indicated by URL. |
| [sharedContent](https://schema.org/sharedContent "sharedContent") | [Comment](https://schema.org/Comment "Comment")  or <br>[SocialMediaPosting](https://schema.org/SocialMediaPosting "SocialMediaPosting") | A CreativeWork such as an image, video, or audio clip shared as part of this posting. |
| [softwareHelp](https://schema.org/softwareHelp "softwareHelp") | [SoftwareApplication](https://schema.org/SoftwareApplication "SoftwareApplication") | Software application help. |
| [step](https://schema.org/step "step") | [HowTo](https://schema.org/HowTo "HowTo") | A single step item (as HowToStep, text, document, video, etc.) or a HowToSection. |
| [steps](https://schema.org/steps "steps") | [HowTo](https://schema.org/HowTo "HowTo")  or <br>[HowToSection](https://schema.org/HowToSection "HowToSection") | A single step item (as HowToStep, text, document, video, etc.) or a HowToSection (originally misnamed 'steps'; 'step' is preferred). |
| [subjectOf](https://schema.org/subjectOf "subjectOf") | [Thing](https://schema.org/Thing "Thing") | A CreativeWork or Event about this Thing. |
| [translationOfWork](https://schema.org/translationOfWork "translationOfWork") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | The work that this work has been translated from. E.g. 物种起源 is a translationOf “On the Origin of Species”. |
| [unnamedSourcesPolicy](https://schema.org/unnamedSourcesPolicy "unnamedSourcesPolicy") | [NewsMediaOrganization](https://schema.org/NewsMediaOrganization "NewsMediaOrganization")  or <br>[Organization](https://schema.org/Organization "Organization") | For an [Organization](https://schema.org/Organization) (typically a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization)), a statement about policy on use of unnamed sources and the decision process required. |
| [usageInfo](https://schema.org/usageInfo "usageInfo") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | The schema.org [usageInfo](https://schema.org/usageInfo) property indicates further information about a [CreativeWork](https://schema.org/CreativeWork). This property is applicable both to works that are freely available and to those that require payment or other transactions. It can reference additional information, e.g. community expectations on preferred linking and citation conventions, as well as purchasing details. For something that can be commercially licensed, usageInfo can provide detailed, resource-specific information about licensing options.<br>This property can be used alongside the license property which indicates license(s) applicable to some piece of content. The usageInfo property can provide information about other licensing options, e.g. acquiring commercial usage rights for an image that is also available under non-commercial creative commons licenses. |
| [verificationFactCheckingPolicy](https://schema.org/verificationFactCheckingPolicy "verificationFactCheckingPolicy") | [NewsMediaOrganization](https://schema.org/NewsMediaOrganization "NewsMediaOrganization") | Disclosure about verification and fact-checking processes for a [NewsMediaOrganization](https://schema.org/NewsMediaOrganization) or other fact-checking [Organization](https://schema.org/Organization). |
| [workExample](https://schema.org/workExample "workExample") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | Example/instance/realization/derivation of the concept of this creative work. E.g. the paperback edition, first edition, or e-book. |
| [workFeatured](https://schema.org/workFeatured "workFeatured") | [Event](https://schema.org/Event "Event") | A work featured in some event, e.g. exhibited in an ExhibitionEvent.<br> Specific subproperties are available for workPerformed (e.g. a play), or a workPresented (a Movie at a ScreeningEvent). |
| [workPerformed](https://schema.org/workPerformed "workPerformed") | [Event](https://schema.org/Event "Event") | A work performed in some event, for example a play performed in a TheaterEvent. |
| [workTranslation](https://schema.org/workTranslation "workTranslation") | [CreativeWork](https://schema.org/CreativeWork "CreativeWork") | A work that is a translation of the content of this work. E.g. 西遊記 has an English workTranslation “Journey to the West”, a German workTranslation “Monkeys Pilgerfahrt” and a Vietnamese translation Tây du ký bình khảo. |

#### More specific Types

- [AmpStory](https://schema.org/AmpStory "AmpStory")
- [ArchiveComponent](https://schema.org/ArchiveComponent "ArchiveComponent")
- [Article](https://schema.org/Article "Article")
- [Atlas](https://schema.org/Atlas "Atlas")
- [Blog](https://schema.org/Blog "Blog")
- [Book](https://schema.org/Book "Book")
- [Certification](https://schema.org/Certification "Certification")
- [Chapter](https://schema.org/Chapter "Chapter")
- [Claim](https://schema.org/Claim "Claim")
- [Clip](https://schema.org/Clip "Clip")
- [Collection](https://schema.org/Collection "Collection")
- [ComicStory](https://schema.org/ComicStory "ComicStory")
- [Comment](https://schema.org/Comment "Comment")
- [Conversation](https://schema.org/Conversation "Conversation")
- [Course](https://schema.org/Course "Course")
- [CreativeWorkSeason](https://schema.org/CreativeWorkSeason "CreativeWorkSeason")
- [CreativeWorkSeries](https://schema.org/CreativeWorkSeries "CreativeWorkSeries")
- [Credential](https://schema.org/Credential "Credential")
- [DataCatalog](https://schema.org/DataCatalog "DataCatalog")
- [Dataset](https://schema.org/Dataset "Dataset")
- [DefinedTermSet](https://schema.org/DefinedTermSet "DefinedTermSet")
- [Diet](https://schema.org/Diet "Diet")
- [DigitalDocument](https://schema.org/DigitalDocument "DigitalDocument")
- [Drawing](https://schema.org/Drawing "Drawing")
- [Episode](https://schema.org/Episode "Episode")
- [ExercisePlan](https://schema.org/ExercisePlan "ExercisePlan")
- [Game](https://schema.org/Game "Game")
- [Guide](https://schema.org/Guide "Guide")
- [HowTo](https://schema.org/HowTo "HowTo")
- [HowToDirection](https://schema.org/HowToDirection "HowToDirection")
- [HowToSection](https://schema.org/HowToSection "HowToSection")
- [HowToStep](https://schema.org/HowToStep "HowToStep")
- [HowToTip](https://schema.org/HowToTip "HowToTip")
- [HyperToc](https://schema.org/HyperToc "HyperToc")
- [HyperTocEntry](https://schema.org/HyperTocEntry "HyperTocEntry")
- [LearningResource](https://schema.org/LearningResource "LearningResource")
- [Legislation](https://schema.org/Legislation "Legislation")
- [Manuscript](https://schema.org/Manuscript "Manuscript")
- [Map](https://schema.org/Map "Map")
- [MathSolver](https://schema.org/MathSolver "MathSolver")
- [MediaObject](https://schema.org/MediaObject "MediaObject")
- [MediaReviewItem](https://schema.org/MediaReviewItem "MediaReviewItem")
- [Menu](https://schema.org/Menu "Menu")
- [MenuSection](https://schema.org/MenuSection "MenuSection")
- [Message](https://schema.org/Message "Message")
- [Movie](https://schema.org/Movie "Movie")
- [MusicComposition](https://schema.org/MusicComposition "MusicComposition")
- [MusicPlaylist](https://schema.org/MusicPlaylist "MusicPlaylist")
- [MusicRecording](https://schema.org/MusicRecording "MusicRecording")
- [Painting](https://schema.org/Painting "Painting")
- [Photograph](https://schema.org/Photograph "Photograph")
- [Play](https://schema.org/Play "Play")
- [Poster](https://schema.org/Poster "Poster")
- [PublicationIssue](https://schema.org/PublicationIssue "PublicationIssue")
- [PublicationVolume](https://schema.org/PublicationVolume "PublicationVolume")
- [Quotation](https://schema.org/Quotation "Quotation")
- [Review](https://schema.org/Review "Review")
- [Sculpture](https://schema.org/Sculpture "Sculpture")
- [SheetMusic](https://schema.org/SheetMusic "SheetMusic")
- [ShortStory](https://schema.org/ShortStory "ShortStory")
- [SoftwareApplication](https://schema.org/SoftwareApplication "SoftwareApplication")
- [SoftwareSourceCode](https://schema.org/SoftwareSourceCode "SoftwareSourceCode")
- [SpecialAnnouncement](https://schema.org/SpecialAnnouncement "SpecialAnnouncement")
- [Statement](https://schema.org/Statement "Statement")
- [TVSeason](https://schema.org/TVSeason "TVSeason")
- [TVSeries](https://schema.org/TVSeries "TVSeries")
- [Thesis](https://schema.org/Thesis "Thesis")
- [VisualArtwork](https://schema.org/VisualArtwork "VisualArtwork")
- [WebContent](https://schema.org/WebContent "WebContent")
- [WebPage](https://schema.org/WebPage "WebPage")
- [WebPageElement](https://schema.org/WebPageElement "WebPageElement")
- [WebSite](https://schema.org/WebSite "WebSite")

### Acknowledgements

IPTC rNews properties


This class contains derivatives of IPTC rNews properties. rNews is a data model of publishing metadata with serializations currently available for RDFa as well as HTML5 Microdata. More information about the IPTC and rNews can be found at [rnews.org](http://rnews.org/).


### Examples

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 1](https://schema.org/CreativeWork#eg-0020 "Link: #eg-0020")

Copied

No MarkupMicrodataRDFaJSON-LDStructure

Example notes or example HTML without markup.

```html
<div>

Resistance 3: Fall of Man

by Sony

Platform: Playstation 3

Rated: Mature

<img alt="Fall of Man cover art" src="videogame.jpg" />

</div>
```

Example encoded as [Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) embedded in HTML.

```html
<div itemscope itemtype="https://schema.org/CreativeWork">

<img itemprop="image" alt="Fall of Man cover art"

src="videogame.jpg" />

<span itemprop="name">Resistance 3: Fall of Man</span>

by <span itemprop="author">Sony</span>,

Platform: Playstation 3

Rated:<span itemprop="contentRating">Mature</span>

</div>
```

Example encoded as [RDFa](https://en.wikipedia.org/wiki/RDFa) embedded in HTML.

```html
<div vocab="https://schema.org/" typeof="CreativeWork">

<img property="image" alt="Fall of Man cover art"

src="videogame.jpg" />

<span property="name">Resistance 3: Fall of Man</span>

by <span property="author">Sony</span>,

Platform: Playstation 3

Rated:<span property="contentRating">Mature</span>

</div>
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

{

  "@context": "https://schema.org",

  "@type": "CreativeWork",

  "author": "Sony",

  "contentRating": "Mature",

  "image": "videogame.jpg",

  "name": "Resistance 3: Fall of Man"

}

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org",
"@type": "CreativeWork",
"author": "Sony",
"contentRating": "Mature",
"image": "videogame.jpg",
"name": "Resistance 3: Fall of Man"
}

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 2](https://schema.org/CreativeWork#eg-0175 "Link: #eg-0175")

Copied

No MarkupMicrodataRDFaJSON-LDStructure

Example notes or example HTML without markup.

```html
<div>

   <dl>

      <dt>Name:</dt>

      <dd>Holt Physical Science</dd>

      <dt>Brief Synopsis:</dt>

      <dd>NIMAC-sourced textbook</dd>

      <dt>Long Synopsis:</dt>

      <dd>N/A</dd>

      <dt>Book Quality:</dt>

      <dd>Publisher Quality</dd>

      <dt>Book Size:</dt>

      <dd>598 Pages</dd>

      <dt>ISBN-13:</dt>

      <dd>9780030426599</dd>

      <dt>Publisher:</dt>

      <dd >Holt, Rinehart and Winston</dd>

      <dt>Date of Addition:</dt>

      <dd>06/08/10</dd>

      <dt>Copyright Date:</dt>

      <dd>2007</dd>

      <dt>Copyrighted By:</dt>

      <dd>Holt, Rinehart and Winston</dd>

      <dt>Adult content:</dt>

      <dd>No</dd>

      <dt>Language:</dt>

      <dd>English US</dd>

      <dt>Essential Images:</dt>

      <dd>861</dd>

      <dt>Described Images:</dt>

      <dd>910</dd>

      <dt>Categories:</dt>

      <dd>Educational Materials</dd>

      <dt>Grade Levels:</dt>

      <dd>Sixth grade, Seventh grade, Eighth grade</dd>

      <dt>Submitted By:</dt>

      <dd>Bookshare Staff</dd>

      <dt>NIMAC:</dt>

      <dd>This book is currently only available to public K-12 schools and organizations in the

      United States for use with students with an IEP, because it was created from files

      supplied by the NIMAC under these restrictions. Learn more in the NIMAC Support Center.</dd>

   </dl>

   <div class="bookReviews">

      <h2>Reviews of Holt Physical Science (0 reviews)</h2>

      <div class="bookReviewScore">

         <span>0 - No Rating Yet</span>

      </div>

   </div>

</div>
```

Example encoded as [Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) embedded in HTML.

```html
<p>

This example shows the addition of Accessibility metadata. Although these properties are not

a formal enumeration, there is evolving consensus amongst accessibility experts for

appropriate values for these properties. This example shows simple text values,

as suggested by www.a11ymetadata.org.

</p>

<div itemscope="" itemtype="https://schema.org/Book">

   <meta itemprop="bookFormat" content="EBook"/>

   <meta itemprop="accessibilityFeature" content="largePrint"/>

   <meta itemprop="accessibilityFeature" content="highContrastDisplay"/>

   <meta itemprop="accessibilityFeature" content="displayTransformability"/>

   <meta itemprop="accessibilityFeature" content="longDescription"/>

   <meta itemprop="accessibilityFeature" content="alternativeText"/>

   <meta itemprop="accessibilityControl" content="fullKeyboardControl"/>

   <meta itemprop="accessibilityControl" content="fullMouseControl"/>

   <meta itemprop="accessibilityHazard" content="noFlashingHazard"/>

   <meta itemprop="accessibilityHazard" content="noMotionSimulationHazard"/>

   <meta itemprop="accessibilityHazard" content="noSoundHazard"/>

   <meta itemprop="accessibilityAPI" content="ARIA"/>

   <dl>

      <dt>Name:</dt>

      <dd itemprop="name">Holt Physical Science</dd>

      <dt>Brief Synopsis:</dt>

      <dd itemprop="description">NIMAC-sourced textbook</dd>

      <dt>Long Synopsis:</dt>

      <dd>N/A</dd>

      <dt>Book Quality:</dt>

      <dd>Publisher Quality</dd>

      <dt>Book Size:</dt>

      <dd><span itemprop="numberOfPages">598</span> Pages</dd>

      <dt>ISBN-13:</dt>

      <dd itemprop="isbn">9780030426599</dd>

      <dt>Publisher:</dt>

      <dd itemprop="publisher" itemtype="https://schema.org/Organization" itemscope=""><span itemprop="name">Holt, Rinehart and Winston</span></dd>

      <dt>Date of Addition:</dt>

      <dd>06/08/10</dd>

      <dt>Copyright Date:</dt>

      <dd itemprop="copyrightYear">2007</dd>

      <dt>Copyrighted By:</dt>

      <dd itemprop="copyrightHolder" itemtype="https://schema.org/Organization" itemscope=""><span itemprop="name">Holt, Rinehart and Winston</span></dd>

      <dt>Adult content:</dt>

      <dd><meta itemprop="isFamilyFriendly" content="true"/>No</dd>

      <dt>Language:</dt>

      <dd><meta itemprop="inLanguage" content="en-US"/>English US</dd>

      <dt>Essential Images:</dt>

      <dd>861</dd>

      <dt>Described Images:</dt>

      <dd>910</dd>

      <dt>Categories:</dt>

      <dd><span itemprop="genre">Educational Materials</span></dd>

      <dt>Grade Levels:</dt>

      <dd>Sixth grade, Seventh grade, Eighth grade</dd>

      <dt>Submitted By:</dt>

      <dd>Bookshare Staff</dd>

      <dt>NIMAC:</dt>

      <dd>This book is currently only available to public K-12 schools and organizations in the

      United States for use with students with an IEP, because it was created from files

      supplied by the NIMAC under these restrictions. Learn more in the NIMAC Support Center.</dd>

   </dl>

   <div class="bookReviews" itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">

      <h2>Reviews of Holt Physical Science (<span itemprop="reviewCount">0</span> reviews)</h2>

      <div class="bookReviewScore">

         <span><span itemprop="ratingValue">0</span> - No Rating Yet</span>

      </div>

   </div>

</div>
```

Example encoded as [RDFa](https://en.wikipedia.org/wiki/RDFa) embedded in HTML.

```html
<p>

This example shows the addition of Accessibility metadata. Although these properties are not

a formal enumeration, there is evolving consensus amongst accessibility experts for

appropriate values for these properties. This example shows simple text values,

as suggested by www.a11ymetadata.org.

</p>

<div vocab="https://schema.org/" typeof="Book">

   <meta property="bookFormat" content="EBook"/>

   <meta property="accessibilityFeature" content="largePrint"/>

   <meta property="accessibilityFeature" content="highContrastDisplay"/>

   <meta property="accessibilityFeature" content="displayTransformability"/>

   <meta property="accessibilityFeature" content="longDescription"/>

   <meta property="accessibilityFeature" content="alternativeText"/>

   <meta property="accessibilityControl" content="fullKeyboardControl"/>

   <meta property="accessibilityControl" content="fullMouseControl"/>

   <meta property="accessibilityHazard" content="noFlashingHazard"/>

   <meta property="accessibilityHazard" content="noMotionSimulationHazard"/>

   <meta property="accessibilityHazard" content="noSoundHazard"/>

   <meta property="accessibilityAPI" content="ARIA"/>

   <dl>

      <dt>Name:</dt>

      <dd property="name">Holt Physical Science</dd>

      <dt>Brief Synopsis:</dt>

      <dd property="description">NIMAC-sourced textbook</dd>

      <dt>Long Synopsis:</dt>

      <dd>N/A</dd>

      <dt>Book Quality:</dt>

      <dd>Publisher Quality</dd>

      <dt>Book Size:</dt>

      <dd><span property="numberOfPages">598</span> Pages</dd>

      <dt>ISBN-13:</dt>

      <dd property="isbn">9780030426599</dd>

      <dt>Publisher:</dt>

      <dd property="publisher" typeof="Organization"><span property="name">Holt, Rinehart and Winston</span></dd>

      <dt>Date of Addition:</dt>

      <dd>06/08/10</dd>

      <dt>Copyright Date:</dt>

      <dd property="copyrightYear">2007</dd>

      <dt>Copyrighted By:</dt>

      <dd property="copyrightHolder" typeof="Organization"><span property="name">Holt, Rinehart and Winston</span></dd>

      <dt>Adult content:</dt>

      <dd><meta property="isFamilyFriendly" content="true"/>No</dd>

      <dt>Language:</dt>

      <dd><meta property="inLanguage" content="en-US"/>English US</dd>

      <dt>Essential Images:</dt>

      <dd>861</dd>

      <dt>Described Images:</dt>

      <dd>910</dd>

      <dt>Categories:</dt>

      <dd><span property="genre">Educational Materials</span></dd>

      <dt>Grade Levels:</dt>

      <dd>Sixth grade, Seventh grade, Eighth grade</dd>

      <dt>Submitted By:</dt>

      <dd>Bookshare Staff</dd>

      <dt>NIMAC:</dt>

      <dd>This book is currently only available to public K-12 schools and organizations in the

      United States for use with students with an IEP, because it was created from files

      supplied by the NIMAC under these restrictions. Learn more in the NIMAC Support Center.</dd>

   </dl>

   <div class="bookReviews" property="aggregateRating" typeof="AggregateRating">

      <h2>Reviews of Holt Physical Science (<span property="reviewCount">0</span> reviews)</h2>

      <div class="bookReviewScore">

         <span><span property="ratingValue">0</span> - No Rating Yet</span>

      </div>

   </div>

</div>
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

{

  "@context": "https://schema.org",

  "@type": "Book",

  "accessibilityAPI": "ARIA",

  "accessibilityControl": [\
\
    "fullKeyboardControl",\
\
    "fullMouseControl"\
\
  ],

  "accessibilityFeature": [\
\
    "largePrint",\
\
    "highContrastDisplay",\
\
    "displayTransformability",\
\
    "longDescription",\
\
    "alternativeText"\
\
  ],

  "accessibilityHazard": [\
\
    "noFlashingHazard",\
\
    "noMotionSimulationHazard",\
\
    "noSoundHazard"\
\
  ],

  "aggregateRating": {

    "@type": "AggregateRating",

    "reviewCount": "0"

  },

  "bookFormat": "EBook",

  "copyrightHolder": {

    "@type": "Organization",

    "name": "Holt, Rinehart and Winston"

  },

  "copyrightYear": "2007",

  "description": "NIMAC-sourced textbook",

  "genre": "Educational Materials",

  "inLanguage": "en-US",

  "isFamilyFriendly": "true",

  "isbn": "9780030426599",

  "name": "Holt Physical Science",

  "numberOfPages": "598",

  "publisher": {

    "@type": "Organization",

    "name": "Holt, Rinehart and Winston"

  }

}

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org",
"@type": "Book",
"accessibilityAPI": "ARIA",
"accessibilityControl": \[\
"fullKeyboardControl",\
"fullMouseControl"\
\],
"accessibilityFeature": \[\
"largePrint",\
"highContrastDisplay",\
"displayTransformability",\
"longDescription",\
"alternativeText"\
\],
"accessibilityHazard": \[\
"noFlashingHazard",\
"noMotionSimulationHazard",\
"noSoundHazard"\
\],
"aggregateRating": {
"@type": "AggregateRating",
"reviewCount": "0"
},
"bookFormat": "EBook",
"copyrightHolder": {
"@type": "Organization",
"name": "Holt, Rinehart and Winston"
},
"copyrightYear": "2007",
"description": "NIMAC-sourced textbook",
"genre": "Educational Materials",
"inLanguage": "en-US",
"isFamilyFriendly": "true",
"isbn": "9780030426599",
"name": "Holt Physical Science",
"numberOfPages": "598",
"publisher": {
"@type": "Organization",
"name": "Holt, Rinehart and Winston"
}
}

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 3](https://schema.org/CreativeWork#eg-0189 "Link: #eg-0189")

Copied

No MarkupMicrodataRDFaJSON-LDStructure

Example notes or example HTML without markup.

```html
<div>

  <h2>Shostakovich Leningrad</h2>

  <div>

    <div>May<span>23</span></div>

    <div>8:00 PM</div>

    <div>

      <strong>Britten, Shostakovich</strong>

    </div>

  </div>

  <div>

    <p>Jaap van Zweden conducts two World War II-era pieces showcasing the glorious sound of the CSO.</p>

  </div>

  <div>

    <h3>Program</h3>

    <ul>

      <li>

        <link href="http://en.wikipedia.org/wiki/Peter_Grimes" />

        <span><strong>Britten</strong> Four Sea Interludes and Passacaglia from <em>Peter Grimes</em></span>

  </li>

      <li>

      <link href="http://en.wikipedia.org/wiki/Symphony_No._7_(Shostakovich)" />

      <span><strong>Shostakovich</strong> Symphony No. 7 <em>(Leningrad)</em></span>

  </li>

    </ul>

  </div>

  <div>

    <h3>Performers</h3>

    <div>

      <img src="/examples/cso_c_logo_s.jpg" alt="Chicago Symphony Orchestra" />

      <link href="http://cso.org/" />

      <link href="http://en.wikipedia.org/wiki/Chicago_Symphony_Orchestra" />

      <div>

        <a href="examples/Performer?id=4434">Chicago Symphony Orchestra</a>

      </div>

    </div>

    <div>

      <link href="http://www.jaapvanzweden.com/" />

      <img src="/examples/jvanzweden_s.jpg" alt="Jaap van Zweden"/>

      <div>

        <a href="/examples/Performer.aspx?id=11324">Jaap van Zweden</a>

      </div>

      <div>conductor</div>

    </div>

  </div>

</div>
```

Example encoded as [Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) embedded in HTML.

```html
<div itemscope="" itemtype="https://schema.org/MusicEvent">

  <div itemprop="location" itemscope="" itemtype="https://schema.org/MusicVenue">

    <meta itemprop="name" content="Chicago Symphony Center"/>

    <link itemprop="sameAs" href="http://en.wikipedia.org/wiki/Symphony_Center"/>

    <meta itemprop="address" content="220 S. Michigan Ave, Chicago, Illinois, USA"/>

  </div>

  <div itemprop="offers" itemscope="" itemtype="https://schema.org/Offer">

    <link itemprop="url" href="/examples/ticket/12341234" />

    <meta itemprop="price" content="40"/>

    <meta itemprop="priceCurrency" content="USD" />

    <link itemprop="availability" href="https://schema.org/InStock"/>

  </div>

  <h2 itemprop="name">Shostakovich Leningrad</h2>

  <div>

    <div itemprop="startDate" content="2014-05-23T20:00">May<span>23</span></div>

    <div>8:00 PM</div>

    <div>

      <strong>Britten, Shostakovich</strong>

    </div>

  </div>

  <div>

    <p>Jaap van Zweden conducts two World War II-era pieces showcasing the glorious sound of the CSO.</p>

  </div>

  <div>

    <h3>Program</h3>

    <ul>

      <li itemprop="workPerformed" itemscope="" itemtype="https://schema.org/CreativeWork">

        <link itemprop="sameAs" href="http://en.wikipedia.org/wiki/Peter_Grimes" />

        <span itemprop="name"><strong>Britten</strong> Four Sea Interludes and Passacaglia from <em itemprop="name">Peter Grimes</em></span>

  </li>

      <li itemprop="workPerformed" itemscope="" itemtype="https://schema.org/CreativeWork">

      <link itemprop="sameAs" href="http://en.wikipedia.org/wiki/Symphony_No._7_(Shostakovich)" />

      <span itemprop="name"><strong>Shostakovich</strong> Symphony No. 7 <em>(Leningrad)</em></span>

  </li>

    </ul>

  </div>

  <div>

    <h3>Performers</h3>

    <div itemprop="performer" itemscope="" itemtype="https://schema.org/MusicGroup">

      <img src="/examples/cso_c_logo_s.jpg" alt="Chicago Symphony Orchestra" />

      <link itemprop="sameAs" href="http://cso.org/" />

      <link itemprop="sameAs" href="http://en.wikipedia.org/wiki/Chicago_Symphony_Orchestra" />

      <div>

        <a href="examples/Performer?id=4434"><span itemprop="name">Chicago Symphony Orchestra</span></a>

      </div>

    </div>

    <div itemprop="performer" itemscope="" itemtype="https://schema.org/Person">

      <link itemprop="sameAs" href="http://www.jaapvanzweden.com/" />

      <img itemprop="image" src="/examples/jvanzweden_s.jpg" alt="Jaap van Zweden"/>

      <div>

        <a href="/examples/Performer.aspx?id=11324"><span itemprop="name">Jaap van Zweden</span></a>

      </div>

      <div>conductor</div>

    </div>

  </div>

</div>
```

Example encoded as [RDFa](https://en.wikipedia.org/wiki/RDFa) embedded in HTML.

```html
<div vocab="https://schema.org/" typeof="MusicEvent">

  <div property="location" typeof="MusicVenue">

    <meta property="name" content="Chicago Symphony Center"/>

    <link property="sameAs" href="http://en.wikipedia.org/wiki/Symphony_Center"/>

    <meta property="address" content="220 S. Michigan Ave, Chicago, Illinois, USA"/>

  </div>

  <div property="offers" typeof="Offer">

    <link property="url" href="/examples/ticket/12341234"/>

    <meta property="priceCurrency" content="USD" />$

    <meta property="price" content="40"/>40.00

    <link property="availability" href="https://schema.org/InStock"/>

  </div>

  <h2 property="name">Shostakovich Leningrad</h2>

  <div>

    <div property="startDate" content="2014-05-23T20:00">May<span>23</span></div>

    <div>8:00 PM</div>

    <div>

      <strong>Britten, Shostakovich</strong>

    </div>

  </div>

  <div>

    <p>Jaap van Zweden conducts two World War II-era pieces showcasing the glorious sound of the CSO.</p>

  </div>

  <div>

    <h3>Program</h3>

    <ul>

      <li property="workPerformed" typeof="CreativeWork">

        <link href="http://en.wikipedia.org/wiki/Peter_Grimes" property="sameAs"/>

        <span property="name"><strong>Britten</strong> Four Sea Interludes and Passacaglia from <em property="name">Peter Grimes</em></span>

  </li>

      <li property="workPerformed" typeof="CreativeWork">

      <link href="http://en.wikipedia.org/wiki/Symphony_No._7_(Shostakovich)" property="sameAs"/>

      <span property="name"><strong>Shostakovich</strong> Symphony No. 7 <em>(Leningrad)</em></span>

  </li>

    </ul>

  </div>

  <div>

    <h3>Performers</h3>

    <div property="performer" typeof="MusicGroup">

      <img src="/examples/cso_c_logo_s.jpg" alt="Chicago Symphony Orchestra"/>

      <link href="http://cso.org/" property="sameAs"/>

      <link href="http://en.wikipedia.org/wiki/Chicago_Symphony_Orchestra" property="sameAs"/>

      <span property="name"><a href="examples/Performer?id=4434">Chicago Symphony Orchestra</a></span>

    </div>

    <div property="performer" typeof="Person">

      <link href="http://www.jaapvanzweden.com/" property="sameAs"/>

      <img src="/examples/jvanzweden_s.jpg" alt="Jaap van Zweden" property="image"/>

      <span property="name"><a href="/examples/Performer.aspx?id=11324">Jaap van Zweden</a></span>

      <div>conductor</div>

    </div>

  </div>

</div>
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

{

  "@context": "https://schema.org",

  "@type": "MusicEvent",

  "location": {

    "@type": "MusicVenue",

    "name": "Chicago Symphony Center",

    "address": "220 S. Michigan Ave, Chicago, Illinois, USA"

  },

  "name": "Shostakovich Leningrad",

  "offers": {

    "@type": "Offer",

    "url": "/examples/ticket/12341234",

    "price": "40",

    "priceCurrency": "USD",

    "availability": "https://schema.org/InStock"

  },

  "performer": [\
\
    {\
\
      "@type": "MusicGroup",\
\
      "name": "Chicago Symphony Orchestra",\
\
      "sameAs": [\
\
        "http://cso.org/",\
\
        "http://en.wikipedia.org/wiki/Chicago_Symphony_Orchestra"\
\
      ]\
\
    },\
\
    {\
\
      "@type": "Person",\
\
      "image": "/examples/jvanzweden_s.jpg",\
\
      "name": "Jaap van Zweden",\
\
      "sameAs": "http://www.jaapvanzweden.com/"\
\
    }\
\
  ],

  "startDate": "2014-05-23T20:00",

  "workPerformed": [\
\
    {\
\
      "@type": "CreativeWork",\
\
      "name": "Britten Four Sea Interludes and Passacaglia from Peter Grimes",\
\
      "sameAs": "http://en.wikipedia.org/wiki/Peter_Grimes"\
\
    },\
\
    {\
\
      "@type": "CreativeWork",\
\
      "name": "Shostakovich Symphony No. 7 (Leningrad)",\
\
      "sameAs": "http://en.wikipedia.org/wiki/Symphony_No._7_(Shostakovich)"\
\
    }\
\
  ]

}

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org",
"@type": "MusicEvent",
"location": {
"@type": "MusicVenue",
"name": "Chicago Symphony Center",
"address": "220 S. Michigan Ave, Chicago, Illinois, USA"
},
"name": "Shostakovich Leningrad",
"offers": {
"@type": "Offer",
"url": "/examples/ticket/12341234",
"price": "40",
"priceCurrency": "USD",
"availability": "https://schema.org/InStock"
},
"performer": \[\
{\
"@type": "MusicGroup",\
"name": "Chicago Symphony Orchestra",\
"sameAs": \[\
"http://cso.org/",\
"http://en.wikipedia.org/wiki/Chicago\_Symphony\_Orchestra"\
\]\
},\
{\
"@type": "Person",\
"image": "/examples/jvanzweden\_s.jpg",\
"name": "Jaap van Zweden",\
"sameAs": "http://www.jaapvanzweden.com/"\
}\
\],
"startDate": "2014-05-23T20:00",
"workPerformed": \[\
{\
"@type": "CreativeWork",\
"name": "Britten Four Sea Interludes and Passacaglia from Peter Grimes",\
"sameAs": "http://en.wikipedia.org/wiki/Peter\_Grimes"\
},\
{\
"@type": "CreativeWork",\
"name": "Shostakovich Symphony No. 7 (Leningrad)",\
"sameAs": "http://en.wikipedia.org/wiki/Symphony\_No.\_7\_(Shostakovich)"\
}\
\]
}

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 4](https://schema.org/CreativeWork#eg-0190 "Link: #eg-0190")

Copied

No MarkupMicrodataRDFaJSON-LDStructure

Example notes or example HTML without markup.

```html
<div>

  <span>Julius Caesar at Shakespeare's Globe</span>

  <span>Wed 01 October 2014 19:30</span>

</div>
```

Example encoded as [Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) embedded in HTML.

```html
<div itemscope="" itemtype="https://schema.org/TheaterEvent">

  <span itemprop="name">Julius Caesar at Shakespeare's Globe</span>

  <div itemprop="location" itemscope="" itemtype="https://schema.org/PerformingArtsTheater">

    <meta itemprop="name" content="Shakespeare's Globe"/>

    <link itemprop="sameAs" href="http://www.shakespearesglobe.com/"/>

    <meta itemprop="address" content="London, UK"/>

  </div>

  <div itemprop="offers" itemscope="" itemtype="https://schema.org/Offer">

    <link itemprop="url" href="/examples/ticket/0012301230123"/>

  </div>

  <span itemprop="startDate" content="2014-10-01T19:30">Wed 01 October 2014 19:30</span>

  <div itemprop="workPerformed" itemscope="" itemtype="https://schema.org/CreativeWork">

    <link itemprop="sameAs" href="http://en.wikipedia.org/wiki/Julius_Caesar_(play)"/>

    <link itemprop="sameAs" href="http://worldcat.org/entity/work/id/1807288036"/>

    <div itemprop="creator" itemscope="" itemtype="https://schema.org/Person">

       <meta itemprop="name" content="William Shakespeare"/>

       <link itemprop="sameAs" href="http://en.wikipedia.org/wiki/William_Shakespeare"/>

    </div>

  </div>

</div>
```

Example encoded as [RDFa](https://en.wikipedia.org/wiki/RDFa) embedded in HTML.

```html
<div vocab="https://schema.org/" typeof="TheaterEvent">

  <span property="name">Julius Caesar at Shakespeare's Globe</span>

  <div property="location" typeof="PerformingArtsTheater">

    <meta property="name" content="Shakespeare's Globe"/>

    <link property="sameAs" href="http://www.shakespearesglobe.com/"/>

    <meta property="address" content="London, UK"/>

  </div>

  <div property="offers" typeof="Offer">

    <link property="url" href="/examples/ticket/0012301230123"/>

  </div>

  <span property="startDate" content="2014-10-01T19:30">Wed 01 October 2014 19:30</span>

  <div property="workPerformed" typeof="CreativeWork">

    <link property="sameAs" href="http://en.wikipedia.org/wiki/Julius_Caesar_(play)"/>

    <link property="sameAs" href="http://worldcat.org/entity/work/id/1807288036"/>

    <div property="creator" typeof="Person">

       <meta property="name" content="William Shakespeare"/>

       <link property="sameAs" href="http://en.wikipedia.org/wiki/William_Shakespeare"/>

    </div>

  </div>

</div>
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

{

  "@context": "https://schema.org",

  "@type": "TheaterEvent",

  "name": "Julius Caesar at Shakespeare's Globe",

  "location": {

    "@type": "PerformingArtsTheater",

    "name": "Shakespeare's Globe",

    "sameAs": "http://www.shakespearesglobe.com/",

    "address": "London, UK"

  },

  "offers": {

    "@type": "Offer",

    "url": "/examples/ticket/0012301230123"

  },

  "startDate": "2014-10-01T19:30",

  "workPerformed": {

    "@type": "CreativeWork",

    "name": "Julius Caesar",

    "sameAs": [\
\
      "http://en.wikipedia.org/wiki/Julius_Caesar_(play)",\
\
      "http://worldcat.org/entity/work/id/1807288036"\
\
    ],

    "creator": {

      "@type": "Person",

      "name": "William Shakespeare",

      "sameAs": "http://en.wikipedia.org/wiki/William_Shakespeare"

    }

  }

}

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org",
"@type": "TheaterEvent",
"name": "Julius Caesar at Shakespeare's Globe",
"location": {
"@type": "PerformingArtsTheater",
"name": "Shakespeare's Globe",
"sameAs": "http://www.shakespearesglobe.com/",
"address": "London, UK"
},
"offers": {
"@type": "Offer",
"url": "/examples/ticket/0012301230123"
},
"startDate": "2014-10-01T19:30",
"workPerformed": {
"@type": "CreativeWork",
"name": "Julius Caesar",
"sameAs": \[\
"http://en.wikipedia.org/wiki/Julius\_Caesar\_(play)",\
"http://worldcat.org/entity/work/id/1807288036"\
\],
"creator": {
"@type": "Person",
"name": "William Shakespeare",
"sameAs": "http://en.wikipedia.org/wiki/William\_Shakespeare"
}
}
}

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 5](https://schema.org/CreativeWork#eg-0209 "Link: #eg-0209")

Copied

No MarkupMicrodataRDFaJSON-LDStructure

Example notes or example HTML without markup.

```html
Top 5 covers of Bob Dylan Songs

by John Doe

5. If Not for You -- George Harrison

4. The Times They Are A-Changin' -- Tracy Chapman

3. It Ain't Me, Babe -- Johnny Cash and June Carter Cash

2. Don't Think Twice, It's Alright -- Waylon Jennings

1. All Along the Watchtower -- Jimi Hendrix
```

Example encoded as [Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) embedded in HTML.

```html
<div itemscope itemtype="https://schema.org/ItemList https://schema.org/CreativeWork">

  <h1 itemprop="name">Top 5 covers of Bob Dylan Songs</h1>

  <div itemprop="author" itemscope itemtype="https://schema.org/Person">

    by <span itemprop="name">John Doe</span>

  </div>

  <div itemprop="about" itemscope itemtype="https://schema.org/MusicRecording">

    <div itemprop="byArtist" itemscope itemtype="https://schema.org/MusicGroup">

      <meta itemprop="name" content="Bob Dylan" />

    </div>

  </div>

  <link itemprop="itemListOrder" href="https://schema.org/ItemListOrderAscending" />

  <meta itemprop="numberOfItems" content="5" />

  <div itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">

    <span itemprop="position">5</span>

    <div itemprop="item" itemscope itemtype="https://schema.org/MusicRecording">

      <span itemprop="name">If Not For You</span>

      <div itemprop="byArtist" itemscope itemtype="https://schema.org/MusicGroup">

        <span itemprop="name">George Harrison</span>

      </div>

    </div>

  </div>

  <div itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">

    <span itemprop="position">4</span>

    <div itemprop="item" itemscope itemtype="https://schema.org/MusicRecording">

      <span itemprop="name">The Times They Are A-Changin'</span>

      <div itemprop="byArtist" itemscope itemtype="https://schema.org/MusicGroup">

        <span itemprop="name">Tracy Chapman</span>

      </div>

    </div>

  </div>

  <div itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">

    <span itemprop="position">3</span>

    <div itemprop="item" itemscope itemtype="https://schema.org/MusicRecording">

      <span itemprop="name">It Ain't Me Babe</span>

      <div itemprop="byArtist" itemscope itemtype="https://schema.org/MusicGroup">

        <span itemprop="name">Johnny Cash</span>

      </div>

      <div itemprop="byArtist" itemscope itemtype="https://schema.org/MusicGroup">

        <span itemprop="name">June Carter Cash</span>

      </div>

    </div>

  </div>

  <div itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">

    <span itemprop="position">2</span>

    <div itemprop="item" itemscope itemtype="https://schema.org/MusicRecording">

      <span itemprop="name">Don't Think Twice It's Alright</span>

      <div itemprop="byArtist" itemscope itemtype="https://schema.org/MusicGroup">

        <span itemprop="name">Waylon Jennings</span>

      </div>

    </div>

  </div>

  <div itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">

    <span itemprop="position">1</span>

    <div itemprop="item" itemscope itemtype="https://schema.org/MusicRecording">

      <span itemprop="name">All Along the Watchtower</span>

      <div itemprop="byArtist" itemscope itemtype="https://schema.org/MusicGroup">

        <span itemprop="name">Jimi Hendrix</span>

      </div>

    </div>

  </div>

</div>
```

Example encoded as [RDFa](https://en.wikipedia.org/wiki/RDFa) embedded in HTML.

```html
<div vocab="https://schema.org/" typeof="ItemList CreativeWork">

    <h1 property="name">

        Top 5 covers of Bob Dylan Songs

    </h1>

    <div property="author" typeof="Person">

        by <span property="name">John Doe</span>

    </div>

    <div property="about" typeof="MusicRecording">

        <div property="byArtist" typeof="MusicGroup">

            <meta property="name" content="Bob Dylan">

        </div>

    </div>

    <link property="itemListOrder" href="https://schema.org/ItemListOrderAscending">

    <meta property="numberOfItems" content="5">

    <div property="itemListElement" typeof="ListItem">

        <span property="position">5</span>

        <div property="item" typeof="MusicRecording">

            <span property="name">If Not For You</span>

            <div property="byArtist" typeof="MusicGroup">

                <span property="name">George Harrison</span>

            </div>

        </div>

    </div>

    <div property="itemListElement" typeof="ListItem">

        <span property="position">4</span>

        <div property="item" typeof="MusicRecording">

            <span property="name">The Times They Are A-Changin'</span>

            <div property="byArtist" typeof="MusicGroup">

                <span property="name">Tracy Chapman</span>

            </div>

        </div>

    </div>

    <div property="itemListElement" typeof="ListItem">

        <span property="position">3</span>

        <div property="item" typeof="MusicRecording">

            <span property="name">It Ain't Me Babe</span>

            <div property="byArtist" typeof="MusicGroup">

                <span property="name">Johnny Cash</span>

            </div>

            <div property="byArtist" typeof="MusicGroup">

                <span property="name">June Carter Cash</span>

            </div>

        </div>

    </div>

    <div property="itemListElement" typeof="ListItem">

        <span property="position">2</span>

        <div property="item" typeof="MusicRecording">

            <span property="name">Don't Think Twice It's Alright</span>

            <div property="byArtist" typeof="MusicGroup">

                <span property="name">Waylon Jennings</span>

            </div>

        </div>

    </div>

    <div property="itemListElement" typeof="ListItem">

        <span property="position">1</span>

        <div property="item" typeof="MusicRecording">

            <span property="name">All Along the Watchtower</span>

            <div property="byArtist" typeof="MusicGroup">

                <span property="name">Jimi Hendrix</span>

            </div>

        </div>

    </div>

</div>
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

{

  "@context": "https://schema.org",

  "@type": ["ItemList", "CreativeWork"],

  "name": "Top 5 covers of Bob Dylan Songs",

  "author": "John Doe",

  "about": {

    "@type": "MusicRecording",

    "byArtist": {

      "@type": "MusicGroup",

      "name": "Bob Dylan"

    }

  },

  "itemListOrder": "https://schema.org/ItemListOrderAscending",

  "numberOfItems": 5,

  "itemListElement": [\
\
    {\
\
      "@type": "ListItem",\
\
      "position": 5,\
\
      "item": {\
\
        "@type": "MusicRecording",\
\
        "name": "If Not For You",\
\
        "byArtist": {\
\
          "@type": "MusicGroup",\
\
          "name": "George Harrison"\
\
        }\
\
      }\
\
    },\
\
    {\
\
      "@type": "ListItem",\
\
      "position": 4,\
\
      "item": {\
\
        "@type": "MusicRecording",\
\
        "name": "The Times They Are A-Changin'",\
\
        "byArtist": {\
\
          "@type": "MusicGroup",\
\
          "name": "Tracy Chapman"\
\
        }\
\
      }\
\
    },\
\
    {\
\
      "@type": "ListItem",\
\
      "position": 3,\
\
      "item": {\
\
        "@type": "MusicRecording",\
\
        "name": "It Ain't Me Babe",\
\
        "byArtist": [\
\
          {\
\
            "@type": "MusicGroup",\
\
            "name": "Johnny Cash"\
\
          },\
\
          {\
\
            "@type": "MusicGroup",\
\
            "name": "June Carter Cash"\
\
          }\
\
        ]\
\
      }\
\
    },\
\
    {\
\
      "@type": "ListItem",\
\
      "position": 2,\
\
      "item": {\
\
        "@type": "MusicRecording",\
\
        "name": "Don't Think Twice It's Alright",\
\
        "byArtist": {\
\
          "@type": "MusicGroup",\
\
          "name": "Waylon Jennings"\
\
        }\
\
      }\
\
    },\
\
    {\
\
      "@type": "ListItem",\
\
      "position": 1,\
\
      "item": {\
\
        "@type": "MusicRecording",\
\
        "name": "All Along the Watchtower",\
\
        "byArtist": {\
\
          "@type": "MusicGroup",\
\
          "name": "Jimi Hendrix"\
\
        }\
\
      }\
\
    }\
\
  ]

}

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org",
"@type": \["ItemList", "CreativeWork"\],
"name": "Top 5 covers of Bob Dylan Songs",
"author": "John Doe",
"about": {
"@type": "MusicRecording",
"byArtist": {
"@type": "MusicGroup",
"name": "Bob Dylan"
}
},
"itemListOrder": "https://schema.org/ItemListOrderAscending",
"numberOfItems": 5,
"itemListElement": \[\
{\
"@type": "ListItem",\
"position": 5,\
"item": {\
"@type": "MusicRecording",\
"name": "If Not For You",\
"byArtist": {\
"@type": "MusicGroup",\
"name": "George Harrison"\
}\
}\
},\
{\
"@type": "ListItem",\
"position": 4,\
"item": {\
"@type": "MusicRecording",\
"name": "The Times They Are A-Changin'",\
"byArtist": {\
"@type": "MusicGroup",\
"name": "Tracy Chapman"\
}\
}\
},\
{\
"@type": "ListItem",\
"position": 3,\
"item": {\
"@type": "MusicRecording",\
"name": "It Ain't Me Babe",\
"byArtist": \[\
{\
"@type": "MusicGroup",\
"name": "Johnny Cash"\
},\
{\
"@type": "MusicGroup",\
"name": "June Carter Cash"\
}\
\]\
}\
},\
{\
"@type": "ListItem",\
"position": 2,\
"item": {\
"@type": "MusicRecording",\
"name": "Don't Think Twice It's Alright",\
"byArtist": {\
"@type": "MusicGroup",\
"name": "Waylon Jennings"\
}\
}\
},\
{\
"@type": "ListItem",\
"position": 1,\
"item": {\
"@type": "MusicRecording",\
"name": "All Along the Watchtower",\
"byArtist": {\
"@type": "MusicGroup",\
"name": "Jimi Hendrix"\
}\
}\
}\
\]
}

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 6](https://schema.org/CreativeWork#eg-0220 "Link: #eg-0220")

Copied

No MarkupMicrodataRDFaJSON-LDStructure

Example notes or example HTML without markup.

```html
A CreativeWork and its translation.

<div>

<div>

        <h1>Rouge et le noir</h1>

    <div>Author: Stendhal</div>

        <div>Language: French</div>

        <div>Has Translation: Red and Black : A New Translation, Backgrounds and Sources, Criticism</div>

</div>

<div>

    <h1>Red and Black : A New Translation, Backgrounds and Sources, Criticism</h1>

    <div>Author: Stendhal</div>

        <div>Language: English</div>

        <div>Subject: Psychological fiction, French</div>

        <div>Translation of: Rouge et le noir</div>

        <div>Translator: Robert Martin Adams</div>

</div>

</div>
```

Example encoded as [Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) embedded in HTML.

```html
<div>

<div itemscope itemtype="https://schema.org/Book" itemid="http://worldcat.org/entity/work/id/2292573321">

        <h1><span itemprop="name">Rouge et le noir</span></h1>

    <div>Author: <span itemprop="author" itemscope itemtype="https://schema.org/Person" itemid="http://viaf.org/viaf/17823">Stendhal</span></div>

        <div>Language: <meta itemprop="inLanguage" content="fr" />French</div>

        <div>Has Translation: <span itemprop="workTranslation" itemscope itemtype="https://schema.org/CreativeWork" itemid="http://worldcat.org/entity/work/id/460647">Red and Black : A New Translation, Backgrounds and Sources, Criticism</span></div>

</div>

<div itemscope itemtype="https://schema.org/Book" itemid="http://worldcat.org/entity/work/id/460647">

    <h1><span itemprop="name">Red and Black : A New Translation, Backgrounds and Sources, Criticism</span></h1>

    <div>Author: <span itemprop="author" itemscope itemtype="https://schema.org/Person" itemid="http://viaf.org/viaf/17823">Stendhal</span></div>

        <div>Language: <meta itemprop="inLanguage" content="en" />English</div>

        <div>Subject: <span itemprop="about">Psychological fiction, French</span></div>

        <div>Translation of: <span itemprop="translationOfWork" itemscope itemtype="https://schema.org/CreativeWork" itemid="http://worldcat.org/entity/work/id/2292573321">Rouge et le noir</span></div>

        <div>Translator: <span itemprop="translator" itemscope itemtype="https://schema.org/Person" itemid="http://viaf.org/viaf/8453420">Robert Martin Adams</span></div>

</div>

</div>
```

Example encoded as [RDFa](https://en.wikipedia.org/wiki/RDFa) embedded in HTML.

```html
<div vocab="https://schema.org/">

<div typeof="Book" resource="http://worldcat.org/entity/work/id/2292573321">

        <h1><span property="name">Rouge et le noir</span></h1>

    <div>Author: <span property="author" typeof="Person" resource="http://viaf.org/viaf/17823">Stendhal</span></div>

        <div>Language: <span property="inLanguage" content="fr">French</span></div>

        <div>Has Translation: <span property="workTranslation" typeof="CreativeWork" resource="http://worldcat.org/entity/work/id/460647">Red and Black : A New Translation, Backgrounds and Sources, Criticism</span></div>

</div>

<div typeof="Book" resource="http://worldcat.org/entity/work/id/460647">

    <h1><span property="name">Red and Black : A New Translation, Backgrounds and Sources, Criticism</span></h1>

    <div>Author: <span property="author" typeof="Person" resource="http://viaf.org/viaf/17823">Stendhal</span></div>

        <div>Language: <span property="inLanguage" content="en">English</span></div>

        <div>Subject: <span property="about">Psychological fiction, French</span></div>

        <div>Translation of: <span property="translationOfWork" typeof="CreativeWork" resource="http://worldcat.org/entity/work/id/2292573321">Rouge et le noir</span></div>

        <div>Translator: <span property="translator" typeof="Person" resource="http://viaf.org/viaf/8453420">Robert Martin Adams</span></div>

</div>

</div>
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

    {

        "@context": "https://schema.org/",

        "@graph": [\
\
            {\
\
                "@id": "http://worldcat.org/entity/work/id/2292573321",\
\
                "@type": "Book",\
\
                "author": {\
\
                    "@id": "http://viaf.org/viaf/17823"\
\
                },\
\
                "inLanguage": "fr",\
\
                "name": "Rouge et le noir",\
\
                "workTranslation": {\
\
                    "@type": "Book",\
\
                    "@id": "http://worldcat.org/entity/work/id/460647"\
\
                }\
\
            },\
\
            {\
\
                "@id": "http://worldcat.org/entity/work/id/460647",\
\
                "@type": "Book",\
\
                "about": "Psychological fiction, French",\
\
                "author": {\
\
                    "@id": "http://viaf.org/viaf/17823"\
\
                },\
\
                "inLanguage": "en",\
\
                "name": "Red and Black : A New Translation, Backgrounds and Sources, Criticism",\
\
                "translationOfWork": {\
\
                    "@id": "http://worldcat.org/entity/work/id/2292573321"\
\
                },\
\
                "translator": {\
\
                    "@id": "http://viaf.org/viaf/8453420"\
\
                }\
\
            }\
\
        ]

    }

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org/",
"@graph": \[\
{\
"@id": "http://worldcat.org/entity/work/id/2292573321",\
"@type": "Book",\
"author": {\
"@id": "http://viaf.org/viaf/17823"\
},\
"inLanguage": "fr",\
"name": "Rouge et le noir",\
"workTranslation": {\
"@type": "Book",\
"@id": "http://worldcat.org/entity/work/id/460647"\
}\
},\
{\
"@id": "http://worldcat.org/entity/work/id/460647",\
"@type": "Book",\
"about": "Psychological fiction, French",\
"author": {\
"@id": "http://viaf.org/viaf/17823"\
},\
"inLanguage": "en",\
"name": "Red and Black : A New Translation, Backgrounds and Sources, Criticism",\
"translationOfWork": {\
"@id": "http://worldcat.org/entity/work/id/2292573321"\
},\
"translator": {\
"@id": "http://viaf.org/viaf/8453420"\
}\
}\
\]
}

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 7](https://schema.org/CreativeWork#eg-0246 "Link: #eg-0246")

Copied

No MarkupJSON-LDStructure

Example notes or example HTML without markup.

```html
See JSON example.
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

{

  "@context": "https://schema.org/",

  "@type": "Thing",

  "name": "Schema.org Ontology",

  "subjectOf": {

    "@type": "Book",

    "name": "The Complete History of Schema.org"

  }

}

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org/",
"@type": "Thing",
"name": "Schema.org Ontology",
"subjectOf": {
"@type": "Book",
"name": "The Complete History of Schema.org"
}
}

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 8](https://schema.org/CreativeWork#eg-0257 "Link: #eg-0257")

Copied

No MarkupMicrodataJSON-LDStructure

Example notes or example HTML without markup.

```html
<div>

  Name: Assorted collection of items<br/>

  Extent: 285 A boxes, 8 OS boxes (plus 45 T boxes, 50 A boxes, 13 OS boxes / items uncatalogued)<br/>

</div>
```

Example encoded as [Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) embedded in HTML.

```html
<div itemscope itemtype="https://schema.org/CreativeWork">

  <link itemprop="additionalType" href="https://schema.org/ArchiveComponent"/>

  Name: <span itemprop="name">Assorted collection of items</span><br/>

  Extent: <span itemprop="materialExtent">285 A boxes, 8 OS boxes (plus 45 T boxes, 50 A boxes, 13 OS boxes / items uncatalogued)</span><br/>

</div>
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

{

  "@context": "https://schema.org",

  "@type": ["CreativeWork","ArchiveComponent"],

  "name": "Assorted collection of items",

  "materialExtent": "285 A boxes, 8 OS boxes (plus 45 T boxes, 50 A boxes, 13 OS boxes / items uncatalogued)"

}

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org",
"@type": \["CreativeWork","ArchiveComponent"\],
"name": "Assorted collection of items",
"materialExtent": "285 A boxes, 8 OS boxes (plus 45 T boxes, 50 A boxes, 13 OS boxes / items uncatalogued)"
}

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 9](https://schema.org/CreativeWork#eg-0258 "Link: #eg-0258")

Copied

No MarkupMicrodataJSON-LDStructure

Example notes or example HTML without markup.

```html
<div>

  Name: Assorted collection of items<br/>

  Extent: 1 folder containing 5 design drawings<br/>

</div>
```

Example encoded as [Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) embedded in HTML.

```html
<div itemscope itemtype="https://schema.org/CreativeWork">

  <link itemprop="additionalType" href="https://schema.org/ArchiveComponent"/>

  Name: <span itemprop="name">Assorted collection of items</span><br/>

  Extent: <div>

            <div itemprop="materialExtent" itemscope itemtype="https://schema.org/QuantitativeValue">

              <span itemprop="value">1</span> <span itemprop="unitText">folder</span>

                        </div>

                        containing

            <div itemprop="materialExtent" itemscope itemtype="https://schema.org/QuantitativeValue">

              <span itemprop="value">5</span> <span itemprop="unitText">design drawings</span>

                        </div>

          </div><br/>

</div>
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

{

  "@context": "https://schema.org",

  "@type": ["CreativeWork","ArchiveComponent"],

  "materialExtent": [\
\
          {\
\
            "@type": "QuantitativeValue",\
\
            "unitText": "folder",\
\
            "value": "1"\
\
          },\
\
          {\
\
            "@type": "QuantitativeValue",\
\
            "unitText": "design drawings",\
\
            "value": "5"\
\
          }\
\
       ]

}

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org",
"@type": \["CreativeWork","ArchiveComponent"\],
"materialExtent": \[\
{\
"@type": "QuantitativeValue",\
"unitText": "folder",\
"value": "1"\
},\
{\
"@type": "QuantitativeValue",\
"unitText": "design drawings",\
"value": "5"\
}\
\]
}

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 10](https://schema.org/CreativeWork#eg-0462 "Link: #eg-0462")

Copied

No MarkupMicrodataRDFaJSON-LDStructure

Example notes or example HTML without markup.

```html
<a href="category/books.html">Books</a> >

 <a href="category/books-literature.html">Literature &amp; Fiction</a> >

 <a href="category/books-classics">Classics</a>

<img src="catcher-in-the-rye-book-cover.jpg"

  alt="cover art: red horse, city in background"/>

The Catcher in the Rye - Mass Market Paperback

by <a href="/author/jd_salinger.html">J.D. Salinger</a>

4 stars - 3077 reviews

Price: $6.99

In Stock

Product details

224 pages

Publisher: Little, Brown, and Company - May 1, 1991

Language: English

ISBN-10: 0316769487

Reviews:

5 stars - <b>"A masterpiece of literature" </b>

by John Doe. Written on May 4, 2006

I really enjoyed this book. It captures the essential challenge people face

as they try make sense of their lives and grow to adulthood.

4 stars - <b>"love it LOLOL111!" </b>

by Bob Smith, Written on June 15, 2006

Catcher in the Rye is a fun book. It's a good book to read.
```

Example encoded as [Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) embedded in HTML.

```html
<body itemscope itemtype="https://schema.org/WebPage">

...

<div itemprop="breadcrumb">

  <a href="category/books.html">Books</a> >

  <a href="category/books-literature.html">Literature &amp; Fiction</a> >

  <a href="category/books-classics">Classics</a>

</div>

<div itemprop="mainEntity" itemscope itemtype="https://schema.org/Book">

<img itemprop="image" src="catcher-in-the-rye-book-cover.jpg"

     alt="cover art: red horse, city in background"/>

<span itemprop="name">The Catcher in the Rye</span> -

 <link itemprop="bookFormat" href="https://schema.org/Paperback">Mass Market Paperback

by <a itemprop="author" href="/author/jd_salinger.html">J.D. Salinger</a>

<div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">

  <span itemprop="ratingValue">4</span> stars -

  <span itemprop="reviewCount">3077</span> reviews

</div>

<div itemprop="offers" itemscope itemtype="https://schema.org/Offer">

  Price: $<span itemprop="price">6.99</span>

  <meta itemprop="priceCurrency" content="USD" />

  <link itemprop="availability" href="https://schema.org/InStock">In Stock

</div>

Product details

<span itemprop="numberOfPages">224</span> pages

Publisher: <span itemprop="publisher">Little, Brown, and Company</span> -

 <meta itemprop="datePublished" content="1991-05-01">May 1, 1991

Language: <span itemprop="inLanguage">English</span>

ISBN-10: <span itemprop="isbn">0316769487</span>

Reviews:

<div itemprop="review" itemscope itemtype="https://schema.org/Review">

  <span itemprop="reviewRating">5</span> stars -

  <b>"<span itemprop="name">A masterpiece of literature</span>"</b>

  by <span itemprop="author">John Doe</span>,

  Written on <meta itemprop="datePublished" content="2006-05-04">May 4, 2006

  <span itemprop="reviewBody">I really enjoyed this book. It captures the essential

  challenge people face as they try make sense of their lives and grow to adulthood.</span>

</div>

<div itemprop="review" itemscope itemtype="https://schema.org/Review">

  <span itemprop="reviewRating">4</span> stars -

  <b>"<span itemprop="name">A good read.</span>" </b>

  by <span itemprop="author">Bob Smith</span>,

  Written on <meta itemprop="datePublished" content="2006-06-15">June 15, 2006

  <span itemprop="reviewBody">Catcher in the Rye is a fun book. It's a good book to read.</span>

</div>

</div>

...

</body>
```

Example encoded as [RDFa](https://en.wikipedia.org/wiki/RDFa) embedded in HTML.

```html
<body vocab="https://schema.org/" typeof="WebPage">

...

<div property="breadcrumb">

  <a href="category/books.html">Books</a> >

  <a href="category/books-literature.html">Literature &amp; Fiction</a> >

  <a href="category/books-classics">Classics</a>

</div>

<div property="mainEntity" typeof="Book">

<img property="image" src="catcher-in-the-rye-book-cover.jpg"

    alt="cover art: red horse, city in background"/>

<span property="name">The Catcher in the Rye</span> -

 <link property="bookFormat" href="https://schema.org/Paperback">Mass Market Paperback

by <a property="author" href="/author/jd_salinger.html">J.D. Salinger</a>

<div property="aggregateRating" typeof="AggregateRating">

  <span property="ratingValue">4</span> stars -

  <span property="reviewCount">3077</span> reviews

</div>

<div property="offers" typeof="Offer">

  Price: $<span property="price">6.99</span>

  <meta property="priceCurrency" content="USD" />

  <link property="availability" href="https://schema.org/InStock">In Stock

</div>

Product details

<span property="numberOfPages">224</span> pages

Publisher: <span property="publisher">Little, Brown, and Company</span> -

 <meta property="datePublished" content="1991-05-01">May 1, 1991

Language: <span property="inLanguage">English</span>

ISBN-10: <span property="isbn">0316769487</span>

Reviews:

<div property="review" typeof="Review">

  <span property="reviewRating">5</span> stars -

  <b>"<span property="name">A masterpiece of literature</span>"</b>

  by <span property="author">John Doe</span>,

  Written on <meta property="datePublished" content="2006-05-04">May 4, 2006

  <span property="reviewBody">I really enjoyed this book. It captures the essential

  challenge people face as they try make sense of their lives and grow to adulthood.</span>

</div>

<div property="review" typeof="Review">

  <span property="reviewRating">4</span> stars -

  <b>"<span property="name">A good read.</span>" </b>

  by <span property="author">Bob Smith</span>,

  Written on <meta property="datePublished" content="2006-06-15">June 15, 2006

  <span property="reviewBody">Catcher in the Rye is a fun book. It's a good book to read.</span>

</div>

</div>

...

</body>
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

{

  "@context": "https://schema.org",

  "@type": "WebPage",

  "breadcrumb": "Books > Literature & Fiction > Classics",

  "mainEntity":{

    "@type": "Book",

    "author": "/author/jd_salinger.html",

    "bookFormat": "https://schema.org/Paperback",

    "datePublished": "1991-05-01",

    "image": "catcher-in-the-rye-book-cover.jpg",

    "inLanguage": "English",

    "isbn": "0316769487",

    "name": "The Catcher in the Rye",

    "numberOfPages": "224",

    "offers": {

      "@type": "Offer",

      "availability": "https://schema.org/InStock",

      "price": "6.99",

      "priceCurrency": "USD"

    },

    "publisher": "Little, Brown, and Company",

    "aggregateRating": {

      "@type": "AggregateRating",

      "ratingValue": "4",

      "reviewCount": "3077"

    },

    "review": [\
\
      {\
\
        "@type": "Review",\
\
        "author": "John Doe",\
\
        "datePublished": "2006-05-04",\
\
        "name": "A masterpiece of literature",\
\
        "reviewBody": "I really enjoyed this book. It captures the essential challenge people face as they try make sense of their lives and grow to adulthood.",\
\
        "reviewRating": {\
\
            "@type": "Rating",\
\
            "ratingValue": "5"\
\
           }\
\
      },\
\
      {\
\
        "@type": "Review",\
\
        "author": "Bob Smith",\
\
        "datePublished": "2006-06-15",\
\
        "name": "A good read.",\
\
        "reviewBody": "Catcher in the Rye is a fun book. It's a good book to read.",\
\
        "reviewRating": "4"\
\
      }\
\
    ]

    }

}

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org",
"@type": "WebPage",
"breadcrumb": "Books > Literature & Fiction > Classics",
"mainEntity":{
"@type": "Book",
"author": "/author/jd\_salinger.html",
"bookFormat": "https://schema.org/Paperback",
"datePublished": "1991-05-01",
"image": "catcher-in-the-rye-book-cover.jpg",
"inLanguage": "English",
"isbn": "0316769487",
"name": "The Catcher in the Rye",
"numberOfPages": "224",
"offers": {
"@type": "Offer",
"availability": "https://schema.org/InStock",
"price": "6.99",
"priceCurrency": "USD"
},
"publisher": "Little, Brown, and Company",
"aggregateRating": {
"@type": "AggregateRating",
"ratingValue": "4",
"reviewCount": "3077"
},
"review": \[\
{\
"@type": "Review",\
"author": "John Doe",\
"datePublished": "2006-05-04",\
"name": "A masterpiece of literature",\
"reviewBody": "I really enjoyed this book. It captures the essential challenge people face as they try make sense of their lives and grow to adulthood.",\
"reviewRating": {\
"@type": "Rating",\
"ratingValue": "5"\
}\
},\
{\
"@type": "Review",\
"author": "Bob Smith",\
"datePublished": "2006-06-15",\
"name": "A good read.",\
"reviewBody": "Catcher in the Rye is a fun book. It's a good book to read.",\
"reviewRating": "4"\
}\
\]
}
}

![Copy to clipboard](https://schema.org/docs/clipboard/clippy.svg)[Example 11](https://schema.org/CreativeWork#eg-0465 "Link: #eg-0465")

Copied

No MarkupJSON-LDStructure

Example notes or example HTML without markup.

```html
Example of Job markup for experience standing in place of formal qualifications.
```

Example encoded as [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) in a HTML script tag.

```html
<script type="application/ld+json">

{

  "@context": "https://schema.org/",

  "@type": "JobPosting",

  "title": "Software Engineer",

  "educationRequirements": {

    "@type": "EducationalOccupationalCredential",

    "credentialCategory": "bachelor degree"

  },

  "experienceRequirements": {

    "@type": "OccupationalExperienceRequirements",

    "monthsOfExperience": "60"

  },

  "experienceInPlaceOfEducation": true

}

</script>
```

Structured representation of the JSON-LD example.

{
"@context": "https://schema.org/",
"@type": "JobPosting",
"title": "Software Engineer",
"educationRequirements": {
"@type": "EducationalOccupationalCredential",
"credentialCategory": "bachelor degree"
},
"experienceRequirements": {
"@type": "OccupationalExperienceRequirements",
"monthsOfExperience": "60"
},
"experienceInPlaceOfEducation": true
}

|     |     |
| --- | --- |
|  |  |
