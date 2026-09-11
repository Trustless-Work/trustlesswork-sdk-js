#!/usr/bin/env node
/**
 * Push Escrow JS SDK docs into a GitBook change request.
 *
 * Requires GITBOOK_TOKEN in env or .env at repo root.
 * Optional: GITBOOK_SPACE_ID (existing empty/dedicated JS SDK space).
 * Optional: GITBOOK_ORG_ID (used when creating a new space).
 *
 * Usage: node .gitbook-migration/push-change-request.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, "..");
const PAGES = path.join(__dirname, "pages");
const MAP = JSON.parse(
  fs.readFileSync(path.join(__dirname, "page-map.json"), "utf8"),
);

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

loadEnv();

const TOKEN = process.env.GITBOOK_TOKEN;
if (!TOKEN) {
  console.error(
    "Missing GITBOOK_TOKEN. Create one at https://app.gitbook.com/account/developer and add it to .env",
  );
  process.exit(1);
}

async function gbapi(method, apiPath, body) {
  const res = await fetch(`https://api.gitbook.com/v1${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    console.error(method, apiPath, res.status, JSON.stringify(json, null, 2));
    throw new Error(`GitBook API ${res.status}`);
  }
  return json;
}

function readPage(file) {
  return fs.readFileSync(path.join(PAGES, file), "utf8");
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function resolveSpaceId() {
  if (process.env.GITBOOK_SPACE_ID) return process.env.GITBOOK_SPACE_ID;

  const orgs = await gbapi("GET", "/orgs");
  const orgId = process.env.GITBOOK_ORG_ID || orgs.items?.[0]?.id;
  if (!orgId) throw new Error("No organization found. Set GITBOOK_ORG_ID.");

  console.log("Using org:", orgId);

  // Look for an existing Escrow JS space by title
  const spaces = await gbapi("GET", `/orgs/${orgId}/spaces?limit=100`);
  const existing = (spaces.items || []).find((s) =>
    /escrow.?js|javascript.?sdk|js.?sdk/i.test(s.title || ""),
  );
  if (existing) {
    console.log("Found existing space:", existing.id, existing.title);
    return existing.id;
  }

  console.log("Creating space: Escrow JS SDK");
  const created = await gbapi("POST", `/orgs/${orgId}/spaces`, {
    title: "Escrow JS SDK",
  });
  console.log("Created space:", created.id);
  return created.id;
}

async function main() {
  const user = await gbapi("GET", "/user");
  console.log("Authenticated as:", user.displayName || user.email || user.id);

  const spaceId = await resolveSpaceId();

  const cr = await gbapi("POST", `/spaces/${spaceId}/change-requests`, {
    subject: "Docs: @trustless-work/escrow-js — JavaScript SDK (Core API v2)",
  });
  const crId = cr.id;
  console.log("Change request:", crId);
  console.log("Editor:", cr.urls?.app || "(no urls.app)");

  // Clear default welcome pages if present (best-effort)
  try {
    const pages = await gbapi(
      "GET",
      `/spaces/${spaceId}/change-requests/${crId}/content/pages`,
    );
    const deletable = (pages.pages || pages.items || [])
      .filter((p) => p.type === "document" && /welcome|readme|untitled/i.test(p.title || ""))
      .map((p) => ({ operation: "delete_page", page: p.id }));
    if (deletable.length) {
      await gbapi(
        "POST",
        `/spaces/${spaceId}/change-requests/${crId}/content?compat=false`,
        { changes: deletable.slice(0, 10) },
      );
    }
  } catch (e) {
    console.warn("Skip default page cleanup:", e.message);
  }

  // Batch 1: root parents (refs for children)
  const rootInserts = [
    { file: "introduction.md", title: "Introduction", ref: "introduction" },
    { file: "getting-started.md", title: "Getting Started", ref: "getting-started" },
    { file: "architecture.md", title: "Architecture", ref: "architecture" },
    { file: "send-transaction.md", title: "sendTransaction", ref: "sendtransaction" },
    { file: "operate.md", title: "Operate", ref: "operate" },
    { file: "rest-reads.md", title: "REST Reads", ref: "rest-reads" },
    { file: "graphql.md", title: "GraphQL", ref: "graphql" },
    { file: "types.md", title: "Types", ref: "types" },
    { file: "errors.md", title: "Errors", ref: "errors" },
    { file: "runtimes.md", title: "Runtimes", ref: "runtimes" },
    { file: "migration.md", title: "Migration", ref: "migration" },
  ];

  const batch1 = rootInserts.map((p, at) => ({
    operation: "insert_page",
    title: p.title,
    at,
    ref: p.ref,
    document: { markdown: readPage(p.file) },
  }));

  const r1 = await gbapi(
    "POST",
    `/spaces/${spaceId}/change-requests/${crId}/content?compat=false`,
    { changes: batch1 },
  );

  const byRef = {};
  for (const page of r1.revision?.pages || r1.pages || r1.insertedPages || []) {
    // fallback: match by title from page-map after list
  }

  // Re-list pages to resolve parent IDs by title
  const listed = await gbapi(
    "GET",
    `/spaces/${spaceId}/change-requests/${crId}/content/pages`,
  );
  const flat = listed.pages || listed.items || [];
  const byTitle = Object.fromEntries(flat.map((p) => [p.title, p.id]));

  const children = [
    ...MAP.tree
      .find((n) => n.slug === "operate")
      .children.map((c) => ({ ...c, parentTitle: "Operate" })),
    ...MAP.tree
      .find((n) => n.slug === "rest-reads")
      .children.map((c) => ({ ...c, parentTitle: "REST Reads" })),
    ...MAP.tree
      .find((n) => n.slug === "graphql")
      .children.map((c) => ({ ...c, parentTitle: "GraphQL" })),
    ...MAP.tree
      .find((n) => n.slug === "types")
      .children.map((c) => ({ ...c, parentTitle: "Types" })),
  ];

  for (const group of chunk(children, 20)) {
    const changes = group.map((c, i) => ({
      operation: "insert_page",
      title: c.title,
      into: byTitle[c.parentTitle],
      at: i,
      document: { markdown: readPage(c.file) },
    }));
    if (changes.some((c) => !c.into)) {
      console.error("Missing parent id. Known titles:", Object.keys(byTitle));
      throw new Error("Parent page not found — aborting child inserts");
    }
    await gbapi(
      "POST",
      `/spaces/${spaceId}/change-requests/${crId}/content?compat=false`,
      { changes },
    );
  }

  const crFinal = await gbapi("GET", `/spaces/${spaceId}/change-requests/${crId}`);
  console.log("\nDone.");
  console.log("Space:", spaceId);
  console.log("Change request:", crId);
  console.log("Editor URL:", crFinal.urls?.app || cr.urls?.app);
  console.log("Review the CR in GitBook, then merge when ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
