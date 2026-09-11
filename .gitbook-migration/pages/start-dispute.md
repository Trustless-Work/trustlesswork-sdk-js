---
description: Start a dispute on a single-release escrow or selected multi-release milestones.
---

# startDispute

Start a dispute on a single-release escrow or selected multi-release milestones.

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.startDispute(
  payload: SingleReleaseStartDisputePayload | MultiReleaseStartDisputePayload,
  type: EscrowType,
): Promise<BuildTransactionResponse>
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

Single path: `/dispute`. Multi path: `/dispute-milestones` (also `disputeMilestones(data)`).

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
