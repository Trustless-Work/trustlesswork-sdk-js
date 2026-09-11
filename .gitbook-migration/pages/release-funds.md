---
description: Build an unsigned release transaction.
---

# releaseFunds

Build an unsigned release transaction.

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.releaseFunds(
  payload: SingleReleaseReleaseFundsPayload | MultiReleaseReleaseFundsPayload,
  type: EscrowType,
): Promise<BuildTransactionResponse>
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

Single: `{ contractId, releaseSigner }`. Multi: add `milestoneIndexes`. Alias: `releaseMilestones(data)` → multi-release.

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
