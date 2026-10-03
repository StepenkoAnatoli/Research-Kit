---
url: https://docs.tavily.com/
retrieved: 2026-10-03
command: firecrawl scrape https://docs.tavily.com/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Index - Tavily Docs
---
Please note: This website includes an accessibility system. Press Control-F11 to adjust the website to people with visual disabilities who are using a screen reader; Press Control-F10 to open an accessibility menu.

close

Popup heading

- Press enter for Accessibility for blind people who use screen readers
- Press enter for Keyboard Navigation
- Press enter for Accessibility menu

> ## Documentation Index
>
> Fetch the complete documentation index at: [/llms.txt](https://docs.tavily.com/llms.txt)
>
> Use this file to discover all available pages before exploring further.

[Skip to main content](https://docs.tavily.com/#content-area)

**For AI agents:** Use [llms.txt](https://docs.tavily.com/llms.txt) for a full index of all documentation.

# Build with Tavily

Your journey to state-of-the-art web search starts right here.

### Onboard your agent

Let your coding agent install and configure Tavily for you.

```
Read and execute tavily.com/agent-setup/SKILL.md
```

![](https://mintcdn.com/tavilyai/3kKJpw-1j36_ISJE/images/logos/editors/claude.webp?fit=max&auto=format&n=3kKJpw-1j36_ISJE&q=85&s=ab08b0221f928fc7044b70bde64cbf07)![](https://mintcdn.com/tavilyai/3kKJpw-1j36_ISJE/images/logos/editors/codex.webp?fit=max&auto=format&n=3kKJpw-1j36_ISJE&q=85&s=6fe2f174341bd59c37a60241df2942ef)![](https://mintcdn.com/tavilyai/3kKJpw-1j36_ISJE/images/logos/editors/cursor.webp?fit=max&auto=format&n=3kKJpw-1j36_ISJE&q=85&s=6a935bc875b677457a9c5ffec4194cd3)

Open in

[![](https://mintcdn.com/tavilyai/3kKJpw-1j36_ISJE/images/logos/editors/claude.webp?fit=max&auto=format&n=3kKJpw-1j36_ISJE&q=85&s=ab08b0221f928fc7044b70bde64cbf07)Claude Code](claude-cli://open?q=Read%20and%20execute%20tavily.com%2Fagent-setup%2FSKILL.md) [![](https://mintcdn.com/tavilyai/3kKJpw-1j36_ISJE/images/logos/editors/codex.webp?fit=max&auto=format&n=3kKJpw-1j36_ISJE&q=85&s=6fe2f174341bd59c37a60241df2942ef)Codex](codex://new?prompt=Read%20and%20execute%20tavily.com%2Fagent-setup%2FSKILL.md) [![](https://mintcdn.com/tavilyai/3kKJpw-1j36_ISJE/images/logos/editors/cursor.webp?fit=max&auto=format&n=3kKJpw-1j36_ISJE&q=85&s=6a935bc875b677457a9c5ffec4194cd3)Cursor](cursor://anysphere.cursor-deeplink/prompt?text=Read%20and%20execute%20tavily.com%2Fagent-setup%2FSKILL.md)

[View SKILL.md](https://www.tavily.com/agent-setup/SKILL.md)

### Install the SDK

Add the Tavily client to your project.

Python

```
pip install tavily-python
```

JavaScript

```
npm i @tavily/core
```

### Try it now

Make your first request to any Tavily endpoint.

- Search the web

- Extract webpages

- Crawl webpages

- Map webpages

- Create Research Task


Python

JavaScript

cURL

```
from tavily import TavilyClient

tavily_client = TavilyClient(api_key="tvly-YOUR_API_KEY")
response = tavily_client.search("Who is Leo Messi?")

print(response)
```

```
const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });
const response = await tvly.search("Who is Leo Messi?");

console.log(response);
```

```
curl --request POST \
  --url https://api.tavily.com/search \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '
{
  "query": "who is Leo Messi?",
  "auto_parameters": false,
  "topic": "general",
  "search_depth": "basic",
  "chunks_per_source": 3,
  "max_results": 1,
  "time_range": null,
  "start_date": "2025-02-09",
  "end_date": "2025-12-29",
  "include_answer": false,
  "include_raw_content": false,
  "include_images": false,
  "include_image_descriptions": false,
  "include_favicon": false,
  "include_domains": [],
  "exclude_domains": [],
  "country": null,
  "include_usage": false
}
'
```

[Learn more about the Search API →](https://docs.tavily.com/documentation/api-reference/endpoint/search)

Python

JavaScript

cURL

```
from tavily import TavilyClient

tavily_client = TavilyClient(api_key="tvly-YOUR_API_KEY")
response = tavily_client.extract("https://en.wikipedia.org/wiki/Artificial_intelligence")

print(response)
```

```
const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });
const response = await tvly.extract("https://en.wikipedia.org/wiki/Artificial_intelligence");

console.log(response);
```

```
curl --request POST \
  --url https://api.tavily.com/extract \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '
{
  "urls": "https://en.wikipedia.org/wiki/Artificial_intelligence",
  "query": "<string>",
  "chunks_per_source": 3,
  "extract_depth": "basic",
  "include_images": false,
  "include_favicon": false,
  "format": "markdown",
  "timeout": "None",
  "include_usage": false
}
'
```

[Learn more about the Extract API →](https://docs.tavily.com/documentation/api-reference/endpoint/extract)

Python

JavaScript

cURL

```
from tavily import TavilyClient

tavily_client = TavilyClient(api_key="tvly-YOUR_API_KEY")
response = tavily_client.crawl("https://docs.tavily.com", instructions="Find all pages on the Python SDK")

print(response)
```

```
const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });
const response = await tvly.crawl("https://docs.tavily.com", { instructions: "Find all pages on the Python SDK" });

console.log(response);
```

```
curl --request POST \
  --url https://api.tavily.com/crawl \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '
{
  "url": "docs.tavily.com",
  "instructions": "Find all pages about the Python SDK",
  "chunks_per_source": 3,
  "max_depth": 1,
  "max_breadth": 20,
  "limit": 50,
  "select_paths": null,
  "select_domains": null,
  "exclude_paths": null,
  "exclude_domains": null,
  "allow_external": true,
  "include_images": false,
  "extract_depth": "basic",
  "format": "markdown",
  "include_favicon": false,
  "timeout": 150,
  "include_usage": false
}
'
```

[Learn more about the Crawl API →](https://docs.tavily.com/documentation/api-reference/endpoint/crawl)

Python

JavaScript

cURL

```
from tavily import TavilyClient

tavily_client = TavilyClient(api_key="tvly-YOUR_API_KEY")
response = tavily_client.map("https://docs.tavily.com")

print(response)
```

```
const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });
const response = await tvly.map("https://docs.tavily.com");

console.log(response);
```

```
curl --request POST \
  --url https://api.tavily.com/map \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '
{
  "url": "docs.tavily.com",
  "instructions": "Find all pages about the Python SDK",
  "max_depth": 1,
  "max_breadth": 20,
  "limit": 50,
  "select_paths": null,
  "select_domains": null,
  "exclude_paths": null,
  "exclude_domains": null,
  "allow_external": true,
  "timeout": 150,
  "include_usage": false
}
'
```

[Learn more about the Map API →](https://docs.tavily.com/documentation/api-reference/endpoint/map)

Python

JavaScript

cURL

```
from tavily import TavilyClient

tavily_client = TavilyClient(api_key="tvly-YOUR_API_KEY")
response = tavily_client.research("What are the latest developments in AI?")

print(response)
```

```
const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });
const response = await tvly.research("What are the latest developments in AI?");

console.log(response);
```

```
curl --request POST \
  --url https://api.tavily.com/research \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '
{
  "input": "What are the latest developments in AI?",
  "model": "auto",
  "stream": false,
  "output_schema": {
    "properties": {
      "company": {
        "type": "string",
        "description": "The name of the company"
      },
      "key_metrics": {
        "type": "array",
        "description": "List of key performance metrics",
        "items": {
          "type": "string"
        }
      },
      "financial_details": {
        "type": "object",
        "description": "Detailed financial breakdown",
        "properties": {
          "operating_income": {
            "type": "number",
            "description": "Operating income for the period"
          }
        }
      }
    },
    "required": [\
      "company"\
    ]
  },
  "citation_format": "numbered"
}
'
```

[Learn more about the Research API →](https://docs.tavily.com/documentation/api-reference/endpoint/research)

### Developer Resources

Credits, limits, and a place to test your queries.

[**API Credits Overview** \\
\\
Learn how Tavily API credits work.](https://docs.tavily.com/documentation/api-credits)

[**Rate Limits** \\
\\
Understand Tavily’s rate limits and policies.](https://docs.tavily.com/documentation/rate-limits)

[**Playground** \\
\\
Try Tavily’s APIs interactively.](https://app.tavily.com/playground)

Question? [Contact Us](mailto:support@tavily.com)

Integration issues? [Join Community](https://community.tavily.com/)

Using LLMs? [Read LLMs.txt](https://docs.tavily.com/llms.txt)

Building agents? [Read the Agents guide](https://docs.tavily.com/agents)

Something not right? [Check Status](https://status.tavily.com/)

© Tavily [Privacy Policy](https://www.tavily.com/privacy)· [Website Terms of Use](https://www.tavily.com/website-terms)· [Platform Terms of Use](https://www.tavily.com/terms)· [Cookie Notice](https://www.tavily.com/cookie-policy)· [Cookies Settings](https://docs.tavily.com/#)· [Accessibility Menu](https://docs.tavily.com/#)

[LinkedIn](https://www.linkedin.com/company/tavily)[Twitter](https://x.com/tavilyai)[GitHub](https://github.com/tavily-ai)[YouTube](https://www.youtube.com/@TavilyAI)

Assistant

Responses are generated using AI and may contain mistakes.
