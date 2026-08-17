"use client";

import { BellRing, CalendarClock, CheckCircle2, Circle, Clock3, Edit3, Search, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { FormActions, Modal, PageHeader, StatusPill } from "@/components/ui";
import { formatTaskDate, makeId, type Task, type TaskPriority, type TaskStatus } from "@/lib/data";

const emptyForm = (): Task => ({
  id: makeId("task"),
  title: "",
  project: "",
  status: "todo",
  priority: "medium",
  dueAt: "",
  reminderAt: "",
  description: "",
  createdAt: new Date().toISOString(),
});

const priorityLabel: Record<TaskPriority, string> = { low: "Past", medium: "O‘rta", high: "Yuqori" };
const statusLabel: Record<TaskStatus, string> = { todo: "Rejada", doing: "Jarayonda", done: "Bajarildi" };

export default function TasksPage() {
  const { data, addTask, updateTask, removeTask, toggleTask } = useAppData();
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<Task>(emptyForm());
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() => typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported");

  const tasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...data.tasks]
      .filter((task) => filter === "all" || task.status === filter)
      .filter((task) => !q || `${task.title} ${task.project} ${task.description}`.toLowerCase().includes(q))
      .sort((a, b) => {
        if (a.status === "done" && b.status !== "done") return 1;
        if (a.status !== "done" && b.status === "done") return -1;
        if (!a.dueAt) return 1;
        if (!b.dueAt) return -1;
        return a.dueAt.localeCompare(b.dueAt);
      });
  }, [data.tasks, filter, query]);

  const now = Date.now();
  const stats = useMemo(() => ({
    todo: data.tasks.filter((t) => t.status === "todo").length,
    doing: data.tasks.filter((t) => t.status === "doing").length,
    done: data.tasks.filter((t) => t.status === "done").length,
    overdue: data.tasks.filter((t) => t.status !== "done" && t.dueAt && new Date(t.dueAt).getTime() < now).length,
  }), [data.tasks, now]);

  function openNew() {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setForm({ ...task });
    setModalOpen(true);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) return;
    const normalized = { ...form, title: form.title.trim(), project: form.project.trim() };
    if (editing) updateTask(normalized);
    else addTask(normalized);
    setModalOpen(false);
  }

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="MY DAY" title="Vazifalar" subtitle="Kunlik ishlar, deadline va reminderlarni boshqaring." actionLabel="Yangi vazifa" onAction={openNew} />

      <section className="taskStats">
        <div><span>Rejada</span><strong>{stats.todo}</strong></div>
        <div><span>Jarayonda</span><strong>{stats.doing}</strong></div>
        <div><span>Bajarildi</span><strong>{stats.done}</strong></div>
        <div className={stats.overdue ? "dangerStat" : ""}><span>Kechikkan</span><strong>{stats.overdue}</strong></div>
      </section>

      <section className="taskToolbar cardLike">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Vazifa yoki loyiha qidirish..." /></div>
        <div className="segmented">
          {(["all", "todo", "doing", "done"] as const).map((key) => <button key={key} className={filter === key ? "selected" : ""} onClick={() => setFilter(key)}>{key === "all" ? "Barchasi" : statusLabel[key]}</button>)}
        </div>
        <button className="secondaryButton reminderButton" onClick={enableNotifications}><BellRing size={15} /> {permission === "granted" ? "Reminder yoqilgan" : permission === "denied" ? "Ruxsat berilmagan" : "Reminder yoqish"}</button>
      </section>

      <section className="taskBoard">
        {tasks.length ? tasks.map((task) => {
          const overdue = task.status !== "done" && task.dueAt && new Date(task.dueAt).getTime() < now;
          return (
            <article className={`taskCard ${task.status === "done" ? "taskDone" : ""}`} key={task.id}>
              <button className={`taskToggle ${task.status === "done" ? "checked" : ""}`} onClick={() => toggleTask(task.id)} aria-label="Vazifa holatini almashtirish">{task.status === "done" ? <CheckCircle2 size={21} /> : <Circle size={21} />}</button>
              <div className="taskCardBody">
                <div className="taskTitleLine"><strong>{task.title}</strong><span className={`priorityBadge ${task.priority}`}>{priorityLabel[task.priority as TaskPriority]}</span></div>
                {task.description && <p>{task.description}</p>}
                <div className="taskMetaLine">
                  <span className={overdue ? "overdueText" : ""}><CalendarClock size={14} /> {formatTaskDate(task.dueAt)}</span>
                  {task.reminderAt && <span><BellRing size={14} /> {formatTaskDate(task.reminderAt)}</span>}
                  <span><Clock3 size={14} /> {task.project || "Umumiy"}</span>
                  <StatusPill value={statusLabel[task.status as TaskStatus]} />
                </div>
              </div>
              <div className="taskActions">
                <button onClick={() => openEdit(task)} aria-label="Tahrirlash"><Edit3 size={16} /></button>
                <button className="dangerButton" onClick={() => window.confirm("Vazifani o‘chirasizmi?") && removeTask(task.id)} aria-label="O‘chirish"><Trash2 size={16} /></button>
              </div>
            </article>
          );
        }) : <div className="emptyState cardLike"><div className="emptyDot" /><strong>Vazifa topilmadi</strong><p>Filtrni o‘zgartiring yoki yangi vazifa qo‘shing.</p></div>}
      </section>

      <Modal open={modalOpen} title={editing ? "Vazifani tahrirlash" : "Yangi vazifa"} subtitle="Deadline va reminder bilan shaxsiy ish rejangiz." onClose={() => setModalOpen(false)}>
        <form className="formGrid" onSubmit={save}>
          <label className="field span2"><span>Vazifa nomi</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Masalan: Avgust hisobotini tayyorlash" /></label>
          <label className="field"><span>Loyiha</span><input list="project-options" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="Loyiha nomi" /><datalist id="project-options">{data.projects.map((p) => <option key={p.id} value={p.name} />)}</datalist></label>
          <label className="field"><span>Status</span><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}><option value="todo">Rejada</option><option value="doing">Jarayonda</option><option value="done">Bajarildi</option></select></label>
          <label className="field"><span>Muhimlik</span><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}><option value="low">Past</option><option value="medium">O‘rta</option><option value="high">Yuqori</option></select></label>
          <label className="field"><span>Deadline</span><input type="datetime-local" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} /></label>
          <label className="field"><span>Reminder vaqti</span><input type="datetime-local" value={form.reminderAt} onChange={(e) => setForm({ ...form, reminderAt: e.target.value })} /></label>
          <label className="field span2"><span>Izoh</span><textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Vazifa bo‘yicha qisqa izoh..." /></label>
          <div className="span2"><FormActions onCancel={() => setModalOpen(false)} submitLabel={editing ? "Yangilash" : "Vazifa qo‘shish"} /></div>
        </form>
      </Modal>
    </div>
  );
}
