---
description: Build an unsigned update transaction (full replace of platform-controlled fields).
---

# updateEscrow

Build an unsigned update transaction (full replace of platform-controlled fields).

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.updateEscrow(
  payload: UpdateSingleReleaseEscrowPayload | UpdateMultiReleaseEscrowPayload,
  type: EscrowType,
): Promise<BuildTransactionResponse>
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

Requires `contractId`, `admin`, and full `escrow` properties. See [Payloads](/escrow-js-sdk/types/payloads).

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
