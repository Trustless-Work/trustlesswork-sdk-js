import type { EscrowStatus, EscrowType } from "../../types";
import type { EscrowAsset } from "../../types/escrow.read";
import type { EscrowSnapshot } from "../../types/escrow.snapshot";
import type { Role } from "../../types/types.entity";

/**
 * GraphQL wire types for escrow reads. Amounts on the graph are strings.
 */

export type GraphqlSortOrder = "asc" | "desc";

export type GraphqlEscrowScope = "mine" | "all";

export type GraphqlEscrowSort = "createdAt" | "updatedAt";

export type GraphqlEscrowParticipant = {
  address: string;
  role: string;
  milestoneIndex: number;
};

export type GraphqlEscrowDeposit = {
  fromAddress: string;
  amount: string;
  asset: string;
  ledgerClosedAt: string;
  ledgerSeq: string;
  txHash?: string | null;
};

export type GraphqlEscrowEvent = {
  kind: string;
  actor: string | null;
  ledgerSeq: string;
  txHash: string | null;
  ledgerClosedAt: string;
  topics: string[];
  payload: Record<string, unknown> | null;
};

export type GraphqlEscrowEventPage = {
  data: GraphqlEscrowEvent[];
  hasMore: boolean;
  nextCursor: string | null;
};

export type GraphqlNextRelease = {
  milestoneIndex: number | null;
  amount: string;
};

export type GraphqlEscrowFinancial = {
  balance: string;
  pendingRelease: string;
  totalDeposited: string;
  totalReleased: string;
  platformFee: string | null;
  totalAmount: string | null;
  nextRelease: GraphqlNextRelease | null;
};

export type GraphqlEscrow = {
  network: string;
  contractId: string;
  type: EscrowType | string | null;
  engagementId: string | null;
  status: EscrowStatus | string | null;
  totalAmount: string | null;
  balance: string;
  asset: EscrowAsset | null;
  lastLedgerSeq: string;
  createdAt: string;
  updatedAt: string;
  snapshot: EscrowSnapshot | Record<string, unknown> | null;
  milestones: unknown[];
  participants: GraphqlEscrowParticipant[];
  deposits?: GraphqlEscrowDeposit[];
  financial: GraphqlEscrowFinancial;
  events?: GraphqlEscrowEventPage;
};

export type GraphqlEscrowPage = {
  data: GraphqlEscrow[];
  hasMore: boolean;
  nextCursor: string | null;
};

export type GraphqlListEscrowsVariables = {
  scope?: GraphqlEscrowScope;
  status?: EscrowStatus | string;
  contractType?: EscrowType | string;
  engagementId?: string;
  contractIds?: string[];
  participant?: string;
  role?: Role | string;
  platformId?: string;
  subjectId?: string;
  createdAfter?: string;
  createdBefore?: string;
  limit?: number;
  cursor?: string;
  sort?: GraphqlEscrowSort;
  order?: GraphqlSortOrder;
};

export type GraphqlGetEscrowVariables = {
  contractId: string;
  eventsLimit?: number;
  eventsCursor?: string;
  eventsOrder?: GraphqlSortOrder;
};

export type GraphqlErrorLocation = {
  line: number;
  column: number;
};

export type GraphqlFormattedError = {
  message: string;
  locations?: GraphqlErrorLocation[];
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
};

export type GraphqlResponse<TData> = {
  data?: TData;
  errors?: GraphqlFormattedError[];
};

/** Internal execute payload (not part of the public GraphQL surface). */
export type GraphqlExecuteOptions = {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};
