const STATUS_LABEL = {
  in_progress: "در حال انجام",
  completed: "کامل شد",
  stalled: "متوقف مانده",
};

export default function TaskPanel({ tasks = [], onRequestReport }) {
  const openTasks = tasks.filter((t) => t.status !== "completed");
  const doneTasks = tasks.filter((t) => t.status === "completed");

  if (tasks.length === 0) return null;

  return (
    <div className="card">
      <h3>
        <span>📋</span>
        <span>وظایف واگذارشده</span>
      </h3>
      {[...openTasks, ...doneTasks].map((t) => (
        <div className="task-item" key={t.id}>
          <div className="task-title">{t.title}</div>
          <div className="task-meta">
            مسئول: {t.assigneeName} · تخمین زمان: {t.estimatedDuration}
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${t.progressPct ?? 0}%` }} />
          </div>
          <div className="task-footer">
            <span className="task-status">
              {t.progressPct ?? 0}٪ — {STATUS_LABEL[t.status] || t.status}
            </span>
            {t.status !== "completed" && (
              <button
                type="button"
                className="task-report-btn"
                onClick={() => onRequestReport(t)}
              >
                درخواست گزارش پیشرفت
              </button>
            )}
          </div>
          {t.lastUpdate && <div className="task-lastupdate">{t.lastUpdate}</div>}
        </div>
      ))}
    </div>
  );
}
