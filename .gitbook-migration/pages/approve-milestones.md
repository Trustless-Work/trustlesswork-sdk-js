---
description: Batch approve one or more milestones (v2).
---

# approveMilestones

Batch approve one or more milestones (v2).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.approveMilestones(
  payload: ApproveMilestonesPayload,
  type: EscrowType,
): Promise<BuildTransactionResponse>
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

`ApproveMilestonesPayload`: `{ contractId, approver, milestoneIndexes: number[] }`.

### Example

```ts
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

// see signature above
```

See [Operate](/escrow-js-sdk/operate) and [sendTransaction](/escrow-js-sdk/sendtransaction).
