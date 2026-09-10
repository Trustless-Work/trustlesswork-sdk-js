import type { EscrowErrorCode } from "./escrow-error-codes";

/**
 * On-chain / adapter discriminator echoed in Problem Details `extensions`.
 * Matches `EscrowKind` in Trustless-Work-Core.
 */
export type EscrowKind =
  | "single-release"
  | "single-release-v2"
  | "multi-release"
  | "multi-release-v2";

/**
 * Structured context for escrow contract / simulation failures.
 */
export type EscrowProblemExtensions = {
  contractId?: string;
  escrowKind?: EscrowKind;
  method?: string;
  contractCode?: number;
  errors?: string[];
};

/**
 * Non-escrow codes emitted by Core's HTTP layer (auth, validation, infra).
 */
export type GeneralApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "TOO_MANY_REQUESTS"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR"
  | "HTTP_ERROR"
  | "STELLAR_SIMULATION_MISSING"
  | "STELLAR_SIMULATION_FAILED";

export type ApiErrorCode =
  | EscrowErrorCode
  | GeneralApiErrorCode
  | (string & {});

/**
 * RFC 9457 Problem Details returned by Trustless Work Core on any error.
 *
 * `code` and `traceId` are hoisted to the top level (see Core `ProblemDetails`).
 */
export type ApiProblemDetails = {
  type: string;
  title: string;
  status: number;
  code: ApiErrorCode;
  detail: string;
  instance?: string;
  traceId?: string;
  extensions?: EscrowProblemExtensions & Record<string, unknown>;
};

/** Problem Details whose `code` is a known escrow contract error. */
export type EscrowApiProblemDetails = Omit<ApiProblemDetails, "code"> & {
  code: EscrowErrorCode;
  extensions?: EscrowProblemExtensions;
};
