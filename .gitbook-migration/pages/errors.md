---
description: RFC 9457 Problem Details — TrustlessWorkApiError, TrustlessWorkNetworkError, and helpers.
---

# Errors

HTTP failures from Core are RFC 9457 Problem Details. The fetch transport surfaces them as `TrustlessWorkApiError`. Non-problem HTTP failures throw `TrustlessWorkNetworkError`.

### Core exports

```ts
import {
  toTrustlessWorkError,
  TrustlessWorkApiError,
  TrustlessWorkNetworkError,
  formatApiErrorMessage,
  parseProblemDetails,
  parseProblemDetailsFromResponse,
  isProblemDetails,
  ESCROW_ERROR_CODES,
  isEscrowErrorCode,
} from "@trustless-work/escrow-js";
```

| Helper | Role |
| --- | --- |
| `toTrustlessWorkError` | Normalize thrown values → `TrustlessWorkApiError` when body is Problem Details |
| `TrustlessWorkApiError` | Typed error with `code`, `status`, `detail`, `traceId`, `extensions`, … |
| `TrustlessWorkNetworkError` | Non-problem HTTP failure (`status` + raw `body`) |
| `formatApiErrorMessage` | One-liner for logs (`[CODE] detail (trace: …)`) |
| `parseProblemDetails` | Parse unknown JSON into `ApiProblemDetails` |
| `parseProblemDetailsFromResponse` | Extract Problem Details from status + body (fetch equivalent of Axios helper) |
| `isProblemDetails` | Type guard |
| `ESCROW_ERROR_CODES` / `isEscrowErrorCode` | Known escrow machine codes |

### Example

```ts
try {
  await client.rest.fundEscrow(payload, "single-release");
} catch (error: unknown) {
  const err = toTrustlessWorkError(error);
  if (err instanceof TrustlessWorkApiError) {
    // err.code, err.status, err.detail, err.traceId, err.extensions
    console.error(formatApiErrorMessage(err));
    if (err.code === ESCROW_ERROR_CODES.ESCROW_NOT_FOUND) {
      // handle missing contract
    }
  }
  if (error instanceof TrustlessWorkNetworkError) {
    console.error(error.status, error.body);
  }
}
```

### `TrustlessWorkApiError` fields

| Accessor | Source |
| --- | --- |
| `status` | HTTP status |
| `code` | Machine-readable code |
| `detail` / `message` | Human detail |
| `traceId` | Correlation id |
| `type` / `title` / `instance` | Problem Details metadata |
| `extensions` | Optional escrow extensions |
| `isEscrowError()` / `asEscrowProblem()` | Narrow to known escrow codes |

{% hint style="info" %}
Operate and read methods throw the same error classes. Always catch as `unknown` and normalize with `toTrustlessWorkError`.
{% endhint %}
