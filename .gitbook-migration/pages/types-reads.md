---
description: Read-model rows, snapshots, list params, and build/send transaction responses.
---

# Reads & responses

List and detail rows use **decimal strings** for money fields. Build/send responses return unsigned XDR or submit results.

## Transaction responses

Returned by **build** (unsigned XDR) and **send** (after wallet signs).

```ts
type BuildTransactionResponse = {
  unsignedXdr: string;
  txHash: string;
};

type DeployEscrowResponse = {
  unsignedXdr: string;
  txHash: string;
  contractId: string; // predicted C… address before submit
};

type SendTransactionResponse = {
  txHash: string;
  ledger: number;
  contractId?: string;
  escrow?: Escrow | EscrowSummary;
  code?: "STELLAR_TX_SUBMITTED" | "STELLAR_TX_SUBMITTED_INDEXER_LAGGING";
  message?: string;
};
```

## Asset — `EscrowAsset`

```ts
type EscrowAsset = {
  name: string | null;
  address: string | null;
  contractId: string | null;
};
```

## List / detail row — `EscrowSummary`

```ts
type EscrowSummary = {
  network: string;
  contractId: string;
  type: EscrowType;
  engagementId: string;
  status: EscrowStatus;
  totalAmount: string | null; // multi: sum of milestones; null for single
  balance: string;            // deposited − released (always present)
  asset: EscrowAsset | null;
  lastLedgerSeq: string;
  createdAt: string;
  updatedAt: string;
  snapshot: EscrowSnapshot;   // title, roles, milestones, …
};
```

## Snapshot (inside `EscrowSummary`)

{% tabs %}
{% tab title="Single-release snapshot" %}
```ts
type SingleReleaseEscrowSnapshot = {
  title: string;
  description: string;
  engagementId: string;
  trustline: Trustline;
  platformFee: string; // decimal string
  amount: string;
  roles: Roles;
  milestones: SingleReleaseMilestone[];
  dispute?: Dispute;
  released?: boolean;
  flags?: Record<string, unknown>;
};
```
{% endtab %}

{% tab title="Multi-release snapshot" %}
```ts
type MultiReleaseEscrowSnapshot = {
  title: string;
  description: string;
  engagementId: string;
  trustline: Trustline;
  platformFee: string;
  roles: MultiReleaseRoles;
  milestones: Array<{
    description: string;
    amount: string; // decimal string on reads
    receiver: string;
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
  }>;
  flags?: Record<string, unknown>;
};
```
{% endtab %}
{% endtabs %}

```ts
type EscrowSnapshot = SingleReleaseEscrowSnapshot | MultiReleaseEscrowSnapshot;
```

## Detail — `EscrowDetail` / `GetEscrowResponse`

```ts
type EscrowEvent = {
  kind: string;
  actor: string | null;
  ledgerSeq: string;
  txHash: string;
  ledgerClosedAt: string;
  topics: string[];
  payload: Record<string, unknown>;
};

type EscrowDeposit = {
  fromAddress: string;
  amount: string;
  asset: string;
  txHash?: string;
  ledgerSeq?: string;
  ledgerClosedAt?: string;
};

type EscrowDetail = {
  escrow: EscrowSummary;
  events: EscrowEvent[];
  deposits: EscrowDeposit[];
};
```

## Pagination — `KeysetPage`

```ts
type KeysetPage = {
  data: EscrowSummary[]; // or EscrowEvent[] for events
  hasMore: boolean;
  nextCursor: string | null;
};

type ListEscrowsResponse = KeysetPage; // data: EscrowSummary[]
type ListEscrowEventsResponse = KeysetPage; // data: EscrowEvent[]
```

## Batch helpers

```ts
type EscrowDetailsItem = {
  escrow: EscrowSummary;
  deposits: EscrowDeposit[];
};

type BatchEscrowDetailsResponse = {
  data: EscrowDetailsItem[];
};

type EscrowMilestones = {
  contractId: string;
  type: EscrowType;
  milestones: SingleReleaseMilestone[] | MultiReleaseMilestone[];
};

type EscrowFinancial = {
  contractId: string;
  type: EscrowType;
  asset: string;
  platformFee: string;
  totalAmount: string;
  totalDeposited: string;
  totalReleased: string;
  pendingRelease: string;
  nextRelease: { milestoneIndex: number; amount: string } | null;
  balance: string;
};
```

## List query — `ListEscrowsParams`

```ts
type ListEscrowsParams = {
  scope?: "mine" | "all";
  status?: EscrowStatus;
  contractType?: EscrowType; // filter name; response field is `type`
  engagementId?: string;
  contractIds?: string[];
  participant?: string;
  role?: Role;
  platformId?: string;
  subjectId?: string;
  createdAfter?: string;
  createdBefore?: string;
  limit?: number;
  cursor?: string;
  sort?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
};

type BatchContractIdsParams = {
  contractIds: string[];
};

type ListEscrowEventsParams = {
  limit?: number;
  order?: "asc" | "desc";
  cursor?: string;
};
```

{% hint style="info" %}
Entity field definitions: [Entities](/escrow-js-sdk/types/entities). Operate bodies: [Payloads](/escrow-js-sdk/types/payloads).
{% endhint %}
