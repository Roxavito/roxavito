const BRANCH_ORDER = [
  "سه شورای اصلی",
  "شش وزارتخانه",
  "نهادهای نظارتی و فکری",
  "نظامی",
  "نهادهای پنهان",
  "مجلس پنج‌نفره نخبگان",
  "نزدیکان پادشاه",
];

const BRANCH_ICON = {
  "سه شورای اصلی": "🏛",
  "شش وزارتخانه": "🏛",
  "نهادهای نظارتی و فکری": "📖",
  نظامی: "⚔️",
  "نهادهای پنهان": "🕵️",
  "مجلس پنج‌نفره نخبگان": "🧠",
  "نزدیکان پادشاه": "🕯",
};

function groupByBranch(government) {
  const groups = {};
  for (const pos of government) {
    if (!groups[pos.branch]) groups[pos.branch] = [];
    groups[pos.branch].push(pos);
  }
  return groups;
}

function StatusBadge({ status }) {
  if (!status || status === "active") return null;
  return <span className="status-badge">{status}</span>;
}

export default function GovernmentPanel({ government = [], rosterLog = [] }) {
  if (!government.length) return null;
  const groups = groupByBranch(government);
  const branches = [
    ...BRANCH_ORDER.filter((b) => groups[b]),
    ...Object.keys(groups).filter((b) => !BRANCH_ORDER.includes(b)),
  ];

  return (
    <>
      {rosterLog.length > 0 && (
        <div className="card">
          <h3>
            <span>📰</span>
            <span>آخرین تغییرات دربار</span>
          </h3>
          <ul>
            {rosterLog.slice(0, 5).map((change, i) => (
              <li key={i}>
                <b>{change.title}:</b> {change.previousHolder}
                {change.newHolder && change.newHolder !== change.previousHolder
                  ? ` ← ${change.newHolder}`
                  : ""}
                {change.status && change.status !== "active" ? ` (${change.status})` : ""}
                {change.reason ? ` — ${change.reason}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {branches.map((branch) => (
        <div className="card" key={branch}>
          <h3>
            <span>{BRANCH_ICON[branch] || "🏛"}</span>
            <span>{branch}</span>
          </h3>
          {groups[branch].map((pos) => (
            <div className="roster-item" key={pos.id}>
              <span className="name">
                {pos.holder || "—"}
                <StatusBadge status={pos.status} />
              </span>
              <span className="role">{pos.title}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
