import { TrustlessWorkClient, type TrustlessWorkClientOptions } from "./client";
import type { EscrowGraphqlService } from "./services/graphql";
import type { EscrowRestService } from "./services/rest";

let defaultClient: TrustlessWorkClient | null = null;

/**
 * Configure a module-level default client (vanilla equivalent of React's `TrustlessWorkConfig`).
 */
export function configureTrustlessWork(
  options: TrustlessWorkClientOptions,
): TrustlessWorkClient {
  defaultClient = new TrustlessWorkClient(options);
  return defaultClient;
}

/**
 * Returns the configured default client, or throws if `configureTrustlessWork` was not called.
 */
export function getTrustlessWorkClient(): TrustlessWorkClient {
  if (!defaultClient) {
    throw new Error(
      "Trustless Work client is not configured. Call configureTrustlessWork() first, or create a TrustlessWorkClient instance directly.",
    );
  }
  return defaultClient;
}

/** REST escrow service from the default client. */
export function escrowRest(): EscrowRestService {
  return getTrustlessWorkClient().rest;
}

/** GraphQL escrow service from the default client. */
export function escrowGraphql(): EscrowGraphqlService {
  return getTrustlessWorkClient().graphql;
}

/**
 * Reset the module-level default client (useful in tests).
 */
export function resetTrustlessWorkClient(): void {
  defaultClient = null;
}
