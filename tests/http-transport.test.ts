import { HttpTransport } from "../src/transport/http-transport";
import { TrustlessWorkApiError } from "../src/errors/trustless-work-api-error";
import { TrustlessWorkNetworkError } from "../src/errors/trustless-work-network-error";

function mockFetch(
  impl: (url: string, init?: RequestInit) => Promise<Response>,
): typeof fetch {
  return impl as typeof fetch;
}

describe("HttpTransport", () => {
  it("applies default headers, api key, and bearer token in order", async () => {
    let capturedInit: RequestInit | undefined;

    const transport = new HttpTransport({
      baseURL: "https://api.example.com",
      apiKey: "key-123",
      defaultHeaders: { "X-TW-Platform": "platform-1" },
      getAccessToken: () => "token-abc",
      fetch: mockFetch(async (_url, init) => {
        capturedInit = init;
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }),
    });

    await transport.request({ method: "GET", url: "/escrows" });

    const headers = capturedInit?.headers as Record<string, string>;
    expect(headers["x-api-key"]).toBe("key-123");
    expect(headers.Authorization).toBe("Bearer token-abc");
    expect(headers["X-TW-Platform"]).toBe("platform-1");
  });

  it("supports async getAccessToken", async () => {
    let capturedInit: RequestInit | undefined;

    const transport = new HttpTransport({
      baseURL: "https://api.example.com",
      getAccessToken: async () => "async-token",
      fetch: mockFetch(async (_url, init) => {
        capturedInit = init;
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }),
    });

    await transport.request({ method: "GET", url: "/escrows" });
    const headers = capturedInit?.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer async-token");
  });

  it("returns undefined for 204 responses", async () => {
    const transport = new HttpTransport({
      baseURL: "https://api.example.com",
      fetch: mockFetch(async () => new Response(null, { status: 204 })),
    });

    const result = await transport.request({ method: "DELETE", url: "/x" });
    expect(result).toBeUndefined();
  });

  it("throws TrustlessWorkApiError on Problem Details", async () => {
    const problem = {
      type: "about:blank",
      title: "Bad Request",
      status: 400,
      code: "BAD_REQUEST",
      detail: "Invalid payload",
    };

    const transport = new HttpTransport({
      baseURL: "https://api.example.com",
      fetch: mockFetch(
        async () =>
          new Response(JSON.stringify(problem), {
            status: 400,
            headers: { "content-type": "application/json" },
          }),
      ),
    });

    await expect(
      transport.request({ method: "GET", url: "/escrows" }),
    ).rejects.toBeInstanceOf(TrustlessWorkApiError);
  });

  it("throws TrustlessWorkNetworkError on non-problem failures", async () => {
    const transport = new HttpTransport({
      baseURL: "https://api.example.com",
      fetch: mockFetch(
        async () =>
          new Response("Internal Server Error", {
            status: 500,
          }),
      ),
    });

    await expect(
      transport.request({ method: "GET", url: "/escrows" }),
    ).rejects.toBeInstanceOf(TrustlessWorkNetworkError);
  });

  it("serializes array query params", async () => {
    let capturedUrl = "";

    const transport = new HttpTransport({
      baseURL: "https://api.example.com",
      fetch: mockFetch(async (url) => {
        capturedUrl = url;
        return new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }),
    });

    await transport.request({
      method: "GET",
      url: "/escrows/details",
      params: { contractIds: ["C1", "C2"] },
    });

    expect(capturedUrl).toBe(
      "https://api.example.com/escrows/details?contractIds=C1&contractIds=C2",
    );
  });
});
