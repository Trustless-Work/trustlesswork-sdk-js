import {
  formatApiErrorMessage,
  isProblemDetails,
  parseProblemDetailsFromResponse,
  toTrustlessWorkError,
} from "../src/errors";
import { TrustlessWorkApiError } from "../src/errors/trustless-work-api-error";
import { TrustlessWorkNetworkError } from "../src/errors/trustless-work-network-error";
import { ESCROW_ERROR_CODES, isEscrowErrorCode } from "../src/types";

const sampleProblem = {
  type: "about:blank",
  title: "Not Found",
  status: 404,
  code: ESCROW_ERROR_CODES.ESCROW_NOT_FOUND,
  detail: "Escrow not found",
  traceId: "trace-123",
};

describe("errors", () => {
  it("isProblemDetails validates RFC 9457 shape", () => {
    expect(isProblemDetails(sampleProblem)).toBe(true);
    expect(isProblemDetails({ detail: "missing fields" })).toBe(false);
  });

  it("parseProblemDetailsFromResponse returns problem body", () => {
    expect(parseProblemDetailsFromResponse(404, sampleProblem)).toEqual(
      sampleProblem,
    );
  });

  it("toTrustlessWorkError maps network error with problem body", () => {
    const network = new TrustlessWorkNetworkError("fail", 404, sampleProblem);
    const err = toTrustlessWorkError(network);
    expect(err).toBeInstanceOf(TrustlessWorkApiError);
    expect((err as TrustlessWorkApiError).code).toBe(
      ESCROW_ERROR_CODES.ESCROW_NOT_FOUND,
    );
  });

  it("formatApiErrorMessage includes code and traceId", () => {
    const err = new TrustlessWorkApiError(sampleProblem);
    expect(formatApiErrorMessage(err)).toContain(
      ESCROW_ERROR_CODES.ESCROW_NOT_FOUND,
    );
    expect(formatApiErrorMessage(err)).toContain("trace-123");
  });

  it("isEscrowErrorCode narrows escrow codes", () => {
    expect(isEscrowErrorCode(ESCROW_ERROR_CODES.ESCROW_NOT_FOUND)).toBe(true);
    expect(isEscrowErrorCode("BAD_REQUEST")).toBe(false);
  });
});
