// In-memory ring buffer of recent MCP tool activity.
// SECURITY: store only metadata (tool name, timestamp, duration, short summary).
// Never store tool inputs/outputs, Solidity source, or anything user-identifying.
// Per-instance memory — resets on cold start; durable storage (KV) is roadmap.

export type ActivityEvent = {
  id: number;
  ts: number; // epoch ms
  tool: string;
  summary: string;
  ms: number;
  ok: boolean;
};

const MAX_EVENTS = 100;
const events: ActivityEvent[] = [];
let nextId = 1;
const bootTs = Date.now();

export function recordActivity(
  tool: string,
  summary: string,
  ms: number,
  ok = true
) {
  events.push({ id: nextId++, ts: Date.now(), tool, summary: summary.slice(0, 140), ms, ok });
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
}

export function getActivity() {
  return { bootTs, now: Date.now(), events: [...events].reverse() };
}
