/**
 * Framework-agnostic Trustless Work escrow SDK.
 */
export {
  configureTrustlessWork,
  escrowGraphql,
  escrowRest,
  getTrustlessWorkClient,
  resetTrustlessWorkClient,
} from "./config";
export { TrustlessWorkClient } from "./client";
export type { TrustlessWorkClientOptions } from "./client";

export { EscrowRestService } from "./services/rest";
export {
  EscrowGraphqlService,
  GraphqlRequestError,
  GRAPHQL_GET_ESCROW,
  GRAPHQL_LIST_ESCROWS,
} from "./services/graphql";
export type {
  GraphqlEscrow,
  GraphqlEscrowDeposit,
  GraphqlEscrowEvent,
  GraphqlEscrowEventPage,
  GraphqlEscrowFinancial,
  GraphqlEscrowPage,
  GraphqlEscrowParticipant,
  GraphqlEscrowScope,
  GraphqlEscrowSort,
  GraphqlFormattedError,
  GraphqlGetEscrowVariables,
  GraphqlListEscrowsVariables,
  GraphqlNextRelease,
  GraphqlResponse,
  GraphqlSortOrder,
} from "./services/graphql";

/**
 * Core API base URL (current hosted environment).
 * Pass an explicit `baseURL` string when you need a different host.
 */
export const mainNet = "https://beta.api.trustlesswork.com";
export const development = "https://beta.api.trustlesswork.com";

export * from "./types";
export * from "./errors";
