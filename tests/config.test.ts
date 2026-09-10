import {
  configureTrustlessWork,
  escrowRest,
  getTrustlessWorkClient,
  resetTrustlessWorkClient,
} from "../src/config";

describe("config", () => {
  afterEach(() => {
    resetTrustlessWorkClient();
  });

  it("configureTrustlessWork sets default client", () => {
    const client = configureTrustlessWork({
      baseURL: "https://api.example.com",
      fetch: async () =>
        new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
    });

    expect(getTrustlessWorkClient()).toBe(client);
    expect(escrowRest()).toBe(client.rest);
  });

  it("getTrustlessWorkClient throws when not configured", () => {
    expect(() => getTrustlessWorkClient()).toThrow(/not configured/i);
  });
});
