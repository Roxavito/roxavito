import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  loadState,
  saveState,
  mergeState,
  loadHistory,
  saveHistory,
  resetGame,
} from "./state.js";
import { askGameMaster } from "./llm.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

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
    const { narrative, stateUpdate, usage } = await askGameMaster({
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

    const newState = stateUpdate ? mergeState(currentState, stateUpdate) : currentState;
    saveState(newState);

    res.json({ narrative, state: newState, usage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در ارتباط با گیم‌مستر. " + err.message });
  }
});

app.post("/api/reset", (req, res) => {
  const initial = resetGame();
  res.json({ state: initial });
});

app.listen(PORT, () => {
  console.log(`👑 سرور امپراتوری چوسان روی پورت ${PORT} در حال اجراست.`);
});
