---
url: https://serpapi.com/account-api
retrieved: 2026-09-26
command: firecrawl scrape https://serpapi.com/account-api --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Account API - SerpApi
---
# Account API

Account API allows you to check the number of searches you made in this month, your plan's monthly limit, your plan's monthly searches left, your plan's next renewal date, your account's hourly throughput limit, and if you have an account with no monthly plan then you can also check the remaining credits. Account API is free of charge, and using it will not be counted toward your monthly quota.

You can query `https://serpapi.com/account.json` using a `GET` request with these parameters:

### API Parameters

api\_key

Required

Parameter is your SerpApi private key. You should be able to retrieve it inside the 'Your Account' tab.

## API Examples

### Account API example

GET

- ```url

```


JSON Example

```json
{
"account_id": "5ac54d6adefb2f1dba1663f5",
"api_key": "SECRET_API_KEY",
"account_email": "demo@serpapi.com",
"account_status": "Active",
"plan_id": "bigdata",
"plan_name": "Big Data Plan",
"plan_monthly_price": 250.0,
"plan_renewal_date": "2026-10-26",
"searches_per_month": 30000,
"plan_searches_left": 5958,
"extra_credits": 0,
"total_searches_left": 5958,
"this_month_usage": 24042,
"this_hour_searches": 87,
"last_hour_searches": 42,
"account_rate_limit_per_hour": 6000
}
```

## About plan\_renewal\_date

`plan_renewal_date` is `null` for accounts without an active monthly plan (for example, enterprise credit-pool accounts or cancelled subscriptions).

### **SerpApi** results for ""

|     |     |     |
| --- | --- | --- |
| |     |     |
| --- | --- |
|  | × | | search |  |

Custom Search

|     |     |
| --- | --- |
|  | Sort by<br>Relevance<br>Date |

|     |     |
| --- | --- |
|  |  |
