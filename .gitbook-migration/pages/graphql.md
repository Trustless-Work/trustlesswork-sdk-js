---
description: GraphQL read surface — POST /graphql for escrow and escrows queries.
---

# GraphQL

GraphQL reads go through `POST /graphql`. Prefer this when you want escrow + financial + deposits + events in one round-trip.

Import from `@trustless-work/escrow-js` or `@trustless-work/escrow-js/graphql`.

### Methods

| Method | Query |
| --- | --- |
| [`getEscrow`](/escrow-js-sdk/graphql/getescrow) | `escrow(contractId)` + financial / deposits / events |
| [`listEscrows`](/escrow-js-sdk/graphql/listescrows) | `escrows(...)` (same filters as REST list) |

Documents: `GRAPHQL_GET_ESCROW`, `GRAPHQL_LIST_ESCROWS`.

### Quick example

```ts
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

const detail = await client.graphql.getEscrow({
  contractId,
  eventsLimit: 20,
});

const page = await client.graphql.listEscrows({
  scope: "mine",
  limit: 20,
});
```

### Wire types

GraphQL wire types (`GraphqlEscrow`, `GraphqlEscrowPage`, `GraphqlEscrowFinancial`, …) live on `@trustless-work/escrow-js` / `@trustless-work/escrow-js/graphql`.

{% hint style="info" %}
REST and GraphQL share the same Core identity model (`contractId`) and filter semantics (`scope`, `status`, `contractType`, …). Choose based on nesting needs, not different product surfaces.
{% endhint %}

See also [REST Reads](/escrow-js-sdk/rest-reads) and [Types](/escrow-js-sdk/types).
