/**
 * GraphQL surface — escrow reads via `POST /graphql`.
 */
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
export { escrowGraphql } from "./config";
