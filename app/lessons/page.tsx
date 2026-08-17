"use client";

import { AlertTriangle, CheckCircle2, Edit3, Lightbulb, Search, Trash2, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, PageHeader } from "@/components/ui";
import { makeId, type Lesson, type LessonType } from "@/lib/data";

const emptyLesson = (): Lesson => ({
  id: makeId("lesson"), date: "2026-08-17", title: "", project: "", type: "lesson", situation: "", lesson: "", action: "",
});

const typeLabel: Record<LessonType, string> = { mistake: "Xato", lesson: "Dars", win: "Yutuq" };
const TypeIcon = ({ type }: { type: LessonType }) => type === "mistake" ? <AlertTriangle size={18} /> : type === "win" ? <Trophy size={18} /> : <Lightbulb size={18} />;

export default function LessonsPage() {
  const { data, addLesson, updateLesson, removeLesson } = useAppData();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | LessonType>("all");
  const [editing, setEditing] = useState<Lesson | null>(null);

  const filtered = useMemo(() => data.lessons.filter((item) => {
    const q = query.toLowerCase();
    const match = [item.title, item.project, item.situation, item.lesson, item.action].some((v) => v.toLowerCase().includes(q));
    return match && (type === "all" || item.type === type);
  }).sort((a, b) => b.date.localeCompare(a.date)), [data.lessons, query, type]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.title.trim()) return;
    data.lessons.some((p) => p.id === editing.id) ? updateLesson(editing) : addLesson(editing);
    setEditing(null);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="PERSONAL KNOWLEDGE" title="Xatolar & Darslar" subtitle="Qaysi qaror ishladi, qayerda xato bo‘ldi va keyingi safar nimani boshqacha qilish kerakligini saqlang." actionLabel="Yangi yozuv" onAction={() => setEditing(emptyLesson())} />

      <section className="summaryStrip">
        <div><span>Jami</span><strong>{data.lessons.length}</strong></div>
        <div><span>Xatolar</span><strong>{data.lessons.filter((x) => x.type === "mistake").length}</strong></div>
        <div><span>Darslar</span><strong>{data.lessons.filter((x) => x.type === "lesson").length}</strong></div>
        <div><span>Yutuqlar</span><strong>{data.lessons.filter((x) => x.type === "win").length}</strong></div>
      </section>

      <section className="toolbar cardLike">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Xato, dars yoki loyiha qidirish..." /></div>
        <div className="segmented">
          {(["all", "mistake", "lesson", "win"] as const).map((item) => <button key={item} className={type === item ? "selected" : ""} onClick={() => setType(item)}>{item === "all" ? "Barchasi" : typeLabel[item]}</button>)}
        </div>
      </section>

      <section className="lessonGrid">
        {filtered.map((item) => (
          <article className={`lessonCard ${item.type}`} key={item.id}>
            <div className="lessonTop">
              <div className="lessonType"><TypeIcon type={item.type} /><span>{typeLabel[item.type]}</span></div>
              <span className="lessonDate">{item.date}</span>
            </div>
            <h2>{item.title}</h2>
            <p className="lessonProject">{item.project || "Umumiy"}</p>
            <div className="lessonSection"><span>Vaziyat</span><p>{item.situation || "—"}</p></div>
            <div className="lessonSection strong"><span>Olingan dars</span><p>{item.lesson || "—"}</p></div>
            <div className="lessonAction"><CheckCircle2 size={15} /><div><span>Keyingi action</span><strong>{item.action || "Kiritilmagan"}</strong></div></div>
            <div className="lessonButtons"><button onClick={() => setEditing({ ...item })}><Edit3 size={14} /> Tahrirlash</button><button className="dangerButton" onClick={() => window.confirm("Yozuvni o‘chirasizmi?") && removeLesson(item.id)}><Trash2 size={14} /></button></div>
          </article>
        ))}
      </section>
      {!filtered.length && <EmptyState title="Yozuv topilmadi" text="Tajriba, xato yoki yutuqni yozib qoldiring." />}

      <Modal open={!!editing} title={data.lessons.some((p) => p.id === editing?.id) ? "Yozuvni tahrirlash" : "Yangi tajriba yozuvi"} subtitle="Kelajakda bir xil xatoni takrorlamaslik uchun qisqa va aniq yozing." onClose={() => setEditing(null)}>
        {editing && <form className="formGrid" onSubmit={save}>
          <label className="field"><span>Sana</span><input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></label>
          <label className="field"><span>Turi</span><select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as LessonType })}><option value="mistake">Xato</option><option value="lesson">Dars</option><option value="win">Yutuq</option></select></label>
          <label className="field span2"><span>Sarlavha</span><input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
          <label className="field span2"><span>Loyiha</span><input value={editing.project} onChange={(e) => setEditing({ ...editing, project: e.target.value })} /></label>
          <label className="field span2"><span>Nima bo‘ldi?</span><textarea rows={3} value={editing.situation} onChange={(e) => setEditing({ ...editing, situation: e.target.value })} /></label>
          <label className="field span2"><span>Nimani o‘rgandim?</span><textarea rows={3} value={editing.lesson} onChange={(e) => setEditing({ ...editing, lesson: e.target.value })} /></label>
          <label className="field span2"><span>Keyingi safar nima qilaman?</span><textarea rows={2} value={editing.action} onChange={(e) => setEditing({ ...editing, action: e.target.value })} /></label>
          <div className="span2"><FormActions onCancel={() => setEditing(null)} /></div>
        </form>}
      </Modal>
    </div>
  );
}
