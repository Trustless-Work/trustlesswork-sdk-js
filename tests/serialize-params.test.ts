import { serializeParams } from "../src/transport/serialize-params";

describe("serializeParams", () => {
  it("omits undefined and null values", () => {
    expect(
      serializeParams({ scope: "mine", status: undefined, limit: null }),
    ).toBe("scope=mine");
  });

  it("repeats array keys", () => {
    expect(
      serializeParams({ contractIds: ["C1", "C2"] }),
    ).toBe("contractIds=C1&contractIds=C2");
  });

  it("serializes mixed params", () => {
    expect(
      serializeParams({
        scope: "all",
        limit: 20,
        contractIds: ["A", "B"],
      }),
    ).toBe("scope=all&limit=20&contractIds=A&contractIds=B");
  });
});
