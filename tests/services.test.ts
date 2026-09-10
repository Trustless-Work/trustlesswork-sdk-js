import { TrustlessWorkClient } from "../src/client";
import { GraphqlRequestError } from "../src/services/graphql";

function createMockFetch(
  handler: (url: string, init?: RequestInit) => Promise<Response>,
) {
  return handler as typeof fetch;
}

describe("EscrowRestService", () => {
  it("calls deploy endpoint with attribution headers", async () => {
    let capturedUrl = "";
    let capturedInit: RequestInit | undefined;

    const client = new TrustlessWorkClient({
      baseURL: "https://api.example.com",
      fetch: createMockFetch(async (url, init) => {
        capturedUrl = url;
        capturedInit = init;
        return new Response(
          JSON.stringify({
            unsignedXdr: "xdr",
            txHash: "hash",
            contractId: "C123",
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }),
    });

    await client.rest.deployEscrow(
      {
        signer: "G...",
        engagementId: "eng-1",
        title: "t",
        description: "d",
        amount: 100,
        platformFee: 1,
        roles: {
          approvers: [],
          serviceProviders: [],
          platform: "G...",
          releaseSigners: [],
          disputeResolvers: [],
          receiver: "G...",
          admin: "G...",
        },
        milestones: [{ description: "m1", approvalsTarget: 1 }],
        trustline: { contractId: "C...", symbol: "USDC" },
      },
      "single-release",
      { platformId: "plat-1", subjectId: "sub-1" },
    );

    expect(capturedUrl).toBe(
      "https://api.example.com/escrow/single-release/v2/deploy",
    );
    const headers = capturedInit?.headers as Record<string, string>;
    expect(headers["X-TW-Platform"]).toBe("plat-1");
    expect(headers["X-TW-Subject"]).toBe("sub-1");
  });

  it("uses dispute vs dispute-milestones path by escrow type", async () => {
    const urls: string[] = [];

    const client = new TrustlessWorkClient({
      baseURL: "https://api.example.com",
      fetch: createMockFetch(async (url) => {
        urls.push(url);
        return new Response(
          JSON.stringify({ unsignedXdr: "xdr", txHash: "hash" }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }),
    });

    await client.rest.startDispute(
      { contractId: "C1", signer: "G...", reason: "issue" },
      "single-release",
    );
    await client.rest.startDispute(
      { contractId: "C1", signer: "G...", reason: "issue", milestoneIndexes: [0] },
      "multi-release",
    );

    expect(urls[0]).toContain("/escrow/single-release/v2/dispute");
    expect(urls[1]).toContain("/escrow/multi-release/v2/dispute-milestones");
  });
});

describe("EscrowGraphqlService", () => {
  it("throws GraphqlRequestError when errors array is present", async () => {
    const client = new TrustlessWorkClient({
      baseURL: "https://api.example.com",
      fetch: createMockFetch(
        async () =>
          new Response(
            JSON.stringify({
              errors: [{ message: "Field error" }],
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          ),
      ),
    });

    await expect(
      client.graphql.getEscrow({ contractId: "C123" }),
    ).rejects.toBeInstanceOf(GraphqlRequestError);
  });

  it("returns escrow data on success", async () => {
    const client = new TrustlessWorkClient({
      baseURL: "https://api.example.com",
      fetch: createMockFetch(
        async () =>
          new Response(
            JSON.stringify({
              data: {
                escrow: {
                  contractId: "C123",
                  balance: "10",
                  network: "testnet",
                  lastLedgerSeq: "1",
                  createdAt: "2026-01-01",
                  updatedAt: "2026-01-01",
                  milestones: [],
                  participants: [],
                  financial: {
                    balance: "10",
                    pendingRelease: "0",
                    totalDeposited: "10",
                    totalReleased: "0",
                    platformFee: null,
                    totalAmount: null,
                    nextRelease: null,
                  },
                },
              },
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          ),
      ),
    });

    const escrow = await client.graphql.getEscrow({ contractId: "C123" });
    expect(escrow.contractId).toBe("C123");
  });
});
