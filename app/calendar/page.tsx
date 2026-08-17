"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui";
import { useAppData } from "@/components/data-provider";
import { dateKey } from "@/lib/data";

type CalendarEvent = { id: string; date: string; title: string; kind: "task" | "project" | "contract" | "invoice" };

const weekdays = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];
const monthFmt = new Intl.DateTimeFormat("uz-UZ", { month: "long", year: "numeric" });

export default function CalendarPage() {
  const { data } = useAppData();
  const [cursor, setCursor] = useState(() => new Date());

  const events = useMemo<CalendarEvent[]>(() => [
    ...data.tasks.filter((t) => t.dueAt).map((t) => ({ id: `task-${t.id}`, date: dateKey(t.dueAt), title: t.title, kind: "task" as const })),
    ...data.projects.filter((p) => p.deadline).map((p) => ({ id: `project-${p.id}`, date: p.deadline.slice(0, 10), title: `${p.name} deadline`, kind: "project" as const })),
    ...data.contracts.filter((c) => c.endDate).map((c) => ({ id: `contract-${c.id}`, date: c.endDate.slice(0, 10), title: `${c.title} tugaydi`, kind: "contract" as const })),
    ...data.invoices.filter((invoice) => invoice.dueDate && invoice.status !== "paid" && invoice.status !== "cancelled").map((invoice) => ({ id: `invoice-${invoice.id}`, date: invoice.dueDate.slice(0, 10), title: `${invoice.client} to‘lovi`, kind: "invoice" as const })),
  ], [data]);

  const cells = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const first = new Date(y, m, 1);
    const firstMondayIndex = (first.getDay() + 6) % 7;
    const start = new Date(y, m, 1 - firstMondayIndex);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return {
        date,
        key,
        current: date.getMonth() === m,
        events: events.filter((event) => event.date === key),
      };
    });
  }, [cursor, events]);

  const today = dateKey(new Date().toISOString());

  function moveMonth(delta: number) {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="SCHEDULE" title="Kalendar" subtitle="Vazifa, loyiha deadline, shartnoma va to‘lov muddatlarini bitta kalendarda ko‘ring." />
      <section className="calendarCard cardLike calendarV3">
        <div className="calendarTop">
          <div><CalendarDays size={18} /><strong>{monthFmt.format(cursor)}</strong></div>
          <div className="calendarNav"><button onClick={() => moveMonth(-1)} aria-label="Oldingi oy"><ChevronLeft size={17} /></button><button onClick={() => setCursor(new Date())}>Bugun</button><button onClick={() => moveMonth(1)} aria-label="Keyingi oy"><ChevronRight size={17} /></button></div>
        </div>
        <div className="calendarWeek">{weekdays.map((d) => <b key={d}>{d}</b>)}</div>
        <div className="calendarGrid calendarGridV3">
          {cells.map((cell) => (
            <div key={cell.key} className={`${!cell.current ? "mutedDay" : ""} ${cell.key === today ? "todayDay" : ""}`}>
              <span className="calendarDayNumber">{cell.date.getDate()}</span>
              <div className="calendarEvents">
                {cell.events.slice(0, 3).map((event) => <span key={event.id} className={`calendarEvent ${event.kind}`} title={event.title}>{event.title}</span>)}
                {cell.events.length > 3 && <small>+{cell.events.length - 3} ta</small>}
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="calendarLegend"><span><i className="task" /> Vazifa</span><span><i className="project" /> Loyiha deadline</span><span><i className="contract" /> Shartnoma</span><span><i className="invoice" /> To‘lov muddati</span></div>
    </div>
  );
}
