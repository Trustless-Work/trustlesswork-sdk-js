---
description: Multi-release only. Atomic approve + release for the given milestone indexes.
---

# approveAndReleaseMilestones

Multi-release only. Atomic approve + release for the given milestone indexes.

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.approveAndReleaseMilestones(
  payload: ApproveAndReleaseMilestonesPayload,
): Promise<BuildTransactionResponse>
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

`ApproveAndReleaseMilestonesPayload`: `{ contractId, signer, milestoneIndexes: number[] }`. Multi-release only — no `type` argument.

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
