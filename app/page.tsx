export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "10vh auto", padding: 24 }}>
      <h1>⚡ MonadKit MCP</h1>
      <p>
        One MCP URL that turns Base44&apos;s AI builder into a Monad web3 app
        builder — invisible wallets, gasless USDC payments, vibecoded in one
        prompt.
      </p>
      <p>
        <strong>MCP endpoint (Streamable HTTP):</strong> <code>/api/mcp</code>
      </p>
      <h2>Tools</h2>
      <ul>
        <li>
          <code>get_monad_playbook</code> — live MONSKILLS guidance (MIT,
          skills.devnads.com)
        </li>
        <li>
          <code>get_monad_config</code> — canonical Monad Testnet config
        </li>
        <li>
          <code>scaffold_monad_feature</code> — paste-ready Privy wallet login
          &amp; Pimlico gasless USDC code
        </li>
        <li>
          <code>get_example_project</code> — bill-split blueprint + official
          Monad template catalog
        </li>
      </ul>
      <p>
        Connect in Base44: Settings → MCP connections → Add custom MCP → name{" "}
        <strong>MonadKit</strong>, this URL + <code>/api/mcp</code>, Auth: Not
        required.
      </p>
    </main>
  );
}
