/**
 * Angular — injectable service wrapper.
 *
 * ```ts
 * @Injectable({ providedIn: "root" })
 * export class TrustlessWorkService {
 *   private readonly client = new TrustlessWorkClient({
 *     baseURL: environment.twBaseUrl,
 *     apiKey: environment.twApiKey,
 *     getAccessToken: () => this.auth.getAccessToken(),
 *   });
 *
 *   listEscrows() {
 *     return from(this.client.rest.listEscrows({ scope: "mine" }));
 *   }
 * }
 * ```
 */
import { TrustlessWorkClient, development } from "@trustless-work/escrow-js";

export class TrustlessWorkService {
  private readonly client = new TrustlessWorkClient({
    baseURL: development,
    apiKey: "your-api-key",
    getAccessToken: () => localStorage.getItem("tw_token"),
  });

  listEscrows() {
    return this.client.rest.listEscrows({ scope: "mine", limit: 20 });
  }

  getEscrow(contractId: string) {
    return this.client.graphql.getEscrow({ contractId });
  }
}
