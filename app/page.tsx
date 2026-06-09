import { CopyUrl } from "@/components/CopyUrl";

const MCP_URL = "https://monad-mcp-rosy.vercel.app/api/mcp";

export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="MonadKit" className="logo-icon" />
          <span className="logo-word">
            <span className="mono">
              Monad<span className="kit">Kit</span>
            </span>
            <span className="logo-tag mono">// vibecode onchain</span>
          </span>
        </div>
        <div className="nav-links">
          <a href="#tools">Tools</a>
          <a href="#how">How it works</a>
          <a href="#tagme">Tag me</a>
          <a
            href="https://docs.monad.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            Monad docs
          </a>
        </div>
      </nav>

      <header className="hero">
        <div>
          <span className="pill">● LIVE · ONE MCP URL · NO AUTH</span>
          <h1>
            Vibecode <span className="grad">web3 apps</span> on Monad.
          </h1>
          <p className="sub">
            Plug one MCP URL into your AI app builder and describe your app in
            English. Get <strong>invisible wallets</strong>,{" "}
            <strong>gasless USDC payments</strong>, and{" "}
            <strong>custom smart contracts</strong> — compiled by the MCP,
            deployed from the browser. No seed phrases. No gas. No CLI.
          </p>
          <CopyUrl url={MCP_URL} />
          <p className="works">
            Works with <b>Base44</b> · <b>Lovable</b> · Claude · Cursor · all
            vibecoding apps
          </p>
        </div>

        <div className="term">
          <div className="term-bar">
            <i />
            <i />
            <i />
            <span>base44 — builder</span>
          </div>
          <div className="term-body">
            <div className="t-user">
              Use the Monad MCP to build a bill-split app where roommates pay
              their share on Monad
            </div>
            <div className="t-call">calling get_monad_playbook…</div>
            <div className="t-call">calling get_monad_config…</div>
            <div className="t-ok">✓ chainId 10143 · testnet-rpc.monad.xyz</div>
            <div className="t-call">
              calling scaffold_monad_feature(&quot;wallet_login&quot;)…
            </div>
            <div className="t-call">
              calling compile_monad_contract(GroupVault.sol)…
            </div>
            <div className="t-ok">✓ ABI + bytecode ready — deploying gas-free</div>
            <div className="t-dim">
              building screens: login → balance → split → pay{" "}
              <span className="cursor" />
            </div>
          </div>
        </div>
      </header>

      <section className="section" id="how">
        <h2>How it works</h2>
        <p className="lead">Three steps from prompt to onchain app.</p>
        <div className="steps">
          <div className="step">
            <div className="num">01</div>
            <h3>Connect</h3>
            <p>
              Paste the MCP URL into your builder&apos;s MCP settings (Auth: Not
              required). One green dot and you&apos;re wired.
            </p>
          </div>
          <div className="step">
            <div className="num">02</div>
            <h3>Prompt</h3>
            <p>
              &quot;Use the Monad MCP to build…&quot; — the builder pulls real
              network config, battle-tested wallet code, and compiled contracts
              instead of hallucinating.
            </p>
          </div>
          <div className="step">
            <div className="num">03</div>
            <h3>Ship</h3>
            <p>
              Your users log in with email, pay in dollars, and never see a
              seed phrase or gas fee. Contracts deploy gas-free from the
              browser.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="tools">
        <h2>Five tools</h2>
        <p className="lead">
          Everything an AI builder needs to ship consumer crypto on Monad.
        </p>
        <div className="tools">
          <div className="tool">
            <span className="badge">LIVE FETCH</span>
            <h3>get_monad_playbook</h3>
            <p>
              MONSKILLS guidance pulled from GitHub at request time — scaffold,
              wallet-integration, addresses, indexer. Cached with an offline
              fallback.
            </p>
          </div>
          <div className="tool">
            <h3>get_monad_config</h3>
            <p>
              Canonical Monad Testnet config: chainId 10143, RPC, explorer,
              faucet, MON + testnet USDC. Never guess network details.
            </p>
          </div>
          <div className="tool">
            <h3>scaffold_monad_feature</h3>
            <p>
              Paste-ready React: Privy embedded-wallet email login, Pimlico
              gas-sponsored USDC payments, and browser-side contract deployment
              via CREATE2.
            </p>
          </div>
          <div className="tool">
            <span className="badge">NEW</span>
            <h3>compile_monad_contract</h3>
            <p>
              Send Solidity source, get back ABI + bytecode. The MCP runs the
              compiler so your app builder doesn&apos;t have to — custom
              contracts with zero CLI.
            </p>
          </div>
          <div className="tool">
            <h3>get_example_project</h3>
            <p>
              A complete bill-split blueprint (entities, screens, wiring) plus
              the official Monad template catalog for web, mobile and mini
              apps.
            </p>
          </div>
        </div>
      </section>

      <section className="tagme" id="tagme">
        <div className="tagme-inner">
          <h2>Built something with MonadKit? Tag me 🏷️</h2>
          <p>
            MonadKit is built and maintained by <strong>Jaison Jayaraj</strong>.
            If you ship an app with this MCP, tag me on your launch post — I
            showcase the best ones.
          </p>
          <div className="tag-links">
            <a
              className="primary"
              href="https://linkedin.com/in/jaison-jayaraj"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn · jaison-jayaraj
            </a>
            <a
              className="ghost"
              href="https://t.me/newcut2021"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram · @newcut2021
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>
          MIT License · Playbook from{" "}
          <a
            href="https://skills.devnads.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            MONSKILLS
          </a>{" "}
          (MIT © Harpalsinh Jadeja)
        </span>
        <span>
          Built by{" "}
          <a
            href="https://linkedin.com/in/jaison-jayaraj"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jaison Jayaraj
          </a>{" "}
          for the Monad hackathon
        </span>
      </footer>
    </>
  );
}
