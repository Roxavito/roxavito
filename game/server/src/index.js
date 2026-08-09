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

app.get("/api/state", async (req, res) => {
  try {
    res.json({ state: await loadState() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در بارگذاری وضعیت بازی. " + err.message });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    res.json({ history: await loadHistory() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در بارگذاری تاریخچه. " + err.message });
  }
});

app.post("/api/chat", async (req, res) => {
  const playerMessage = String(req.body?.message || "").trim();
  if (!playerMessage) {
    return res.status(400).json({ error: "پیام خالی است." });
  }

  try {
    // Independent reads — running them in parallel saves one Redis
    // round-trip's worth of latency off every single chat request.
    const [currentState, history] = await Promise.all([loadState(), loadHistory()]);

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

    // Independent writes, same reasoning as the reads above.
    await Promise.all([saveHistory(newHistory), saveState(newState)]);

    // Scene images were reported as "never once shown" with zero trace in
    // the logs of the image search itself ever running — meaning the model
    // simply wasn't including `imageQuery` in its STATE block at all. This
    // makes that directly observable in Render's logs going forward,
    // instead of having to infer it indirectly from silence.
    console.log(
      imageQuery ? `[imageQuery] model requested: "${imageQuery}"` : "[imageQuery] not included this turn"
    );

    res.json({ narrative, choices, imageQuery, state: newState, usage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در ارتباط با گیم‌مستر. " + err.message });
  }
});

app.get("/api/image", async (req, res) => {
  const query = String(req.query.q || "").trim();
  if (!query) return res.json({ image: null });
  console.log(`[api/image] request received for "${query}"`);
  // Best-effort only: never fail the request over a bad image search — the
  // scene image is decorative, the game must keep working without it.
  const image = await searchSceneImage(query).catch(() => null);
  console.log(image ? `[api/image] found: ${image.url}` : "[api/image] no image found");
  res.json({ image });
});

app.post("/api/reset", async (req, res) => {
  try {
    const initial = await resetGame();
    res.json({ state: initial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در شروع دوباره‌ی بازی. " + err.message });
  }
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
