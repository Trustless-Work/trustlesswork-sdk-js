import { isEscrowErrorCode } from "../types/escrow-error-codes";
import type {
  ApiProblemDetails,
  EscrowApiProblemDetails,
  EscrowProblemExtensions,
} from "../types/types.error";

/**
 * Thrown when the API responds with an RFC 9457 Problem Details body.
 */
export class TrustlessWorkApiError extends Error {
  readonly problem: ApiProblemDetails;

  constructor(problem: ApiProblemDetails) {
    super(problem.detail);
    this.name = "TrustlessWorkApiError";
    this.problem = problem;
  }

  get status(): number {
    return this.problem.status;
  }

  get code(): ApiProblemDetails["code"] {
    return this.problem.code;
  }

  get traceId(): string | undefined {
    return this.problem.traceId;
  }

  get type(): string {
    return this.problem.type;
  }

  get title(): string {
    return this.problem.title;
  }

  get instance(): string | undefined {
    return this.problem.instance;
  }

  get detail(): string {
    return this.problem.detail;
  }

  get extensions(): EscrowProblemExtensions | undefined {
    return this.problem.extensions;
  }

  isEscrowError(): boolean {
    return isEscrowErrorCode(this.problem.code);
  }

  /** Narrows when `code` is a known escrow contract error. */
  asEscrowProblem(): EscrowApiProblemDetails | undefined {
    if (!this.isEscrowError()) return undefined;
    return this.problem as EscrowApiProblemDetails;
  }
}
