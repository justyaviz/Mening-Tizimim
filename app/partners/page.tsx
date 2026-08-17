"use client";

import { Edit3, Handshake, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, PageHeader, StatusPill } from "@/components/ui";
import { formatMoney, makeId, type Currency, type Partner, type PartnerStatus } from "@/lib/data";

const emptyPartner = (): Partner => ({
  id: makeId("partner"), name: "", specialty: "", phone: "", telegram: "", rate: 0, currency: "UZS", rateType: "project", status: "available", projects: "", note: "",
});

export default function PartnersPage() {
  const { data, addPartner, updatePartner, removePartner } = useAppData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | PartnerStatus>("all");
  const [editing, setEditing] = useState<Partner | null>(null);

  const filtered = useMemo(() => data.partners.filter((item) => {
    const q = query.toLowerCase();
    const match = [item.name, item.specialty, item.telegram, item.projects, item.note].some((v) => v.toLowerCase().includes(q));
    return match && (status === "all" || item.status === status);
  }), [data.partners, query, status]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.name.trim()) return;
    data.partners.some((p) => p.id === editing.id) ? updatePartner(editing) : addPartner(editing);
    setEditing(null);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="COLLABORATION CRM" title="Hamkorlar" subtitle="Mobilograf, dizayner, developer va boshqa hamkorlarni narxi va loyihalari bilan boshqaring." actionLabel="Hamkor qo‘shish" onAction={() => setEditing(emptyPartner())} />

      <section className="summaryStrip">
        <div><span>Jami</span><strong>{data.partners.length}</strong></div>
        <div><span>Aktiv</span><strong>{data.partners.filter((p) => p.status === "active").length}</strong></div>
        <div><span>Bo‘sh</span><strong>{data.partners.filter((p) => p.status === "available").length}</strong></div>
        <div><span>Yo‘nalishlar</span><strong>{new Set(data.partners.map((p) => p.specialty).filter(Boolean)).size}</strong></div>
      </section>

      <section className="toolbar cardLike">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hamkor, yo‘nalish yoki loyiha qidirish..." /></div>
        <div className="segmented">
          {(["all", "active", "available", "paused"] as const).map((item) => <button key={item} className={status === item ? "selected" : ""} onClick={() => setStatus(item)}>{item === "all" ? "Barchasi" : item}</button>)}
        </div>
      </section>

      <section className="projectCardsGrid partnerGrid">
        {filtered.map((partner) => (
          <article className="entityCard" key={partner.id}>
            <div className="entityCardTop"><div className="entityIcon"><Handshake size={20} /></div><StatusPill value={partner.status} /></div>
            <div className="entityBody">
              <h2>{partner.name}</h2>
              <p>{partner.specialty || "Yo‘nalish belgilanmagan"}</p>
              <div className="entityMeta"><span>Narx</span><b>{partner.rate ? `${formatMoney(partner.rate, partner.currency)} / ${partner.rateType}` : "Kelishiladi"}</b></div>
              <div className="entityMeta"><span>Telegram</span><b>{partner.telegram || "—"}</b></div>
              <div className="nextAction"><span>Loyihalar</span><strong>{partner.projects || "Hozircha biriktirilmagan"}</strong></div>
              {partner.note && <p className="partnerNote">{partner.note}</p>}
            </div>
            <div className="entityActions">
              <button onClick={() => setEditing({ ...partner })}><Edit3 size={15} /> Tahrirlash</button>
              <button className="dangerButton" onClick={() => window.confirm("Hamkorni o‘chirasizmi?") && removePartner(partner.id)}><Trash2 size={15} /></button>
            </div>
          </article>
        ))}
      </section>
      {!filtered.length && <EmptyState title="Hamkor topilmadi" text="Yangi hamkor qo‘shing yoki filtrni o‘zgartiring." />}

      <Modal open={!!editing} title={data.partners.some((p) => p.id === editing?.id) ? "Hamkorni tahrirlash" : "Yangi hamkor"} subtitle="Hamkorlik tafsilotlari va narxini saqlang." onClose={() => setEditing(null)}>
        {editing && <form className="formGrid" onSubmit={save}>
          <label className="field span2"><span>Ism / nomi</span><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Masalan: Aziz — mobilograf" /></label>
          <label className="field"><span>Yo‘nalish</span><input value={editing.specialty} onChange={(e) => setEditing({ ...editing, specialty: e.target.value })} placeholder="Mobilograf, designer, developer..." /></label>
          <label className="field"><span>Status</span><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as PartnerStatus })}><option value="active">active</option><option value="available">available</option><option value="paused">paused</option></select></label>
          <label className="field"><span>Telefon</span><input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></label>
          <label className="field"><span>Telegram</span><input value={editing.telegram} onChange={(e) => setEditing({ ...editing, telegram: e.target.value })} placeholder="@username" /></label>
          <label className="field"><span>Narx</span><input type="number" min="0" value={editing.rate} onChange={(e) => setEditing({ ...editing, rate: Number(e.target.value) })} /></label>
          <label className="field"><span>Valyuta</span><select value={editing.currency} onChange={(e) => setEditing({ ...editing, currency: e.target.value as Currency })}><option value="UZS">UZS</option><option value="USD">USD</option></select></label>
          <label className="field"><span>Narx turi</span><select value={editing.rateType} onChange={(e) => setEditing({ ...editing, rateType: e.target.value as Partner["rateType"] })}><option value="project">project</option><option value="monthly">monthly</option><option value="day">day</option></select></label>
          <label className="field"><span>Loyihalar</span><input value={editing.projects} onChange={(e) => setEditing({ ...editing, projects: e.target.value })} placeholder="aloo, Start Education..." /></label>
          <label className="field span2"><span>Izoh</span><textarea rows={3} value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          <div className="span2"><FormActions onCancel={() => setEditing(null)} /></div>
        </form>}
      </Modal>
    </div>
  );
}
