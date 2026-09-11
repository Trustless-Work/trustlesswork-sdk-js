---
description: GraphQL escrow(contractId) — detail with financial, deposits, events.
---

# getEscrow

GraphQL escrow(contractId) — detail with financial, deposits, events.

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.graphql.getEscrow(variables: GraphqlGetEscrowVariables): Promise<GraphqlEscrow>
```

**Returns** `GraphqlEscrow` including `financial`, optional `deposits` and `events`.

Variables: `contractId` (required), `eventsLimit?`, `eventsCursor?`, `eventsOrder?`. Document: `GRAPHQL_GET_ESCROW`.

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
