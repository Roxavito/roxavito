import OpenAI from "openai";
import { buildSystemBlocks } from "./systemPrompt.js";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const MAX_TOKENS = Number(process.env.OPENAI_MAX_TOKENS || 4096);

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STATE_OPEN = "<STATE>";
const STATE_CLOSE = "</STATE>";

function splitNarrativeAndState(fullText) {
  const openIdx = fullText.lastIndexOf(STATE_OPEN);
  const closeIdx = fullText.lastIndexOf(STATE_CLOSE);
  if (openIdx === -1 || closeIdx === -1 || closeIdx < openIdx) {
    return { narrative: fullText.trim(), stateUpdate: null };
  }
  const narrative = fullText.slice(0, openIdx).trim();
  const jsonText = fullText.slice(openIdx + STATE_OPEN.length, closeIdx).trim();
  let stateUpdate = null;
  try {
    stateUpdate = JSON.parse(jsonText);
  } catch (err) {
    console.error("Failed to parse <STATE> block:", err.message);
  }
  return { narrative, stateUpdate };
}

export async function askGameMaster({ currentState, history, playerMessage }) {
  const [stableSystem, stateSystem] = buildSystemBlocks(currentState);

  const messages = [
    { role: "system", content: stableSystem },
    { role: "system", content: stateSystem },
    ...history,
    { role: "user", content: playerMessage },
  ];

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages,
  });

  const fullText = response.choices?.[0]?.message?.content || "";

  const { narrative, stateUpdate } = splitNarrativeAndState(fullText);

  return { narrative, stateUpdate, rawText: fullText, usage: response.usage };
}
