export const metadata = {
  title: "MonadKit MCP",
  description:
    "MCP server that turns Base44's AI builder into a Monad web3 app builder.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>{children}</body>
    </html>
  );
}
