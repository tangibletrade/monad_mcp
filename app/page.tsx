import { CopyUrl } from "@/components/CopyUrl";

const ASCII = String.raw`
███╗   ███╗ ██████╗ ███╗   ██╗ █████╗ ██████╗ ██╗  ██╗██╗████████╗
████╗ ████║██╔═══██╗████╗  ██║██╔══██╗██╔══██╗██║ ██╔╝██║╚══██╔══╝
██╔████╔██║██║   ██║██╔██╗ ██║███████║██║  ██║█████╔╝ ██║   ██║
██║╚██╔╝██║██║   ██║██║╚██╗██║██╔══██║██║  ██║██╔═██╗ ██║   ██║
██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║  ██║██████╔╝██║  ██╗██║   ██║
╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝`;

const MCP_URL = "https://monad-mcp-rosy.vercel.app/api/mcp";

export default function Home() {
  return (
    <main className="wrap">
      <pre className="ascii-title">{ASCII}</pre>

      <div>
        <span className="subtitle-badge">VIBECODE WEB3 · ONE MCP URL</span>
      </div>

      <p className="tagline">
        Turn any AI app builder into a <em>Monad web3 app builder</em>.
        Describe your app in English — get invisible wallets, gasless USDC
        payments, and battle-tested onchain code. No seed phrases. No gas. No
        crypto words.
      </p>

      <CopyUrl url={MCP_URL} />
      <p className="urlbox-hint">
        Paste into your builder&apos;s MCP settings · Auth: Not required · then
        prompt: &quot;Use the Monad MCP to build…&quot;
      </p>

      <div className="workswith">
        WORKS WITH{" "}
        <span>
          <strong>Base44</strong> · <strong>Lovable</strong> · Claude · Cursor ·
          all vibecoding apps
        </span>
      </div>

      <p className="section-label">— FOUR TOOLS —</p>
      <section className="tools">
        <div className="tool">
          <h3>get_monad_playbook</h3>
          <p>
            Live MONSKILLS guidance fetched from GitHub at request time —
            scaffold, wallet-integration, addresses, indexer and more. Cached,
            with an offline fallback.
          </p>
        </div>
        <div className="tool">
          <h3>get_monad_config</h3>
          <p>
            Canonical Monad Testnet config: chainId 10143, RPC, explorer,
            faucet, MON + testnet USDC. Never guess network details again.
          </p>
        </div>
        <div className="tool">
          <h3>scaffold_monad_feature</h3>
          <p>
            Paste-ready React code: Privy embedded-wallet email login and
            Pimlico gas-sponsored USDC payments via Kernel smart accounts —
            each with a setup checklist.
          </p>
        </div>
        <div className="tool">
          <h3>get_example_project</h3>
          <p>
            A complete bill-split app blueprint (entities, screens, wiring)
            plus the official Monad template catalog for web, mobile and mini
            apps.
          </p>
        </div>
      </section>

      <section className="tagme">
        <h2>Built something with MonadKit? Tag me! 🏷️</h2>
        <p>
          MonadKit is built and maintained by <strong>Jaison Jayaraj</strong>.
          If you ship an app with this MCP, tag me on your launch post — I
          showcase the best ones.
        </p>
        <div className="links">
          <a
            href="https://linkedin.com/in/jaison-jayaraj"
            target="_blank"
            rel="noopener noreferrer"
          >
            in/ jaison-jayaraj
          </a>
          <a
            href="https://t.me/newcut2021"
            target="_blank"
            rel="noopener noreferrer"
          >
            ✈ @newcut2021
          </a>
        </div>
      </section>

      <footer className="footer">
        MIT License · Playbook content from{" "}
        <a
          href="https://skills.devnads.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          MONSKILLS
        </a>{" "}
        (MIT © Harpalsinh Jadeja)
        <br />
        Built for the Monad hackathon by{" "}
        <a
          href="https://linkedin.com/in/jaison-jayaraj"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jaison Jayaraj
        </a>{" "}
        · Telegram{" "}
        <a
          href="https://t.me/newcut2021"
          target="_blank"
          rel="noopener noreferrer"
        >
          @newcut2021
        </a>
      </footer>
    </main>
  );
}
