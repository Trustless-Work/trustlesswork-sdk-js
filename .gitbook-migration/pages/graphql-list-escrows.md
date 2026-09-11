---
description: GraphQL escrows(...) — same filters as REST list.
---

# listEscrows

GraphQL escrows(...) — same filters as REST list.

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.graphql.listEscrows(variables?: GraphqlListEscrowsVariables): Promise<GraphqlEscrowPage>
```

**Returns** `GraphqlEscrowPage` → `{ data, hasMore, nextCursor }`.

Same filter semantics as REST `ListEscrowsParams`. Document: `GRAPHQL_LIST_ESCROWS`.

### Example

```ts
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

// see signature above
```

See [GraphQL](/escrow-js-sdk/graphql).
