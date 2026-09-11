---
description: Roles, milestones, trustline, and on-chain escrow entity shapes.
---

# Entities

These are the **on-chain / post-submit** shapes. For list and detail UI, prefer the **read model** (`EscrowSummary`) in [Reads & responses](/escrow-js-sdk/types/reads-and-responses).

## Roles

v2 roles use **arrays** for operational wallets. Single-release keeps an escrow-level `receiver`. Multi-release puts `receiver` on each milestone instead.

### Single-release — `Roles`

```ts
type Roles = {
  approvers: string[];        // G… wallets that approve milestones
  serviceProviders: string[]; // who delivers work / updates status
  platform: string;           // platform fee address
  releaseSigners: string[];   // who can release funds
  disputeResolvers: string[]; // who can resolve disputes
  receiver: string;           // who receives the single payout
  admin: string;              // who can update / manage milestones
  observers?: string[];       // optional watchers
};
```

### Multi-release — `MultiReleaseRoles`

Same as `Roles`, **without** `receiver` (each milestone has its own):

```ts
type MultiReleaseRoles = {
  approvers: string[];
  serviceProviders: string[];
  platform: string;
  releaseSigners: string[];
  disputeResolvers: string[];
  admin: string;
  observers?: string[];
};
```

### Role filter — `Role`

Used when filtering lists (`ListEscrowsParams.role`):

```ts
type Role =
  | "approver"
  | "serviceProvider"
  | "platform"
  | "releaseSigner"
  | "disputeResolver"
  | "receiver"
  | "admin"
  | "observer"
  | "signer";
```

## Trustline

### On deploy — `DeployTrustline`

```ts
type DeployTrustline = {
  contractId: string; // Soroban SAC contract id (C…)
  symbol: string;     // e.g. "USDC"
};
```

### On read / snapshot — `Trustline`

```ts
type Trustline = {
  address: string;     // issuer or related address
  symbol?: string;
  contractId?: string; // SAC id when present
};
```

## Milestones

### Approvals — `MilestoneApprovals`

```ts
type MilestoneApprovals = {
  target: number;         // how many approvals are required
  approvalCount: number;  // how many have approved so far
  approvedBy: string[];   // G… wallets that already approved
};
```

### Single-release milestone — `SingleReleaseMilestone`

```ts
type SingleReleaseMilestone = {
  description: string;
  status?: string;           // free-form status label
  evidence?: string;         // optional proof / link
  approvalsTarget?: number;
  approvals?: MilestoneApprovals;
};
```

### Multi-release milestone — `MultiReleaseMilestone`

```ts
type MultiReleaseMilestone = {
  description: string;
  amount: number;            // payout for this milestone
  receiver: string;          // G… who receives this milestone
  status?: string;
  evidence?: string;
  approvalsTarget?: number;
  approvals?: MilestoneApprovals;
  released?: boolean;
  dispute?: {
    isDisputed: boolean;
    reason: string;
    resolved: boolean;
  };
};
```

### Escrow-level dispute (single-release) — `Dispute`

```ts
type Dispute = {
  isDisputed: boolean;
  reason: string;
  resolved: boolean;
};
```

## Escrow entities

{% tabs %}
{% tab title="Single-release" %}
```ts
type SingleReleaseEscrow = {
  type: "single-release";
  contractId: string;
  contractBaseId?: string;
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  platformFee: number;
  balance: number;
  amount: number;
  transactionHash?: string | null;
  trustline: Trustline;
  roles: Roles;
  milestones: SingleReleaseMilestone[];
  dispute?: Dispute;
  released?: boolean;
};
```
{% endtab %}

{% tab title="Multi-release" %}
```ts
type MultiReleaseEscrow = {
  type: "multi-release";
  contractId: string;
  contractBaseId?: string;
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  platformFee: number;
  balance: number;
  transactionHash?: string | null;
  trustline: Trustline;
  roles: MultiReleaseRoles;
  milestones: MultiReleaseMilestone[];
};
```

{% hint style="info" %}
There is **no escrow-level `amount`**. Total value is the sum of milestone `amount`s.
{% endhint %}
{% endtab %}
{% endtabs %}

`Escrow` is either single or multi:

```ts
type Escrow = SingleReleaseEscrow | MultiReleaseEscrow;
```
