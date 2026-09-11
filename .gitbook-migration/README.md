# GitBook migration — `@trustless-work/escrow-js`

Documentation for the JavaScript SDK, structured as a sibling of the **Escrow React SDK** space (`/escrow-react-sdk` → space `T9oAW5k4YIU200ZnbO0x`).

## Page tree (34 pages)

```
Introduction
Getting Started
Architecture
sendTransaction
Operate/
  deployEscrow, fundEscrow, updateEscrow, changeMilestoneStatus,
  approveMilestones, approveAndReleaseMilestones, manageMilestones,
  releaseFunds, startDispute, resolveDispute, withdrawRemainingFunds
REST Reads/
  listEscrows, getEscrow, getEscrowDetails, listEscrowEvents,
  getEscrowMilestones, getEscrowsMilestones, getEscrowsFinancial
GraphQL/
  getEscrow, listEscrows
Types/
  Entities, Payloads, Reads & responses
Errors
Runtimes          ← Node / NestJS / Angular / browser
Migration         ← React SDK hook → method map
```

Markdown sources live in [`pages/`](pages/).

## Apply to GitBook

1. Create a **Personal Access Token** at https://app.gitbook.com/account/developer
2. Put it in the repo root `.env` (gitignored):

```bash
echo 'GITBOOK_TOKEN=gb_...' >> .env
```

3. Run the push script (creates a space if needed, opens a change request, inserts all pages):

```bash
node .gitbook-migration/push-change-request.mjs
```

The script prints the CR editor URL and site preview URL when available.

## Differences vs React docs

| React (`@trustless-work/escrow`) | JS (`@trustless-work/escrow-js`) |
| --- | --- |
| `TrustlessWorkConfig` + hooks | `TrustlessWorkClient` / `configureTrustlessWork` |
| Axios | Native `fetch` |
| React peers | Zero runtime deps |
| — | **Runtimes** guide (Node, Nest, Angular, browser) |
| Migration v3/v4 → v5 | Migration React → JS |
