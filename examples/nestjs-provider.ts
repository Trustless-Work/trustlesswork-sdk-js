/**
 * NestJS — injectable provider pattern.
 *
 * ```ts
 * @Module({
 *   providers: [
 *     {
 *       provide: TrustlessWorkClient,
 *       useFactory: () =>
 *         new TrustlessWorkClient({
 *           baseURL: process.env.TW_BASE_URL!,
 *           apiKey: process.env.TW_API_KEY,
 *           getAccessToken: async () => getSessionToken(),
 *         }),
 *     },
 *   ],
 *   exports: [TrustlessWorkClient],
 * })
 * export class TrustlessWorkModule {}
 * ```
 */
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

export function createTrustlessWorkClient(): TrustlessWorkClient {
  return new TrustlessWorkClient({
    baseURL: process.env.TW_BASE_URL ?? development,
    apiKey: process.env.TW_API_KEY,
    getAccessToken: async () => process.env.TW_ACCESS_TOKEN ?? null,
    defaultHeaders: {
      "X-TW-Platform": process.env.TW_PLATFORM_ID ?? "",
    },
  });
}

// In a service:
// constructor(private readonly tw: TrustlessWorkClient) {}
// await this.tw.rest.listEscrows({ scope: "mine" });
