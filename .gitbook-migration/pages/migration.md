---
description: Map @trustless-work/escrow (React) hooks to @trustless-work/escrow-js methods.
---

# Migration from React SDK

Coming from `@trustless-work/escrow`? Method signatures, payloads, responses, and error handling are **identical**. Only the React hooks / provider layer is removed.

### Hook → method map

| React SDK | `@trustless-work/escrow-js` |
| --- | --- |
| `TrustlessWorkConfig` | `configureTrustlessWork` or `new TrustlessWorkClient(...)` |
| `useTrustlessWorkClient()` | `getTrustlessWorkClient()` or your own client instance |
| `useEscrowRest()` | `client.rest` or `escrowRest()` |
| `useEscrowGraphql()` | `client.graphql` or `escrowGraphql()` |
| `useDeployEscrow().deployEscrow` | `client.rest.deployEscrow` |
| `useFundEscrow().fundEscrow` | `client.rest.fundEscrow` |
| `useUpdateEscrow().updateEscrow` | `client.rest.updateEscrow` |
| `useSendTransaction().sendTransaction` | `client.rest.sendTransaction` |
| `useListEscrows().listEscrows` | `client.rest.listEscrows` |
| `useGetEscrow().getEscrow` | `client.rest.getEscrow` |
| `useGraphqlGetEscrow().getEscrow` | `client.graphql.getEscrow` |
| `useGraphqlListEscrows().listEscrows` | `client.graphql.listEscrows` |

### Transport differences

| | React SDK | JS SDK |
| --- | --- | --- |
| HTTP | Axios | Native `fetch` |
| Runtime deps | `axios` + React peers | **None** |
| Token getter | sync | sync **or** async `Promise` |
| Non-problem errors | raw Axios error | `TrustlessWorkNetworkError` |
| Problem Details helper | `parseProblemDetailsFromAxiosError` | `parseProblemDetailsFromResponse` |

### Shared Core v2 contract

Everything else matches the React v5 docs:

* Identity is **`contractId` only**
* Deploy returns `{ unsignedXdr, txHash, contractId }`
* Milestone ops are **batch**
* Read amounts are **decimal strings**; operate payloads use **numbers**
* Handle `STELLAR_TX_SUBMITTED_INDEXER_LAGGING` after submit

See [Getting Started](/escrow-js-sdk/getting-started) and [Architecture](/escrow-js-sdk/architecture).
