import GovernmentPanel from "./GovernmentPanel.jsx";
import TaskPanel from "./TaskPanel.jsx";

function Card({ title, icon, children }) {
  return (
    <div className="card">
      <h3>
        <span>{icon}</span>
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

export default function StatusPanel({ state, onRequestTaskReport }) {
  if (!state) return null;

  const {
    meta = {},
    treasury = {},
    army = {},
    factions = {},
    openThreads = [],
    publicMood,
    lastEventSummary,
    government = [],
    rosterLog = [],
    correspondence = [],
    tasks = [],
    nationalPact,
    difficultyLevel,
  } = state;

  const pendingMail = correspondence.filter((l) => l.status !== "archived");

  return (
    <div className="status-panel">
      <Card title="پادشاهی چوسان" icon="👑">
        <div className="kv">
          <span>سال سلطنت</span>
          <b>{meta.regnalYear ?? "—"}</b>
        </div>
        <div className="kv">
          <span>روز</span>
          <b>
            {meta.day ?? "—"} · {meta.timeOfDay ?? "—"}
          </b>
        </div>
        {meta.seasonNote && (
          <p style={{ marginTop: 8 }}>{meta.seasonNote}</p>
        )}
      </Card>

      <Card title="خزانه" icon="💰">
        <div className="kv">
          <span>واحد</span>
          <b>{treasury.unit ?? "Seok"}</b>
        </div>
        <div className="kv">
          <span>درآمد سالانه تقریبی</span>
          <b>{treasury.annualIncomeApprox?.toLocaleString?.("fa-IR") ?? "—"}</b>
        </div>
        {treasury.note && <p style={{ marginTop: 8 }}>{treasury.note}</p>}
      </Card>

      <Card title="ارتش" icon="⚔️">
        <div className="bar-track">
          <div
            className="bar-fill"
            style={{ width: `${army.loyaltyPct ?? 0}%` }}
          />
        </div>
        <p>وفاداری: {army.loyaltyPct ?? "—"}٪</p>
        {army.note && <p style={{ marginTop: 6 }}>{army.note}</p>}
      </Card>

      <Card title="جناح‌ها و نهادها" icon="🏛">
        <ul>
          {factions.nobility && <li>🏛 اشراف: {factions.nobility}</li>}
          {factions.merchants && <li>💰 تجار: {factions.merchants}</li>}
          {factions.inspectorate && <li>👁 اداره بازرسی: {factions.inspectorate}</li>}
          {factions.mice && <li>🐭 موش‌های زیرک: {factions.mice}</li>}
          {factions.sagesCouncil && <li>🧠 مجلس نخبگان: {factions.sagesCouncil}</li>}
        </ul>
      </Card>

      {pendingMail.length > 0 && (
        <Card title="نامه‌ها و گزارش‌ها" icon="✉️">
          {pendingMail.map((letter) => (
            <div className="roster-item" key={letter.id}>
              <span className="name">
                {letter.from}
                <span className={`mail-badge mail-${letter.status}`}>
                  {letter.status === "pending"
                    ? "منتظر ارائه"
                    : letter.status === "delivered"
                    ? "تحویل شده"
                    : letter.status === "read"
                    ? "خوانده شده"
                    : letter.status}
                </span>
              </span>
              <span className="role">
                {letter.fromTitle ? `${letter.fromTitle} — ` : ""}
                {letter.subject}
              </span>
            </div>
          ))}
        </Card>
      )}

      <TaskPanel tasks={tasks} onRequestReport={onRequestTaskReport} />

      {nationalPact?.articles?.length > 0 && (
        <Card title="پیمان ملی" icon="📜">
          <ul>
            {nationalPact.articles.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Card>
      )}

      {openThreads.length > 0 && (
        <Card title="نخ‌های داستانی باز" icon="🎯">
          <ul>
            {openThreads.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Card>
      )}

      {publicMood && (
        <Card title="حس‌وحال مردم" icon="🏙">
          <p>{publicMood}</p>
        </Card>
      )}

      {lastEventSummary && (
        <Card title="آخرین رویداد" icon="📍">
          <p>{lastEventSummary}</p>
        </Card>
      )}

      <GovernmentPanel government={government} rosterLog={rosterLog} />

      {difficultyLevel && (
        <Card title="سطح سختی بازی" icon="⚠️">
          <p>{difficultyLevel}</p>
        </Card>
      )}
    </div>
  );
}
