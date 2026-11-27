import { TrustlessWorkClient } from "../src/client";
import {
  GRAPHQL_GET_ESCROW,
  GRAPHQL_LIST_ESCROWS,
  GraphqlRequestError,
} from "../src/services/graphql";

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

  it("filters GET /escrows by type, not contractType", async () => {
    let capturedUrl = "";

    const client = new TrustlessWorkClient({
      baseURL: "https://api.example.com",
      fetch: createMockFetch(async (url) => {
        capturedUrl = url;
        return new Response(
          JSON.stringify({ data: [], hasMore: false, nextCursor: null }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }),
    });

    await client.rest.listEscrows({ type: "multi-release", limit: 5 });

    expect(capturedUrl).toContain("type=multi-release");
    expect(capturedUrl).not.toContain("contractType");
  });
});

describe("EscrowRestService CCTP", () => {
  function captureClient(body: unknown) {
    const calls: { url: string; init?: RequestInit }[] = [];
    const client = new TrustlessWorkClient({
      baseURL: "https://api.example.com",
      fetch: createMockFetch(async (url, init) => {
        calls.push({ url, init });
        return new Response(JSON.stringify(body), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }),
    });
    return { client, calls };
  }

  it("sets the destination per escrow type and returns the fee", async () => {
    const { client, calls } = captureClient({
      unsignedXdr: "xdr",
      txHash: "hash",
      estimatedFeeUsdc: 0.0534,
    });

    const res = await client.rest.setCrossChainDestination(
      {
        contractId: "C1",
        receiver: "G1",
        destinationDomain: 6,
        recipientAddress: "0xabc",
      },
      "single-release",
    );
    await client.rest.setCrossChainDestination(
      {
        contractId: "C1",
        receiver: "G1",
        milestoneIndex: 2,
        destinationDomain: 5,
        recipientAddress: "So1",
      },
      "multi-release",
    );

    expect(res.estimatedFeeUsdc).toBe(0.0534);
    expect(calls[0].url).toBe(
      "https://api.example.com/escrow/single-release/v2/cross-chain-destination",
    );
    expect(calls[0].init?.method).toBe("POST");
    expect(calls[1].url).toBe(
      "https://api.example.com/escrow/multi-release/v2/cross-chain-destination",
    );
    expect(JSON.parse(calls[1].init?.body as string)).toMatchObject({
      milestoneIndex: 2,
      destinationDomain: 5,
    });
  });

  it("clears the destination", async () => {
    const { client, calls } = captureClient({ unsignedXdr: "x", txHash: "h" });

    await client.rest.clearCrossChainDestination(
      { contractId: "C1", receiver: "G1", milestoneIndex: 0 },
      "multi-release",
    );

    expect(calls[0].url).toBe(
      "https://api.example.com/escrow/multi-release/v2/cross-chain-destination/clear",
    );
  });

  it("reads the destination and returns null when unset", async () => {
    const { client, calls } = captureClient(null);

    const single = await client.rest.getCrossChainDestination(
      { contractId: "C1" },
      "single-release",
    );
    await client.rest.getCrossChainDestination(
      { contractId: "C1", milestoneIndex: 3 },
      "multi-release",
    );

    expect(single).toBeNull();
    expect(calls[0].url).toBe(
      "https://api.example.com/escrow/single-release/v2/cross-chain-destination/C1",
    );
    expect(calls[1].url).toBe(
      "https://api.example.com/escrow/multi-release/v2/cross-chain-destination/C1/3",
    );
  });

  it("rejects a multi-release read without milestoneIndex", async () => {
    const { client, calls } = captureClient(null);

    await expect(
      client.rest.getCrossChainDestination(
        { contractId: "C1" },
        "multi-release",
      ),
    ).rejects.toThrow("milestoneIndex");
    expect(calls).toHaveLength(0);
  });

  it("calls the fee-quote and attestation endpoints", async () => {
    const { client, calls } = captureClient({ status: "pending" });

    await client.rest.getCctpFeeQuote(6);
    await client.rest.getCctpAttestation("ab".repeat(32));

    expect(calls[0].url).toBe("https://api.example.com/cctp/fee-quote/6");
    expect(calls[1].url).toBe(
      `https://api.example.com/cctp/attestation/${"ab".repeat(32)}`,
    );
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
                    amount: null,
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

  it("selects amount and filters escrows by type", async () => {
    let capturedBody = "";

    const client = new TrustlessWorkClient({
      baseURL: "https://api.example.com",
      fetch: createMockFetch(async (_url, init) => {
        capturedBody = String(init?.body ?? "");
        return new Response(
          JSON.stringify({
            data: { escrows: { data: [], hasMore: false, nextCursor: null } },
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }),
    });

    await client.graphql.listEscrows({ type: "single-release", limit: 5 });

    expect(GRAPHQL_LIST_ESCROWS).toContain("amount");
    expect(GRAPHQL_LIST_ESCROWS).not.toContain("totalAmount");
    expect(GRAPHQL_LIST_ESCROWS).not.toContain("contractType");
    expect(GRAPHQL_GET_ESCROW).not.toContain("totalAmount");
    expect(capturedBody).toContain('"type":"single-release"');
    expect(capturedBody).not.toContain("contractType");
  });
});
