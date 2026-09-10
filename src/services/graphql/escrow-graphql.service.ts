import { TrustlessWorkApiError } from "../../errors/trustless-work-api-error";
import type { HttpTransport } from "../../transport/http-transport";
import { GRAPHQL_GET_ESCROW, GRAPHQL_LIST_ESCROWS } from "./documents";
import type {
  GraphqlEscrow,
  GraphqlEscrowPage,
  GraphqlExecuteOptions,
  GraphqlFormattedError,
  GraphqlGetEscrowVariables,
  GraphqlListEscrowsVariables,
  GraphqlResponse,
} from "./types";

export class GraphqlRequestError extends Error {
  readonly errors: GraphqlFormattedError[];
  readonly data: unknown;

  constructor(errors: GraphqlFormattedError[], data?: unknown) {
    const message =
      errors.map((e) => e.message).join("; ") || "GraphQL request failed";
    super(message);
    this.name = "GraphqlRequestError";
    this.errors = errors;
    this.data = data;
  }
}

/**
 * GraphQL escrow reads — `POST /graphql` (`escrow` / `escrows` only).
 * Operate / build-XDR stays on {@link EscrowRestService}.
 */
export class EscrowGraphqlService {
  constructor(private readonly http: HttpTransport) {}

  private async execute<TData>(options: GraphqlExecuteOptions): Promise<TData> {
    const body = {
      query: options.query,
      variables: options.variables,
      operationName: options.operationName,
    };

    let response: GraphqlResponse<TData>;
    try {
      response = await this.http.request<GraphqlResponse<TData>>({
        method: "POST",
        url: "/graphql",
        data: body,
      });
    } catch (error) {
      if (error instanceof TrustlessWorkApiError) {
        throw error;
      }
      throw error;
    }

    if (response.errors && response.errors.length > 0) {
      throw new GraphqlRequestError(response.errors, response.data);
    }

    if (response.data === undefined) {
      throw new GraphqlRequestError(
        [{ message: "GraphQL response missing data" }],
        response.data,
      );
    }

    return response.data;
  }

  getEscrow(variables: GraphqlGetEscrowVariables) {
    const contractId =
      typeof variables.contractId === "string"
        ? variables.contractId.trim()
        : "";

    if (!contractId) {
      return Promise.reject(
        new Error(
          "GraphQL getEscrow requires a non-empty variables.contractId (String!)",
        ),
      );
    }

    const requestVariables: Record<string, unknown> = {
      contractId,
      eventsLimit: variables.eventsLimit ?? 20,
    };

    if (variables.eventsCursor) {
      requestVariables.eventsCursor = variables.eventsCursor;
    }

    if (variables.eventsOrder) {
      requestVariables.eventsOrder = variables.eventsOrder;
    }

    return this.execute<{ escrow: GraphqlEscrow }>({
      query: GRAPHQL_GET_ESCROW,
      operationName: "GetEscrow",
      variables: requestVariables,
    }).then((data) => data.escrow);
  }

  listEscrows(variables: GraphqlListEscrowsVariables = {}) {
    const requestVariables: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined && value !== null && value !== "") {
        requestVariables[key] = value;
      }
    }

    return this.execute<{ escrows: GraphqlEscrowPage }>({
      query: GRAPHQL_LIST_ESCROWS,
      operationName: "ListEscrows",
      variables: requestVariables,
    }).then((data) => data.escrows);
  }
}
