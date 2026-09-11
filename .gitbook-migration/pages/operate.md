---
description: REST operate methods — build unsigned XDR, sign with your wallet, then send.
---

# Operate

Operate methods call Core **build** endpoints. Each returns an **unsigned** XDR. You sign it, then submit with [`sendTransaction`](/escrow-js-sdk/sendtransaction).

Import from `@trustless-work/escrow-js` or `@trustless-work/escrow-js/rest`.

### Methods

| Method                           | Action                                                 |
| -------------------------------- | ------------------------------------------------------ |
| [`deployEscrow`](/escrow-js-sdk/operate/deployescrow) | Create escrow (`unsignedXdr` + predicted `contractId`) |
| [`fundEscrow`](/escrow-js-sdk/operate/fundescrow) | Fund                                                   |
| [`updateEscrow`](/escrow-js-sdk/operate/updateescrow) | Update properties                                      |
| [`changeMilestoneStatus`](/escrow-js-sdk/operate/changemilestonestatus) | Status / evidence (batch)                              |
| [`approveMilestones`](/escrow-js-sdk/operate/approvemilestones) | Approve (batch)                                        |
| [`approveAndReleaseMilestones`](/escrow-js-sdk/operate/approveandreleasemilestones) | Approve + release (multi-release)                      |
| [`manageMilestones`](/escrow-js-sdk/operate/managemilestones) | Add / edit milestones                                  |
| [`releaseFunds`](/escrow-js-sdk/operate/releasefunds) | Release                                                |
| [`startDispute`](/escrow-js-sdk/operate/startdispute) | Start dispute                                          |
| [`resolveDispute`](/escrow-js-sdk/operate/resolvedispute) | Resolve dispute (distributions)                        |
| [`withdrawRemainingFunds`](/escrow-js-sdk/operate/withdrawremainingfunds) | Withdraw remaining                                     |

{% hint style="info" %}
Most operate methods take `(payload, type)` where `type` is `"single-release"` | `"multi-release"`. Multi-only helpers (`approveAndReleaseMilestones`, `releaseMilestones`, `disputeMilestones`) omit the type argument.
{% endhint %}

### Pattern

```ts
const { unsignedXdr } = await client.rest.fundEscrow(payload, "single-release");
const signedXdr = await signWithWallet(unsignedXdr);
const result = await client.rest.sendTransaction(signedXdr);
```

### Response types

| Step         | Type |
| ------------ | ---- |
| Deploy build | `DeployEscrowResponse` → `{ unsignedXdr, txHash, contractId }` |
| Other builds | `BuildTransactionResponse` → `{ unsignedXdr, txHash }` |
| Submit       | `SendTransactionResponse` |

Error handling: [Errors](/escrow-js-sdk/errors). Payload types: [Types](/escrow-js-sdk/types).
