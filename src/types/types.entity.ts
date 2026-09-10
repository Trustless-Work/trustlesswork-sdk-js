import type { EscrowType } from "./types";

/**
 * Milestone approvals (v2 on-chain shape).
 */
export type MilestoneApprovals = {
  target: number;
  approvalCount: number;
  approvedBy: string[];
};

/**
 * Base milestone fields shared by single- and multi-release v2.
 */
type BaseMilestone = {
  description: string;
  status?: string;
  evidence?: string;
  approvalsTarget?: number;
  approvals?: MilestoneApprovals;
};

/**
 * Single-release milestone (v2).
 */
export type SingleReleaseMilestone = BaseMilestone;

/**
 * Per-milestone dispute state (multi-release v2).
 */
export type MilestoneDispute = {
  isDisputed: boolean;
  reason: string;
  resolved: boolean;
};

/**
 * Multi-release milestone (v2).
 */
export type MultiReleaseMilestone = BaseMilestone & {
  amount: number;
  receiver: string;
  dispute?: MilestoneDispute;
  released?: boolean;
};

/**
 * Escrow-level dispute (single-release v2).
 */
export type Dispute = {
  isDisputed: boolean;
  reason: string;
  resolved: boolean;
};

/**
 * Trustline on deploy — Soroban SAC contract id + asset symbol.
 */
export type DeployTrustline = {
  contractId: string;
  symbol: string;
};

/**
 * Trustline on read / snapshot (may include issuer address and SAC contract id).
 */
export type Trustline = {
  address: string;
  symbol?: string;
  contractId?: string;
};

/**
 * Roles (v2) — single-release. Operational roles are arrays.
 * `receiver` is escrow-level for single-release.
 */
export type Roles = {
  approvers: string[];
  serviceProviders: string[];
  platform: string;
  releaseSigners: string[];
  disputeResolvers: string[];
  receiver: string;
  admin: string;
  observers?: string[];
};

/**
 * Multi-release roles — no `receiver`; each milestone defines its own.
 */
export type MultiReleaseRoles = Omit<Roles, "receiver">;

/**
 * Role filter for list/query params.
 */
export type Role =
  | "approver"
  | "serviceProvider"
  | "platform"
  | "releaseSigner"
  | "disputeResolver"
  | "receiver"
  | "admin"
  | "observer"
  | "signer";

/**
 * Shared on-chain / deploy-time escrow fields (not the HTTP read-model row).
 */
type BaseEscrowFields = {
  type: EscrowType;
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
};

/**
 * Single-release escrow on-chain shape (snapshot / send-transaction).
 */
export type SingleReleaseEscrow = BaseEscrowFields & {
  roles: Roles;
  amount: number;
  milestones: SingleReleaseMilestone[];
  dispute?: Dispute;
  released?: boolean;
};

/**
 * Multi-release escrow on-chain shape (snapshot / send-transaction).
 */
export type MultiReleaseEscrow = BaseEscrowFields & {
  roles: MultiReleaseRoles;
  milestones: MultiReleaseMilestone[];
};

export type Escrow = SingleReleaseEscrow | MultiReleaseEscrow;
