import type { EscrowNetwork, EscrowStatus, EscrowType } from "./types";
import type {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "./types.entity";
import type { EscrowSnapshot } from "./escrow.snapshot";

/**
 * Resolved trustline asset on read-model rows (Core API root `asset`).
 */
export type EscrowAsset = {
  name: string | null;
  address: string | null;
  contractId: string | null;
};

/**
 * Escrow read-model row (list + detail). Identified only by `contractId`.
 */
export type EscrowSummary = {
  network: EscrowNetwork;
  contractId: string;
  type: EscrowType;
  engagementId: string;
  status: EscrowStatus;
  /**
   * Total escrowed value in token units (decimal string): the single-release
   * amount, or the sum of milestone amounts for multi-release. Null until the
   * first on-chain state is projected.
   */
  amount: string | null;
  /** Projected balance (deposited − released) in human token units. Always present. */
  balance: string;
  /** Resolved trustline token; null until first projection. */
  asset: EscrowAsset | null;
  lastLedgerSeq: string;
  createdAt: string;
  updatedAt: string;
  snapshot: EscrowSnapshot;
};

/**
 * Indexed escrow event — `topics` + camelCased `payload` (no event `id`).
 */
export type EscrowEvent = {
  kind: string;
  actor: string | null;
  ledgerSeq: string;
  txHash: string;
  ledgerClosedAt: string;
  topics: string[];
  payload: Record<string, unknown>;
};

/**
 * Deposit recorded against an escrow (no deposit `id`).
 */
export type EscrowDeposit = {
  fromAddress: string;
  amount: string;
  asset: string;
  txHash?: string;
  ledgerSeq?: string;
  ledgerClosedAt?: string;
};

/**
 * Next release hint on financial batch rows.
 */
export type EscrowNextRelease = {
  /** Milestone carrying the tranche. Null for single-release. */
  milestoneIndex: number | null;
  amount: string;
};

/**
 * Batch financial summary (`GET /escrows/financial`).
 * `balance` is deposited − released (was `balanceProjected`).
 */
export type EscrowFinancial = {
  contractId: string;
  type: EscrowType;
  /** Legacy plain string (`USDC:G...`); prefer `EscrowSummary.asset` on list/detail. */
  asset: string;
  platformFee: string;
  /**
   * Total escrowed value in token units (decimal string). Null until the first
   * on-chain state is projected.
   */
  amount: string | null;
  totalDeposited: string;
  totalReleased: string;
  pendingRelease: string;
  nextRelease: EscrowNextRelease | null;
  balance: string;
};

/**
 * Keyset page envelope used by list + events endpoints.
 */
export type KeysetPage<T> = {
  data: T[];
  hasMore: boolean;
  nextCursor: string | null;
};

/**
 * One entry from `GET /escrows/details`.
 */
export type EscrowDetailsItem = {
  escrow: EscrowSummary;
  deposits: EscrowDeposit[];
};

/**
 * `GET /escrows/:contractId` body.
 */
export type EscrowDetail = {
  escrow: EscrowSummary;
  events: EscrowEvent[];
  deposits: EscrowDeposit[];
};

/**
 * `GET /escrows/:contractId/milestones` body.
 */
export type EscrowMilestones = {
  contractId: string;
  type: EscrowType;
  milestones: SingleReleaseMilestone[] | MultiReleaseMilestone[];
};
