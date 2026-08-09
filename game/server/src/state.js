import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(here, "..", "data");
const STATE_PATH = path.join(DATA_DIR, "state.json");
const HISTORY_PATH = path.join(DATA_DIR, "history.json");
const INITIAL_STATE_PATH = path.join(DATA_DIR, "initial-state.json");

// Live game state (state.json/history.json) lives in Upstash Redis when
// configured — it's the only durable option on Render's free plan, whose
// local disk is wiped on every deploy. Without these two env vars, storage
// silently falls back to the local JSON files (fine for local dev, but
// still ephemeral on a hosted free-tier deploy).
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = Boolean(REDIS_URL && REDIS_TOKEN);

const STATE_KEY = "joseon:state";
const HISTORY_KEY = "joseon:history";

if (!useRedis) {
  console.warn(
    "⚠️  UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN تنظیم نشده — بازی روی دیسک محلی سرور ذخیره می‌شود. روی هاست رایگان Render این یعنی وضعیت بازی با هر دیپلوی پاک می‌شود؛ برای ذخیره‌ی دائمی طبق راهنمای game/README.md یک دیتابیس Upstash Redis رایگان وصل کن."
  );
}

function readJsonFile(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJsonFile(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Upstash's REST API accepts a single command as a JSON array in the POST
// body (["SET", key, value], ["GET", key], ...) — used instead of the
// path-segment form (`/set/key/value`) because our values are multi-KB
// JSON blobs full of Persian text, which is exactly the case the
// path-segment form (URL length limits, encoding edge cases) handles worst.
async function redisCommand(command) {
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    throw new Error(`Upstash ${command[0]} failed: ${res.status} ${await res.text()}`);
  }
  const body = await res.json();
  if (body.error) throw new Error(`Upstash error: ${body.error}`);
  return body.result;
}

async function readJson(key, filePath, fallback) {
  if (useRedis) {
    const raw = await redisCommand(["GET", key]);
    return raw == null ? fallback : JSON.parse(raw);
  }
  return readJsonFile(filePath, fallback);
}

async function writeJson(key, filePath, data) {
  if (useRedis) {
    await redisCommand(["SET", key, JSON.stringify(data)]);
    return;
  }
  writeJsonFile(filePath, data);
}

export async function loadState() {
  // The seed state is always read from the bundled repo file (not Redis) —
  // it's static content, never mutated at runtime, and must be available
  // even the very first time a fresh Redis database is empty.
  const initial = readJsonFile(INITIAL_STATE_PATH, {});
  return readJson(STATE_KEY, STATE_PATH, initial);
}

export async function saveState(state) {
  return writeJson(STATE_KEY, STATE_PATH, state);
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

// Same guardrail pattern again: tasks are never a raw overwrite of `tasks`
// (a long-running task the model doesn't re-mention this turn must not
// vanish). The model reports discrete `taskEvents` — "new" creates a task,
// "update" advances an existing one's progress/status by id.
export function applyTaskEvents(state, events) {
  if (!Array.isArray(events) || events.length === 0) return state;

  let tasks = (state.tasks || []).map((t) => ({ ...t }));

  for (const event of events) {
    if (!event || typeof event !== "object") continue;
    const {
      action,
      id,
      title,
      assigneeId,
      assigneeName,
      estimatedDuration,
      progressPct,
      status,
      lastUpdate,
    } = event;

    if (action === "update" && id) {
      tasks = tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              ...(typeof progressPct === "number" ? { progressPct } : {}),
              ...(status ? { status } : {}),
              ...(lastUpdate ? { lastUpdate } : {}),
            }
          : t
      );
    } else {
      tasks.unshift({
        id: id || `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: title || "وظیفه‌ی نامشخص",
        assigneeId: assigneeId || null,
        assigneeName: assigneeName || "نامشخص",
        assignedDay: state.meta?.day,
        assignedRegnalYear: state.meta?.regnalYear,
        estimatedDuration: estimatedDuration || "نامشخص",
        progressPct: typeof progressPct === "number" ? progressPct : 0,
        status: status || "in_progress",
        lastUpdate: lastUpdate || "تازه واگذار شد",
      });
    }
  }

  return {
    ...state,
    tasks: tasks.slice(0, 40),
  };
}

export async function loadHistory() {
  return readJson(HISTORY_KEY, HISTORY_PATH, []);
}

export async function saveHistory(history) {
  return writeJson(HISTORY_KEY, HISTORY_PATH, history);
}

export async function resetGame() {
  const initial = readJsonFile(INITIAL_STATE_PATH, {});
  await writeJson(STATE_KEY, STATE_PATH, initial);
  await writeJson(HISTORY_KEY, HISTORY_PATH, []);
  return initial;
}
