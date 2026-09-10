/**
 * Base URL for the Trustless Work Core API.
 */
export type baseURL = string;

/**
 * Escrow contract family.
 */
export type EscrowType = "single-release" | "multi-release";

/**
 * Derived on-chain escrow status (read-model).
 */
export type EscrowStatus = "active" | "released" | "disputed";

/**
 * Network identifier returned by the Core API.
 */
export type EscrowNetwork = string;
