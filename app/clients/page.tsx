"use client";

import { Building2, Edit3, Instagram, MessageCircle, Phone, Search, Trash2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, PageHeader, StatusPill } from "@/components/ui";
import { makeId, type Client, type ClientStatus } from "@/lib/data";

const emptyClient = (): Client => ({
  id: makeId("client"),
  name: "",
  company: "",
  role: "",
  phone: "",
  telegram: "",
  instagram: "",
  status: "lead",
  source: "",
  note: "",
});

export default function ClientsPage() {
  const { data, addClient, updateClient, removeClient } = useAppData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | ClientStatus>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const filtered = useMemo(() => data.clients.filter((client) => {
    const q = query.toLowerCase();
    const match = [client.name, client.company, client.role, client.instagram, client.telegram].some((v) => v.toLowerCase().includes(q));
    return match && (filter === "all" || client.status === filter);
  }), [data.clients, query, filter]);

  function addNew() { setEditing(emptyClient()); setOpen(true); }
  function edit(client: Client) { setEditing({ ...client }); setOpen(true); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.name.trim()) return;
    data.clients.some((c) => c.id === editing.id) ? updateClient(editing) : addClient(editing);
    setOpen(false);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="CLIENT CRM" title="Mijozlar" subtitle="Mijozlar, kontaktlar, leadlar va aloqa ma’lumotlarini bir joyda saqlang." actionLabel="Yangi mijoz" onAction={addNew} />

      <section className="summaryStrip">
        <div><span>Jami kontakt</span><strong>{data.clients.length}</strong></div>
        <div><span>Aktiv mijoz</span><strong>{data.clients.filter((c) => c.status === "active").length}</strong></div>
        <div><span>Lead</span><strong>{data.clients.filter((c) => c.status === "lead").length}</strong></div>
        <div><span>Loyihaga ulangan</span><strong>{new Set(data.projects.map((p) => p.client).filter(Boolean)).size}</strong></div>
      </section>

      <section className="toolbar cardLike">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ism, kompaniya, Instagram..." /></div>
        <div className="segmented">
          {(["all", "active", "lead", "inactive"] as const).map((item) => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item === "all" ? "Barchasi" : item}</button>)}
        </div>
      </section>

      <section className="entityTable cardLike">
        <div className="entityTableHead clientCols"><span>Mijoz</span><span>Status</span><span>Aloqa</span><span>Manba</span><span /></div>
        {filtered.map((client) => (
          <div className="entityTableRow clientCols" key={client.id}>
            <div className="personCell"><div className="personAvatar"><UserRound size={18} /></div><div><strong>{client.name}</strong><small>{client.company || "Kompaniya yo‘q"} · {client.role || "Rol yo‘q"}</small></div></div>
            <div><StatusPill value={client.status} /></div>
            <div className="contactCell">
              {client.phone && <span><Phone size={13} /> {client.phone}</span>}
              {client.telegram && <span><MessageCircle size={13} /> {client.telegram}</span>}
              {client.instagram && <span><Instagram size={13} /> {client.instagram}</span>}
              {!client.phone && !client.telegram && !client.instagram && <span className="mutedText">Aloqa kiritilmagan</span>}
            </div>
            <div className="sourceCell"><Building2 size={14} /><span>{client.source || "—"}</span></div>
            <div className="rowActions"><button onClick={() => edit(client)}><Edit3 size={15} /></button><button className="dangerButton" onClick={() => window.confirm("Mijozni o‘chirasizmi?") && removeClient(client.id)}><Trash2 size={15} /></button></div>
          </div>
        ))}
      </section>
      {!filtered.length && <EmptyState title="Mijoz topilmadi" text="Yangi mijoz qo‘shing yoki filtrni o‘zgartiring." />}

      <Modal open={open} title={data.clients.some((c) => c.id === editing?.id) ? "Mijozni tahrirlash" : "Yangi mijoz"} subtitle="CRM uchun asosiy kontakt ma’lumotlari." onClose={() => setOpen(false)}>
        {editing && <form className="formGrid" onSubmit={save}>
          <label className="field"><span>Ism / nomi</span><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
          <label className="field"><span>Kompaniya</span><input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} /></label>
          <label className="field"><span>Rol / xizmat</span><input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="SMM mijoz, hamkor..." /></label>
          <label className="field"><span>Status</span><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as ClientStatus })}><option value="active">active</option><option value="lead">lead</option><option value="inactive">inactive</option></select></label>
          <label className="field"><span>Telefon</span><input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} placeholder="+998..." /></label>
          <label className="field"><span>Telegram</span><input value={editing.telegram} onChange={(e) => setEditing({ ...editing, telegram: e.target.value })} placeholder="@username" /></label>
          <label className="field"><span>Instagram</span><input value={editing.instagram} onChange={(e) => setEditing({ ...editing, instagram: e.target.value })} placeholder="@username" /></label>
          <label className="field"><span>Qayerdan keldi</span><input value={editing.source} onChange={(e) => setEditing({ ...editing, source: e.target.value })} placeholder="Referral, Instagram..." /></label>
          <label className="field span2"><span>Izoh</span><textarea rows={3} value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          <div className="span2"><FormActions onCancel={() => setOpen(false)} /></div>
        </form>}
      </Modal>
    </div>
  );
}
