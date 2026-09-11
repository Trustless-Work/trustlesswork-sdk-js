---
description: Submit a signed Stellar XDR via POST /stellar/send-transaction.
---

# sendTransaction

Submit a **signed** transaction XDR to Core. Call this after any operate method returns `unsignedXdr` and your wallet has signed it.

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
// or use client.rest from your configured instance
```

### Signature

```ts
client.rest.sendTransaction(signedXdr: string): Promise<SendTransactionResponse>
```

**Returns** `SendTransactionResponse`:

| Field | Type | Notes |
| --- | --- | --- |
| `txHash` | `string` | On-chain transaction hash |
| `ledger` | `number` | Ledger number |
| `contractId?` | `string` | Present on factory deploy confirmation |
| `escrow?` | `Escrow \| EscrowSummary` | Optional snapshot after submit |
| `code?` | `SendTransactionCode` | `STELLAR_TX_SUBMITTED` or `STELLAR_TX_SUBMITTED_INDEXER_LAGGING` |
| `message?` | `string` | Human-readable note |

{% hint style="warning" %}
When `code` is `STELLAR_TX_SUBMITTED_INDEXER_LAGGING`, the tx is on-chain but reads may lag. Poll [`getEscrow`](/escrow-js-sdk/rest-reads/getescrow) until the indexer catches up.
{% endhint %}

### Example

```ts
import {
  TrustlessWorkClient,
  development,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

const onFund = async () => {
  try {
    const { unsignedXdr } = await client.rest.fundEscrow(
      { contractId, amount: 100, signer: address },
      "single-release",
    );
    const signedXdr = await signWithWallet(unsignedXdr);
    const result = await client.rest.sendTransaction(signedXdr);
    console.log(result.txHash, result.code);
  } catch (error: unknown) {
    const err = toTrustlessWorkError(error);
    if (err instanceof TrustlessWorkApiError) {
      console.error(formatApiErrorMessage(err));
    }
    throw error;
  }
};
```

See [Operate](/escrow-js-sdk/operate) for the full mutate catalog.
