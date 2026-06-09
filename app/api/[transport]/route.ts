import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { getActivity, recordActivity } from "@/lib/activity";
import { createRequire } from "module";
import {
  BUILDER_CREDIT,
  DEPLOY_CONTRACT_CODE,
  MONAD_CONFIG,
  WALLET_LOGIN_CODE,
  SPONSORED_PAYMENT_CODE,
  BILL_SPLIT_BLUEPRINT,
  OFFICIAL_TEMPLATES,
  PLAYBOOK_FALLBACK,
  MONSKILLS_ATTRIBUTION,
  MONSKILLS_SKILLS,
  TOPIC_ALIASES,
} from "@/lib/content";

const MONSKILLS_RAW =
  "https://raw.githubusercontent.com/therealharpaljadeja/monskills/main";

// Module-level cache: survives for the lifetime of the serverless instance, so
// repeated calls in one build session don't re-hit GitHub and a transient GitHub
// blip mid-demo can't break an already-warmed playbook.
const playbookCache = new Map<string, string>();

async function fetchMonskill(path: string): Promise<string | null> {
  const cached = playbookCache.get(path);
  if (cached) return cached;
  try {
    const res = await fetch(`${MONSKILLS_RAW}/${path}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    playbookCache.set(path, text);
    return text;
  } catch {
    return null;
  }
}

const require_ = createRequire(import.meta.url);

// solc is a multi-MB emscripten binary — load lazily (only when the compile
// tool is called) and keep the loaded module for the instance lifetime.
let solcInstance: any;
function getSolc() {
  if (!solcInstance) solcInstance = require_("solc");
  return solcInstance;
}

const text = (s: string) => ({
  content: [{ type: "text" as const, text: s + BUILDER_CREDIT }],
});

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "get_monad_playbook",
      "Call this FIRST for ANY request involving Monad, crypto, web3, wallets, USDC, onchain payments, or blockchain. Returns the official MONSKILLS guidance for building Monad apps.",
      {
        topic: z
          .string()
          .optional()
          .describe(
            'Optional topic, e.g. "scaffold", "wallet-integration", "addresses", "indexer", "why-monad". Omit to get the index of available skills.'
          ),
      },
      async ({ topic }) => {
        const t0 = Date.now();
        if (!topic) {
          const index = await fetchMonskill("README.md");
          recordActivity(
            "get_monad_playbook",
            index ? "served MONSKILLS index (live)" : "served index (fallback)",
            Date.now() - t0
          );
          const body =
            index ??
            `Available MONSKILLS topics: ${MONSKILLS_SKILLS.join(", ")}.\n\n${PLAYBOOK_FALLBACK}`;
          return text(
            body +
              `\n\nCall get_monad_playbook again with one of these topics for the full skill: ${MONSKILLS_SKILLS.join(", ")}.` +
              MONSKILLS_ATTRIBUTION
          );
        }

        const skill =
          TOPIC_ALIASES[topic.toLowerCase().trim()] ??
          (MONSKILLS_SKILLS as readonly string[]).find(
            (s) => s === topic.toLowerCase().trim()
          );

        const body = skill ? await fetchMonskill(`${skill}/SKILL.md`) : null;
        recordActivity(
          "get_monad_playbook",
          body ? `served skill "${skill}" (live)` : `topic "${topic}" → fallback summary`,
          Date.now() - t0
        );
        return text((body ?? PLAYBOOK_FALLBACK) + MONSKILLS_ATTRIBUTION);
      }
    );

    server.tool(
      "get_monad_config",
      "Returns canonical Monad Testnet network config (chainId, RPC, explorer, faucet). ALWAYS call this instead of guessing network details.",
      {},
      async () => {
        recordActivity("get_monad_config", "served Monad Testnet config (chainId 10143)", 0);
        return text(MONAD_CONFIG);
      }
    );

    server.tool(
      "scaffold_monad_feature",
      "Returns correct, paste-ready React code for Monad features (Privy embedded wallet login, Pimlico gas-sponsored payments). ALWAYS use this code instead of writing wallet/payment code from scratch.",
      {
        feature: z
          .enum(["wallet_login", "sponsored_payment", "deploy_contract"])
          .describe(
            "wallet_login = email login with invisible embedded wallet (Privy). sponsored_payment = gasless USDC send via Kernel smart account + Pimlico paymaster. deploy_contract = deploy a custom Solidity contract from the browser, gas-sponsored, via CREATE2 factory (compile it first with compile_monad_contract)."
          ),
      },
      async ({ feature }) => {
        recordActivity("scaffold_monad_feature", `served "${feature}" scaffold`, 0);
        return text(
          feature === "wallet_login"
            ? WALLET_LOGIN_CODE
            : feature === "sponsored_payment"
              ? SPONSORED_PAYMENT_CODE
              : DEPLOY_CONTRACT_CODE
        );
      }
    );

    server.tool(
      "compile_monad_contract",
      "Compiles Solidity source code and returns the ABI + deployment bytecode, ready to deploy on Monad from the browser (pair with scaffold_monad_feature('deploy_contract')). ALWAYS use this instead of asking the user to compile locally — app builders like Base44 cannot run a compiler.",
      {
        source: z
          .string()
          .max(100_000)
          .describe("Complete Solidity source code (pragma ^0.8.x)."),
        contractName: z
          .string()
          .optional()
          .describe(
            "Which contract to return artifacts for, if the source defines several. Defaults to the last contract in the file."
          ),
      },
      async ({ source, contractName }) => {
        const t0 = Date.now();
        const input = {
          language: "Solidity",
          sources: { "Contract.sol": { content: source } },
          settings: {
            optimizer: { enabled: true, runs: 200 },
            outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
          },
        };
        const output = JSON.parse(getSolc().compile(JSON.stringify(input)));

        const errors = (output.errors ?? []).filter(
          (e: any) => e.severity === "error"
        );
        if (errors.length > 0) {
          recordActivity(
            "compile_monad_contract",
            `compilation failed (${errors.length} error${errors.length > 1 ? "s" : ""})`,
            Date.now() - t0,
            false
          );
          return text(
            "# Compilation failed\n\n" +
              errors.map((e: any) => e.formattedMessage).join("\n") +
              "\n\nFix the Solidity source and call compile_monad_contract again."
          );
        }

        const contracts = output.contracts?.["Contract.sol"] ?? {};
        const names = Object.keys(contracts);
        if (names.length === 0) {
          return text("# Compilation produced no contracts — check the source.");
        }
        const name =
          contractName && names.includes(contractName)
            ? contractName
            : names[names.length - 1];
        const artifact = contracts[name];
        const bytecode = "0x" + artifact.evm.bytecode.object;
        recordActivity(
          "compile_monad_contract",
          `compiled ${name} → ${artifact.evm.bytecode.object.length / 2} bytes of bytecode`,
          Date.now() - t0
        );

        return text(
          `# Compiled: ${name} (solc ${getSolc().version()}, optimizer 200 runs)

## ABI
\`\`\`json
${JSON.stringify(artifact.abi)}
\`\`\`

## Deployment bytecode
\`\`\`
${bytecode}
\`\`\`

## Next step
Paste ABI and bytecode into the app as constants, then deploy gas-free from the
browser with the useDeployContract hook from scaffold_monad_feature("deploy_contract").
Constructor args go in the hook's \`args\` option — do NOT append them to the bytecode
manually (encodeDeployData does that).` +
            (names.length > 1
              ? `\n\nOther contracts in this source: ${names.filter((n) => n !== name).join(", ")} — pass contractName to get their artifacts.`
              : "")
        );
      }
    );

    server.tool(
      "get_example_project",
      "Returns complete example projects: a bill-split app blueprint for Base44, and the official Monad template catalog (web, mobile, mini-app) with links.",
      {
        type: z
          .enum(["bill_split", "official_templates"])
          .describe(
            "bill_split = entity schema + screens + wiring for a Base44 bill-split app. official_templates = curated Monad docs template catalog."
          ),
      },
      async ({ type }) => {
        recordActivity("get_example_project", `served "${type}"`, 0);
        return text(type === "bill_split" ? BILL_SPLIT_BLUEPRINT : OFFICIAL_TEMPLATES);
      }
    );
  },
  {
    serverInfo: { name: "MonadKit", version: "1.0.0" },
  },
  {
    basePath: "/api", // streamable HTTP endpoint => /api/mcp
    maxDuration: 60,
    verboseLogs: true,
  }
);

// GET /api/activity returns the in-memory activity feed (read-only metadata, no
// tool inputs/outputs). It must live in this module so it shares the instance
// memory where tool calls are recorded. Every other transport goes to the MCP.
async function GET(
  req: Request,
  ctx: { params: Promise<{ transport: string }> }
) {
  const { transport } = await ctx.params;
  if (transport === "activity") {
    return Response.json(getActivity(), {
      headers: { "Cache-Control": "no-store" },
    });
  }
  return handler(req);
}

export { GET, handler as POST, handler as DELETE };
