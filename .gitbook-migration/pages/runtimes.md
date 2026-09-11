---
description: Use @trustless-work/escrow-js in Node, NestJS, Angular, and the browser.
---

# Runtimes

One client, many runtimes. Prefer an **explicit** `TrustlessWorkClient` when your framework has DI.

### Node.js / Express

```ts
import {
  TrustlessWorkClient,
  development,
  toTrustlessWorkError,
  TrustlessWorkApiError,
} from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

const page = await client.rest.listEscrows({ scope: "mine", limit: 20 });
```

### NestJS

Register the client as a provider:

```ts
import { Module } from "@nestjs/common";
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

@Module({
  providers: [
    {
      provide: TrustlessWorkClient,
      useFactory: () =>
        new TrustlessWorkClient({
          baseURL: process.env.TW_BASE_URL ?? development,
          apiKey: process.env.TW_API_KEY,
          getAccessToken: async () => process.env.TW_ACCESS_TOKEN ?? null,
        }),
    },
  ],
  exports: [TrustlessWorkClient],
})
export class TrustlessWorkModule {}
```

Inject into services:

```ts
constructor(private readonly tw: TrustlessWorkClient) {}

async listMine() {
  return this.tw.rest.listEscrows({ scope: "mine" });
}
```

### Angular

Wrap the client in an `@Injectable` service:

```ts
import { Injectable } from "@angular/core";
import { from } from "rxjs";
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

@Injectable({ providedIn: "root" })
export class TrustlessWorkService {
  private readonly client = new TrustlessWorkClient({
    baseURL: development,
    apiKey: "your-api-key",
    getAccessToken: () => localStorage.getItem("tw_token"),
  });

  listEscrows() {
    return from(this.client.rest.listEscrows({ scope: "mine", limit: 20 }));
  }

  getEscrow(contractId: string) {
    return from(this.client.graphql.getEscrow({ contractId }));
  }
}
```

### Browser (vanilla)

```html
<script type="module">
  import {
    TrustlessWorkClient,
    development,
  } from "https://esm.sh/@trustless-work/escrow-js@beta";

  const client = new TrustlessWorkClient({
    baseURL: development,
    apiKey: "YOUR_API_KEY",
  });

  const page = await client.rest.listEscrows({ scope: "mine", limit: 5 });
  console.log(page);
</script>
```

{% hint style="info" %}
Repo examples live under [`examples/`](https://github.com/Trustless-Work/trustlesswork-sdk-js/tree/main/examples) — `node-basic.ts`, `nestjs-provider.ts`, `angular-service.ts`, `browser-vanilla.html`.
{% endhint %}
