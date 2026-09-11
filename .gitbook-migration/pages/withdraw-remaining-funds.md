---
description: Withdraw remaining funds after resolution / completion.
---

# withdrawRemainingFunds

Withdraw remaining funds after resolution / completion.

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.withdrawRemainingFunds(
  payload: SingleReleaseWithdrawRemainingFundsPayload | MultiReleaseWithdrawRemainingFundsPayload,
  type: EscrowType,
): Promise<BuildTransactionResponse>
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

Same shape as resolve dispute distributions. See [Payloads](/escrow-js-sdk/types/payloads).

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
