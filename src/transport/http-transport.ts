import { parseProblemDetails } from "../errors/parse-problem-details";
import { TrustlessWorkApiError } from "../errors/trustless-work-api-error";
import { TrustlessWorkNetworkError } from "../errors/trustless-work-network-error";
import type { baseURL } from "../types";
import { serializeParams } from "./serialize-params";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpRequestConfig = {
  method?: HttpMethod;
  url: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
};

export type AccessTokenGetter = () =>
  | string
  | undefined
  | null
  | Promise<string | undefined | null>;

export type HttpTransportOptions = {
  baseURL: baseURL;
  apiKey?: string;
  getAccessToken?: AccessTokenGetter;
  defaultHeaders?: Record<string, string>;
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
};

/**
 * Shared fetch transport (auth + Problem Details). Used by REST and GraphQL services.
 */
export class HttpTransport {
  private apiKey: string | undefined;
  private getAccessToken: AccessTokenGetter | undefined;
  private defaultHeaders: Record<string, string>;
  private readonly baseURL: string;
  private readonly fetchImpl: typeof globalThis.fetch;
  private timeoutMs: number | undefined;

  constructor(options: HttpTransportOptions) {
    this.baseURL = options.baseURL.replace(/\/$/, "");
    this.apiKey = options.apiKey;
    this.getAccessToken = options.getAccessToken;
    this.defaultHeaders = options.defaultHeaders ?? {};
    this.fetchImpl = options.fetch ?? globalThis.fetch;
    this.timeoutMs = options.timeoutMs;

    if (!this.fetchImpl) {
      throw new Error(
        "No fetch implementation available. Provide `fetch` in HttpTransportOptions.",
      );
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  setAccessTokenGetter(getAccessToken?: AccessTokenGetter) {
    this.getAccessToken = getAccessToken;
  }

  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = headers;
  }

  setTimeoutMs(timeoutMs?: number) {
    this.timeoutMs = timeoutMs;
  }

  private async buildHeaders(
    requestHeaders?: Record<string, string>,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(requestHeaders ?? {}),
    };

    for (const [key, value] of Object.entries(this.defaultHeaders)) {
      if (headers[key] === undefined) {
        headers[key] = value;
      }
    }

    if (this.apiKey) {
      headers["x-api-key"] = this.apiKey;
    }

    const token = await this.getAccessToken?.();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private buildUrl(url: string, params?: Record<string, unknown>): string {
    const path = url.startsWith("/") ? url : `/${url}`;
    const full = `${this.baseURL}${path}`;
    if (!params || Object.keys(params).length === 0) return full;
    const query = serializeParams(params);
    return query ? `${full}?${query}` : full;
  }

  private async parseBody(response: Response): Promise<unknown> {
    if (response.status === 204) return undefined;

    const text = await response.text();
    if (!text) return undefined;

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return text;
      }
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  async request<T>(config: HttpRequestConfig): Promise<T> {
    const method = config.method ?? "GET";
    const headers = await this.buildHeaders(config.headers);
    const hasBody = config.data !== undefined && method !== "GET";

    if (hasBody && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const init: RequestInit = {
      method,
      headers,
      body: hasBody ? JSON.stringify(config.data) : undefined,
    };

    if (this.timeoutMs !== undefined && this.timeoutMs > 0) {
      init.signal = AbortSignal.timeout(this.timeoutMs);
    }

    const response = await this.fetchImpl(
      this.buildUrl(config.url, config.params),
      init,
    );

    const body = await this.parseBody(response);

    if (!response.ok) {
      const problem = parseProblemDetails(body);
      if (problem) {
        throw new TrustlessWorkApiError(problem);
      }
      throw new TrustlessWorkNetworkError(
        `HTTP ${response.status}: Request failed`,
        response.status,
        body,
      );
    }

    return body as T;
  }
}
