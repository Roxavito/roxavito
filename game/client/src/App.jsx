import { useEffect, useState } from "react";
import ChatPanel from "./components/ChatPanel.jsx";
import StatusPanel from "./components/StatusPanel.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { fetchState, fetchHistory, sendMessage, resetGame, fetchSceneImage } from "./api.js";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [state, setState] = useState(null);
  const [messages, setMessages] = useState([]);
  const [choices, setChoices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, h] = await Promise.all([fetchState(), fetchHistory()]);
        setState(s.state);
        setMessages((h.history || []).map((m) => ({ ...m, id: newId() })));
      } catch (err) {
        setError(
          "اتصال به سرور برقرار نشد. مطمئن شو سرور بازی (game/server) در حال اجراست."
        );
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  // Attaches an image to the message once the (non-blocking) search resolves
  // — whether that's before or after the player has already sent their next
  // message. If the message is gone (e.g. the game was reset meanwhile),
  // this quietly does nothing.
  function attachImageWhenReady(messageId, imageCategory) {
    if (!imageCategory) return;
    fetchSceneImage(imageCategory).then((image) => {
      if (!image) return;
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, image } : m))
      );
    });
  }

  async function handleSend(text) {
    setError(null);
    setChoices(null);
    setMessages((prev) => [...prev, { id: newId(), role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await sendMessage(text);
      const assistantId = newId();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: res.narrative },
      ]);
      setState(res.state);
      setChoices(res.choices || null);
      attachImageWhenReady(assistantId, res.imageCategory);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleRequestTaskReport(task) {
    handleSend(
      `از ${task.assigneeName} بخواه گزارش پیشرفت وظیفه‌ی «${task.title}» رو با جزئیات کامل بده.`
    );
  }

  async function handleReset() {
    if (!confirm("بازی از اول شروع بشه و کل تاریخچه پاک بشه؟")) return;
    const res = await resetGame();
    setState(res.state);
    setMessages([]);
    setChoices(null);
    setError(null);
  }

  if (booting) {
    return <div className="loading-screen">در حال بارگذاری دربار چوسان...</div>;
  }

  return (
    <>
      <header className="app-header">
        <div className="app-title">
          <h1>امپراتوری چوسان</h1>
          <span>سلطنت روهی کبیر</span>
        </div>
        <button className="reset-btn" onClick={handleReset}>
          شروع دوباره
        </button>
      </header>
      <div className="app-body">
        <ErrorBoundary>
          <ChatPanel
            messages={messages}
            choices={choices}
            schedule={state?.schedule}
            onSend={handleSend}
            loading={loading}
            error={error}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <StatusPanel state={state} onRequestTaskReport={handleRequestTaskReport} />
        </ErrorBoundary>
      </div>
    </>
  );
}
