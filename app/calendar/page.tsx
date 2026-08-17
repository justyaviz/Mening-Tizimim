"use client";

import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/ui";

export default function CalendarPage() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  return (
    <div className="pageWrap">
      <PageHeader eyebrow="SCHEDULE" title="Kalendar" subtitle="Deadline, to‘lov va uchrashuvlarni bir vaqt chizig‘ida ko‘rish uchun tayyor sahifa." />
      <section className="calendarCard cardLike">
        <div className="calendarTop"><div><CalendarDays size={18} /><strong>Avgust 2026</strong></div><span>v0.3 da event CRUD</span></div>
        <div className="calendarWeek">{["Du","Se","Cho","Pa","Ju","Sha","Ya"].map((d) => <b key={d}>{d}</b>)}</div>
        <div className="calendarGrid">{days.map((d, i) => <div key={i} className={`${d < 1 || d > 31 ? "mutedDay" : ""} ${d === 17 ? "todayDay" : ""}`}>{d < 1 ? 31 + d : d > 31 ? d - 31 : d}{d === 25 && <i />}{d === 28 && <i />}</div>)}</div>
      </section>
    </div>
  );
}
