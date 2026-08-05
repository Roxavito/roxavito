import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(here, "..", "data");
const STATE_PATH = path.join(DATA_DIR, "state.json");
const HISTORY_PATH = path.join(DATA_DIR, "history.json");
const INITIAL_STATE_PATH = path.join(DATA_DIR, "initial-state.json");

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function loadState() {
  const initial = readJson(INITIAL_STATE_PATH, {});
  return readJson(STATE_PATH, initial);
}

export function saveState(state) {
  writeJson(STATE_PATH, state);
}

export function mergeState(current, partialUpdate) {
  const merged = { ...current };
  for (const [key, value] of Object.entries(partialUpdate || {})) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current[key] &&
      typeof current[key] === "object" &&
      !Array.isArray(current[key])
    ) {
      merged[key] = { ...current[key], ...value };
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

export function loadHistory() {
  return readJson(HISTORY_PATH, []);
}

export function saveHistory(history) {
  writeJson(HISTORY_PATH, history);
}

export function resetGame() {
  const initial = readJson(INITIAL_STATE_PATH, {});
  writeJson(STATE_PATH, initial);
  writeJson(HISTORY_PATH, []);
  return initial;
}
