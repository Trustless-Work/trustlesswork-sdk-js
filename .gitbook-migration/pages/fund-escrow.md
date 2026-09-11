---
description: Build an unsigned fund transaction for an escrow.
---

# fundEscrow

Build an unsigned fund transaction for an escrow.

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.fundEscrow(
  payload: FundEscrowPayload,
  type: EscrowType,
): Promise<BuildTransactionResponse>
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

`FundEscrowPayload`: `{ contractId, amount, signer }`.

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
