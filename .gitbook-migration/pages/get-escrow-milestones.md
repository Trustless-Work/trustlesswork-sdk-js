---
description: Milestones for one escrow (GET /escrows/:contractId/milestones).
---

# getEscrowMilestones

Milestones for one escrow (GET /escrows/:contractId/milestones).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.getEscrowMilestones(contractId: string): Promise<GetEscrowMilestonesResponse>
```

**Returns** `EscrowMilestones` → `{ contractId, type, milestones }`.


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
