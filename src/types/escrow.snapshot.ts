import type { EscrowType } from "./types";
import type {
  Dispute,
  MultiReleaseMilestone,
  MultiReleaseRoles,
  Roles,
  SingleReleaseMilestone,
  Trustline,
} from "./types.entity";

/**
 * Shared camelCased on-chain snapshot fields (Core v2 wire contract).
 */
type BaseEscrowSnapshot = {
  title: string;
  description: string;
  engagementId: string;
  trustline: Trustline;
  /** Human token units as decimal string on the read-model. */
  platformFee: string;
  flags?: Record<string, unknown>;
};

/** Milestone row embedded in read-model snapshots (amounts as decimal strings). */
export type SnapshotMultiReleaseMilestone = Omit<
  MultiReleaseMilestone,
  "amount"
> & {
  amount: string;
};

/**
 * Single-release on-chain snapshot.
 */
export type SingleReleaseEscrowSnapshot = BaseEscrowSnapshot & {
  roles: Roles;
  amount: string;
  milestones: SingleReleaseMilestone[];
  dispute?: Dispute;
  released?: boolean;
};

/**
 * Multi-release on-chain snapshot — amounts live on milestones.
 */
export type MultiReleaseEscrowSnapshot = BaseEscrowSnapshot & {
  roles: MultiReleaseRoles;
  milestones: SnapshotMultiReleaseMilestone[];
};

/**
 * Full on-chain contract state embedded in list/detail rows.
 */
export type EscrowSnapshot =
  | SingleReleaseEscrowSnapshot
  | MultiReleaseEscrowSnapshot;

/**
 * Narrow snapshot by escrow type.
 */
export type EscrowSnapshotFor<T extends EscrowType> = T extends "single-release"
  ? SingleReleaseEscrowSnapshot
  : MultiReleaseEscrowSnapshot;
