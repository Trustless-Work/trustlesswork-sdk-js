import type { Escrow } from "./types.entity";
import type {
  EscrowDeposit,
  EscrowDetail,
  EscrowDetailsItem,
  EscrowEvent,
  EscrowFinancial,
  EscrowMilestones,
  EscrowSummary,
  KeysetPage,
} from "./escrow.read";

/**
 * Build-step response for non-deploy escrow v2 operations (unsigned XDR).
 */
export type BuildTransactionResponse = {
  unsignedXdr: string;
  txHash: string;
};

/**
 * Deploy build-step response — includes predicted `contractId`.
 */
export type DeployEscrowResponse = BuildTransactionResponse & {
  contractId: string;
};

/**
 * Stable machine-readable codes from POST /stellar/send-transaction.
 */
export type SendTransactionCode =
  | "STELLAR_TX_SUBMITTED"
  | "STELLAR_TX_SUBMITTED_INDEXER_LAGGING";

/**
 * Submit-step response after signing and posting a transaction.
 * Factory deploy confirmation may include `contractId` + `escrow`.
 */
export type SendTransactionResponse = {
  txHash: string;
  ledger: number;
  contractId?: string;
  escrow?: Escrow | EscrowSummary;
  code?: SendTransactionCode;
  message?: string;
};

/** `GET /escrows` */
export type ListEscrowsResponse = KeysetPage<EscrowSummary>;

/** `GET /escrows/:contractId` */
export type GetEscrowResponse = EscrowDetail;

/** `GET /escrows/details` */
export type BatchEscrowDetailsResponse = {
  data: EscrowDetailsItem[];
};

/** `GET /escrows/:contractId/events` */
export type ListEscrowEventsResponse = KeysetPage<EscrowEvent>;

/** `GET /escrows/:contractId/milestones` */
export type GetEscrowMilestonesResponse = EscrowMilestones;

/** `GET /escrows/milestones` */
export type BatchEscrowMilestonesResponse = {
  data: EscrowMilestones[];
};

/** `GET /escrows/financial` */
export type BatchEscrowFinancialResponse = {
  data: EscrowFinancial[];
};

export type {
  EscrowDeposit,
  EscrowDetail,
  EscrowDetailsItem,
  EscrowEvent,
  EscrowFinancial,
  EscrowMilestones,
  EscrowSummary,
  KeysetPage,
};
