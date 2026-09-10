# `@trustless-work/escrow-js` — Qué puedes hacer

Cliente JavaScript/TypeScript agnóstico de framework para escrows Trustless Work Core v2.

Flujo mutate: **build XDR → firmar → `sendTransaction`** (solo REST).  
Lecturas: **elige REST o GraphQL**.

Setup: `TrustlessWorkClient` o `configureTrustlessWork` (`baseURL`, `apiKey`, opcional `getAccessToken`, `defaultHeaders`).

Identidad: siempre **`contractId`**. Tipos: `single-release` | `multi-release`.

---

## Elegir REST vs GraphQL

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({ baseURL, apiKey });
client.rest.deployEscrow(...);
client.graphql.getEscrow({ contractId });

// o cliente por defecto:
import { configureTrustlessWork, escrowRest, escrowGraphql } from "@trustless-work/escrow-js";
configureTrustlessWork({ baseURL, apiKey });
escrowRest().listEscrows({ scope: "mine" });
escrowGraphql().getEscrow({ contractId });
```

Entradas separadas (sin mezclar):

| Import | Contiene |
|--------|----------|
| `@trustless-work/escrow-js/rest` | servicio REST |
| `@trustless-work/escrow-js/graphql` | servicio GraphQL + documentos |
| `@trustless-work/escrow-js/types` | payloads, responses, read-model, entities |

---

## REST — Operar (build → sign → send)

| Método | Acción |
|--------|--------|
| `deployEscrow` | Crear (`unsignedXdr`, `txHash`, `contractId`) |
| `fundEscrow` | Fondear |
| `updateEscrow` | Actualizar |
| `changeMilestoneStatus` | Status/evidence (batch) |
| `approveMilestones` | Aprobar (batch) |
| `approveAndReleaseMilestones` | Aprobar + liberar (multi) |
| `manageMilestones` | Agregar/editar milestones |
| `releaseFunds` | Liberar |
| `startDispute` / `resolveDispute` | Disputa |
| `withdrawRemainingFunds` | Retirar restante |
| `sendTransaction` | Enviar XDR firmado |

Deploy: `{ platformId, subjectId }` → `X-TW-Platform` / `X-TW-Subject`.

---

## REST — Leer

| Método | Endpoint |
|--------|----------|
| `listEscrows` | `GET /escrows` |
| `getEscrow` | `GET /escrows/:contractId` |
| `getEscrowDetails` | `GET /escrows/details` |
| `listEscrowEvents` | `GET /escrows/:id/events` |
| `getEscrowMilestones` / `getEscrowsMilestones` | milestones |
| `getEscrowsFinancial` | `GET /escrows/financial` |

---

## GraphQL — Leer escrows (`POST /graphql`)

| Método | Query |
|--------|-------|
| `getEscrow` | `escrow(contractId)` + financial/deposits/events |
| `listEscrows` | `escrows(...)` (mismos filtros que REST) |

Documentos: `GRAPHQL_GET_ESCROW`, `GRAPHQL_LIST_ESCROWS`.

---

## Equivalencia con el SDK React

| React hook | JS SDK |
|------------|--------|
| `useDeployEscrow` → `deployEscrow` | `client.rest.deployEscrow` |
| `useSendTransaction` → `sendTransaction` | `client.rest.sendTransaction` |
| `useListEscrows` → `listEscrows` | `client.rest.listEscrows` |
| `useGraphqlGetEscrow` → `getEscrow` | `client.graphql.getEscrow` |
| `useEscrowRest()` | `client.rest` |
| `useEscrowGraphql()` | `client.graphql` |
| `TrustlessWorkConfig` | `configureTrustlessWork` |

---

## Fuera de scope

auth, users, platforms, wallets, admin, access grants.
