---
url: https://docs.searxng.org/dev/result_types/main_result.html
retrieved: 2026-09-30
command: http-keyless scrape https://docs.searxng.org/dev/result_types/main_result.html
statusCode: 200
transport: http-keyless
completeness: full
title: Main Search Results - SearXNG Documentation (2026.9.30+a9d990033)
---
# Main Search Results[¶](#main-search-results)

 In the [area main results](index.html#area-main-results) the results that a search engine has found for
the search term are displayed.

 There is still no typing for all items in the [Main Result List](../templates.html#main-result-list). The
following types have been implemented so far ..




- [Main Results](main/mainresult.html)
 [MainResult](main/mainresult.html#searx.result_types._base.MainResult)



- [Key-Value Results](main/keyvalue.html)
 [KeyValue](main/keyvalue.html#searx.result_types.keyvalue.KeyValue)



- [Code Results](main/code.html)
 [Code](main/code.html#searx.result_types.code.Code)



- [Paper Results](main/paper.html)
 [Paper](main/paper.html#searx.result_types.paper.Paper)



- [File Results](main/file.html)
 [File](main/file.html#searx.result_types.file.File)



- [Image Results](main/image.html)
 [Image](main/image.html#searx.result_types.image.Image)

- [ImageRef](main/image.html#searx.result_types.image.ImageRef)



- [Video Results](main/video.html)
 [Video](main/video.html#searx.result_types.video.Video)



 The [LegacyResult](base_result.html#legacyresult) is used internally for the results that
have not yet been typed. The templates can be used as orientation until the
final typing is complete.



- [default.html](../templates.html#template-default) / ` Result `

- [torrent.html](../templates.html#template-torrent)

- [map.html](../templates.html#template-map)

- [packages](../templates.html#template-packages)

- [products.html](../templates.html#template-products)
