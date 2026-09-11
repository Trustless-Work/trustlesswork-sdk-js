---
description: List escrows with keyset pagination and filters (GET /escrows).
---

# listEscrows

List escrows with keyset pagination and filters (GET /escrows).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.listEscrows(params?: ListEscrowsParams): Promise<ListEscrowsResponse>
```

**Returns** `ListEscrowsResponse` = `KeysetPage<EscrowSummary>` → `{ data, hasMore, nextCursor }`.

Filters: `scope`, `status`, `contractType`, `engagementId`, `contractIds`, `participant`, `role`, `platformId`, `subjectId`, `createdAfter`, `createdBefore`, `limit`, `cursor`, `sort`, `order`.

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
