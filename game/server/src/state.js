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

// Roster changes are never accepted as a raw overwrite of `government` (that
// would let one hallucinated turn silently rewrite/drop the whole court).
// Instead the model reports discrete `rosterEvents` — each naming an existing
// position by its fixed `id` — and this applies them one at a time, logging
// each change. A position id the model invents or misspells is ignored.
export function applyRosterEvents(state, events) {
  if (!Array.isArray(events) || events.length === 0) return state;

  const government = (state.government || []).map((pos) => ({ ...pos }));
  const rosterLog = [...(state.rosterLog || [])];

  for (const event of events) {
    if (!event || typeof event !== "object") continue;
    const { positionId, newHolder, status, reason } = event;
    const pos = government.find((p) => p.id === positionId);
    if (!pos) continue;

    const previousHolder = pos.holder;
    if (newHolder) pos.holder = newHolder;
    if (status) pos.status = status;
    if (reason) pos.note = reason;

    rosterLog.unshift({
      positionId,
      title: pos.title,
      previousHolder,
      newHolder: pos.holder,
      status: pos.status,
      reason: reason || "",
      regnalYear: state.meta?.regnalYear,
      day: state.meta?.day,
    });
  }

  return {
    ...state,
    government,
    rosterLog: rosterLog.slice(0, 25),
  };
}

// Same guardrail pattern as rosterEvents: letters are never a raw overwrite
// of `correspondence` (a model turn that forgets an older pending letter
// would otherwise silently delete it from the inbox). The model instead
// reports discrete `correspondenceEvents` — "new" adds a letter, "update"
// changes an existing one's status by id — applied incrementally here.
export function applyCorrespondenceEvents(state, events) {
  if (!Array.isArray(events) || events.length === 0) return state;

  let correspondence = (state.correspondence || []).map((l) => ({ ...l }));

  for (const event of events) {
    if (!event || typeof event !== "object") continue;
    const { action, id, from, fromTitle, subject, status } = event;

    if (action === "update" && id) {
      correspondence = correspondence.map((l) =>
        l.id === id
          ? {
              ...l,
              ...(status ? { status } : {}),
              ...(subject ? { subject } : {}),
            }
          : l
      );
    } else {
      // Default to "new" for anything else so a missing/odd `action` from
      // the model still surfaces the letter rather than silently dropping it.
      correspondence.unshift({
        id: id || `letter-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        from: from || "نامشخص",
        fromTitle: fromTitle || "",
        subject: subject || "",
        status: status || "pending",
      });
    }
  }

  return {
    ...state,
    correspondence: correspondence.slice(0, 30),
  };
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
