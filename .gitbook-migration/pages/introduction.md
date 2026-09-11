---
description: Framework-agnostic JavaScript/TypeScript client for Trustless Work Core API v2 escrows.
---

# Introduction

**`@trustless-work/escrow-js` v1** — Framework-agnostic JavaScript/TypeScript client for Trustless Work **Core API v2** escrows.

| Surface           | What it does                                                                      |
| ----------------- | --------------------------------------------------------------------------------- |
| **REST operate**  | Build unsigned XDR → you sign → [`sendTransaction`](/escrow-js-sdk/sendtransaction) |
| **REST reads**    | `GET /escrows*` (list, detail, events, milestones, financial)                     |
| **GraphQL reads** | `POST /graphql` (`escrow` / `escrows`)                                            |

Identity is always **`contractId`** (Soroban `C…`). Escrow types: `single-release` | `multi-release`.

Works in **Node.js 18+**, **NestJS**, **Angular**, **Vue**, **browser**, and any JS runtime with `fetch`. Zero runtime dependencies.

{% hint style="info" %}
Auth, users, platforms, wallets, admin, and access grants are **out of scope** for this package.
{% endhint %}

### Quick links

<table data-view="cards"><thead><tr><th>Title</th><th data-card-target data-type="content-ref">Link</th></tr></thead><tbody><tr><td>Getting started</td><td><a href="/escrow-js-sdk/getting-started">Getting Started</a></td></tr><tr><td>Architecture</td><td><a href="/escrow-js-sdk/architecture">Architecture</a></td></tr><tr><td>Operate</td><td><a href="/escrow-js-sdk/operate">Operate</a></td></tr><tr><td>REST reads</td><td><a href="/escrow-js-sdk/rest-reads">REST Reads</a></td></tr><tr><td>GraphQL</td><td><a href="/escrow-js-sdk/graphql">GraphQL</a></td></tr><tr><td>Runtimes</td><td><a href="/escrow-js-sdk/runtimes">Runtimes</a></td></tr><tr><td>NPM package</td><td><a href="https://www.npmjs.com/package/@trustless-work/escrow-js">@trustless-work/escrow-js</a></td></tr></tbody></table>

### What you'll do with the SDK

- Deploy escrows with [`deployEscrow`](/escrow-js-sdk/operate/deployescrow) — single-release or multi-release.
- Fund, update, manage milestones, approve, release, dispute, resolve, and withdraw.
- Read escrows via [REST](/escrow-js-sdk/rest-reads) or [GraphQL](/escrow-js-sdk/graphql).
- Submit signed XDR with [`sendTransaction`](/escrow-js-sdk/sendtransaction).

{% hint style="warning" %}
Read amounts are **human decimal strings** (e.g. `"250.5"`). Do **not** divide by `1e7`. Operate payloads still use human **numbers**.
{% endhint %}

### Environment

`development` and `mainNet` currently both point at:

```
https://beta.api.trustlesswork.com
```

Pass any Core API `baseURL` string when you need another host. Get an API key from the Trustless Work dApp.

### Coming from React?

See [Migration from React SDK](/escrow-js-sdk/migration) for the hook → method map and shared Core v2 contract.
