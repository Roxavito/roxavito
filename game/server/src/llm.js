import OpenAI from "openai";
import { buildSystemBlocks } from "./systemPrompt.js";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const MAX_TOKENS = Number(process.env.OPENAI_MAX_TOKENS || 4096);

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
  return { narrative: narrativeRaw.trim(), stateUpdate, choices };
}

export async function askGameMaster({ currentState, history, playerMessage }) {
  const [stableSystem, stateSystem, rulesSystem] = buildSystemBlocks(currentState);

  const messages = [
    { role: "system", content: stableSystem },
    { role: "system", content: stateSystem },
    ...history,
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
