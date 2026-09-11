---
description: Add new milestones and/or edit existing milestone descriptions (and amounts for multi).
---

# manageMilestones

Add new milestones and/or edit existing milestone descriptions (and amounts for multi).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.manageMilestones(
  payload: ManageSingleReleaseMilestonesPayload | ManageMultiReleaseMilestonesPayload,
  type: EscrowType,
): Promise<BuildTransactionResponse>
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

Requires `contractId`, `admin`, `newMilestones`, and `milestoneUpdates`. See [Payloads](/escrow-js-sdk/types/payloads).

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
