import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import {
  loadState,
  saveState,
  mergeState,
  applyRosterEvents,
  applyCorrespondenceEvents,
  applyTaskEvents,
  loadHistory,
  saveHistory,
  resetGame,
} from "./state.js";
import { askGameMaster } from "./llm.js";
import { searchSceneImage } from "./images.js";

const here = path.dirname(fileURLToPath(import.meta.url));
// The built client (from `cd client && npm run build`) — when present, this
// same server serves the game's UI too, so there is exactly one process and
// one URL for the whole app (used for hosted deploys; local dev normally
// runs the Vite dev server separately instead and never touches this path).
const clientDist = path.join(here, "..", "..", "client", "dist");
const hasClientBuild = fs.existsSync(path.join(clientDist, "index.html"));

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

if (hasClientBuild) {
  app.use(express.static(clientDist));
}

const PORT = Number(process.env.PORT || 8787);

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "⚠️  OPENAI_API_KEY تنظیم نشده. یک فایل .env در game/server بساز و کلید API اوپن‌ای‌آی خودت را در آن بگذار (نمونه در .env.example)."
  );
}

app.get("/api/state", (req, res) => {
  res.json({ state: loadState() });
});

app.get("/api/history", (req, res) => {
  res.json({ history: loadHistory() });
});

app.post("/api/chat", async (req, res) => {
  const playerMessage = String(req.body?.message || "").trim();
  if (!playerMessage) {
    return res.status(400).json({ error: "پیام خالی است." });
  }

  const currentState = loadState();
  const history = loadHistory();

  try {
    const { narrative, stateUpdate, choices, usage } = await askGameMaster({
      currentState,
      history,
      playerMessage,
    });

    const newHistory = [
      ...history,
      { role: "user", content: playerMessage },
      { role: "assistant", content: narrative },
    ];
    saveHistory(newHistory);

    // `government`, `correspondence` and `tasks` are never accepted as raw
    // overwrites — only the discrete, id-targeted `rosterEvents` /
    // `correspondenceEvents` / `taskEvents` can touch them. Anything else
    // the model returned merges normally. `imageQuery` is ephemeral (like
    // `choices`) — it never gets saved to the persisted state.
    let newState = currentState;
    let imageQuery = null;
    if (stateUpdate) {
      const {
        rosterEvents,
        correspondenceEvents,
        taskEvents,
        imageQuery: extractedImageQuery,
        government: _ignoredRosterOverwrite,
        correspondence: _ignoredCorrespondenceOverwrite,
        tasks: _ignoredTasksOverwrite,
        ...rest
      } = stateUpdate;
      imageQuery = extractedImageQuery || null;
      newState = mergeState(currentState, rest);
      newState = applyRosterEvents(newState, rosterEvents);
      newState = applyCorrespondenceEvents(newState, correspondenceEvents);
      newState = applyTaskEvents(newState, taskEvents);
    }
    saveState(newState);

    res.json({ narrative, choices, imageQuery, state: newState, usage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در ارتباط با گیم‌مستر. " + err.message });
  }
});

app.get("/api/image", async (req, res) => {
  const query = String(req.query.q || "").trim();
  if (!query) return res.json({ image: null });
  // Best-effort only: never fail the request over a bad image search — the
  // scene image is decorative, the game must keep working without it.
  const image = await searchSceneImage(query).catch(() => null);
  res.json({ image });
});

app.post("/api/reset", (req, res) => {
  const initial = resetGame();
  res.json({ state: initial });
});

if (hasClientBuild) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`👑 سرور امپراتوری چوسان روی پورت ${PORT} در حال اجراست.`);
});
