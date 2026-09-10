/**
 * Entity types (v2 on-chain / deploy shapes)
 */
export type { SingleReleaseEscrow } from "./types.entity";
export type { MultiReleaseEscrow } from "./types.entity";
export type { Escrow } from "./types.entity";
export type { SingleReleaseMilestone } from "./types.entity";
export type { MultiReleaseMilestone } from "./types.entity";
export type { MilestoneApprovals } from "./types.entity";
export type { MilestoneDispute } from "./types.entity";
export type { Dispute } from "./types.entity";
export type { Roles } from "./types.entity";
export type { MultiReleaseRoles } from "./types.entity";
export type { Role } from "./types.entity";
export type { Trustline } from "./types.entity";
export type { DeployTrustline } from "./types.entity";

/**
 * Snapshot types (camelCased on-chain state in read rows)
 */
export type {
  EscrowSnapshot,
  EscrowSnapshotFor,
  SingleReleaseEscrowSnapshot,
  MultiReleaseEscrowSnapshot,
  SnapshotMultiReleaseMilestone,
} from "./escrow.snapshot";

/**
 * Read-model types
 */
export type {
  EscrowSummary,
  EscrowAsset,
  EscrowEvent,
  EscrowDeposit,
  EscrowFinancial,
  EscrowNextRelease,
  EscrowDetailsItem,
  EscrowDetail,
  EscrowMilestones,
  KeysetPage,
} from "./escrow.read";

/**
 * Error types (RFC 9457 Problem Details + escrow codes)
 */
export type {
  ApiProblemDetails,
  EscrowApiProblemDetails,
  EscrowKind,
  EscrowProblemExtensions,
  ApiErrorCode,
  GeneralApiErrorCode,
} from "./types.error";
export { ESCROW_ERROR_CODES, isEscrowErrorCode } from "./escrow-error-codes";
export type { EscrowErrorCode } from "./escrow-error-codes";

/**
 * Response types
 */
export type { BuildTransactionResponse } from "./types.response";
export type { DeployEscrowResponse } from "./types.response";
export type { SendTransactionResponse } from "./types.response";
export type { SendTransactionCode } from "./types.response";
export type { ListEscrowsResponse } from "./types.response";
export type { GetEscrowResponse } from "./types.response";
export type { BatchEscrowDetailsResponse } from "./types.response";
export type { ListEscrowEventsResponse } from "./types.response";
export type { GetEscrowMilestonesResponse } from "./types.response";
export type { BatchEscrowMilestonesResponse } from "./types.response";
export type { BatchEscrowFinancialResponse } from "./types.response";

/**
 * Core types
 */
export type { baseURL } from "./types";
export type { EscrowType } from "./types";
export type { EscrowStatus } from "./types";
export type { EscrowNetwork } from "./types";

/**
 * Payload / params types
 */
export type { Distribution } from "./types.payload";
export type { AttributionHeaders } from "./types.payload";
export type { SingleReleaseMilestonePayload } from "./types.payload";
export type { MultiReleaseMilestonePayload } from "./types.payload";
export type { DeploySingleReleaseEscrowPayload } from "./types.payload";
export type { DeployMultiReleaseEscrowPayload } from "./types.payload";
export type { UpdateSingleReleaseEscrowProperties } from "./types.payload";
export type { UpdateMultiReleaseEscrowProperties } from "./types.payload";
export type { UpdateSingleReleaseEscrowPayload } from "./types.payload";
export type { UpdateMultiReleaseEscrowPayload } from "./types.payload";
export type { MilestoneStatusUpdate } from "./types.payload";
export type { ChangeMilestoneStatusPayload } from "./types.payload";
export type { ApproveMilestonesPayload } from "./types.payload";
export type { ApproveAndReleaseMilestonesPayload } from "./types.payload";
export type { SingleReleaseMilestoneDescriptionUpdate } from "./types.payload";
export type { MultiReleaseMilestoneDescriptionUpdate } from "./types.payload";
export type { ManageSingleReleaseMilestonesPayload } from "./types.payload";
export type { ManageMultiReleaseMilestonesPayload } from "./types.payload";
export type { SingleReleaseStartDisputePayload } from "./types.payload";
export type { MultiReleaseStartDisputePayload } from "./types.payload";
export type { SingleReleaseResolveDisputePayload } from "./types.payload";
export type { MultiReleaseResolveDisputePayload } from "./types.payload";
export type { SingleReleaseWithdrawRemainingFundsPayload } from "./types.payload";
export type { MultiReleaseWithdrawRemainingFundsPayload } from "./types.payload";
export type { FundEscrowPayload } from "./types.payload";
export type { SingleReleaseReleaseFundsPayload } from "./types.payload";
export type { MultiReleaseReleaseFundsPayload } from "./types.payload";
export type { ListEscrowsParams } from "./types.payload";
export type { BatchContractIdsParams } from "./types.payload";
export type { ListEscrowEventsParams } from "./types.payload";
