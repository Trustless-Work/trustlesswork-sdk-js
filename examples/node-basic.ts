/**
 * Node.js / Express — explicit client instance.
 */
import {
  TrustlessWorkClient,
  development,
  toTrustlessWorkError,
  TrustlessWorkApiError,
} from "@trustless-work/escrow-js";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

async function main() {
  try {
    const page = await client.rest.listEscrows({ scope: "mine", limit: 20 });
    console.log("Escrows:", page.data.length);

    const detail = await client.graphql.getEscrow({
      contractId: page.data[0]?.contractId ?? "",
    });
    console.log("Balance:", detail.balance);
  } catch (error: unknown) {
    const normalized = toTrustlessWorkError(error);
    if (normalized instanceof TrustlessWorkApiError) {
      console.error(normalized.code, normalized.detail);
    }
    throw error;
  }
}

main();
