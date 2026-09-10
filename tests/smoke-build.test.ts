/**
 * Smoke test: verifies built artifacts can be required/imported after `npm run build`.
 * Skipped when dist/ is not present (e.g. during `tsc --noEmit` only).
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

const dist = join(__dirname, "..", "dist");

describe("build smoke", () => {
  const hasDist = existsSync(join(dist, "index.js"));

  it("CJS entry loads", () => {
    if (!hasDist) return;
    const pkg = require("../dist/index.js");
    expect(pkg.TrustlessWorkClient).toBeDefined();
    expect(pkg.development).toBe("https://beta.api.trustlesswork.com");
  });

  it("rest subpath loads", () => {
    if (!hasDist) return;
    const rest = require("../dist/rest.js");
    expect(rest.EscrowRestService).toBeDefined();
  });

  it("graphql subpath loads", () => {
    if (!hasDist) return;
    const graphql = require("../dist/graphql.js");
    expect(graphql.EscrowGraphqlService).toBeDefined();
  });
});
