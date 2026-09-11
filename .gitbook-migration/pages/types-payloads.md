---
description: Operate payloads — deploy, update, fund, release, dispute, and milestone management.
---

# Payloads

What you pass into deploy / update / fund / release / dispute methods. Amounts here are human **numbers**.

Milestone **payloads** for deploy are leaner than full entity milestones.

## Milestone payloads (deploy / manage)

```ts
type SingleReleaseMilestonePayload = {
  description: string;
  status?: string;
  approvalsTarget: number;
};

type MultiReleaseMilestonePayload = {
  description: string;
  status?: string;
  approvalsTarget: number;
  amount: number;
  receiver: string;
};
```

## Deploy

{% tabs %}
{% tab title="Single-release" %}
```ts
type DeploySingleReleaseEscrowPayload = {
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  amount: number;
  platformFee: number;
  roles: Roles;
  milestones: SingleReleaseMilestonePayload[];
  trustline: DeployTrustline;
};
```
{% endtab %}

{% tab title="Multi-release" %}
```ts
type DeployMultiReleaseEscrowPayload = {
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  platformFee: number;
  roles: MultiReleaseRoles;
  milestones: MultiReleaseMilestonePayload[];
  trustline: DeployTrustline;
};
```
{% endtab %}
{% endtabs %}

Optional attribution headers (platform-scoped calls):

```ts
type AttributionHeaders = {
  platformId?: string; // → X-TW-Platform
  subjectId?: string;  // → X-TW-Subject
};
```

## Update (full replace)

```ts
type UpdateSingleReleaseEscrowPayload = {
  contractId: string;
  admin: string;
  escrow: {
    engagementId: string;
    title: string;
    description: string;
    amount: number;
    platformFee: number;
    roles: Roles;
    milestones: SingleReleaseMilestonePayload[];
    trustline: Trustline;
  };
};

type UpdateMultiReleaseEscrowPayload = {
  contractId: string;
  admin: string;
  escrow: {
    engagementId: string;
    title: string;
    description: string;
    platformFee: number;
    roles: MultiReleaseRoles;
    milestones: MultiReleaseMilestonePayload[];
    trustline: Trustline;
  };
};
```

## Fund

```ts
type FundEscrowPayload = {
  amount: number;
  contractId: string;
  signer: string;
};
```

## Change milestone status

```ts
type ChangeMilestoneStatusPayload = {
  contractId: string;
  serviceProvider: string;
  updates: Array<{
    index: number;
    newStatus: string;
    newEvidence?: string;
  }>;
};
```

## Approve milestones

```ts
type ApproveMilestonesPayload = {
  contractId: string;
  approver: string;
  milestoneIndexes: number[];
};
```

## Approve and release (multi convenience)

```ts
type ApproveAndReleaseMilestonesPayload = {
  contractId: string;
  signer: string;
  milestoneIndexes: number[];
};
```

## Manage milestones (add / edit descriptions)

```ts
type ManageSingleReleaseMilestonesPayload = {
  contractId: string;
  admin: string;
  newMilestones: SingleReleaseMilestonePayload[];
  milestoneUpdates: Array<{
    index: number;
    newDescription?: string;
  }>;
};

type ManageMultiReleaseMilestonesPayload = {
  contractId: string;
  admin: string;
  newMilestones: MultiReleaseMilestonePayload[];
  milestoneUpdates: Array<{
    index: number;
    newDescription?: string;
    newAmount?: number;
  }>;
};
```

## Release funds

{% tabs %}
{% tab title="Single-release" %}
```ts
type SingleReleaseReleaseFundsPayload = {
  contractId: string;
  releaseSigner: string;
};
```
{% endtab %}

{% tab title="Multi-release" %}
```ts
type MultiReleaseReleaseFundsPayload = {
  contractId: string;
  releaseSigner: string;
  milestoneIndexes: number[];
};
```
{% endtab %}
{% endtabs %}

## Start dispute

{% tabs %}
{% tab title="Single-release" %}
```ts
type SingleReleaseStartDisputePayload = {
  contractId: string;
  signer: string;
  reason: string;
};
```
{% endtab %}

{% tab title="Multi-release" %}
```ts
type MultiReleaseStartDisputePayload = {
  contractId: string;
  signer: string;
  reason: string;
  milestoneIndexes: number[];
};
```
{% endtab %}
{% endtabs %}

## Resolve dispute / withdraw remaining

Shared distribution entry:

```ts
type Distribution = {
  address: string;
  amount: number;
};
```

{% tabs %}
{% tab title="Resolve — single" %}
```ts
type SingleReleaseResolveDisputePayload = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
};
```
{% endtab %}

{% tab title="Resolve — multi" %}
```ts
type MultiReleaseResolveDisputePayload = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
  milestoneIndexes: number[];
};
```
{% endtab %}

{% tab title="Withdraw remaining" %}
```ts
type SingleReleaseWithdrawRemainingFundsPayload = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
};

type MultiReleaseWithdrawRemainingFundsPayload = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
};
```
{% endtab %}
{% endtabs %}

See [Entities](/escrow-js-sdk/types/entities) for `Roles`, `Trustline`, and `DeployTrustline`.
