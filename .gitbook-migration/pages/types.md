---
description: Plain shapes for the most important `@trustless-work/escrow-js` types — entities, payloads, responses, and the read model.
---

# Types

All types below ship with `@trustless-work/escrow-js`. Import them from the package root or from `@trustless-work/escrow-js/types`.

```ts
import type {
  DeploySingleReleaseEscrowPayload,
  EscrowSummary,
  Roles,
} from "@trustless-work/escrow-js";
```

{% hint style="info" %}
**Three buckets**

1. **Entities** — on-chain shapes (roles, milestones, escrow).
2. **Payloads** — what you send to operate REST (deploy, fund, release, …).
3. **Reads & responses** — what Core returns after build, submit, or GET.
{% endhint %}

{% hint style="warning" %}
**Amounts**

- **Operate payloads** use human **numbers** (`amount: 1000`).
- **Read-model** fields use **decimal strings** (`balance: "1000"`, `amount: "250"`).

There is no UUID `id` / `escrowId`. Always identify an escrow with `contractId` (`C…`).
{% endhint %}

## Browse by topic

| Page | What you’ll find |
| --- | --- |
| [Entities](/escrow-js-sdk/types/entities) | `Roles`, milestones, `SingleReleaseEscrow` / `MultiReleaseEscrow`, trustline |
| [Payloads](/escrow-js-sdk/types/payloads) | Deploy, update, fund, release, dispute, manage milestones |
| [Reads & responses](/escrow-js-sdk/types/reads-and-responses) | `EscrowSummary`, snapshots, list params, build/send responses |
| [Errors](/escrow-js-sdk/errors) | `ApiProblemDetails` and escrow error codes |

## Core values

```ts
type EscrowType = "single-release" | "multi-release";

type EscrowStatus = "active" | "released" | "disputed";

type EscrowNetwork = string; // network id from Core

type baseURL = string; // Core API base URL
```

| Value | Meaning |
| --- | --- |
| `single-release` | One payout for the whole escrow after milestones are done |
| `multi-release` | Each milestone can be released on its own |
| `active` / `released` / `disputed` | Derived status on list/detail rows |

## Quick map

| You want to… | Start with |
| --- | --- |
| Deploy an escrow | `DeploySingleReleaseEscrowPayload` / `DeployMultiReleaseEscrowPayload` → [Payloads](/escrow-js-sdk/types/payloads) |
| Fund / release / dispute | Matching `*Payload` → [Payloads](/escrow-js-sdk/types/payloads) |
| Show a list in the UI | `EscrowSummary` → [Reads & responses](/escrow-js-sdk/types/reads-and-responses) |
| Show one escrow | `EscrowDetail` → [Reads & responses](/escrow-js-sdk/types/reads-and-responses) |
| Sign & submit | `BuildTransactionResponse` → wallet → `SendTransactionResponse` |
| Handle failures | [Errors](/escrow-js-sdk/errors) |
