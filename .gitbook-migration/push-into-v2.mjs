#!/usr/bin/env node
/**
 * Push Escrow JS SDK docs into Trustless Work English v2
 * (space T9oAW5k4YIU200ZnbO0x), as a sibling of ESCROW REACT SDK.
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

const V2_SPACE_ID = "T9oAW5k4YIU200ZnbO0x";
const WRONG_SPACE_ID = "GTtB3rTsI4bjAZmLjFev";
const WRONG_CR_ID = "2WaWEoaYUHKmUHoGOHAY";
const REACT_GROUP_TITLE = "ESCROW REACT SDK";

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv();
const TOKEN = process.env.GITBOOK_TOKEN;
if (!TOKEN) {
  console.error("Missing GITBOOK_TOKEN");
  process.exit(1);
}

function readPage(file) {
  return fs.readFileSync(path.join(PAGES, file), "utf8");
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function flattenPages(pages, acc = []) {
  for (const p of pages || []) {
    acc.push(p);
    if (p.pages) flattenPages(p.pages, acc);
  }
  return acc;
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

async function cancelWrongWork() {
  try {
    await gbapi(
      "PATCH",
      `/spaces/${WRONG_SPACE_ID}/change-requests/${WRONG_CR_ID}`,
      { status: "archived" },
    );
    console.log("Cancelled leftover CR on the extra space");
  } catch (e) {
    console.warn("Could not cancel leftover CR:", e.message);
  }
}

async function main() {
  const user = await gbapi("GET", "/user");
  console.log("Authenticated as:", user.displayName || user.id);

  await cancelWrongWork();

  const live = await gbapi("GET", `/spaces/${V2_SPACE_ID}/content/pages`);
  const roots = live.pages || live.items || [];
  const reactIndex = roots.findIndex((p) => p.title === REACT_GROUP_TITLE);
  if (reactIndex < 0) {
    throw new Error("ESCROW REACT SDK group not found in English v2");
  }
  const insertAt = reactIndex + 1;
  console.log(
    `Inserting ESCROW JS SDK at root index ${insertAt} (after ${REACT_GROUP_TITLE})`,
  );

  const cr = await gbapi("POST", `/spaces/${V2_SPACE_ID}/change-requests`, {
    subject:
      "Docs: @trustless-work/escrow-js — add Escrow JS SDK next to React SDK (v2)",
  });
  const crId = cr.id;
  console.log("Change request:", crId);
  console.log("Editor:", cr.urls?.app || "(no urls.app)");

  const groupMarkdown = `---
description: Framework-agnostic JavaScript/TypeScript client for Trustless Work Core API v2 escrows.
---

# ESCROW JS SDK

**\`@trustless-work/escrow-js\`** — the same Core API v2 escrow client as the React SDK, without React.

Start with [Getting Started](/escrow-js-sdk/getting-started). Coming from React? See [Migration](/escrow-js-sdk/migration).
`;

  await gbapi(
    "POST",
    `/spaces/${V2_SPACE_ID}/change-requests/${crId}/content?compat=false`,
    {
      changes: [
        {
          operation: "insert_page",
          title: "ESCROW JS SDK",
          at: insertAt,
          ref: "escrow-js-sdk",
          document: { markdown: groupMarkdown },
        },
      ],
    },
  );

  const afterGroup = await gbapi(
    "GET",
    `/spaces/${V2_SPACE_ID}/change-requests/${crId}/content/pages`,
  );
  const group = (afterGroup.pages || afterGroup.items || []).find(
    (p) => p.title === "ESCROW JS SDK",
  );
  if (!group) throw new Error("Failed to insert ESCROW JS SDK group page");
  console.log("Group page id:", group.id);

  const firstLevel = [
    { file: "introduction.md", title: "Introduction" },
    { file: "getting-started.md", title: "Getting Started" },
    { file: "architecture.md", title: "Architecture" },
    { file: "send-transaction.md", title: "sendTransaction" },
    { file: "operate.md", title: "Operate" },
    { file: "rest-reads.md", title: "REST Reads" },
    { file: "graphql.md", title: "GraphQL" },
    { file: "types.md", title: "Types" },
    { file: "errors.md", title: "Errors" },
    { file: "runtimes.md", title: "Runtimes" },
    { file: "migration.md", title: "Migration" },
  ];

  await gbapi(
    "POST",
    `/spaces/${V2_SPACE_ID}/change-requests/${crId}/content?compat=false`,
    {
      changes: firstLevel.map((p, at) => ({
        operation: "insert_page",
        title: p.title,
        into: group.id,
        at,
        document: { markdown: readPage(p.file) },
      })),
    },
  );

  const listed = await gbapi(
    "GET",
    `/spaces/${V2_SPACE_ID}/change-requests/${crId}/content/pages`,
  );
  const flat = flattenPages(listed.pages || listed.items || []);
  const byTitleUnderGroup = {};
  const groupNow = (listed.pages || listed.items || []).find(
    (p) => p.id === group.id,
  );
  for (const child of groupNow?.pages || []) {
    byTitleUnderGroup[child.title] = child.id;
  }

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

  for (const groupChildren of chunk(children, 20)) {
    const changes = groupChildren.map((c, i) => ({
      operation: "insert_page",
      title: c.title,
      into: byTitleUnderGroup[c.parentTitle],
      at: i,
      document: { markdown: readPage(c.file) },
    }));
    if (changes.some((c) => !c.into)) {
      console.error("Known titles:", Object.keys(byTitleUnderGroup));
      throw new Error("Parent page not found under ESCROW JS SDK");
    }
    await gbapi(
      "POST",
      `/spaces/${V2_SPACE_ID}/change-requests/${crId}/content?compat=false`,
      { changes },
    );
  }

  const crFinal = await gbapi(
    "GET",
    `/spaces/${V2_SPACE_ID}/change-requests/${crId}`,
  );
  console.log("\nDone.");
  console.log("Space: English v2", V2_SPACE_ID);
  console.log("Change request:", crId);
  console.log("Editor URL:", crFinal.urls?.app || cr.urls?.app);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
