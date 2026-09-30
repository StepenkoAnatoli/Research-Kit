---
url: https://docs.searxng.org/dev/result_types/main/mainresult.html
retrieved: 2026-09-30
command: http-keyless scrape https://docs.searxng.org/dev/result_types/main/mainresult.html
statusCode: 200
transport: http-keyless
completeness: full
title: Main Results - SearXNG Documentation (2026.9.30+a9d990033)
---
# Main Results[¶](#main-results)



 class searx.result_types._base. MainResult ( * template : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = 'default.html' *, * title : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * content : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * img_src : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * iframe_src : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * audio_src : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * thumbnail : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * publishedDate : [datetime](https://docs.python.org/3/library/datetime.html#datetime.datetime) | [None](https://docs.python.org/3/builtins/constants.html#None) = None *, * pubdate : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * length : [timedelta](https://docs.python.org/3/library/datetime.html#datetime.timedelta) | [None](https://docs.python.org/3/builtins/constants.html#None) = None *, * views : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * author : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * metadata : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * priority : Literal['' *, * 'high' *, * 'low'] = '' *, * engines : [set](https://docs.python.org/3/builtins/stdtypes.html#set) [ [str](https://docs.python.org/3/builtins/stdtypes.html#str) ] = <factory> *, * open_group : [bool](https://docs.python.org/3/builtins/functions.html#bool) = False *, * close_group : [bool](https://docs.python.org/3/builtins/functions.html#bool) = False *, * positions : [list](https://docs.python.org/3/builtins/stdtypes.html#list) [ [int](https://docs.python.org/3/builtins/functions.html#int) ] = <factory> *, * score : [float](https://docs.python.org/3/builtins/functions.html#float) = 0 *, * category : [str](https://docs.python.org/3/builtins/stdtypes.html#str) = '' *, * * *, * url : [str](https://docs.python.org/3/builtins/stdtypes.html#str) | [None](https://docs.python.org/3/builtins/constants.html#None) = None *, * engine : [str](https://docs.python.org/3/builtins/stdtypes.html#str) | [None](https://docs.python.org/3/builtins/constants.html#None) = '' *, * parsed_url : [ParseResult](https://docs.python.org/3/library/urllib.parse.html#urllib.parse.ParseResult) | [None](https://docs.python.org/3/builtins/constants.html#None) = None * ) [[source]](../../../_modules/searx/result_types/_base.html#MainResult)[¶](#searx.result_types._base.MainResult)
 Base class of all result types displayed in [area main results](../index.html#area-main-results).



 template : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.template)
 Name of the template used to render the result.

 By default [result_templates/default.html](https://github.com/searxng/searxng/blob/master/searx/templates/simple/result_templates/default.html) is used.





 title : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.title)
 Link title of the result item.





 content : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.content)
 Extract or description of the result item





 img_src : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.img_src)
 URL of a image that is displayed in the result item.





 iframe_src : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.iframe_src)
 URL of an embedded ` <iframe> ` / the frame is collapsible.

 To convert a standard video URL from a widely know video services into its
embed format, have a look at [searx.utils.get_embedded_stream_url](../../../src/searx.utils.html#searx.utils.get_embedded_stream_url).





 audio_src : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.audio_src)
 URL of an embedded ` <audio controls> `.





 thumbnail : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.thumbnail)
 URL of a thumbnail that is displayed in the result item.





 publishedDate : [datetime](https://docs.python.org/3/library/datetime.html#datetime.datetime) | [None](https://docs.python.org/3/builtins/constants.html#None) [¶](#searx.result_types._base.MainResult.publishedDate)
 The date on which the object was published.





 pubdate : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.pubdate)
 String representation of [MainResult.publishedDate](#searx.result_types._base.MainResult.publishedDate)

 Deprecated: it is still partially used in the templates, but will one day be
completely eliminated.





 length : [timedelta](https://docs.python.org/3/library/datetime.html#datetime.timedelta) | [None](https://docs.python.org/3/builtins/constants.html#None) [¶](#searx.result_types._base.MainResult.length)
 Playing duration in seconds.





 views : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.views)
 View count in humanized number format.





 author : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.author)
 Author of the title.





 metadata : [str](https://docs.python.org/3/builtins/stdtypes.html#str) [¶](#searx.result_types._base.MainResult.metadata)
 Miscellaneous metadata.





 priority : [Literal](https://docs.python.org/3/library/typing.html#typing.Literal) [ '' , 'high' , 'low' ] [¶](#searx.result_types._base.MainResult.priority)
 The priority can be set via [Hostnames](../../plugins/hostnames.html#hostnames-plugin), for example.





 engines : [set](https://docs.python.org/3/builtins/stdtypes.html#set) [ [str](https://docs.python.org/3/builtins/stdtypes.html#str) ] [¶](#searx.result_types._base.MainResult.engines)
 In a merged results list, the names of the engines that found this result
are listed in this field.





 normalize_result_fields ( ) [[source]](../../../_modules/searx/result_types/_base.html#MainResult.normalize_result_fields)[¶](#searx.result_types._base.MainResult.normalize_result_fields)
 Normalize fields ` url ` and ` parse_sql `.



- If field ` url ` is set and field ` parse_url ` is unset, init
` parse_url ` from field ` url `. The ` url ` field is initialized
with the resulting value in ` parse_url `, if ` url ` and
` parse_url ` are not equal.
