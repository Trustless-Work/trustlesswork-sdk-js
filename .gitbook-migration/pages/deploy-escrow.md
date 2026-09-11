---
description: Build an unsigned deploy transaction for a new single- or multi-release escrow.
---

# deployEscrow

Build an unsigned deploy transaction for a new v2 escrow. Returns `unsignedXdr` plus the predicted `contractId`.

### Import

```ts
import { TrustlessWorkClient } from "@trustless-work/escrow-js";
```

### Signature

```ts
client.rest.deployEscrow(
  payload: DeploySingleReleaseEscrowPayload | DeployMultiReleaseEscrowPayload,
  type: EscrowType,
  attribution?: AttributionHeaders,
): Promise<DeployEscrowResponse>
```

**Returns** `DeployEscrowResponse`: `{ unsignedXdr, txHash, contractId }`.

### Single vs multi

{% tabs %}
{% tab title="single-release" %}
`DeploySingleReleaseEscrowPayload`: `signer`, `engagementId`, `title`, `description`, `amount`, `platformFee`, `roles` (`Roles`), `milestones` (`SingleReleaseMilestonePayload[]`), `trustline` (`DeployTrustline`).

```ts
await client.rest.deployEscrow(payload, "single-release");
```
{% endtab %}
{% tab title="multi-release" %}
`DeployMultiReleaseEscrowPayload`: same fields except no top-level `amount`; `roles` is `MultiReleaseRoles`; each milestone includes `amount` + `receiver`.

```ts
await client.rest.deployEscrow(payload, "multi-release");
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Deploy trustline shape: `{ contractId, symbol }` (Soroban SAC `C…` + asset code). Optional `attribution` maps to `X-TW-Platform` / `X-TW-Subject`.
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
import type { DeploySingleReleaseEscrowPayload } from "@trustless-work/escrow-js/types";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

const onDeploy = async (payload: DeploySingleReleaseEscrowPayload) => {
  try {
    const { unsignedXdr, contractId } = await client.rest.deployEscrow(
      payload,
      "single-release",
      { platformId, subjectId },
    );
    const signedXdr = await signWithWallet(unsignedXdr);
    const result = await client.rest.sendTransaction(signedXdr);
    // Prefer predicted contractId; result.contractId may also appear on confirm
    return { contractId, txHash: result.txHash };
  } catch (error: unknown) {
    const err = toTrustlessWorkError(error);
    if (err instanceof TrustlessWorkApiError) {
      console.error(formatApiErrorMessage(err));
    }
    throw error;
  }
};
```

See [Operate](/escrow-js-sdk/operate) and [sendTransaction](/escrow-js-sdk/sendtransaction).
