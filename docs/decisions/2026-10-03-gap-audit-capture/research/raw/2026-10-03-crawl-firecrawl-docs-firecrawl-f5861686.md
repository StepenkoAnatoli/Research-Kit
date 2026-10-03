---
url: https://docs.firecrawl.dev/api-reference/endpoint/crawl-post
retrieved: 2026-10-03
command: firecrawl scrape https://docs.firecrawl.dev/api-reference/endpoint/crawl-post --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Crawl - Firecrawl Docs
---
> ## Documentation Index
>
> Fetch the complete documentation index at: [/llms.txt](https://docs.firecrawl.dev/llms.txt)
>
> Use this file to discover all available pages before exploring further.

[Skip to main content](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#content-area)

Crawl multiple URLs based on options

cURL

```
curl --request POST \
  --url https://api.firecrawl.dev/v2/crawl \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '
{
  "url": "<string>",
  "prompt": "<string>",
  "excludePaths": [\
    "<string>"\
  ],
  "includePaths": [\
    "<string>"\
  ],
  "maxDiscoveryDepth": 123,
  "sitemap": "include",
  "ignoreQueryParameters": false,
  "regexOnFullURL": false,
  "limit": 10000,
  "crawlEntireDomain": false,
  "allowExternalLinks": false,
  "allowSubdomains": false,
  "ignoreRobotsTxt": false,
  "robotsUserAgent": "<string>",
  "delay": 123,
  "maxConcurrency": 123,
  "scrapeOptions": {
    "formats": [\
      "markdown"\
    ],
    "onlyMainContent": true,
    "onlyCleanContent": false,
    "includeTags": [\
      "<string>"\
    ],
    "excludeTags": [\
      "<string>"\
    ],
    "maxAge": 172800000,
    "minAge": 123,
    "headers": {},
    "waitFor": 0,
    "mobile": false,
    "skipTlsVerification": true,
    "timeout": 60000,
    "parsers": [\
      "pdf"\
    ],
    "actions": [\
      {\
        "type": "wait",\
        "milliseconds": 2\
      }\
    ],
    "location": {
      "country": "US",
      "languages": [\
        "en-US"\
      ]
    },
    "removeBase64Images": true,
    "blockAds": true,
    "proxy": "auto",
    "storeInCache": true,
    "lockdown": false,
    "redactPII": false,
    "threatProtection": {
      "riskScoreThreshold": 75,
      "blacklist": [\
        "<string>"\
      ],
      "whitelist": [\
        "<string>"\
      ],
      "blockedTlds": [\
        "<string>"\
      ]
    },
    "profile": {
      "saveChanges": true
    }
  },
  "zeroDataRetention": false
}
'
```

```
import requests

url = "https://api.firecrawl.dev/v2/crawl"

payload = {
    "url": "<string>",
    "prompt": "<string>",
    "excludePaths": ["<string>"],
    "includePaths": ["<string>"],
    "maxDiscoveryDepth": 123,
    "sitemap": "include",
    "ignoreQueryParameters": False,
    "regexOnFullURL": False,
    "limit": 10000,
    "crawlEntireDomain": False,
    "allowExternalLinks": False,
    "allowSubdomains": False,
    "ignoreRobotsTxt": False,
    "robotsUserAgent": "<string>",
    "delay": 123,
    "maxConcurrency": 123,
    "scrapeOptions": {
        "formats": ["markdown"],
        "onlyMainContent": True,
        "onlyCleanContent": False,
        "includeTags": ["<string>"],
        "excludeTags": ["<string>"],
        "maxAge": 172800000,
        "minAge": 123,
        "headers": {},
        "waitFor": 0,
        "mobile": False,
        "skipTlsVerification": True,
        "timeout": 60000,
        "parsers": ["pdf"],
        "actions": [\
            {\
                "type": "wait",\
                "milliseconds": 2\
            }\
        ],
        "location": {
            "country": "US",
            "languages": ["en-US"]
        },
        "removeBase64Images": True,
        "blockAds": True,
        "proxy": "auto",
        "storeInCache": True,
        "lockdown": False,
        "redactPII": False,
        "threatProtection": {
            "riskScoreThreshold": 75,
            "blacklist": ["<string>"],
            "whitelist": ["<string>"],
            "blockedTlds": ["<string>"]
        },
        "profile": { "saveChanges": True }
    },
    "zeroDataRetention": False
}
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print(response.text)
```

```
const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
  body: JSON.stringify({
    url: '<string>',
    prompt: '<string>',
    excludePaths: ['<string>'],
    includePaths: ['<string>'],
    maxDiscoveryDepth: 123,
    sitemap: 'include',
    ignoreQueryParameters: false,
    regexOnFullURL: false,
    limit: 10000,
    crawlEntireDomain: false,
    allowExternalLinks: false,
    allowSubdomains: false,
    ignoreRobotsTxt: false,
    robotsUserAgent: '<string>',
    delay: 123,
    maxConcurrency: 123,
    scrapeOptions: {
      formats: ['markdown'],
      onlyMainContent: true,
      onlyCleanContent: false,
      includeTags: ['<string>'],
      excludeTags: ['<string>'],
      maxAge: 172800000,
      minAge: 123,
      headers: {},
      waitFor: 0,
      mobile: false,
      skipTlsVerification: true,
      timeout: 60000,
      parsers: ['pdf'],
      actions: [{type: 'wait', milliseconds: 2}],
      location: {country: 'US', languages: ['en-US']},
      removeBase64Images: true,
      blockAds: true,
      proxy: 'auto',
      storeInCache: true,
      lockdown: false,
      redactPII: false,
      threatProtection: {
        riskScoreThreshold: 75,
        blacklist: ['<string>'],
        whitelist: ['<string>'],
        blockedTlds: ['<string>']
      },
      profile: {saveChanges: true}
    },
    zeroDataRetention: false
  })
};

fetch('https://api.firecrawl.dev/v2/crawl', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [\
  CURLOPT_URL => "https://api.firecrawl.dev/v2/crawl",\
  CURLOPT_RETURNTRANSFER => true,\
  CURLOPT_ENCODING => "",\
  CURLOPT_MAXREDIRS => 10,\
  CURLOPT_TIMEOUT => 30,\
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,\
  CURLOPT_CUSTOMREQUEST => "POST",\
  CURLOPT_POSTFIELDS => json_encode([\
    'url' => '<string>',\
    'prompt' => '<string>',\
    'excludePaths' => [\
        '<string>'\
    ],\
    'includePaths' => [\
        '<string>'\
    ],\
    'maxDiscoveryDepth' => 123,\
    'sitemap' => 'include',\
    'ignoreQueryParameters' => false,\
    'regexOnFullURL' => false,\
    'limit' => 10000,\
    'crawlEntireDomain' => false,\
    'allowExternalLinks' => false,\
    'allowSubdomains' => false,\
    'ignoreRobotsTxt' => false,\
    'robotsUserAgent' => '<string>',\
    'delay' => 123,\
    'maxConcurrency' => 123,\
    'scrapeOptions' => [\
        'formats' => [\
                'markdown'\
        ],\
        'onlyMainContent' => true,\
        'onlyCleanContent' => false,\
        'includeTags' => [\
                '<string>'\
        ],\
        'excludeTags' => [\
                '<string>'\
        ],\
        'maxAge' => 172800000,\
        'minAge' => 123,\
        'headers' => [\
\
        ],\
        'waitFor' => 0,\
        'mobile' => false,\
        'skipTlsVerification' => true,\
        'timeout' => 60000,\
        'parsers' => [\
                'pdf'\
        ],\
        'actions' => [\
                [\
                                'type' => 'wait',\
                                'milliseconds' => 2\
                ]\
        ],\
        'location' => [\
                'country' => 'US',\
                'languages' => [\
                                'en-US'\
                ]\
        ],\
        'removeBase64Images' => true,\
        'blockAds' => true,\
        'proxy' => 'auto',\
        'storeInCache' => true,\
        'lockdown' => false,\
        'redactPII' => false,\
        'threatProtection' => [\
                'riskScoreThreshold' => 75,\
                'blacklist' => [\
                                '<string>'\
                ],\
                'whitelist' => [\
                                '<string>'\
                ],\
                'blockedTlds' => [\
                                '<string>'\
                ]\
        ],\
        'profile' => [\
                'saveChanges' => true\
        ]\
    ],\
    'zeroDataRetention' => false\
  ]),\
  CURLOPT_HTTPHEADER => [\
    "Authorization: Bearer <token>",\
    "Content-Type: application/json"\
  ],\
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
```

```
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.firecrawl.dev/v2/crawl"

	payload := strings.NewReader("{\n  \"url\": \"<string>\",\n  \"prompt\": \"<string>\",\n  \"excludePaths\": [\n    \"<string>\"\n  ],\n  \"includePaths\": [\n    \"<string>\"\n  ],\n  \"maxDiscoveryDepth\": 123,\n  \"sitemap\": \"include\",\n  \"ignoreQueryParameters\": false,\n  \"regexOnFullURL\": false,\n  \"limit\": 10000,\n  \"crawlEntireDomain\": false,\n  \"allowExternalLinks\": false,\n  \"allowSubdomains\": false,\n  \"ignoreRobotsTxt\": false,\n  \"robotsUserAgent\": \"<string>\",\n  \"delay\": 123,\n  \"maxConcurrency\": 123,\n  \"scrapeOptions\": {\n    \"formats\": [\n      \"markdown\"\n    ],\n    \"onlyMainContent\": true,\n    \"onlyCleanContent\": false,\n    \"includeTags\": [\n      \"<string>\"\n    ],\n    \"excludeTags\": [\n      \"<string>\"\n    ],\n    \"maxAge\": 172800000,\n    \"minAge\": 123,\n    \"headers\": {},\n    \"waitFor\": 0,\n    \"mobile\": false,\n    \"skipTlsVerification\": true,\n    \"timeout\": 60000,\n    \"parsers\": [\n      \"pdf\"\n    ],\n    \"actions\": [\n      {\n        \"type\": \"wait\",\n        \"milliseconds\": 2\n      }\n    ],\n    \"location\": {\n      \"country\": \"US\",\n      \"languages\": [\n        \"en-US\"\n      ]\n    },\n    \"removeBase64Images\": true,\n    \"blockAds\": true,\n    \"proxy\": \"auto\",\n    \"storeInCache\": true,\n    \"lockdown\": false,\n    \"redactPII\": false,\n    \"threatProtection\": {\n      \"riskScoreThreshold\": 75,\n      \"blacklist\": [\n        \"<string>\"\n      ],\n      \"whitelist\": [\n        \"<string>\"\n      ],\n      \"blockedTlds\": [\n        \"<string>\"\n      ]\n    },\n    \"profile\": {\n      \"saveChanges\": true\n    }\n  },\n  \"zeroDataRetention\": false\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Authorization", "Bearer <token>")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.post("https://api.firecrawl.dev/v2/crawl")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/json")
  .body("{\n  \"url\": \"<string>\",\n  \"prompt\": \"<string>\",\n  \"excludePaths\": [\n    \"<string>\"\n  ],\n  \"includePaths\": [\n    \"<string>\"\n  ],\n  \"maxDiscoveryDepth\": 123,\n  \"sitemap\": \"include\",\n  \"ignoreQueryParameters\": false,\n  \"regexOnFullURL\": false,\n  \"limit\": 10000,\n  \"crawlEntireDomain\": false,\n  \"allowExternalLinks\": false,\n  \"allowSubdomains\": false,\n  \"ignoreRobotsTxt\": false,\n  \"robotsUserAgent\": \"<string>\",\n  \"delay\": 123,\n  \"maxConcurrency\": 123,\n  \"scrapeOptions\": {\n    \"formats\": [\n      \"markdown\"\n    ],\n    \"onlyMainContent\": true,\n    \"onlyCleanContent\": false,\n    \"includeTags\": [\n      \"<string>\"\n    ],\n    \"excludeTags\": [\n      \"<string>\"\n    ],\n    \"maxAge\": 172800000,\n    \"minAge\": 123,\n    \"headers\": {},\n    \"waitFor\": 0,\n    \"mobile\": false,\n    \"skipTlsVerification\": true,\n    \"timeout\": 60000,\n    \"parsers\": [\n      \"pdf\"\n    ],\n    \"actions\": [\n      {\n        \"type\": \"wait\",\n        \"milliseconds\": 2\n      }\n    ],\n    \"location\": {\n      \"country\": \"US\",\n      \"languages\": [\n        \"en-US\"\n      ]\n    },\n    \"removeBase64Images\": true,\n    \"blockAds\": true,\n    \"proxy\": \"auto\",\n    \"storeInCache\": true,\n    \"lockdown\": false,\n    \"redactPII\": false,\n    \"threatProtection\": {\n      \"riskScoreThreshold\": 75,\n      \"blacklist\": [\n        \"<string>\"\n      ],\n      \"whitelist\": [\n        \"<string>\"\n      ],\n      \"blockedTlds\": [\n        \"<string>\"\n      ]\n    },\n    \"profile\": {\n      \"saveChanges\": true\n    }\n  },\n  \"zeroDataRetention\": false\n}")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.firecrawl.dev/v2/crawl")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"url\": \"<string>\",\n  \"prompt\": \"<string>\",\n  \"excludePaths\": [\n    \"<string>\"\n  ],\n  \"includePaths\": [\n    \"<string>\"\n  ],\n  \"maxDiscoveryDepth\": 123,\n  \"sitemap\": \"include\",\n  \"ignoreQueryParameters\": false,\n  \"regexOnFullURL\": false,\n  \"limit\": 10000,\n  \"crawlEntireDomain\": false,\n  \"allowExternalLinks\": false,\n  \"allowSubdomains\": false,\n  \"ignoreRobotsTxt\": false,\n  \"robotsUserAgent\": \"<string>\",\n  \"delay\": 123,\n  \"maxConcurrency\": 123,\n  \"scrapeOptions\": {\n    \"formats\": [\n      \"markdown\"\n    ],\n    \"onlyMainContent\": true,\n    \"onlyCleanContent\": false,\n    \"includeTags\": [\n      \"<string>\"\n    ],\n    \"excludeTags\": [\n      \"<string>\"\n    ],\n    \"maxAge\": 172800000,\n    \"minAge\": 123,\n    \"headers\": {},\n    \"waitFor\": 0,\n    \"mobile\": false,\n    \"skipTlsVerification\": true,\n    \"timeout\": 60000,\n    \"parsers\": [\n      \"pdf\"\n    ],\n    \"actions\": [\n      {\n        \"type\": \"wait\",\n        \"milliseconds\": 2\n      }\n    ],\n    \"location\": {\n      \"country\": \"US\",\n      \"languages\": [\n        \"en-US\"\n      ]\n    },\n    \"removeBase64Images\": true,\n    \"blockAds\": true,\n    \"proxy\": \"auto\",\n    \"storeInCache\": true,\n    \"lockdown\": false,\n    \"redactPII\": false,\n    \"threatProtection\": {\n      \"riskScoreThreshold\": 75,\n      \"blacklist\": [\n        \"<string>\"\n      ],\n      \"whitelist\": [\n        \"<string>\"\n      ],\n      \"blockedTlds\": [\n        \"<string>\"\n      ]\n    },\n    \"profile\": {\n      \"saveChanges\": true\n    }\n  },\n  \"zeroDataRetention\": false\n}"

response = http.request(request)
puts response.read_body
```

200

402

429

500

```
{
  "success": true,
  "id": "<string>",
  "url": "<string>"
}
```

```
{
  "error": "Payment required to access this resource."
}
```

```
{
  "error": "Request rate limit exceeded. Please wait and try again later."
}
```

```
{
  "error": "An unexpected error occurred on the server."
}
```

POST

/

crawl

Try it

Crawl multiple URLs based on options

cURL

```
curl --request POST \
  --url https://api.firecrawl.dev/v2/crawl \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '
{
  "url": "<string>",
  "prompt": "<string>",
  "excludePaths": [\
    "<string>"\
  ],
  "includePaths": [\
    "<string>"\
  ],
  "maxDiscoveryDepth": 123,
  "sitemap": "include",
  "ignoreQueryParameters": false,
  "regexOnFullURL": false,
  "limit": 10000,
  "crawlEntireDomain": false,
  "allowExternalLinks": false,
  "allowSubdomains": false,
  "ignoreRobotsTxt": false,
  "robotsUserAgent": "<string>",
  "delay": 123,
  "maxConcurrency": 123,
  "scrapeOptions": {
    "formats": [\
      "markdown"\
    ],
    "onlyMainContent": true,
    "onlyCleanContent": false,
    "includeTags": [\
      "<string>"\
    ],
    "excludeTags": [\
      "<string>"\
    ],
    "maxAge": 172800000,
    "minAge": 123,
    "headers": {},
    "waitFor": 0,
    "mobile": false,
    "skipTlsVerification": true,
    "timeout": 60000,
    "parsers": [\
      "pdf"\
    ],
    "actions": [\
      {\
        "type": "wait",\
        "milliseconds": 2\
      }\
    ],
    "location": {
      "country": "US",
      "languages": [\
        "en-US"\
      ]
    },
    "removeBase64Images": true,
    "blockAds": true,
    "proxy": "auto",
    "storeInCache": true,
    "lockdown": false,
    "redactPII": false,
    "threatProtection": {
      "riskScoreThreshold": 75,
      "blacklist": [\
        "<string>"\
      ],
      "whitelist": [\
        "<string>"\
      ],
      "blockedTlds": [\
        "<string>"\
      ]
    },
    "profile": {
      "saveChanges": true
    }
  },
  "zeroDataRetention": false
}
'
```

```
import requests

url = "https://api.firecrawl.dev/v2/crawl"

payload = {
    "url": "<string>",
    "prompt": "<string>",
    "excludePaths": ["<string>"],
    "includePaths": ["<string>"],
    "maxDiscoveryDepth": 123,
    "sitemap": "include",
    "ignoreQueryParameters": False,
    "regexOnFullURL": False,
    "limit": 10000,
    "crawlEntireDomain": False,
    "allowExternalLinks": False,
    "allowSubdomains": False,
    "ignoreRobotsTxt": False,
    "robotsUserAgent": "<string>",
    "delay": 123,
    "maxConcurrency": 123,
    "scrapeOptions": {
        "formats": ["markdown"],
        "onlyMainContent": True,
        "onlyCleanContent": False,
        "includeTags": ["<string>"],
        "excludeTags": ["<string>"],
        "maxAge": 172800000,
        "minAge": 123,
        "headers": {},
        "waitFor": 0,
        "mobile": False,
        "skipTlsVerification": True,
        "timeout": 60000,
        "parsers": ["pdf"],
        "actions": [\
            {\
                "type": "wait",\
                "milliseconds": 2\
            }\
        ],
        "location": {
            "country": "US",
            "languages": ["en-US"]
        },
        "removeBase64Images": True,
        "blockAds": True,
        "proxy": "auto",
        "storeInCache": True,
        "lockdown": False,
        "redactPII": False,
        "threatProtection": {
            "riskScoreThreshold": 75,
            "blacklist": ["<string>"],
            "whitelist": ["<string>"],
            "blockedTlds": ["<string>"]
        },
        "profile": { "saveChanges": True }
    },
    "zeroDataRetention": False
}
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print(response.text)
```

```
const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
  body: JSON.stringify({
    url: '<string>',
    prompt: '<string>',
    excludePaths: ['<string>'],
    includePaths: ['<string>'],
    maxDiscoveryDepth: 123,
    sitemap: 'include',
    ignoreQueryParameters: false,
    regexOnFullURL: false,
    limit: 10000,
    crawlEntireDomain: false,
    allowExternalLinks: false,
    allowSubdomains: false,
    ignoreRobotsTxt: false,
    robotsUserAgent: '<string>',
    delay: 123,
    maxConcurrency: 123,
    scrapeOptions: {
      formats: ['markdown'],
      onlyMainContent: true,
      onlyCleanContent: false,
      includeTags: ['<string>'],
      excludeTags: ['<string>'],
      maxAge: 172800000,
      minAge: 123,
      headers: {},
      waitFor: 0,
      mobile: false,
      skipTlsVerification: true,
      timeout: 60000,
      parsers: ['pdf'],
      actions: [{type: 'wait', milliseconds: 2}],
      location: {country: 'US', languages: ['en-US']},
      removeBase64Images: true,
      blockAds: true,
      proxy: 'auto',
      storeInCache: true,
      lockdown: false,
      redactPII: false,
      threatProtection: {
        riskScoreThreshold: 75,
        blacklist: ['<string>'],
        whitelist: ['<string>'],
        blockedTlds: ['<string>']
      },
      profile: {saveChanges: true}
    },
    zeroDataRetention: false
  })
};

fetch('https://api.firecrawl.dev/v2/crawl', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [\
  CURLOPT_URL => "https://api.firecrawl.dev/v2/crawl",\
  CURLOPT_RETURNTRANSFER => true,\
  CURLOPT_ENCODING => "",\
  CURLOPT_MAXREDIRS => 10,\
  CURLOPT_TIMEOUT => 30,\
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,\
  CURLOPT_CUSTOMREQUEST => "POST",\
  CURLOPT_POSTFIELDS => json_encode([\
    'url' => '<string>',\
    'prompt' => '<string>',\
    'excludePaths' => [\
        '<string>'\
    ],\
    'includePaths' => [\
        '<string>'\
    ],\
    'maxDiscoveryDepth' => 123,\
    'sitemap' => 'include',\
    'ignoreQueryParameters' => false,\
    'regexOnFullURL' => false,\
    'limit' => 10000,\
    'crawlEntireDomain' => false,\
    'allowExternalLinks' => false,\
    'allowSubdomains' => false,\
    'ignoreRobotsTxt' => false,\
    'robotsUserAgent' => '<string>',\
    'delay' => 123,\
    'maxConcurrency' => 123,\
    'scrapeOptions' => [\
        'formats' => [\
                'markdown'\
        ],\
        'onlyMainContent' => true,\
        'onlyCleanContent' => false,\
        'includeTags' => [\
                '<string>'\
        ],\
        'excludeTags' => [\
                '<string>'\
        ],\
        'maxAge' => 172800000,\
        'minAge' => 123,\
        'headers' => [\
\
        ],\
        'waitFor' => 0,\
        'mobile' => false,\
        'skipTlsVerification' => true,\
        'timeout' => 60000,\
        'parsers' => [\
                'pdf'\
        ],\
        'actions' => [\
                [\
                                'type' => 'wait',\
                                'milliseconds' => 2\
                ]\
        ],\
        'location' => [\
                'country' => 'US',\
                'languages' => [\
                                'en-US'\
                ]\
        ],\
        'removeBase64Images' => true,\
        'blockAds' => true,\
        'proxy' => 'auto',\
        'storeInCache' => true,\
        'lockdown' => false,\
        'redactPII' => false,\
        'threatProtection' => [\
                'riskScoreThreshold' => 75,\
                'blacklist' => [\
                                '<string>'\
                ],\
                'whitelist' => [\
                                '<string>'\
                ],\
                'blockedTlds' => [\
                                '<string>'\
                ]\
        ],\
        'profile' => [\
                'saveChanges' => true\
        ]\
    ],\
    'zeroDataRetention' => false\
  ]),\
  CURLOPT_HTTPHEADER => [\
    "Authorization: Bearer <token>",\
    "Content-Type: application/json"\
  ],\
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
```

```
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.firecrawl.dev/v2/crawl"

	payload := strings.NewReader("{\n  \"url\": \"<string>\",\n  \"prompt\": \"<string>\",\n  \"excludePaths\": [\n    \"<string>\"\n  ],\n  \"includePaths\": [\n    \"<string>\"\n  ],\n  \"maxDiscoveryDepth\": 123,\n  \"sitemap\": \"include\",\n  \"ignoreQueryParameters\": false,\n  \"regexOnFullURL\": false,\n  \"limit\": 10000,\n  \"crawlEntireDomain\": false,\n  \"allowExternalLinks\": false,\n  \"allowSubdomains\": false,\n  \"ignoreRobotsTxt\": false,\n  \"robotsUserAgent\": \"<string>\",\n  \"delay\": 123,\n  \"maxConcurrency\": 123,\n  \"scrapeOptions\": {\n    \"formats\": [\n      \"markdown\"\n    ],\n    \"onlyMainContent\": true,\n    \"onlyCleanContent\": false,\n    \"includeTags\": [\n      \"<string>\"\n    ],\n    \"excludeTags\": [\n      \"<string>\"\n    ],\n    \"maxAge\": 172800000,\n    \"minAge\": 123,\n    \"headers\": {},\n    \"waitFor\": 0,\n    \"mobile\": false,\n    \"skipTlsVerification\": true,\n    \"timeout\": 60000,\n    \"parsers\": [\n      \"pdf\"\n    ],\n    \"actions\": [\n      {\n        \"type\": \"wait\",\n        \"milliseconds\": 2\n      }\n    ],\n    \"location\": {\n      \"country\": \"US\",\n      \"languages\": [\n        \"en-US\"\n      ]\n    },\n    \"removeBase64Images\": true,\n    \"blockAds\": true,\n    \"proxy\": \"auto\",\n    \"storeInCache\": true,\n    \"lockdown\": false,\n    \"redactPII\": false,\n    \"threatProtection\": {\n      \"riskScoreThreshold\": 75,\n      \"blacklist\": [\n        \"<string>\"\n      ],\n      \"whitelist\": [\n        \"<string>\"\n      ],\n      \"blockedTlds\": [\n        \"<string>\"\n      ]\n    },\n    \"profile\": {\n      \"saveChanges\": true\n    }\n  },\n  \"zeroDataRetention\": false\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Authorization", "Bearer <token>")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.post("https://api.firecrawl.dev/v2/crawl")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/json")
  .body("{\n  \"url\": \"<string>\",\n  \"prompt\": \"<string>\",\n  \"excludePaths\": [\n    \"<string>\"\n  ],\n  \"includePaths\": [\n    \"<string>\"\n  ],\n  \"maxDiscoveryDepth\": 123,\n  \"sitemap\": \"include\",\n  \"ignoreQueryParameters\": false,\n  \"regexOnFullURL\": false,\n  \"limit\": 10000,\n  \"crawlEntireDomain\": false,\n  \"allowExternalLinks\": false,\n  \"allowSubdomains\": false,\n  \"ignoreRobotsTxt\": false,\n  \"robotsUserAgent\": \"<string>\",\n  \"delay\": 123,\n  \"maxConcurrency\": 123,\n  \"scrapeOptions\": {\n    \"formats\": [\n      \"markdown\"\n    ],\n    \"onlyMainContent\": true,\n    \"onlyCleanContent\": false,\n    \"includeTags\": [\n      \"<string>\"\n    ],\n    \"excludeTags\": [\n      \"<string>\"\n    ],\n    \"maxAge\": 172800000,\n    \"minAge\": 123,\n    \"headers\": {},\n    \"waitFor\": 0,\n    \"mobile\": false,\n    \"skipTlsVerification\": true,\n    \"timeout\": 60000,\n    \"parsers\": [\n      \"pdf\"\n    ],\n    \"actions\": [\n      {\n        \"type\": \"wait\",\n        \"milliseconds\": 2\n      }\n    ],\n    \"location\": {\n      \"country\": \"US\",\n      \"languages\": [\n        \"en-US\"\n      ]\n    },\n    \"removeBase64Images\": true,\n    \"blockAds\": true,\n    \"proxy\": \"auto\",\n    \"storeInCache\": true,\n    \"lockdown\": false,\n    \"redactPII\": false,\n    \"threatProtection\": {\n      \"riskScoreThreshold\": 75,\n      \"blacklist\": [\n        \"<string>\"\n      ],\n      \"whitelist\": [\n        \"<string>\"\n      ],\n      \"blockedTlds\": [\n        \"<string>\"\n      ]\n    },\n    \"profile\": {\n      \"saveChanges\": true\n    }\n  },\n  \"zeroDataRetention\": false\n}")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.firecrawl.dev/v2/crawl")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"url\": \"<string>\",\n  \"prompt\": \"<string>\",\n  \"excludePaths\": [\n    \"<string>\"\n  ],\n  \"includePaths\": [\n    \"<string>\"\n  ],\n  \"maxDiscoveryDepth\": 123,\n  \"sitemap\": \"include\",\n  \"ignoreQueryParameters\": false,\n  \"regexOnFullURL\": false,\n  \"limit\": 10000,\n  \"crawlEntireDomain\": false,\n  \"allowExternalLinks\": false,\n  \"allowSubdomains\": false,\n  \"ignoreRobotsTxt\": false,\n  \"robotsUserAgent\": \"<string>\",\n  \"delay\": 123,\n  \"maxConcurrency\": 123,\n  \"scrapeOptions\": {\n    \"formats\": [\n      \"markdown\"\n    ],\n    \"onlyMainContent\": true,\n    \"onlyCleanContent\": false,\n    \"includeTags\": [\n      \"<string>\"\n    ],\n    \"excludeTags\": [\n      \"<string>\"\n    ],\n    \"maxAge\": 172800000,\n    \"minAge\": 123,\n    \"headers\": {},\n    \"waitFor\": 0,\n    \"mobile\": false,\n    \"skipTlsVerification\": true,\n    \"timeout\": 60000,\n    \"parsers\": [\n      \"pdf\"\n    ],\n    \"actions\": [\n      {\n        \"type\": \"wait\",\n        \"milliseconds\": 2\n      }\n    ],\n    \"location\": {\n      \"country\": \"US\",\n      \"languages\": [\n        \"en-US\"\n      ]\n    },\n    \"removeBase64Images\": true,\n    \"blockAds\": true,\n    \"proxy\": \"auto\",\n    \"storeInCache\": true,\n    \"lockdown\": false,\n    \"redactPII\": false,\n    \"threatProtection\": {\n      \"riskScoreThreshold\": 75,\n      \"blacklist\": [\n        \"<string>\"\n      ],\n      \"whitelist\": [\n        \"<string>\"\n      ],\n      \"blockedTlds\": [\n        \"<string>\"\n      ]\n    },\n    \"profile\": {\n      \"saveChanges\": true\n    }\n  },\n  \"zeroDataRetention\": false\n}"

response = http.request(request)
puts response.read_body
```

200

402

429

500

```
{
  "success": true,
  "id": "<string>",
  "url": "<string>"
}
```

```
{
  "error": "Payment required to access this resource."
}
```

```
{
  "error": "Request rate limit exceeded. Please wait and try again later."
}
```

```
{
  "error": "An unexpected error occurred on the server."
}
```

> Are you an AI agent that needs a Firecrawl API key? See [firecrawl.dev/agent-onboarding/SKILL.md](https://www.firecrawl.dev/agent-onboarding/SKILL.md) for automated onboarding instructions.

#### Authorizations

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#authorization-authorization)

Authorization

string

header

required

Bearer authentication header of the form `Bearer <token>`, where `<token>` is your auth token.

#### Body

application/json

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-url)

url

string<uri>

required

The base URL to start crawling from

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-prompt)

prompt

string

A prompt to use to generate the crawler options (all the parameters below) from natural language. Explicitly set parameters will override the generated equivalents.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-exclude-paths)

excludePaths

string\[\]

URL pathname regex patterns that exclude matching URLs from the crawl. For example, if you set "excludePaths": \["blog/.\*"\] for the base URL firecrawl.dev, any results matching that pattern will be excluded, such as [https://www.firecrawl.dev/blog/firecrawl-launch-week-1-recap](https://www.firecrawl.dev/blog/firecrawl-launch-week-1-recap). Patterns use Rust regex (RE2-style) syntax: look-around and backreferences are not supported, and a pattern that does not compile is rejected with a 400. Each field accepts at most 1000 patterns of at most 2000 characters each, and includePaths and excludePaths together may contain at most 1000 patterns and 100,000 characters in total. For keyword-style filtering, send one short pattern per term rather than combining terms into a single long alternation.

Maximum array length: `1000`

Maximum string length: `2000`

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-include-paths)

includePaths

string\[\]

URL pathname regex patterns that include matching URLs in the crawl. Only the paths that match the specified patterns will be included in the response. Note: the starting URL is also checked against these patterns — if it does not match, the crawl may return 0 pages. For example, if you set "includePaths": \["blog/.\*"\] for the base URL firecrawl.dev/blog, only pages under /blog/ will be included in the results, such as [https://www.firecrawl.dev/blog/firecrawl-launch-week-1-recap](https://www.firecrawl.dev/blog/firecrawl-launch-week-1-recap). Patterns use Rust regex (RE2-style) syntax: look-around and backreferences are not supported, and a pattern that does not compile is rejected with a 400. Each field accepts at most 1000 patterns of at most 2000 characters each, and includePaths and excludePaths together may contain at most 1000 patterns and 100,000 characters in total. For keyword-style filtering, send one short pattern per term rather than combining terms into a single long alternation.

Maximum array length: `1000`

Maximum string length: `2000`

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-max-discovery-depth)

maxDiscoveryDepth

integer

Maximum depth to crawl based on discovery order. The root site and sitemapped pages has a discovery depth of 0. For example, if you set it to 1, and you set `sitemap: 'skip'`, you will only crawl the entered URL and all URLs that are linked on that page.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-sitemap)

sitemap

enum<string>

default:include

Sitemap mode when crawling. If you set it to 'skip', the crawler will ignore the website sitemap and only crawl the entered URL and discover pages from there onwards. If you set it to 'only', the crawler will only crawl URLs from the sitemap (plus the start URL) and will not discover links from HTML.

Available options:

`skip`,

`include`,

`only`

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-ignore-query-parameters)

ignoreQueryParameters

boolean

default:false

Do not re-scrape the same path with different (or none) query parameters

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-regex-on-full-url)

regexOnFullURL

boolean

default:false

When true, includePaths and excludePaths regex patterns are matched against the full URL (including query parameters) instead of just the URL pathname. Useful when you need to filter URLs based on query strings.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-limit)

limit

integer

default:10000

Maximum number of pages to crawl. Default limit is 10000.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-crawl-entire-domain)

crawlEntireDomain

boolean

default:false

Allows the crawler to follow internal links to sibling or parent URLs, not just child paths.

false: Only crawls deeper (child) URLs.
→ e.g. /features/feature-1 → /features/feature-1/tips ✅
→ Won't follow /pricing or / ❌

true: Crawls any internal links, including siblings and parents.
→ e.g. /features/feature-1 → /pricing, /, etc. ✅

Use true for broader internal coverage beyond nested paths.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-allow-external-links)

allowExternalLinks

boolean

default:false

Allows the crawler to follow links to external websites. External links are followed one hop (the links found on those external pages are not crawled). Links pointing to an external site's homepage (a root URL with no path) are skipped and reported in Get Crawl Errors with the code EXTERNAL\_LINK; redirects to an external homepage are skipped for the same reason.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-allow-subdomains)

allowSubdomains

boolean

default:false

Allows the crawler to follow links to subdomains of the main domain.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-ignore-robots-txt)

ignoreRobotsTxt

boolean

default:false

Ignore the website's robots.txt rules. Enterprise only — contact [support@firecrawl.com](mailto:support@firecrawl.com) to enable.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-robots-user-agent)

robotsUserAgent

string

Custom User-Agent string for robots.txt evaluation. When set, robots.txt is fetched with this User-Agent and allow/disallow rules are matched against it instead of the default. Enterprise only — contact [support@firecrawl.com](mailto:support@firecrawl.com) to enable.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-delay)

delay

number

Delay in seconds between scrapes. This helps respect website rate limits. Setting this forces concurrency to 1.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-max-concurrency)

maxConcurrency

integer

Maximum number of concurrent scrapes. This parameter allows you to set a concurrency limit for this crawl. If not specified, the crawl adheres to your team's concurrency limit.

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-webhook)

webhook

object

A webhook specification object.

Showchild attributes

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-scrape-options)

scrapeOptions

object

Showchild attributes

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#body-zero-data-retention)

zeroDataRetention

boolean

default:false

If true, this will enable zero data retention for this crawl. To enable this feature, please contact [help@firecrawl.dev](mailto:help@firecrawl.dev)

#### Response

200

application/json

Successful response

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#response-success)

success

boolean

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#response-id)

id

string

[​](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post#response-url)

url

string<uri>

[Suggest edits](https://github.com/firecrawl/firecrawl-docs/edit/main/api-reference/endpoint/crawl-post.mdx) [Raise issue](https://github.com/firecrawl/firecrawl-docs/issues/new?title=Issue%20on%20docs&body=Path:%20/api-reference/endpoint/crawl-post)

✕

- 👋 Hi! Power AI agents with clean web data!

- I can help with search, scrape, MCP setup, or billing.
