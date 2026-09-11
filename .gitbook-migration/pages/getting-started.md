---
description: Install @trustless-work/escrow-js and create a TrustlessWorkClient.
---

# Getting Started

### Overview

The Trustless Work JavaScript SDK is a typed, framework-agnostic client over Core API v2. It uses **native `fetch`** (Node 18+ / browsers) — no Axios, no React peers.

{% hint style="info" %}
Write flows typically need an API key. Optional wallet-session auth uses `getAccessToken` (sync or async).
{% endhint %}

### Quick links

<table data-view="cards"><thead><tr><th>Title</th><th data-card-target data-type="content-ref">Link</th></tr></thead><tbody><tr><td>NPM package</td><td><a href="https://www.npmjs.com/package/@trustless-work/escrow-js">@trustless-work/escrow-js</a></td></tr><tr><td>Architecture</td><td><a href="/escrow-js-sdk/architecture">Architecture</a></td></tr><tr><td>Send signed XDR</td><td><a href="/escrow-js-sdk/sendtransaction">sendTransaction</a></td></tr><tr><td>Runtimes</td><td><a href="/escrow-js-sdk/runtimes">Node · Nest · Angular · Browser</a></td></tr></tbody></table>

### Setup

{% stepper %}
{% step %}
### Installation

```bash
npm i @trustless-work/escrow-js@beta
# or
yarn add @trustless-work/escrow-js@beta
# or
pnpm add @trustless-work/escrow-js@beta
```

Requires **Node.js ≥ 18** (global `fetch`). Zero runtime dependencies.

{% hint style="info" %}
Install under the `beta` dist-tag while Core v2 is in beta, so `latest` can stay on the audited Core v1 line for other packages.
{% endhint %}
{% endstep %}

{% step %}
### Create a client (recommended)

```ts
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

await client.rest.listEscrows({ scope: "mine", limit: 20 });
await client.graphql.getEscrow({ contractId: "C..." });
```

This is the preferred pattern for **NestJS / Angular DI** and server apps.
{% endstep %}

{% step %}
### Or configure a default client

Vanilla equivalent of React’s `TrustlessWorkConfig`:

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
  getAccessToken: async () => sessionToken,
  defaultHeaders: { "X-TW-Platform": platformId },
});

await escrowRest().listEscrows({ scope: "mine", limit: 20 });
await escrowGraphql().getEscrow({ contractId: "C..." });
```
{% endstep %}

{% step %}
### Build → sign → send

Typical **operate** flow:

1. Call a REST method to get an **unsigned XDR** (and for deploy, a predicted `contractId`).
2. Sign the XDR with the correct role wallet.
3. Submit with [`sendTransaction`](/escrow-js-sdk/sendtransaction).

For **reads**, call REST or GraphQL methods directly — they return Promises (pair with your own cache if needed).
{% endstep %}
{% endstepper %}

### Client options

| Option           | Role                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `baseURL`        | Core API host (`development` / `mainNet`, or any URL string)         |
| `apiKey`         | `x-api-key` header                                                   |
| `getAccessToken` | Optional Bearer getter — sync **or** `Promise` (re-read per request) |
| `defaultHeaders` | Merged into every request (e.g. `X-TW-Platform`)                     |
| `fetch`          | Optional custom fetch (tests, polyfills, undici)                     |
| `timeoutMs`      | Optional timeout via `AbortSignal.timeout`                           |

### Next steps

* [Architecture](/escrow-js-sdk/architecture) — entry points and layers
* [Operate](/escrow-js-sdk/operate) — mutate methods
* [REST Reads](/escrow-js-sdk/rest-reads) — `GET /escrows*`
* [Runtimes](/escrow-js-sdk/runtimes) — Node, NestJS, Angular, browser
* [Errors](/escrow-js-sdk/errors) — Problem Details helpers

{% hint style="success" %}
Supports **single-release** and **multi-release**. Use the matching payload type and `EscrowType` for each flow.
{% endhint %}
