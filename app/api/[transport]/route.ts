import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  BUILDER_CREDIT,
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
        if (!topic) {
          const index = await fetchMonskill("README.md");
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
        return text((body ?? PLAYBOOK_FALLBACK) + MONSKILLS_ATTRIBUTION);
      }
    );

    server.tool(
      "get_monad_config",
      "Returns canonical Monad Testnet network config (chainId, RPC, explorer, faucet). ALWAYS call this instead of guessing network details.",
      {},
      async () => text(MONAD_CONFIG)
    );

    server.tool(
      "scaffold_monad_feature",
      "Returns correct, paste-ready React code for Monad features (Privy embedded wallet login, Pimlico gas-sponsored payments). ALWAYS use this code instead of writing wallet/payment code from scratch.",
      {
        feature: z
          .enum(["wallet_login", "sponsored_payment"])
          .describe(
            "wallet_login = email login with invisible embedded wallet (Privy). sponsored_payment = gasless USDC send via Kernel smart account + Pimlico paymaster."
          ),
      },
      async ({ feature }) =>
        text(feature === "wallet_login" ? WALLET_LOGIN_CODE : SPONSORED_PAYMENT_CODE)
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
      async ({ type }) =>
        text(type === "bill_split" ? BILL_SPLIT_BLUEPRINT : OFFICIAL_TEMPLATES)
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

export { handler as GET, handler as POST, handler as DELETE };
