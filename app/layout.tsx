import "./globals.css";

export const metadata = {
  title: "MonadKit MCP — vibecode Monad apps on Base44",
  description:
    "One MCP URL that turns Base44's AI builder into a Monad web3 app builder. Invisible wallets, gasless USDC payments, built by Jaison Jayaraj.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
