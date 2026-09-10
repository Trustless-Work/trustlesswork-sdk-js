/**
 * Thrown when an HTTP request fails without a Trustless Work Problem Details body.
 */
export class TrustlessWorkNetworkError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "TrustlessWorkNetworkError";
    this.status = status;
    this.body = body;
  }
}
