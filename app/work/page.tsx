"use client";

import { Clock3, Edit3, Search, Trash2, Work } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, PageHeader } from "@/components/ui";
import { makeId, minutesLabel, type WorkLog } from "@/lib/data";

const emptyWorkLog = (): WorkLog => ({
  id: makeId("work"), date: "2026-08-17", title: "", project: "", category: "", durationMinutes: 60, result: "", note: "",
});

export default function WorkPage() {
  const { data, addWorkLog, updateWorkLog, removeWorkLog } = useAppData();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<WorkLog | null>(null);

  const filtered = useMemo(() => data.workLogs.filter((item) => {
    const q = query.toLowerCase();
    return [item.title, item.project, item.category, item.result, item.note].some((v) => v.toLowerCase().includes(q));
  }).sort((a, b) => b.date.localeCompare(a.date)), [data.workLogs, query]);

  const totalMinutes = data.workLogs.reduce((s, item) => s + item.durationMinutes, 0);
  const todayMinutes = data.workLogs.filter((item) => item.date === "2026-08-17").reduce((s, item) => s + item.durationMinutes, 0);
  const projects = new Set(data.workLogs.map((item) => item.project).filter(Boolean)).size;

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.title.trim()) return;
    data.workLogs.some((p) => p.id === editing.id) ? updateWorkLog(editing) : addWorkLog(editing);
    setEditing(null);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="WORK JOURNAL" title="Qilgan ishlarim" subtitle="Har kuni nima qilganingiz, qancha vaqt ketgani va qanday natija chiqqanini yozib boring." actionLabel="Ish yozish" onAction={() => setEditing(emptyWorkLog())} />

      <section className="summaryStrip">
        <div><span>Jami yozuv</span><strong>{data.workLogs.length}</strong></div>
        <div><span>Bugun</span><strong>{minutesLabel(todayMinutes)}</strong></div>
        <div><span>Jami vaqt</span><strong>{minutesLabel(totalMinutes)}</strong></div>
        <div><span>Loyihalar</span><strong>{projects}</strong></div>
      </section>

      <section className="toolbar cardLike">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ish, loyiha yoki natija qidirish..." /></div>
      </section>

      <section className="workTimeline">
        {filtered.map((item) => (
          <article className="workLogCard cardLike" key={item.id}>
            <div className="workDate"><span>{item.date}</span><i /></div>
            <div className="workIcon"><Work size={18} /></div>
            <div className="workMain">
              <div className="workTitleRow"><div><strong>{item.title}</strong><p>{item.project || "Umumiy"} · {item.category || "Kategoriya yo‘q"}</p></div><span className="timeChip"><Clock3 size={13} /> {minutesLabel(item.durationMinutes)}</span></div>
              {item.result && <div className="workResult"><span>Natija</span><p>{item.result}</p></div>}
              {item.note && <p className="workNote">{item.note}</p>}
            </div>
            <div className="workActions"><button onClick={() => setEditing({ ...item })}><Edit3 size={15} /></button><button className="dangerButton" onClick={() => window.confirm("Yozuvni o‘chirasizmi?") && removeWorkLog(item.id)}><Trash2 size={15} /></button></div>
          </article>
        ))}
      </section>
      {!filtered.length && <EmptyState title="Ish yozuvi topilmadi" text="Bugungi qilgan ishlaringizni birinchi bo‘lib yozib qo‘ying." />}

      <Modal open={!!editing} title={data.workLogs.some((p) => p.id === editing?.id) ? "Ish yozuvini tahrirlash" : "Bugungi ishni yozish"} subtitle="Bu bo‘lim oy oxiridagi shaxsiy hisobot uchun tarix bo‘lib qoladi." onClose={() => setEditing(null)}>
        {editing && <form className="formGrid" onSubmit={save}>
          <label className="field"><span>Sana</span><input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></label>
          <label className="field"><span>Vaqt (daq)</span><input type="number" min="0" value={editing.durationMinutes} onChange={(e) => setEditing({ ...editing, durationMinutes: Number(e.target.value) })} /></label>
          <label className="field span2"><span>Nima qildim?</span><input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Masalan: Target kampaniyasini optimizatsiya qildim" /></label>
          <label className="field"><span>Loyiha</span><input list="work-project-options" value={editing.project} onChange={(e) => setEditing({ ...editing, project: e.target.value })} placeholder="Start Education" /><datalist id="work-project-options">{data.projects.map((project) => <option key={project.id} value={project.name} />)}</datalist></label>
          <label className="field"><span>Kategoriya</span><input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Target, SMM, Web..." /></label>
          <label className="field span2"><span>Natija</span><textarea rows={3} value={editing.result} onChange={(e) => setEditing({ ...editing, result: e.target.value })} placeholder="Bu ish natijasida nima bo‘ldi?" /></label>
          <label className="field span2"><span>Izoh / keyingi kuzatuv</span><textarea rows={2} value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          <div className="span2"><FormActions onCancel={() => setEditing(null)} /></div>
        </form>}
      </Modal>
    </div>
  );
}
