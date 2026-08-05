import Anthropic from "@anthropic-ai/sdk";
import { buildSystemBlocks } from "./systemPrompt.js";

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";
const MAX_TOKENS = Number(process.env.CLAUDE_MAX_TOKENS || 4096);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
  const system = buildSystemBlocks(currentState);

  const messages = [
    ...history,
    { role: "user", content: playerMessage },
  ];

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system,
    messages,
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const fullText = textBlock ? textBlock.text : "";

  const { narrative, stateUpdate } = splitNarrativeAndState(fullText);

  return { narrative, stateUpdate, rawText: fullText, usage: response.usage };
}
