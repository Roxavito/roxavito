import { useEffect, useRef, useState } from "react";
import DayTimeline from "./DayTimeline.jsx";

export default function ChatPanel({ messages, choices, schedule, onSend, loading, error }) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, choices]);

  function submit(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;
    onSend(text);
    setDraft("");
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      submit(e);
    }
  }

  return (
    <div className="chat-panel">
      <DayTimeline schedule={schedule} />
      <div className="chat-scroll" ref={scrollRef}>
        {messages.length === 0 && !loading && (
          <div className="msg msg-gm">
            اعلیحضرت، سه‌شنبه عصر است. بلافاصله پس از بازگشت از اولین حضور علنی
            هفتگی شما در بازار، بانو سو گزارش‌های اولیه‌ی فساد و احتکار را
            آماده کرده و منتظر دستور شماست. فرمان می‌فرمایید؟
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg ${m.role === "user" ? "msg-user" : "msg-gm"}`}
          >
            {m.content}
          </div>
        ))}
        {loading && <div className="msg msg-loading">هان‌سو در حال آماده‌سازی گزارش است...</div>}
        {error && <div className="msg msg-error">{error}</div>}

        {!loading && choices && choices.length > 0 && (
          <div className="choices-box">
            {choices.map((c, i) => (
              <button
                key={i}
                type="button"
                className="choice-btn"
                onClick={() => onSend(c.label)}
              >
                <span className="choice-label">{c.label}</span>
                {c.impact && <span className="choice-impact">{c.impact}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="director-hint">
        نکته: متنی که داخل پرانتز «(...)» بنویسی خطاب به کارگردان بازیه، نه دیالوگ داخل داستان.
        {choices && choices.length > 0 && !loading
          ? " می‌تونی یکی از گزینه‌های بالا رو انتخاب کنی یا تصمیم خودت رو تایپ کنی."
          : ""}
      </div>
      <form className="chat-form" onSubmit={submit}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="فرمان یا تصمیم پادشاه را بنویس..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !draft.trim()}>
          ارسال
        </button>
      </form>
    </div>
  );
}
