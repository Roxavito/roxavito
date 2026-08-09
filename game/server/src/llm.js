import OpenAI from "openai";
import { buildSystemBlocks } from "./systemPrompt.js";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const MAX_TOKENS = Number(process.env.OPENAI_MAX_TOKENS || 4096);
// The full chat transcript is resent as context on every single turn, with
// nothing trimmed — so a session's request latency (and cost) grows with
// every message ever sent, not just with the current turn's own size. This
// caps how many of the most recent messages are actually replayed to the
// model. Long-term "memory" doesn't depend on this: tasks, letters, the
// roster and the schedule already live in the structured game state (sent
// in full every turn regardless), so trimming older raw dialogue only
// costs some conversational flavor/callbacks, never game-critical facts.
const MAX_HISTORY_MESSAGES = Number(process.env.OPENAI_HISTORY_WINDOW || 40);

// Created lazily (not at import time) so the server can still boot — and
// serve the static frontend / respond to /api/state — even before an
// OPENAI_API_KEY is configured (e.g. the first moments after a hosted
// deploy, before the env var is set).
let client = null;
function getClient() {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

const STATE_OPEN = "<STATE>";
const STATE_CLOSE = "</STATE>";
const CHOICES_OPEN = "<CHOICES>";
const CHOICES_CLOSE = "</CHOICES>";

// Extracts a `<TAG>...json...</TAG>` block, returning the parsed JSON and the
// text with that block (and everything after its opening tag) removed.
function extractBlock(text, openTag, closeTag) {
  const openIdx = text.lastIndexOf(openTag);
  const closeIdx = text.lastIndexOf(closeTag);
  if (openIdx === -1 || closeIdx === -1 || closeIdx < openIdx) {
    return { rest: text, data: null };
  }
  const jsonText = text.slice(openIdx + openTag.length, closeIdx).trim();
  let data = null;
  try {
    data = JSON.parse(jsonText);
  } catch (err) {
    console.error(`Failed to parse ${openTag} block:`, err.message);
  }
  return { rest: text.slice(0, openIdx), data };
}

// Defense-in-depth against a malformed response (e.g. the model opens
// <STATE> but never closes it): extractBlock only strips a tag when both
// its open and close markers are found, so a dangling open tag would
// otherwise leak raw markup into the player-visible narrative — and get
// permanently baked into history.json, feeding it back to the model as
// "context" on every future turn. If either tag still appears after
// extraction, cut the narrative off right before it.
function stripStrayTags(narrative) {
  const idx = narrative.search(/<STATE>|<CHOICES>/);
  if (idx === -1) return narrative;
  console.warn("Stray <STATE>/<CHOICES> tag left in model output after extraction — trimming it out.");
  return narrative.slice(0, idx).trim();
}

function splitResponse(fullText) {
  // <STATE> is always the final block the model writes, so strip it first.
  const { rest: withoutState, data: stateUpdate } = extractBlock(
    fullText,
    STATE_OPEN,
    STATE_CLOSE
  );
  // <CHOICES>, when present, comes right before <STATE>.
  const { rest: narrativeRaw, data: choicesData } = extractBlock(
    withoutState,
    CHOICES_OPEN,
    CHOICES_CLOSE
  );
  const choices = Array.isArray(choicesData) ? choicesData : null;
  return { narrative: stripStrayTags(narrativeRaw.trim()), stateUpdate, choices };
}

export async function askGameMaster({ currentState, history, playerMessage }) {
  const [stableSystem, stateSystem, rulesSystem] = buildSystemBlocks(currentState);
  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);

  const messages = [
    { role: "system", content: stableSystem },
    { role: "system", content: stateSystem },
    ...recentHistory,
    { role: "user", content: playerMessage },
    { role: "system", content: rulesSystem },
  ];

  const response = await getClient().chat.completions.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages,
  });

  const fullText = response.choices?.[0]?.message?.content || "";

  const { narrative, stateUpdate, choices } = splitResponse(fullText);

  return { narrative, stateUpdate, choices, rawText: fullText, usage: response.usage };
}
