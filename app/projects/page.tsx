"use client";

import { Edit3, Eye, FolderKanban, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, PageHeader, StatusPill } from "@/components/ui";
import { formatMoney, makeId, type Currency, type Project, type ProjectStatus } from "@/lib/data";

const emptyProject = (): Project => ({
  id: makeId("project"),
  name: "",
  service: "",
  client: "",
  status: "active",
  progress: 0,
  amount: 0,
  currency: "UZS",
  deadline: "2026-08-31",
  nextAction: "",
  notes: "",
});

export default function ProjectsPage() {
  const { data, addProject, updateProject, removeProject } = useAppData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ProjectStatus>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const filtered = useMemo(() => data.projects.filter((p) => {
    const q = query.toLowerCase();
    const matches = [p.name, p.client, p.service, p.nextAction].some((v) => v.toLowerCase().includes(q));
    return matches && (status === "all" || p.status === status);
  }), [data.projects, query, status]);

  function openNew() {
    setEditing(emptyProject());
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing({ ...project });
    setModalOpen(true);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !editing.name.trim()) return;
    const exists = data.projects.some((p) => p.id === editing.id);
    exists ? updateProject(editing) : addProject(editing);
    setModalOpen(false);
    setEditing(null);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="PROJECT CONTROL" title="Loyihalar" subtitle="Barcha aktiv, pauzadagi va yakunlangan ishlarni boshqaring." actionLabel="Yangi loyiha" onAction={openNew} />

      <section className="summaryStrip">
        <div><span>Jami</span><strong>{data.projects.length}</strong></div>
        <div><span>Aktiv</span><strong>{data.projects.filter((p) => p.status === "active").length}</strong></div>
        <div><span>Deadline yaqin</span><strong>{data.projects.filter((p) => p.status === "active" && p.deadline <= "2026-08-31").length}</strong></div>
        <div><span>Yakunlangan</span><strong>{data.projects.filter((p) => p.status === "done").length}</strong></div>
      </section>

      <section className="toolbar cardLike">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Loyiha yoki mijoz qidirish..." /></div>
        <div className="segmented">
          {(["all", "active", "paused", "lead", "done"] as const).map((item) => (
            <button key={item} onClick={() => setStatus(item)} className={status === item ? "selected" : ""}>{item === "all" ? "Barchasi" : item}</button>
          ))}
        </div>
      </section>

      <section className="projectCardsGrid">
        {filtered.map((project) => (
          <article className="entityCard" key={project.id}>
            <div className="entityCardTop">
              <div className="entityIcon"><FolderKanban size={20} /></div>
              <StatusPill value={project.status} />
            </div>
            <div className="entityBody">
              <h2>{project.name}</h2>
              <p>{project.service} · {project.client || "Mijoz belgilanmagan"}</p>
              <div className="progress big"><i style={{ width: `${project.progress}%` }} /></div>
              <div className="entityMeta"><span>Progress</span><b>{project.progress}%</b></div>
              <div className="entityMeta"><span>Qiymat</span><b>{formatMoney(project.amount, project.currency)}</b></div>
              <div className="entityMeta"><span>Deadline</span><b>{project.deadline || "—"}</b></div>
              <div className="nextAction"><span>Keyingi qadam</span><strong>{project.nextAction || "Kiritilmagan"}</strong></div>
            </div>
            <div className="entityActions">
              <Link className="entityActionLink" href={`/projects/${project.id}`}><Eye size={15} /> Batafsil</Link>
              <button onClick={() => openEdit(project)}><Edit3 size={15} /> Tahrirlash</button>
              <button className="dangerButton" onClick={() => window.confirm("Loyihani o‘chirasizmi?") && removeProject(project.id)}><Trash2 size={15} /></button>
            </div>
          </article>
        ))}
      </section>
      {!filtered.length && <EmptyState title="Loyiha topilmadi" text="Filtrni o‘zgartiring yoki yangi loyiha qo‘shing." />}

      <Modal open={modalOpen} title={data.projects.some((p) => p.id === editing?.id) ? "Loyihani tahrirlash" : "Yangi loyiha"} subtitle="Asosiy loyiha ma’lumotlarini kiriting." onClose={() => setModalOpen(false)}>
        {editing && (
          <form className="formGrid" onSubmit={save}>
            <label className="field span2"><span>Loyiha nomi</span><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Masalan: Yangi SMM loyiha" /></label>
            <label className="field"><span>Xizmat</span><input value={editing.service} onChange={(e) => setEditing({ ...editing, service: e.target.value })} placeholder="SMM, Target, Web..." /></label>
            <label className="field"><span>Mijoz</span><input list="client-options" value={editing.client} onChange={(e) => setEditing({ ...editing, client: e.target.value })} placeholder="Mijoz yoki kompaniya" /><datalist id="client-options">{data.clients.map((client) => <option key={client.id} value={client.name} />)}</datalist></label>
            <label className="field"><span>Status</span><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as ProjectStatus })}><option value="active">active</option><option value="paused">paused</option><option value="lead">lead</option><option value="done">done</option></select></label>
            <label className="field"><span>Progress (%)</span><input type="number" min="0" max="100" value={editing.progress} onChange={(e) => setEditing({ ...editing, progress: Number(e.target.value) })} /></label>
            <label className="field"><span>Qiymat</span><input type="number" min="0" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} /></label>
            <label className="field"><span>Valyuta</span><select value={editing.currency} onChange={(e) => setEditing({ ...editing, currency: e.target.value as Currency })}><option value="UZS">UZS</option><option value="USD">USD</option></select></label>
            <label className="field"><span>Deadline</span><input type="date" value={editing.deadline} onChange={(e) => setEditing({ ...editing, deadline: e.target.value })} /></label>
            <label className="field span2"><span>Keyingi qadam</span><input value={editing.nextAction} onChange={(e) => setEditing({ ...editing, nextAction: e.target.value })} placeholder="Keyingi qilinadigan ish" /></label>
            <label className="field span2"><span>Izoh</span><textarea value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} rows={3} /></label>
            <div className="span2"><FormActions onCancel={() => setModalOpen(false)} /></div>
          </form>
        )}
      </Modal>
    </div>
  );
}
