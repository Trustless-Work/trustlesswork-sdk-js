---
description: Batch change milestone status / evidence (v2).
---

# changeMilestoneStatus

Batch change milestone status / evidence (v2).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.changeMilestoneStatus(
  payload: ChangeMilestoneStatusPayload,
  type: EscrowType,
): Promise<BuildTransactionResponse>
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

`ChangeMilestoneStatusPayload`: `{ contractId, serviceProvider, updates: { index, newStatus, newEvidence? }[] }`.

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
