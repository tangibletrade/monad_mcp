# ⚡ MonadKit MCP

**One MCP URL that turns Base44's AI builder into a Monad web3 app builder** — so anyone can vibecode a consumer crypto app (invisible wallets, gasless USDC payments) by describing it in English.

> Base built an MCP for agents to *transact*. This is the MCP that lets anyone *build* — vibecode a consumer crypto app on Monad in one prompt.

## How it works

- Next.js (App Router) + [`mcp-handler`](https://www.npmjs.com/package/mcp-handler) + `zod`, Streamable HTTP transport.
- **Endpoint:** `https://<project>.vercel.app/api/mcp`
- **Auth:** none — every tool is read-only codegen/config. No keys, no funds, no signing.

## Tools

| Tool | What it returns |
|---|---|
| `get_monad_playbook` | **Live MONSKILLS** guidance fetched from GitHub at request time (cached per instance, hardcoded fallback if GitHub blips). Topics: `scaffold`, `wallet-integration`, `addresses`, `wallet`, `indexer`, `why-monad` — plus aliases like `frontend`, `payments`, `deploy`. MIT, attribution included. |
| `get_monad_config` | Canonical Monad Testnet config: chainId **10143**, RPC `https://testnet-rpc.monad.xyz`, explorer, faucet, MON (18 dec), testnet USDC. |
| `scaffold_monad_feature` | Paste-ready plain-React code: `wallet_login` (Privy embedded wallet, email login) and `sponsored_payment` (Kernel smart account + Pimlico paymaster, gasless USDC, batched calls). Each includes a SETUP CHECKLIST. |
| `get_example_project` | `bill_split` (entity schema + screens + wiring map for Base44) and `official_templates` (Monad docs template catalog with runtime tags). |

## Deploy

```bash
npm install
vercel deploy --prod
```

MCP endpoint is `<deployment-url>/api/mcp` (SSE fallback at `/api/sse`).

## Connect to Base44

Settings → **MCP connections** → Add custom MCP → name **MonadKit**, URL `https://<project>.vercel.app/api/mcp`, Auth: **Not required**.

## Demo prompt

> "Use the MonadKit MCP to build an app where roommates split rent and each pays their share on Monad."

## Local smoke test

```bash
npm run build && npm start
curl -s -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## Attribution

`get_monad_playbook` serves content from [MONSKILLS](https://skills.devnads.com) ([repo](https://github.com/therealharpaljadeja/monskills)), MIT License © Harpalsinh Jadeja.

## Roadmap (not built — by design)

x402 paid endpoints (Monad facilitator), onramp/offramp scaffolds, contract deploy tool, more example apps (tip jar, savings circle), full MONSKILLS knowledge base, mainnet config.
