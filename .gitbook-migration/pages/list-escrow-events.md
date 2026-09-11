---
description: Paginated escrow event timeline (GET /escrows/:contractId/events).
---

# listEscrowEvents

Paginated escrow event timeline (GET /escrows/:contractId/events).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.listEscrowEvents(
  contractId: string,
  params?: ListEscrowEventsParams,
): Promise<ListEscrowEventsResponse>
```

**Returns** `KeysetPage<EscrowEvent>` → `{ data, hasMore, nextCursor }`.

Params: `limit`, `order`, `cursor`.

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
