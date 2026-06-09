"use client";

import { useEffect, useState } from "react";

type ActivityEvent = {
  id: number;
  ts: number;
  tool: string;
  summary: string;
  ms: number;
  ok: boolean;
};

type Feed = { bootTs: number; now: number; events: ActivityEvent[] };

const TOOL_ICONS: Record<string, string> = {
  get_monad_playbook: "📖",
  get_monad_config: "🔗",
  scaffold_monad_feature: "🧩",
  compile_monad_contract: "⚙️",
  get_example_project: "📦",
};

export default function ActivityPage() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        const res = await fetch("/api/activity", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as Feed;
        if (alive) {
          setFeed(data);
          setError(false);
        }
      } catch {
        if (alive) setError(true);
      }
    }
    poll();
    const id = setInterval(poll, 2500);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <main className="act-wrap">
      <div className="act-head">
        <h1>
          <span className="live-dot" /> Live MCP Activity
        </h1>
        <p>
          Tool calls hitting this server in real time — what the AI builder is
          pulling, including Solidity compiles. Metadata only: no code, no
          inputs, no user data is ever stored.
        </p>
      </div>

      <div className="act-term">
        <div className="act-bar">
          <i />
          <i />
          <i />
          <span>monadkit — /api/activity · polling every 2.5s</span>
        </div>
        <div className="act-body">
          {error && (
            <div className="act-row err">
              ✗ couldn&apos;t reach the activity feed — retrying…
            </div>
          )}
          {feed && feed.events.length === 0 && !error && (
            <div className="act-row dim">
              No tool calls on this instance yet. Connect the MCP in your
              builder and prompt it — calls appear here live.
            </div>
          )}
          {feed?.events.map((e) => (
            <div key={e.id} className={`act-row ${e.ok ? "" : "err"}`}>
              <span className="act-time">
                {new Date(e.ts).toLocaleTimeString()}
              </span>
              <span className="act-tool">
                {TOOL_ICONS[e.tool] ?? "⚡"} {e.tool}
              </span>
              <span className="act-sum">
                {e.ok ? "✓" : "✗"} {e.summary}
                {e.ms > 0 ? ` · ${e.ms}ms` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="act-note">
        Feed is held in instance memory and resets on cold starts — durable
        history is on the roadmap. <a href="/">← back to MonadKit</a>
      </p>
    </main>
  );
}
