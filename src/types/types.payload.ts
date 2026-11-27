import type { EscrowStatus, EscrowType } from "./types";
import type {
  DeployTrustline,
  MultiReleaseRoles,
  Role,
  Roles,
  Trustline,
} from "./types.entity";

// ----------------- Shared -----------------

/**
 * Address → amount distribution entry (v2 resolve / withdraw).
 */
export type Distribution = {
  address: string;
  amount: number;
};

/**
 * Optional attribution headers for deploy (and other platform-scoped calls).
 */
export type AttributionHeaders = {
  /** Maps to `X-TW-Platform`. */
  platformId?: string;
  /** Maps to `X-TW-Subject`. */
  subjectId?: string;
};

// ----------------- Milestone payloads (deploy / manage) -----------------

export type SingleReleaseMilestonePayload = {
  description: string;
  status?: string;
  approvalsTarget: number;
};

export type MultiReleaseMilestonePayload = SingleReleaseMilestonePayload & {
  amount: number;
  receiver: string;
};

// ----------------- Deploy Escrow -----------------

export type DeploySingleReleaseEscrowPayload = {
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

export type DeployMultiReleaseEscrowPayload = {
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  platformFee: number;
  roles: MultiReleaseRoles;
  milestones: MultiReleaseMilestonePayload[];
  trustline: DeployTrustline;
};

// ----------------- Update Escrow -----------------

export type UpdateSingleReleaseEscrowProperties = {
  engagementId: string;
  title: string;
  description: string;
  amount: number;
  platformFee: number;
  roles: Roles;
  milestones: SingleReleaseMilestonePayload[];
  trustline: Trustline;
};

export type UpdateMultiReleaseEscrowProperties = Omit<
  UpdateSingleReleaseEscrowProperties,
  "amount" | "milestones" | "roles"
> & {
  roles: MultiReleaseRoles;
  milestones: MultiReleaseMilestonePayload[];
};

export type UpdateSingleReleaseEscrowPayload = {
  contractId: string;
  admin: string;
  escrow: UpdateSingleReleaseEscrowProperties;
};

export type UpdateMultiReleaseEscrowPayload = {
  contractId: string;
  admin: string;
  escrow: UpdateMultiReleaseEscrowProperties;
};

// ----------------- Batch milestone operations (v2) -----------------

export type MilestoneStatusUpdate = {
  index: number;
  newStatus: string;
  newEvidence?: string;
};

export type ChangeMilestoneStatusPayload = {
  contractId: string;
  serviceProvider: string;
  updates: MilestoneStatusUpdate[];
};

export type ApproveMilestonesPayload = {
  contractId: string;
  approver: string;
  milestoneIndexes: number[];
};

export type ApproveAndReleaseMilestonesPayload = {
  contractId: string;
  signer: string;
  milestoneIndexes: number[];
};

export type SingleReleaseMilestoneDescriptionUpdate = {
  index: number;
  newDescription?: string;
};

export type MultiReleaseMilestoneDescriptionUpdate =
  SingleReleaseMilestoneDescriptionUpdate & {
    newAmount?: number;
  };

export type ManageSingleReleaseMilestonesPayload = {
  contractId: string;
  admin: string;
  newMilestones: SingleReleaseMilestonePayload[];
  milestoneUpdates: SingleReleaseMilestoneDescriptionUpdate[];
};

export type ManageMultiReleaseMilestonesPayload = {
  contractId: string;
  admin: string;
  newMilestones: MultiReleaseMilestonePayload[];
  milestoneUpdates: MultiReleaseMilestoneDescriptionUpdate[];
};

// ----------------- Start Dispute -----------------

export type SingleReleaseStartDisputePayload = {
  contractId: string;
  signer: string;
  reason: string;
};

export type MultiReleaseStartDisputePayload =
  SingleReleaseStartDisputePayload & {
    milestoneIndexes: number[];
  };

// ----------------- Resolve Dispute -----------------

export type SingleReleaseResolveDisputePayload = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
};

export type MultiReleaseResolveDisputePayload =
  SingleReleaseResolveDisputePayload & {
    milestoneIndexes: number[];
  };

// ----------------- Withdraw Remaining Funds -----------------

export type SingleReleaseWithdrawRemainingFundsPayload =
  SingleReleaseResolveDisputePayload;

export type MultiReleaseWithdrawRemainingFundsPayload =
  SingleReleaseWithdrawRemainingFundsPayload;

// ----------------- Fund Escrow -----------------

export type FundEscrowPayload = {
  amount: number;
  contractId: string;
  signer: string;
};

// ----------------- Release Funds -----------------

export type SingleReleaseReleaseFundsPayload = {
  contractId: string;
  releaseSigner: string;
};

export type MultiReleaseReleaseFundsPayload =
  SingleReleaseReleaseFundsPayload & {
    milestoneIndexes: number[];
  };

// ----------------- CCTP cross-chain destination -----------------

/**
 * CCTP destination domain: 0=Ethereum, 1=Avalanche, 2=OP, 3=Arbitrum,
 * 5=Solana, 6=Base, 7=Polygon.
 */
export type CctpDestinationDomain = 0 | 1 | 2 | 3 | 5 | 6 | 7;

export type SingleReleaseSetCrossChainDestinationPayload = {
  contractId: string;
  /** Escrow receiver. Only they can sign. */
  receiver: string;
  destinationDomain: CctpDestinationDomain;
  /** EVM address (0x...) or, for Solana, a base58 wallet address. */
  recipientAddress: string;
};

export type MultiReleaseSetCrossChainDestinationPayload =
  SingleReleaseSetCrossChainDestinationPayload & {
    milestoneIndex: number;
  };

export type SingleReleaseClearCrossChainDestinationPayload = {
  contractId: string;
  /** Escrow receiver. Only they can sign. */
  receiver: string;
};

export type MultiReleaseClearCrossChainDestinationPayload =
  SingleReleaseClearCrossChainDestinationPayload & {
    milestoneIndex: number;
  };

export type SingleReleaseGetCrossChainDestinationParams = {
  contractId: string;
};

export type MultiReleaseGetCrossChainDestinationParams =
  SingleReleaseGetCrossChainDestinationParams & {
    milestoneIndex: number;
  };

// ----------------- Reads: list / batch params -----------------

/**
 * Query params for `GET /escrows`.
 * `type` filters by contract flavor and matches the response field `type`.
 */
export type ListEscrowsParams = {
  scope?: "mine" | "all";
  status?: EscrowStatus;
  /** `"single-release"` or `"multi-release"`. Sent as `?type=`. */
  type?: EscrowType;
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

export type BatchContractIdsParams = {
  contractIds: string[];
};

export type ListEscrowEventsParams = {
  limit?: number;
  order?: "asc" | "desc";
  cursor?: string;
};
