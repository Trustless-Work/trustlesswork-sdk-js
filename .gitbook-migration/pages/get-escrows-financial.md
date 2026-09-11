---
description: Batch financial summaries (GET /escrows/financial).
---

# getEscrowsFinancial

Batch financial summaries (GET /escrows/financial).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.getEscrowsFinancial(
  params: BatchContractIdsParams | string[],
): Promise<BatchEscrowFinancialResponse>
```

**Returns** `{ data: EscrowFinancial[] }`.


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
