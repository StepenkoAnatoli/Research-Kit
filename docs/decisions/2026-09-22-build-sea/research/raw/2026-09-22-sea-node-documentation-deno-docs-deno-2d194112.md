---
url: https://docs.deno.com/api/node/sea/
retrieved: 2026-09-22
command: firecrawl scrape https://docs.deno.com/api/node/sea/ --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: sea - Node documentation | Deno Docs
---
[Skip to main content](https://docs.deno.com/api/node/sea/#content)

## Functions

f

[getAsset](https://docs.deno.com/api/node/sea/#getAsset "getAsset")

No documentation available

f

[getAssetAsBlob](https://docs.deno.com/api/node/sea/#getAssetAsBlob "getAssetAsBlob")

No documentation available

f

[getRawAsset](https://docs.deno.com/api/node/sea/#getRawAsset "getRawAsset")

No documentation available

f

[isSea](https://docs.deno.com/api/node/sea/#isSea "isSea")

No documentation available

## Type Aliases

T

[AssetKey](https://docs.deno.com/api/node/sea/#AssetKey "AssetKey")

No documentation available

* * *

## function [getAsset](https://docs.deno.com/api/node/sea/\#getAsset)

### Usage in Deno

```typescript
import { getAsset } from "node:sea";
```

## Overload 1

`#getAsset(key: AssetKey): ArrayBuffer`

Deno compatibility

This symbol is not supported.

This method can be used to retrieve the assets configured to be bundled into the
single-executable application at build time.
An error is thrown when no matching asset can be found.

### Parameters [\#](https://docs.deno.com/api/node/sea/\#getAsset.parameters)

`#key: AssetKey`

### Return Type [\#](https://docs.deno.com/api/node/sea/\#getAsset.return-type)

`ArrayBuffer`

## Overload 2

`#getAsset(key: AssetKey,
encoding: string,

): string`

Deno compatibility

This symbol is not supported.

### Parameters [\#](https://docs.deno.com/api/node/sea/\#getAsset.parameters-1)

`#key: AssetKey`

`#encoding: string`

### Return Type [\#](https://docs.deno.com/api/node/sea/\#getAsset.return-type-1)

`string`

* * *

## function [getAssetAsBlob](https://docs.deno.com/api/node/sea/\#getAssetAsBlob)

### Usage in Deno

```typescript
import { getAssetAsBlob } from "node:sea";
```

`#getAssetAsBlob(key: AssetKey,
options?: { type: string;  },

): Blob`

Deno compatibility

This symbol is not supported.

Similar to `sea.getAsset()`, but returns the result in a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
An error is thrown when no matching asset can be found.

### Parameters [\#](https://docs.deno.com/api/node/sea/\#getAssetAsBlob.parameters)

`#key: AssetKey`

`#options: { type: string;  }`
optional

### Return Type [\#](https://docs.deno.com/api/node/sea/\#getAssetAsBlob.return-type)

`Blob`

* * *

## function [getRawAsset](https://docs.deno.com/api/node/sea/\#getRawAsset)

### Usage in Deno

```typescript
import { getRawAsset } from "node:sea";
```

`#getRawAsset(key: AssetKey): ArrayBuffer`

Deno compatibility

This symbol is not supported.

This method can be used to retrieve the assets configured to be bundled into the
single-executable application at build time.
An error is thrown when no matching asset can be found.

Unlike `sea.getRawAsset()` or `sea.getAssetAsBlob()`, this method does not
return a copy. Instead, it returns the raw asset bundled inside the executable.

For now, users should avoid writing to the returned array buffer. If the
injected section is not marked as writable or not aligned properly,
writes to the returned array buffer is likely to result in a crash.

### Parameters [\#](https://docs.deno.com/api/node/sea/\#getRawAsset.parameters)

`#key: AssetKey`

### Return Type [\#](https://docs.deno.com/api/node/sea/\#getRawAsset.return-type)

`ArrayBuffer`

* * *

## function [isSea](https://docs.deno.com/api/node/sea/\#isSea)

### Usage in Deno

```typescript
import { isSea } from "node:sea";
```

`#isSea(): boolean`

Deno compatibility

This symbol is not supported.

### Return Type [\#](https://docs.deno.com/api/node/sea/\#isSea.return-type)

`boolean`

Whether this script is running inside a single-executable application.

* * *

## type alias [AssetKey](https://docs.deno.com/api/node/sea/\#AssetKey)

### Usage in Deno

```typescript
import { type AssetKey } from "node:sea";
```

Deno compatibility

This symbol is not supported.

### Definition [\#](https://docs.deno.com/api/node/sea/\#AssetKey.definition)

`string`

* * *

## Did you find what you needed?

YesNo

What can we do to improve this page?

0 / 2000

GitHub username ( _optional_)

If provided, you'll be @mentioned in the created GitHub issue

Send us feedback

[Privacy policy](https://docs.deno.com/deploy/privacy_policy)

- [Functions](https://docs.deno.com/api/node/sea/#Functions "Functions")

  - [AssetKey](https://docs.deno.com/api/node/sea/#AssetKey "AssetKey")
- [Type Aliases](https://docs.deno.com/api/node/sea/#Type%20Aliases "Type Aliases")
