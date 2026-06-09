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
          <a href="/activity">Activity</a>
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
          <div className="works">
            <span className="works-label">WORKS WITH</span>
            <span className="ww-chip">
              <svg viewBox="0 0 24 24" aria-hidden>
                <rect x="1" y="1" width="22" height="22" rx="6" fill="#FF5C28" />
                <text
                  x="12"
                  y="16.5"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill="#fff"
                  fontFamily="Inter, sans-serif"
                >
                  44
                </text>
              </svg>
              Base44
            </span>
            <span className="ww-chip">
              <svg viewBox="0 0 24 24" aria-hidden>
                <defs>
                  <linearGradient id="lov" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF6B9D" />
                    <stop offset="50%" stopColor="#FF4D8D" />
                    <stop offset="100%" stopColor="#FF8A3D" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 21s-8.5-5.2-10.2-10C.4 7 2.6 3.5 6.2 3.5c2.2 0 4 1.2 5.8 3.4 1.8-2.2 3.6-3.4 5.8-3.4 3.6 0 5.8 3.5 4.4 7.5C20.5 15.8 12 21 12 21z"
                  fill="url(#lov)"
                />
              </svg>
              Lovable
            </span>
            <span className="ww-chip">
              <svg viewBox="0 0 24 24" aria-hidden>
                <g fill="#D97757">
                  <path d="M12 2.5l1.4 6.1L12 12l-1.4-3.4L12 2.5zM12 21.5l-1.4-6.1L12 12l1.4 3.4L12 21.5zM2.5 12l6.1-1.4L12 12l-3.4 1.4L2.5 12zM21.5 12l-6.1 1.4L12 12l3.4-1.4L21.5 12zM5.3 5.3l5.3 3.3L12 12 8.6 10.6 5.3 5.3zM18.7 18.7l-5.3-3.3L12 12l3.4 1.4 3.3 5.3zM18.7 5.3l-3.3 5.3L12 12l1.4-3.4 5.3-3.3zM5.3 18.7l3.3-5.3L12 12l-1.4 3.4-5.3 3.3z" />
                </g>
              </svg>
              Claude
            </span>
            <span className="ww-chip">
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" fill="#e2e8f5" opacity="0.9" />
                <path d="M12 2v10l9-5-9-5zM12 12v10l9-5V7l-9 5z" fill="#8b95b5" />
                <path d="M12 12L3 7v10l9 5V12z" fill="#56608a" />
              </svg>
              Cursor
            </span>
            <span className="ww-more">+ all vibecoding apps</span>
          </div>
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
