---
description: Entry points, client layers, and the build → sign → send flow.
---

# Architecture

### Package entry points

| Import                              | Contains                                            |
| ----------------------------------- | --------------------------------------------------- |
| `@trustless-work/escrow-js`         | Client, config helpers, services, types, errors     |
| `@trustless-work/escrow-js/rest`    | `EscrowRestService`                                 |
| `@trustless-work/escrow-js/graphql` | GraphQL service, documents, GraphQL types           |
| `@trustless-work/escrow-js/types`   | Payloads, responses, read-model, entities           |

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
import { EscrowRestService } from "@trustless-work/escrow-js/rest";
import { EscrowGraphqlService } from "@trustless-work/escrow-js/graphql";

const client = new TrustlessWorkClient({ baseURL, apiKey });
const rest = client.rest;       // operate + GET /escrows*
const graphql = client.graphql; // POST /graphql
```

### Layers

```
TrustlessWorkClient
  ├─ HttpTransport (native fetch + auth + Problem Details)
  ├─ EscrowRestService    (operate builds + REST reads)
  └─ EscrowGraphqlService (POST /graphql)
```

Optional module-level helpers (`configureTrustlessWork` / `escrowRest` / `escrowGraphql`) wrap a default `TrustlessWorkClient` — the vanilla counterpart to React’s `TrustlessWorkConfig`.

### Build → sign → send

Every mutate method returns an **unsigned** transaction. You sign with the wallet, then submit via [`sendTransaction`](/escrow-js-sdk/sendtransaction).

```ts
import {
  TrustlessWorkClient,
  development,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow-js";
import type { DeploySingleReleaseEscrowPayload } from "@trustless-work/escrow-js/types";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

const onSubmit = async (payload: DeploySingleReleaseEscrowPayload) => {
  try {
    const { unsignedXdr, contractId } = await client.rest.deployEscrow(
      payload,
      "single-release",
      // optional: { platformId, subjectId }
    );

    const signedXdr = await signWithWallet(unsignedXdr);
    const result = await client.rest.sendTransaction(signedXdr);

    if (result.code === "STELLAR_TX_SUBMITTED_INDEXER_LAGGING") {
      // Tx is on-chain; poll GET /escrows/:contractId until the indexer catches up
    }
  } catch (error: unknown) {
    const normalized = toTrustlessWorkError(error);
    if (normalized instanceof TrustlessWorkApiError) {
      console.error(formatApiErrorMessage(normalized), normalized.code);
    }
    throw error;
  }
};
```

### Operate response shapes

| Step         | Type                       | Shape                                                       |
| ------------ | -------------------------- | ----------------------------------------------------------- |
| Deploy build | `DeployEscrowResponse`     | `{ unsignedXdr, txHash, contractId }`                       |
| Other builds | `BuildTransactionResponse` | `{ unsignedXdr, txHash }`                                   |
| Submit       | `SendTransactionResponse`  | `{ txHash, ledger, contractId?, escrow?, code?, message? }` |

`code` may be `STELLAR_TX_SUBMITTED` or `STELLAR_TX_SUBMITTED_INDEXER_LAGGING`.

### Identity & amounts

* Escrow identity is **`contractId` only** (no UUID `id` / `escrowId`).
* Deploy trustline: `{ contractId, symbol }` (Soroban SAC `C…` + asset code).
* Read amounts are **decimal strings**; operate payloads use **numbers**.

See [Types](/escrow-js-sdk/types) and [Errors](/escrow-js-sdk/errors) for the full catalog.
