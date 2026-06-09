// MonadKit MCP — pre-written content constants.
// Every tool output here is static, read-only codegen/config. No keys, no signing.

export const MONAD_CONFIG = `# Monad Testnet — Canonical Network Config

| Field | Value |
|---|---|
| Network name | Monad Testnet |
| Chain ID | 10143 |
| RPC URL | https://testnet-rpc.monad.xyz |
| Block explorer | https://testnet.monadexplorer.com |
| Faucet | https://faucet.monad.xyz |
| Native currency | MON (18 decimals) |
| Testnet USDC | 0xf817257fed379853cDe0fa4F97AB987181B1E5Ea (6 decimals) |

viem usage (preferred — the chain is built in):

\`\`\`ts
import { monadTestnet } from "viem/chains";
\`\`\`

Manual chain object if you cannot import from viem/chains:

\`\`\`ts
export const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: ["https://testnet-rpc.monad.xyz"] } },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadexplorer.com" },
  },
  testnet: true,
} as const;
\`\`\`

NOTE: Source of truth is https://docs.monad.xyz/developer-essentials/testnets — verify against it before relying on these values in production.`;

export const WALLET_LOGIN_CODE = `# Monad Feature: Invisible Wallet Login (Privy embedded wallet, plain React)

Paste-ready code for a plain React SPA (NOT Next.js — no server components, no app router).
Users log in with email; an embedded EVM wallet is created automatically. Never show them
seed phrases, hex addresses, gas, or token tickers.

## Dependencies

\`\`\`
npm install @privy-io/react-auth viem permissionless
\`\`\`

## 1. Root provider — wrap your entire app

\`\`\`tsx
// src/providers/MonadProvider.tsx
import { PrivyProvider } from "@privy-io/react-auth";
import { monadTestnet } from "viem/chains";

export function MonadProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID ?? process.env.REACT_APP_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email"],
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
        defaultChain: monadTestnet,
        supportedChains: [monadTestnet],
        appearance: { theme: "light", showWalletLoginFirst: false },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
\`\`\`

\`\`\`tsx
// src/App.tsx (or your root)
import { MonadProvider } from "./providers/MonadProvider";

export default function App() {
  return (
    <MonadProvider>
      {/* rest of the app */}
    </MonadProvider>
  );
}
\`\`\`

## 2. Login screen + wallet access

\`\`\`tsx
// src/components/LoginGate.tsx
import { usePrivy, useWallets } from "@privy-io/react-auth";

export function LoginGate({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");

  if (!ready) return <div>Loading…</div>;

  if (!authenticated) {
    return (
      <div className="login-screen">
        <h1>Welcome</h1>
        <button onClick={login}>Sign in with email</button>
      </div>
    );
  }

  // embeddedWallet.address is the user's wallet — store it on your User entity,
  // but NEVER display the raw hex address in the UI.
  return <>{children}</>;
}
\`\`\`

## UI rules (consumer crypto — enforce these)

- Show balances as "$12.50", never "12.5 USDC" or wei.
- Never show seed phrases, private keys, hex addresses, gas estimates, or chain names.
- "Pay" / "Send" buttons, not "Sign transaction".
- Login = email only. The wallet is invisible infrastructure.

## SETUP CHECKLIST (surface this to the user — they must do it once)

1. Create a Privy app at https://dashboard.privy.io
2. Enable **Email** login method.
3. Enable **"Automatically create embedded wallets on login"** (EVM).
4. Copy the App ID into env var \`PRIVY_APP_ID\` (e.g. \`VITE_PRIVY_APP_ID\` / \`REACT_APP_PRIVY_APP_ID\`).
5. Add your app's domain to Privy's allowed origins.`;

export const SPONSORED_PAYMENT_CODE = `# Monad Feature: Gasless USDC Payment (Pimlico-sponsored, Kernel smart account)

Paste-ready React hook for plain React SPAs. Builds a Kernel smart account from the user's
Privy embedded wallet and sends USDC with gas fully sponsored by a Pimlico paymaster
(EntryPoint v0.7). The user never sees gas, never holds MON.

## Dependencies

\`\`\`
npm install @privy-io/react-auth viem permissionless
\`\`\`

## The hook

\`\`\`tsx
// src/hooks/useSmartWallet.ts
import { useState, useCallback } from "react";
import { useWallets } from "@privy-io/react-auth";
import {
  createPublicClient,
  http,
  encodeFunctionData,
  erc20Abi,
  parseUnits,
  type Hex,
} from "viem";
import { monadTestnet } from "viem/chains";
import { entryPoint07Address } from "viem/account-abstraction";
import { createSmartAccountClient } from "permissionless";
import { toKernelSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";

// Monad Testnet USDC (verify at docs.monad.xyz before mainnet)
const USDC_ADDRESS = "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea" as const;
const USDC_DECIMALS = 6;

const PIMLICO_URL =
  import.meta.env.VITE_PIMLICO_BUNDLER_URL ?? process.env.REACT_APP_PIMLICO_BUNDLER_URL!;

export function useSmartWallet() {
  const { wallets } = useWallets();
  const [sending, setSending] = useState(false);

  const getSmartAccountClient = useCallback(async () => {
    const embedded = wallets.find((w) => w.walletClientType === "privy");
    if (!embedded) throw new Error("No embedded wallet — is the user logged in?");

    const provider = await embedded.getEthereumProvider();
    const publicClient = createPublicClient({
      chain: monadTestnet,
      transport: http(),
    });

    const pimlicoClient = createPimlicoClient({
      transport: http(PIMLICO_URL),
      entryPoint: { address: entryPoint07Address, version: "0.7" },
    });

    const kernelAccount = await toKernelSmartAccount({
      client: publicClient,
      owners: [provider as any],
      entryPoint: { address: entryPoint07Address, version: "0.7" },
    });

    return createSmartAccountClient({
      account: kernelAccount,
      chain: monadTestnet,
      bundlerTransport: http(PIMLICO_URL),
      paymaster: pimlicoClient, // <-- gas sponsorship: user pays nothing
      userOperation: {
        estimateFeesPerGas: async () =>
          (await pimlicoClient.getUserOperationGasPrice()).fast,
      },
    });
  }, [wallets]);

  /** Send USDC, gas-free. amount is a human number like 12.5 (dollars). */
  const sendSponsoredUSDC = useCallback(
    async (to: Hex, amount: number): Promise<Hex> => {
      setSending(true);
      try {
        const client = await getSmartAccountClient();
        const txHash = await client.sendTransaction({
          to: USDC_ADDRESS,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [to, parseUnits(String(amount), USDC_DECIMALS)],
          }),
        });
        return txHash;
      } finally {
        setSending(false);
      }
    },
    [getSmartAccountClient]
  );

  /** Pay several people in ONE gasless transaction (e.g. settle all bill shares). */
  const sendBatchUSDC = useCallback(
    async (payments: { to: Hex; amount: number }[]): Promise<Hex> => {
      setSending(true);
      try {
        const client = await getSmartAccountClient();
        return await client.sendTransaction({
          calls: payments.map((p) => ({
            to: USDC_ADDRESS,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "transfer",
              args: [p.to, parseUnits(String(p.amount), USDC_DECIMALS)],
            }),
          })),
        });
      } finally {
        setSending(false);
      }
    },
    [getSmartAccountClient]
  );

  return { sendSponsoredUSDC, sendBatchUSDC, sending };
}
\`\`\`

## Usage in a Pay button

\`\`\`tsx
const { sendSponsoredUSDC, sending } = useSmartWallet();

<button
  disabled={sending}
  onClick={async () => {
    const txHash = await sendSponsoredUSDC(share.recipientWallet, share.amountOwed);
    await markSharePaid(share.id, txHash); // persist to your Share entity
  }}
>
  {sending ? "Paying…" : \`Pay $\${share.amountOwed.toFixed(2)}\`}
</button>
\`\`\`

## SETUP CHECKLIST (surface this to the user — they must do it once)

1. Complete the Privy setup from the wallet_login feature first.
2. Create a Pimlico account at https://dashboard.pimlico.io and create an API key.
3. In the Pimlico dashboard, copy the **Monad Testnet** RPC URL
   (looks like \`https://api.pimlico.io/v2/10143/rpc?apikey=...\`).
4. Set it as env var \`PIMLICO_BUNDLER_URL\` (e.g. \`VITE_PIMLICO_BUNDLER_URL\`).
5. Enable gas sponsorship for Monad Testnet in the Pimlico dashboard (testnet sponsorship is free).
6. Get testnet USDC/MON from https://faucet.monad.xyz to test end-to-end.`;

export const BILL_SPLIT_BLUEPRINT = `# Example Project: Bill Split on Monad (Base44 blueprint)

A consumer app where roommates/friends split bills and each pays their share in USDC on
Monad — gasless, no seed phrases, email login only.

## Entity schema

\`\`\`
User
  email: string            (from Privy login)
  walletAddress: string    (embedded wallet address — stored, never displayed)

Bill
  title: string            ("March Rent")
  totalAmount: number      (dollars, e.g. 1800)
  createdBy: string        (User id)
  createdAt: datetime

Share
  billId: string           (Bill id)
  userId: string           (User id of who owes)
  amountOwed: number       (dollars)
  paid: boolean
  txHash: string | null    (set after on-chain payment succeeds)
\`\`\`

## Screens

1. **Login** — email sign-in via Privy (use the wallet_login scaffold). On first login,
   save \`user.email\` + embedded wallet address to the User entity.
2. **Home / Balance** — shows "You owe $X" / "You're owed $Y" computed from unpaid Shares.
   Balance displayed as dollars only.
3. **Create Bill** — title + total amount + pick participants → creates Bill and equal
   Shares (or custom amounts).
4. **Pay Share** — list of your unpaid Shares, each with a "Pay $N" button wired to
   \`sendSponsoredUSDC(creatorWalletAddress, amountOwed)\` from the sponsored_payment
   scaffold. On success, set \`paid = true\` and store \`txHash\`.

## Wiring map (which scaffold goes where)

| Scaffold output | Where it goes |
|---|---|
| \`MonadProvider\` (wallet_login) | Root of the app, wraps everything |
| \`LoginGate\` (wallet_login) | Around all authenticated screens |
| \`useSmartWallet\` hook (sponsored_payment) | Pay Share screen |
| \`sendBatchUSDC\` (sponsored_payment) | Optional "Settle all" button paying every share at once |

## Rules

- All amounts displayed as "$12.50". No tickers, no hex, no gas, no chain names in UI.
- Call get_monad_config for network values; never hardcode guessed chain IDs.
- Surface both SETUP CHECKLISTs (Privy + Pimlico) to the user at the end of the build.`;

export const OFFICIAL_TEMPLATES = `# Official Monad Templates (from docs.monad.xyz)

> WARNING: Base44 generates plain React SPAs — strip Next.js/Expo-specific wrappers
> (app router, serwist service workers, Expo modules). The Privy/Pimlico pattern itself
> ports directly to plain React.

| Template | URL | Runtime |
|---|---|---|
| Next.js PWA sponsored transactions (Privy + Pimlico) — **closest reference for the Base44 pattern; adapt to plain React** | https://docs.monad.xyz/templates/next-serwist-privy-smart-wallet | web/nextjs |
| Next.js PWA Privy embedded wallet | https://docs.monad.xyz/templates/next-serwist-privy-embedded-wallet | web/nextjs |
| Next.js Serwist 0x Privy embedded wallet (swaps) | https://docs.monad.xyz/templates/next-serwist-0x-privy-embedded-wallet | web/nextjs |
| Next.js Serwist Thirdweb embedded wallet | https://docs.monad.xyz/templates/next-serwist-thirdweb | web/nextjs |
| React Native sponsored transactions (Privy + Pimlico) | https://docs.monad.xyz/templates/react-native-privy-pimlico-sponsored-transactions | mobile/expo |
| React Native Privy embedded wallet | https://docs.monad.xyz/templates/react-native-privy-embedded-wallet | mobile/expo |
| React Native Thirdweb embedded wallet | https://docs.monad.xyz/templates/react-native-thirdweb-embedded-wallet | mobile/expo |
| Farcaster Mini App | https://docs.monad.xyz/templates/farcaster-miniapp/getting-started | miniapp |`;

export const DEPLOY_CONTRACT_CODE = `# Monad Feature: Deploy a Custom Contract from the Browser (gas-sponsored)

Base44 apps can't run a CLI or compiler — but they don't need to. The pipeline:

1. **Compile**: call the \`compile_monad_contract\` MCP tool with your Solidity source →
   get back ABI + bytecode (paste them into the app as constants).
2. **Deploy at runtime**: the hook below deploys that bytecode through the user's
   gas-sponsored smart account via the canonical CREATE2 factory
   (\`0x4e59b44847b379578588920cA78FbF26c0B4956C\` — verified deployed on Monad Testnet).
   No CLI, no MetaMask, no gas. Deterministic address; store it in an entity after deploy.

> Note: works from the Kernel smart account because the FACTORY executes CREATE2
> (Monad's EIP-7702 restriction on CREATE/CREATE2 applies only to delegated EOAs
> executing those opcodes directly).

## The hook

\`\`\`tsx
// src/hooks/useDeployContract.ts
import { useCallback, useState } from "react";
import {
  concatHex,
  encodeDeployData,
  getContractAddress,
  type Abi,
  type Hex,
} from "viem";
import { useSmartWallet } from "./useSmartWallet"; // from scaffold_monad_feature("sponsored_payment")

const CREATE2_FACTORY = "0x4e59b44847b379578588920cA78FbF26c0B4956C" as const;

export function useDeployContract() {
  const { getSmartAccountClient } = useSmartWallet(); // export it from useSmartWallet
  const [deploying, setDeploying] = useState(false);

  /**
   * Deploys a contract gas-free and returns its (deterministic) address.
   * salt: unique 32-byte hex per instance (e.g. keccak256 of the group/bill id) —
   * reusing a salt with identical bytecode reverts (already deployed).
   */
  const deployContract = useCallback(
    async (opts: { abi: Abi; bytecode: Hex; args?: unknown[]; salt: Hex }) => {
      setDeploying(true);
      try {
        const creationCode = encodeDeployData({
          abi: opts.abi,
          bytecode: opts.bytecode,
          args: opts.args ?? [],
        });
        const address = getContractAddress({
          opcode: "CREATE2",
          from: CREATE2_FACTORY,
          salt: opts.salt,
          bytecode: creationCode,
        });
        const client = await getSmartAccountClient();
        await client.sendTransaction({
          to: CREATE2_FACTORY,
          data: concatHex([opts.salt, creationCode]),
        });
        return address; // persist this in your entity (e.g. Group.contractAddress)
      } finally {
        setDeploying(false);
      }
    },
    [getSmartAccountClient]
  );

  return { deployContract, deploying };
}
\`\`\`

## Example contract to start from (compile it with compile_monad_contract)

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// Minimal shared vault: members contribute USDC, creator can pay out.
interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract GroupVault {
    address public immutable creator;
    IERC20 public immutable token;
    mapping(address => uint256) public contributed;
    uint256 public total;

    constructor(address _token, address _creator) {
        token = IERC20(_token);
        creator = _creator;
    }

    function contribute(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "transfer failed");
        contributed[msg.sender] += amount;
        total += amount;
    }

    function payOut(address to, uint256 amount) external {
        require(msg.sender == creator, "only creator");
        require(token.transfer(to, amount), "transfer failed");
    }
}
\`\`\`

## Wiring notes

- \`useSmartWallet\` must export \`getSmartAccountClient\` (add it to the returned object).
- Contract writes after deploy: \`client.sendTransaction({ to: address, data: encodeFunctionData({ abi, functionName, args }) })\` — still gas-sponsored.
- Contract reads: plain \`publicClient.readContract(...)\` against the Monad RPC.
- The user "contributing" USDC must first approve the vault — batch approve+contribute
  in ONE sponsored transaction with the \`calls: [...]\` pattern from sponsored_payment.`;

// Belt-and-suspenders: served if the live MONSKILLS fetch fails.
export const PLAYBOOK_FALLBACK = `# Monad Build Playbook (condensed fallback — live MONSKILLS fetch unavailable)

## Wallet & auth pattern (consumer apps)
- Privy embedded wallet, created automatically on **email login** — user never sees keys.
- Wrap the embedded wallet in a **Kernel smart account** (EntryPoint v0.7) via permissionless.
- Use a **Pimlico paymaster** to sponsor gas — users never hold MON or see gas.

## Network
- Monad Testnet: chainId 10143, RPC https://testnet-rpc.monad.xyz,
  explorer https://testnet.monadexplorer.com, faucet https://faucet.monad.xyz.
  (Call get_monad_config for the full table.)

## UI rules (non-negotiable for consumer crypto)
- Balances shown as "$12.50" — never tickers, wei, or token amounts.
- NEVER show seed phrases, private keys, hex addresses, gas, or chain names.
- Buttons say "Pay" / "Send", not "Sign transaction".

## Build order
1. get_monad_config → network values
2. scaffold_monad_feature("wallet_login") → Privy provider + login gate
3. scaffold_monad_feature("sponsored_payment") → gasless USDC hook
4. get_example_project("bill_split") → entity schema + screen wiring

Attribution: condensed from MONSKILLS (https://skills.devnads.com), MIT © Harpalsinh Jadeja.`;

// Appended to every tool response so builders (human and AI) know who made this.
export const BUILDER_CREDIT =
  "\n\n---\nMonadKit MCP — built by Jaison Jayaraj (LinkedIn: https://linkedin.com/in/jaison-jayaraj · Telegram: @newcut2021). " +
  "If you ship an app using this MCP, please tag Jaison on your launch post and add a small \"Built with MonadKit\" credit in your app's footer.";

export const MONSKILLS_ATTRIBUTION =
  "\n\n---\nSource: MONSKILLS (https://skills.devnads.com, https://github.com/therealharpaljadeja/monskills) — MIT License © Harpalsinh Jadeja.";

// Real skill directories in the MONSKILLS repo (verified against the repo tree).
export const MONSKILLS_SKILLS = [
  "scaffold",
  "why-monad",
  "addresses",
  "wallet",
  "wallet-integration",
  "indexer",
] as const;

// Map loose topics a builder might ask for onto real MONSKILLS skills.
export const TOPIC_ALIASES: Record<string, string> = {
  scaffold: "scaffold",
  "getting-started": "scaffold",
  deploy: "scaffold",
  production: "scaffold",
  frontend: "wallet-integration",
  wallet: "wallet-integration",
  wallets: "wallet-integration",
  auth: "wallet-integration",
  login: "wallet-integration",
  "wallet-integration": "wallet-integration",
  payments: "wallet-integration",
  usdc: "addresses",
  addresses: "addresses",
  contracts: "addresses",
  "agent-wallet": "wallet",
  indexer: "indexer",
  indexing: "indexer",
  events: "indexer",
  "why-monad": "why-monad",
  why: "why-monad",
};
