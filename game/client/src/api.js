const BASE = "/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `خطای سرور (${res.status})`);
  }
  return res.json();
}

export async function fetchState() {
  const res = await fetch(`${BASE}/state`);
  return handle(res);
}

export async function fetchHistory() {
  const res = await fetch(`${BASE}/history`);
  return handle(res);
}

export async function sendMessage(message) {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return handle(res);
}

export async function resetGame() {
  const res = await fetch(`${BASE}/reset`, { method: "POST" });
  return handle(res);
}

// Fire-and-forget from the caller's point of view: resolves whenever the
// image search finishes (before or after the player's next message), never
// throws, and resolves to `null` on any failure or no-match.
export async function fetchSceneImage(query) {
  try {
    const res = await fetch(`${BASE}/image?q=${encodeURIComponent(query)}`);
    if (!res.ok) return null;
    const body = await res.json();
    return body.image || null;
  } catch {
    return null;
  }
}
