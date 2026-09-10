<p align="center"> <img src="https://github.com/user-attachments/assets/5b182044-dceb-41f5-acf0-da22dea7c98a" alt="CLR-S (2)"> </p>

# Trustless Work <a href="https://www.npmjs.com/package/@trustless-work/escrow-js" target="_blank">JavaScript SDK</a>

**`@trustless-work/escrow-js` v1** — Framework-agnostic JavaScript/TypeScript client for Trustless Work **Core API v2** escrows.

| Surface           | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| **REST operate**  | Build unsigned XDR → you sign → `sendTransaction`             |
| **REST reads**    | `GET /escrows*` (list, detail, events, milestones, financial) |
| **GraphQL reads** | `POST /graphql` (`escrow` / `escrows`)                        |

Identity is always **`contractId`** (Soroban `C…`). Types: `single-release` | `multi-release`.

> Auth, users, platforms, wallets, admin, and access grants are **out of scope** for this package.

Works in **Node.js 18+**, **NestJS**, **Angular**, **Vue**, **browser**, and any JavaScript runtime with `fetch`.

## Installation

```bash
npm i @trustless-work/escrow-js@beta
```

Zero runtime dependencies. Uses native `fetch` (Node 18+ or browser).

## Quick Start

### Explicit client (recommended for NestJS / Angular DI)

```ts
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

await client.rest.listEscrows({ scope: "mine", limit: 20 });
await client.graphql.getEscrow({ contractId: "C..." });
```

### Module-level default client

```ts
import {
  configureTrustlessWork,
  escrowRest,
  escrowGraphql,
  development,
} from "@trustless-work/escrow-js";

configureTrustlessWork({
  baseURL: development,
  apiKey: process.env.API_KEY,
  getAccessToken: () => sessionToken,
  defaultHeaders: { "X-TW-Platform": platformId },
});

await escrowRest().listEscrows({ scope: "mine" });
await escrowGraphql().getEscrow({ contractId: "C..." });
```

| Option           | Role                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `baseURL`        | Core API host (`development` / `mainNet` helpers, or any URL string) |
| `apiKey`         | `x-api-key` header                                                   |
| `getAccessToken` | Optional Bearer token getter (sync or async, re-read per request)    |
| `defaultHeaders` | Merged into every request (e.g. `X-TW-Platform`)                     |
| `fetch`          | Optional custom fetch implementation (for tests or polyfills)        |
| `timeoutMs`      | Optional request timeout via `AbortSignal.timeout`                     |

## Package entry points

| Import                              | Contains                                      |
| ----------------------------------- | --------------------------------------------- |
| `@trustless-work/escrow-js`         | Client, config helpers, services, types, errors |
| `@trustless-work/escrow-js/rest`    | `EscrowRestService` only                      |
| `@trustless-work/escrow-js/graphql` | GraphQL service, documents, types             |
| `@trustless-work/escrow-js/types`   | Payloads, responses, read-model, entities     |

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
import { EscrowRestService } from "@trustless-work/escrow-js/rest";
import { EscrowGraphqlService } from "@trustless-work/escrow-js/graphql";
import type { DeploySingleReleaseEscrowPayload } from "@trustless-work/escrow-js/types";

const client = new TrustlessWorkClient({ baseURL, apiKey });
const rest = client.rest;       // operate + GET /escrows*
const graphql = client.graphql; // POST /graphql
```

## Build → sign → send

Every mutate method returns an **unsigned** transaction. You sign with the wallet, then submit.

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
      // optional attribution → X-TW-Platform / X-TW-Subject:
      // { platformId, subjectId }
    );

    const signedXdr = await signWithWallet(unsignedXdr);
    const result = await client.rest.sendTransaction(signedXdr);
    // result.txHash, result.ledger, result.contractId?, result.escrow?, result.code?

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

Deploy trustline shape: `{ contractId, symbol }` (Soroban SAC `C…` + asset code).

Operate responses:

| Step         | Type                       | Shape                                                       |
| ------------ | -------------------------- | ----------------------------------------------------------- |
| Deploy build | `DeployEscrowResponse`     | `{ unsignedXdr, txHash, contractId }`                       |
| Other builds | `BuildTransactionResponse` | `{ unsignedXdr, txHash }`                                   |
| Submit       | `SendTransactionResponse`  | `{ txHash, ledger, contractId?, escrow?, code?, message? }` |

`code` may be `STELLAR_TX_SUBMITTED` or `STELLAR_TX_SUBMITTED_INDEXER_LAGGING`.

## REST operate methods

Import from `@trustless-work/escrow-js` or `@trustless-work/escrow-js/rest`.

| Method                           | Action                                                 |
| -------------------------------- | ------------------------------------------------------ |
| `deployEscrow`                   | Create escrow (`unsignedXdr` + predicted `contractId`) |
| `fundEscrow`                     | Fund                                                   |
| `updateEscrow`                   | Update properties                                      |
| `changeMilestoneStatus`          | Status / evidence (batch)                              |
| `approveMilestones`              | Approve (batch)                                        |
| `approveAndReleaseMilestones`    | Approve + release (multi-release)                      |
| `manageMilestones`               | Add / edit milestones                                  |
| `releaseFunds`                   | Release                                                |
| `startDispute`                   | Start dispute                                          |
| `resolveDispute`                 | Resolve dispute (distributions)                        |
| `withdrawRemainingFunds`         | Withdraw remaining                                     |
| `sendTransaction`                | Submit signed XDR (`POST /stellar/send-transaction`)   |

Most operate methods take `(payload, type)` where `type` is `"single-release"` | `"multi-release"`. Multi-only helpers (`approveAndReleaseMilestones`, etc.) omit the type argument.

## REST reads

| Method                  | Endpoint                               |
| ----------------------- | -------------------------------------- |
| `listEscrows`           | `GET /escrows`                         |
| `getEscrow`             | `GET /escrows/:contractId`             |
| `getEscrowDetails`      | `GET /escrows/details?contractIds=`    |
| `listEscrowEvents`      | `GET /escrows/:contractId/events`      |
| `getEscrowMilestones`   | `GET /escrows/:contractId/milestones`  |
| `getEscrowsMilestones`  | `GET /escrows/milestones?contractIds=` |
| `getEscrowsFinancial`   | `GET /escrows/financial?contractIds=`  |

```ts
const page = await client.rest.listEscrows({ scope: "mine", limit: 20 });
const detail = await client.rest.getEscrow(contractId);
```

### `ListEscrowsParams` (filters)

`scope`, `status`, `contractType`, `engagementId`, `contractIds`, `participant`, `role`, `platformId`, `subjectId`, `createdAfter`, `createdBefore`, `limit`, `cursor`, `sort`, `order`.

- Use `scope: "mine" | "all"` for segmentation (not per-escrow access grants).
- List/events return a **keyset page**: `{ data, hasMore, nextCursor }`.

### Read-model shapes

| Type              | Notes                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `EscrowSummary`   | List/detail row: `contractId`, `type`, `status`, `balance`, `asset`, camelCased `snapshot` |
| `EscrowDetail`    | `{ escrow, events, deposits }`                                                             |
| `EscrowFinancial` | Batch financial: deposited / released / pending / `balance`                                |
| `EscrowEvent`     | Indexed event (`kind`, `topics`, `payload`, …) — no UUID event `id`                        |
| `EscrowDeposit`   | Deposit row — no UUID deposit `id`                                                         |

There is **no** UUID `id` / `escrowId`. Amounts on reads are **human decimal strings** (e.g. `"250.5"`) — do **not** divide by `1e7`. Build/operate payloads still use human **numbers**.

## GraphQL reads

| Method        | Query                                                |
| ------------- | ---------------------------------------------------- |
| `getEscrow`   | `escrow(contractId)` + financial / deposits / events |
| `listEscrows` | `escrows(...)` (same filters as REST list)           |

Documents: `GRAPHQL_GET_ESCROW`, `GRAPHQL_LIST_ESCROWS`.

```ts
import { EscrowGraphqlService } from "@trustless-work/escrow-js/graphql";

const detail = await client.graphql.getEscrow({
  contractId,
  eventsLimit: 20,
});

const page = await client.graphql.listEscrows({
  scope: "mine",
  limit: 20,
});
```

GraphQL wire types (`GraphqlEscrow`, `GraphqlEscrowPage`, …) live on `@trustless-work/escrow-js` / `@trustless-work/escrow-js/graphql`.

## Errors

HTTP failures from Core are RFC 9457 Problem Details. The transport surfaces them as `TrustlessWorkApiError`. Non-problem HTTP failures throw `TrustlessWorkNetworkError`.

```ts
import {
  toTrustlessWorkError,
  TrustlessWorkApiError,
  TrustlessWorkNetworkError,
  formatApiErrorMessage,
  parseProblemDetailsFromResponse,
  ESCROW_ERROR_CODES,
} from "@trustless-work/escrow-js";

try {
  await client.rest.fundEscrow(payload, "single-release");
} catch (error: unknown) {
  const err = toTrustlessWorkError(error);
  if (err instanceof TrustlessWorkApiError) {
    // err.code, err.status, err.detail, err.traceId, err.extensions
    console.error(formatApiErrorMessage(err));
    if (err.code === ESCROW_ERROR_CODES.ESCROW_NOT_FOUND) {
      /* … */
    }
  }
  if (error instanceof TrustlessWorkNetworkError) {
    console.error(error.status, error.body);
  }
}
```

Also exported: `parseProblemDetails`, `parseProblemDetailsFromResponse`, `isProblemDetails`, `isEscrowErrorCode`.

## Types

Import from `@trustless-work/escrow-js/types` (or the root package):

| Area                 | Examples                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Operate payloads** | `DeploySingleReleaseEscrowPayload`, `FundEscrowPayload`, `ApproveMilestonesPayload`, `AttributionHeaders`, … |
| **Responses**        | `DeployEscrowResponse`, `BuildTransactionResponse`, `SendTransactionResponse`, `ListEscrowsResponse`, …      |
| **Reads**            | `EscrowSummary`, `EscrowAsset`, `EscrowSnapshot`, `EscrowEvent`, `EscrowFinancial`, `KeysetPage`, …          |
| **Entities**         | `Escrow`, `Roles`, `DeployTrustline`, `SingleReleaseMilestone`, …                                            |
| **Errors**           | `ApiProblemDetails`, `EscrowErrorCode`, `ESCROW_ERROR_CODES`                                                 |

## Runtime guides

### Node.js / Express

See [`examples/node-basic.ts`](examples/node-basic.ts).

```ts
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});
```

### NestJS

See [`examples/nestjs-provider.ts`](examples/nestjs-provider.ts). Register `TrustlessWorkClient` as a provider and inject it into services.

### Angular

See [`examples/angular-service.ts`](examples/angular-service.ts). Wrap `TrustlessWorkClient` in an `@Injectable` service and use `from()` for Observables.

### Browser (vanilla)

See [`examples/browser-vanilla.html`](examples/browser-vanilla.html). Import via ESM CDN or bundle with your tool of choice.

## Migrating from `@trustless-work/escrow` (React SDK)

| React SDK                         | `@trustless-work/escrow-js`              |
| --------------------------------- | ---------------------------------------- |
| `TrustlessWorkConfig`             | `configureTrustlessWork`                 |
| `useTrustlessWorkClient()`        | `getTrustlessWorkClient()`               |
| `useEscrowRest()`                 | `client.rest` or `escrowRest()`          |
| `useEscrowGraphql()`              | `client.graphql` or `escrowGraphql()`    |
| `useDeployEscrow().deployEscrow`  | `client.rest.deployEscrow`               |
| `useSendTransaction().sendTransaction` | `client.rest.sendTransaction`       |
| `useListEscrows().listEscrows`    | `client.rest.listEscrows`                |
| `useGraphqlGetEscrow().getEscrow` | `client.graphql.getEscrow`               |

Method signatures, payloads, responses, and error handling are identical. Only the React hooks layer is removed.

## Environment

`development` and `mainNet` currently point at:

`https://beta.api.trustlesswork.com`

Pass any Core API `baseURL` string when you need another host. Get an API key from the Trustless Work dApp.

## License

MIT License — see [LICENSE](LICENSE) file for details.
