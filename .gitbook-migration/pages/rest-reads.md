---
description: REST read methods for GET /escrows* — list, detail, events, milestones, financial.
---

# REST Reads

Typed helpers for Core **`GET /escrows*`**.

Import from `@trustless-work/escrow-js` or `@trustless-work/escrow-js/rest`.

### Methods

| Method | Endpoint |
| --- | --- |
| [`listEscrows`](/escrow-js-sdk/rest-reads/listescrows) | `GET /escrows` |
| [`getEscrow`](/escrow-js-sdk/rest-reads/getescrow) | `GET /escrows/:contractId` |
| [`getEscrowDetails`](/escrow-js-sdk/rest-reads/getescrowdetails) | `GET /escrows/details?contractIds=` |
| [`listEscrowEvents`](/escrow-js-sdk/rest-reads/listescrowevents) | `GET /escrows/:contractId/events` |
| [`getEscrowMilestones`](/escrow-js-sdk/rest-reads/getescrowmilestones) | `GET /escrows/:contractId/milestones` |
| [`getEscrowsMilestones`](/escrow-js-sdk/rest-reads/getescrowsmilestones) | `GET /escrows/milestones?contractIds=` |
| [`getEscrowsFinancial`](/escrow-js-sdk/rest-reads/getescrowsfinancial) | `GET /escrows/financial?contractIds=` |

### Quick example

```ts
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

const page = await client.rest.listEscrows({ scope: "mine", limit: 20 });
const detail = await client.rest.getEscrow(contractId);
```

### Filters & pagination

`ListEscrowsParams`: `scope`, `status`, `contractType`, `engagementId`, `contractIds`, `participant`, `role`, `platformId`, `subjectId`, `createdAfter`, `createdBefore`, `limit`, `cursor`, `sort`, `order`.

* Use `scope: "mine" | "all"` for segmentation (not per-escrow access grants).
* List/events return a **keyset page**: `{ data, hasMore, nextCursor }`.

### Read-model shapes

| Type | Notes |
| --- | --- |
| `EscrowSummary` | List/detail row: `contractId`, `type`, `status`, `balance`, `asset`, camelCased `snapshot` |
| `EscrowDetail` | `{ escrow, events, deposits }` |
| `EscrowFinancial` | Batch financial: deposited / released / pending / `balance` |
| `EscrowEvent` | Indexed event — no UUID event `id` |
| `EscrowDeposit` | Deposit row — no UUID deposit `id` |

Amounts on reads are **human decimal strings**. Prefer GraphQL when you need nested financial + deposits + events in one call — see [GraphQL](/escrow-js-sdk/graphql).
