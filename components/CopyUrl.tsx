"use client";

import { useState } from "react";

export function CopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable (http/permissions) — select-on-click still works
    }
  }

  return (
    <button className="urlbox" onClick={copy} title="Click to copy">
      <span className="url-text">{url}</span>
      <span className={`copy-chip ${copied ? "copied" : ""}`}>
        {copied ? "✓ copied" : "⧉ copy"}
      </span>
    </button>
  );
}
