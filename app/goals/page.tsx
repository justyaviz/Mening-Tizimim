"use client";

import { Edit3, Search, Target, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, PageHeader, StatusPill } from "@/components/ui";
import { makeId, type Goal, type GoalStatus } from "@/lib/data";

const emptyGoal = (): Goal => ({
  id: makeId("goal"), title: "", category: "", status: "planned", targetDate: "2026-12-31", progress: 0, metric: "", targetValue: 0, currentValue: 0, note: "",
});

export default function GoalsPage() {
  const { data, addGoal, updateGoal, removeGoal } = useAppData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | GoalStatus>("all");
  const [editing, setEditing] = useState<Goal | null>(null);

  const filtered = useMemo(() => data.goals.filter((item) => {
    const q = query.toLowerCase();
    const match = [item.title, item.category, item.metric, item.note].some((v) => v.toLowerCase().includes(q));
    return match && (status === "all" || item.status === status);
  }), [data.goals, query, status]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.title.trim()) return;
    const computed = editing.targetValue > 0 ? Math.min(100, Math.round((editing.currentValue / editing.targetValue) * 100)) : editing.progress;
    const next = { ...editing, progress: computed };
    data.goals.some((p) => p.id === editing.id) ? updateGoal(next) : addGoal(next);
    setEditing(null);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="DIRECTION" title="Maqsadlar" subtitle="Katta rejalarni raqamli maqsadga aylantiring va kunlik ishlar qayerga olib ketayotganini ko‘ring." actionLabel="Maqsad qo‘shish" onAction={() => setEditing(emptyGoal())} />

      <section className="summaryStrip">
        <div><span>Jami</span><strong>{data.goals.length}</strong></div>
        <div><span>Aktiv</span><strong>{data.goals.filter((x) => x.status === "active").length}</strong></div>
        <div><span>Yakunlangan</span><strong>{data.goals.filter((x) => x.status === "done").length}</strong></div>
        <div><span>O‘rtacha progress</span><strong>{data.goals.length ? Math.round(data.goals.reduce((s, x) => s + x.progress, 0) / data.goals.length) : 0}%</strong></div>
      </section>

      <section className="toolbar cardLike">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Maqsad yoki kategoriya qidirish..." /></div>
        <div className="segmented">{(["all", "planned", "active", "paused", "done"] as const).map((x) => <button key={x} className={status === x ? "selected" : ""} onClick={() => setStatus(x)}>{x === "all" ? "Barchasi" : x}</button>)}</div>
      </section>

      <section className="goalGrid">
        {filtered.map((goal) => (
          <article className="goalCard" key={goal.id}>
            <div className="goalTop"><div className="entityIcon"><Target size={20} /></div><StatusPill value={goal.status} /></div>
            <p className="serviceCategory">{goal.category || "Umumiy"}</p>
            <h2>{goal.title}</h2>
            <div className="goalProgressLine"><div className="progress big"><i style={{ width: `${goal.progress}%` }} /></div><strong>{goal.progress}%</strong></div>
            <div className="goalMetrics"><div><span>Hozir</span><b>{goal.currentValue || 0}</b></div><div><span>Maqsad</span><b>{goal.targetValue || 0}</b></div><div><span>O‘lchov</span><b>{goal.metric || "—"}</b></div></div>
            <div className="entityMeta"><span>Target sana</span><b>{goal.targetDate || "—"}</b></div>
            {goal.note && <p className="serviceNote">{goal.note}</p>}
            <div className="entityActions"><button onClick={() => setEditing({ ...goal })}><Edit3 size={15} /> Tahrirlash</button><button className="dangerButton" onClick={() => window.confirm("Maqsadni o‘chirasizmi?") && removeGoal(goal.id)}><Trash2 size={15} /></button></div>
          </article>
        ))}
      </section>
      {!filtered.length && <EmptyState title="Maqsad topilmadi" text="Yangi maqsad qo‘shing yoki filtrni o‘zgartiring." />}

      <Modal open={!!editing} title={data.goals.some((p) => p.id === editing?.id) ? "Maqsadni tahrirlash" : "Yangi maqsad"} subtitle="O‘lchanadigan target kiritsangiz progress avtomatik hisoblanadi." onClose={() => setEditing(null)}>
        {editing && <form className="formGrid" onSubmit={save}>
          <label className="field span2"><span>Maqsad</span><input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
          <label className="field"><span>Kategoriya</span><input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Finance, Personal Brand..." /></label>
          <label className="field"><span>Status</span><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as GoalStatus })}><option value="planned">planned</option><option value="active">active</option><option value="paused">paused</option><option value="done">done</option></select></label>
          <label className="field"><span>Target sana</span><input type="date" value={editing.targetDate} onChange={(e) => setEditing({ ...editing, targetDate: e.target.value })} /></label>
          <label className="field"><span>O‘lchov nomi</span><input value={editing.metric} onChange={(e) => setEditing({ ...editing, metric: e.target.value })} placeholder="USD, kontent soni..." /></label>
          <label className="field"><span>Hozirgi qiymat</span><input type="number" value={editing.currentValue} onChange={(e) => setEditing({ ...editing, currentValue: Number(e.target.value) })} /></label>
          <label className="field"><span>Target qiymat</span><input type="number" value={editing.targetValue} onChange={(e) => setEditing({ ...editing, targetValue: Number(e.target.value) })} /></label>
          <label className="field span2"><span>Izoh / strategiya</span><textarea rows={3} value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          <div className="span2"><FormActions onCancel={() => setEditing(null)} /></div>
        </form>}
      </Modal>
    </div>
  );
}
