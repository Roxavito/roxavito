import { useState } from "react";

const STATUS_LABEL = {
  in_progress: "در حال انجام",
  completed: "کامل شد",
  stalled: "متوقف مانده",
};

function TaskItem({ task, onRequestReport }) {
  return (
    <div className="task-item">
      <div className="task-title">{task.title}</div>
      <div className="task-meta">
        مسئول: {task.assigneeName} · تخمین زمان: {task.estimatedDuration}
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${task.progressPct ?? 0}%` }} />
      </div>
      <div className="task-footer">
        <span className="task-status">
          {task.progressPct ?? 0}٪ — {STATUS_LABEL[task.status] || task.status}
        </span>
        {task.status !== "completed" && (
          <button
            type="button"
            className="task-report-btn"
            onClick={() => onRequestReport(task)}
          >
            درخواست گزارش پیشرفت
          </button>
        )}
      </div>
      {task.lastUpdate && <div className="task-lastupdate">{task.lastUpdate}</div>}
    </div>
  );
}

export default function TaskPanel({ tasks = [], onRequestReport }) {
  const [showDone, setShowDone] = useState(false);
  if (tasks.length === 0) return null;

  const openTasks = tasks.filter((t) => t.status !== "completed");
  const doneTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="card">
      <h3>
        <span>📋</span>
        <span>
          وظایف واگذارشده{openTasks.length > 0 ? ` (${openTasks.length} در جریان)` : ""}
        </span>
      </h3>
      {openTasks.length === 0 && doneTasks.length > 0 && (
        <p>در حال حاضر وظیفه‌ی بازِ در جریانی نیست.</p>
      )}
      {openTasks.map((t) => (
        <TaskItem key={t.id} task={t} onRequestReport={onRequestReport} />
      ))}
      {doneTasks.length > 0 && (
        <>
          <button
            type="button"
            className="task-toggle-done"
            onClick={() => setShowDone((s) => !s)}
          >
            {showDone ? "پنهان کردن" : "نمایش"} وظایف تکمیل‌شده ({doneTasks.length})
          </button>
          {showDone &&
            doneTasks.map((t) => (
              <TaskItem key={t.id} task={t} onRequestReport={onRequestReport} />
            ))}
        </>
      )}
    </div>
  );
}
