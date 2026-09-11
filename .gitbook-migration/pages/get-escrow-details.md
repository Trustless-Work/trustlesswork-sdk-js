---
description: Batch escrow details (GET /escrows/details).
---

# getEscrowDetails

Batch escrow details (GET /escrows/details).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.getEscrowDetails(
  params: BatchContractIdsParams | string[],
): Promise<BatchEscrowDetailsResponse>
```

**Returns** `{ data: EscrowDetailsItem[] }` where each item is `{ escrow, deposits }`.


### Example

```ts
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

// see signature above
```

See [REST Reads](/escrow-js-sdk/rest-reads).
