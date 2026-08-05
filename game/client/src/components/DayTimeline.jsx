import { useEffect, useRef } from "react";

export default function DayTimeline({ schedule }) {
  const currentRef = useRef(null);
  const items = schedule?.items || [];

  // A full day's schedule can have more items than fit on screen at once;
  // without this, the player has to manually scroll the strip to find
  // "where we are" every time it re-renders (e.g. after every message).
  useEffect(() => {
    currentRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [schedule]);

  if (items.length === 0) return null;

  return (
    <div className="timeline">
      <div className="timeline-day">📅 برنامه امروز — {schedule.day}</div>
      <div className="timeline-track">
        {items.map((item, i) => (
          <div
            key={i}
            ref={item.status === "current" ? currentRef : null}
            className={`timeline-item timeline-${item.status || "upcoming"}`}
          >
            <div className="timeline-icon">{item.icon || "•"}</div>
            <div className="timeline-time">{item.time}</div>
            <div className="timeline-activity">{item.activity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
