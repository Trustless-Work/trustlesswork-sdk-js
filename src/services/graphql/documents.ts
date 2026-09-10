/**
 * Named GraphQL documents for escrow reads (`POST /graphql`).
 * Schema: Query.escrow / Query.escrows.
 */

const ESCROW_CORE_FIELDS = `
  network
  contractId
  type
  engagementId
  status
  totalAmount
  balance
  asset {
    name
    address
    contractId
  }
  lastLedgerSeq
  createdAt
  updatedAt
  snapshot
  milestones
  participants {
    address
    role
    milestoneIndex
  }
`;

const ESCROW_FINANCIAL_FIELDS = `
  financial {
    balance
    pendingRelease
    totalDeposited
    totalReleased
    platformFee
    totalAmount
    nextRelease {
      milestoneIndex
      amount
    }
  }
`;

const ESCROW_DEPOSITS_FIELDS = `
  deposits {
    fromAddress
    amount
    asset
    ledgerClosedAt
    ledgerSeq
    txHash
  }
`;

const ESCROW_EVENTS_FIELDS = `
  events(limit: $eventsLimit, cursor: $eventsCursor, order: $eventsOrder) {
    data {
      kind
      actor
      ledgerSeq
      txHash
      ledgerClosedAt
      topics
      payload
    }
    hasMore
    nextCursor
  }
`;

export const GRAPHQL_GET_ESCROW = /* GraphQL */ `
  query GetEscrow(
    $contractId: String!
    $eventsLimit: Int
    $eventsCursor: String
    $eventsOrder: SortOrder
  ) {
    escrow(contractId: $contractId) {
      ${ESCROW_CORE_FIELDS}
      ${ESCROW_FINANCIAL_FIELDS}
      ${ESCROW_DEPOSITS_FIELDS}
      ${ESCROW_EVENTS_FIELDS}
    }
  }
`;

export const GRAPHQL_LIST_ESCROWS = /* GraphQL */ `
  query ListEscrows(
    $scope: EscrowScope
    $status: String
    $contractType: String
    $engagementId: String
    $contractIds: [String!]
    $participant: String
    $role: String
    $platformId: String
    $subjectId: String
    $createdAfter: DateTime
    $createdBefore: DateTime
    $limit: Int
    $cursor: String
    $sort: EscrowSort
    $order: SortOrder
  ) {
    escrows(
      scope: $scope
      status: $status
      contractType: $contractType
      engagementId: $engagementId
      contractIds: $contractIds
      participant: $participant
      role: $role
      platformId: $platformId
      subjectId: $subjectId
      createdAfter: $createdAfter
      createdBefore: $createdBefore
      limit: $limit
      cursor: $cursor
      sort: $sort
      order: $order
    ) {
      data {
        ${ESCROW_CORE_FIELDS}
        ${ESCROW_FINANCIAL_FIELDS}
        ${ESCROW_DEPOSITS_FIELDS}
      }
      hasMore
      nextCursor
    }
  }
`;
