---
description: Batch milestones (GET /escrows/milestones).
---

# getEscrowsMilestones

Batch milestones (GET /escrows/milestones).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.getEscrowsMilestones(
  params: BatchContractIdsParams | string[],
): Promise<BatchEscrowMilestonesResponse>
```

**Returns** `{ data: EscrowMilestones[] }`.


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
