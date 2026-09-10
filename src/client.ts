import type { baseURL } from "./types";
import { HttpTransport, type HttpTransportOptions } from "./transport/http-transport";
import { EscrowRestService } from "./services/rest";
import { EscrowGraphqlService } from "./services/graphql";

export type TrustlessWorkClientOptions = HttpTransportOptions;

/**
 * SDK facade: choose {@link TrustlessWorkClient.rest} or {@link TrustlessWorkClient.graphql}.
 * Both share the same auth transport.
 */
export class TrustlessWorkClient {
  private readonly transport: HttpTransport;
  readonly rest: EscrowRestService;
  readonly graphql: EscrowGraphqlService;

  constructor(
    baseURLOrOptions: baseURL | TrustlessWorkClientOptions,
    apiKey?: string,
  ) {
    const options: TrustlessWorkClientOptions =
      typeof baseURLOrOptions === "string"
        ? { baseURL: baseURLOrOptions, apiKey }
        : baseURLOrOptions;

    this.transport = new HttpTransport(options);
    this.rest = new EscrowRestService(this.transport);
    this.graphql = new EscrowGraphqlService(this.transport);
  }

  setApiKey(apiKey: string) {
    this.transport.setApiKey(apiKey);
  }

  setAccessTokenGetter(
    getAccessToken?: HttpTransportOptions["getAccessToken"],
  ) {
    this.transport.setAccessTokenGetter(getAccessToken);
  }

  setDefaultHeaders(headers: Record<string, string>) {
    this.transport.setDefaultHeaders(headers);
  }

  setTimeoutMs(timeoutMs?: number) {
    this.transport.setTimeoutMs(timeoutMs);
  }
}
