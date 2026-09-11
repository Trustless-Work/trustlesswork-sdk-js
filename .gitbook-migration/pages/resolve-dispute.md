---
description: Resolve a dispute with address → amount distributions.
---

# resolveDispute

Resolve a dispute with address → amount distributions.

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.resolveDispute(
  payload: SingleReleaseResolveDisputePayload | MultiReleaseResolveDisputePayload,
  type: EscrowType,
): Promise<BuildTransactionResponse>
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

`distributions: Distribution[]` where `Distribution = { address, amount }`. Multi adds `milestoneIndexes`.

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
