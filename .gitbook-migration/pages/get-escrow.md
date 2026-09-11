---
description: Get a single escrow detail (GET /escrows/:contractId).
---

# getEscrow

Get a single escrow detail (GET /escrows/:contractId).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.getEscrow(contractId: string): Promise<GetEscrowResponse>
```

**Returns** `GetEscrowResponse` = `EscrowDetail` → `{ escrow, events, deposits }`.


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
