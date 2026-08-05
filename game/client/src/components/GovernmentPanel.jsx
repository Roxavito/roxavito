import { useState } from "react";

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

// A full 25-position court split across 7 branches, each always fully
// expanded, made the sidebar extremely long — most of the time the player
// wants a quick glance at who's who, not the whole roster at once. Branches
// collapse to a one-line header by default; clicking one expands just that
// branch. Component-local state (not persisted) is fine here: it just needs
// to survive re-renders within a session, not across reloads.
export default function GovernmentPanel({ government = [], rosterLog = [] }) {
  const [expanded, setExpanded] = useState({});
  if (!government.length) return null;
  const groups = groupByBranch(government);
  const branches = [
    ...BRANCH_ORDER.filter((b) => groups[b]),
    ...Object.keys(groups).filter((b) => !BRANCH_ORDER.includes(b)),
  ];

  function toggle(branch) {
    setExpanded((prev) => ({ ...prev, [branch]: !prev[branch] }));
  }

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

      {branches.map((branch) => {
        const isOpen = !!expanded[branch];
        return (
          <div className="card" key={branch}>
            <button
              type="button"
              className="card-toggle"
              onClick={() => toggle(branch)}
              aria-expanded={isOpen}
            >
              <h3>
                <span>{BRANCH_ICON[branch] || "🏛"}</span>
                <span>{branch}</span>
                <span className="branch-count">{groups[branch].length}</span>
              </h3>
              <span className={`chevron${isOpen ? " chevron-open" : ""}`}>▾</span>
            </button>
            {isOpen &&
              groups[branch].map((pos) => (
                <div className="roster-item" key={pos.id}>
                  <span className="name">
                    {pos.holder || "—"}
                    <StatusBadge status={pos.status} />
                  </span>
                  <span className="role">{pos.title}</span>
                </div>
              ))}
          </div>
        );
      })}
    </>
  );
}
