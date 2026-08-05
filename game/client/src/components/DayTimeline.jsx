export default function DayTimeline({ schedule }) {
  const items = schedule?.items || [];
  if (items.length === 0) return null;

  return (
    <div className="timeline">
      <div className="timeline-day">📅 برنامه امروز — {schedule.day}</div>
      <div className="timeline-track">
        {items.map((item, i) => (
          <div key={i} className={`timeline-item timeline-${item.status || "upcoming"}`}>
            <div className="timeline-icon">{item.icon || "•"}</div>
            <div className="timeline-time">{item.time}</div>
            <div className="timeline-activity">{item.activity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
