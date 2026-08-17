"use client";

import { BriefcaseBusiness, Edit3, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, PageHeader } from "@/components/ui";
import { formatMoney, makeId, type Currency, type Service } from "@/lib/data";

const emptyService = (): Service => ({
  id: makeId("service"), name: "", category: "", basePrice: 0, currency: "UZS", unit: "project", deliveryDays: 7, costEstimate: 0, active: true, note: "",
});

export default function ServicesPage() {
  const { data, addService, updateService, removeService } = useAppData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [editing, setEditing] = useState<Service | null>(null);

  const filtered = useMemo(() => data.services.filter((item) => {
    const q = query.toLowerCase();
    const match = [item.name, item.category, item.note].some((v) => v.toLowerCase().includes(q));
    const stateMatch = filter === "all" || (filter === "active" ? item.active : !item.active);
    return match && stateMatch;
  }), [data.services, query, filter]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.name.trim()) return;
    data.services.some((p) => p.id === editing.id) ? updateService(editing) : addService(editing);
    setEditing(null);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="OFFER CATALOG" title="Xizmatlarim" subtitle="Sotadigan xizmatlaringiz, bazaviy narx, tannarx va yetkazish vaqtini bir joyda saqlang." actionLabel="Xizmat qo‘shish" onAction={() => setEditing(emptyService())} />

      <section className="summaryStrip">
        <div><span>Jami xizmat</span><strong>{data.services.length}</strong></div>
        <div><span>Aktiv</span><strong>{data.services.filter((x) => x.active).length}</strong></div>
        <div><span>Kategoriyalar</span><strong>{new Set(data.services.map((x) => x.category).filter(Boolean)).size}</strong></div>
        <div><span>Web/IT</span><strong>{data.services.filter((x) => x.category.toLowerCase().includes("web") || x.category.toLowerCase().includes("it")).length}</strong></div>
      </section>

      <section className="toolbar cardLike">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Xizmat yoki kategoriya qidirish..." /></div>
        <div className="segmented">{(["all", "active", "inactive"] as const).map((x) => <button key={x} className={filter === x ? "selected" : ""} onClick={() => setFilter(x)}>{x === "all" ? "Barchasi" : x === "active" ? "Aktiv" : "Nofaol"}</button>)}</div>
      </section>

      <section className="serviceGrid">
        {filtered.map((item) => {
          const margin = item.basePrice > 0 ? Math.max(0, Math.round(((item.basePrice - item.costEstimate) / item.basePrice) * 100)) : 0;
          return (
            <article className="serviceCard" key={item.id}>
              <div className="serviceTop"><div className="entityIcon"><BriefcaseBusiness size={20} /></div><span className={`serviceState ${item.active ? "on" : "off"}`}>{item.active ? "AKTIV" : "NOFAOL"}</span></div>
              <p className="serviceCategory">{item.category || "Kategoriya yo‘q"}</p>
              <h2>{item.name}</h2>
              <div className="servicePrice"><strong>{formatMoney(item.basePrice, item.currency)}</strong><span>/ {item.unit}</span></div>
              <div className="serviceStats"><div><span>Taxminiy tannarx</span><b>{formatMoney(item.costEstimate, item.currency)}</b></div><div><span>Marja</span><b>{margin}%</b></div><div><span>Muddat</span><b>{item.deliveryDays} kun</b></div></div>
              {item.note && <p className="serviceNote">{item.note}</p>}
              <div className="entityActions"><button onClick={() => setEditing({ ...item })}><Edit3 size={15} /> Tahrirlash</button><button className="dangerButton" onClick={() => window.confirm("Xizmatni o‘chirasizmi?") && removeService(item.id)}><Trash2 size={15} /></button></div>
            </article>
          );
        })}
      </section>
      {!filtered.length && <EmptyState title="Xizmat topilmadi" text="Yangi xizmat qo‘shing yoki filtrni o‘zgartiring." />}

      <Modal open={!!editing} title={data.services.some((p) => p.id === editing?.id) ? "Xizmatni tahrirlash" : "Yangi xizmat"} subtitle="Taklif berishda foydalanadigan bazaviy parametrlarni yozing." onClose={() => setEditing(null)}>
        {editing && <form className="formGrid" onSubmit={save}>
          <label className="field span2"><span>Xizmat nomi</span><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
          <label className="field"><span>Kategoriya</span><input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Marketing, Web / IT..." /></label>
          <label className="field"><span>Holat</span><select value={editing.active ? "active" : "inactive"} onChange={(e) => setEditing({ ...editing, active: e.target.value === "active" })}><option value="active">Aktiv</option><option value="inactive">Nofaol</option></select></label>
          <label className="field"><span>Bazaviy narx</span><input type="number" min="0" value={editing.basePrice} onChange={(e) => setEditing({ ...editing, basePrice: Number(e.target.value) })} /></label>
          <label className="field"><span>Valyuta</span><select value={editing.currency} onChange={(e) => setEditing({ ...editing, currency: e.target.value as Currency })}><option value="UZS">UZS</option><option value="USD">USD</option></select></label>
          <label className="field"><span>Narx birligi</span><select value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value as Service["unit"] })}><option value="project">project</option><option value="monthly">monthly</option><option value="hour">hour</option></select></label>
          <label className="field"><span>Muddat (kun)</span><input type="number" min="0" value={editing.deliveryDays} onChange={(e) => setEditing({ ...editing, deliveryDays: Number(e.target.value) })} /></label>
          <label className="field"><span>Taxminiy tannarx</span><input type="number" min="0" value={editing.costEstimate} onChange={(e) => setEditing({ ...editing, costEstimate: Number(e.target.value) })} /></label>
          <label className="field span2"><span>Izoh</span><textarea rows={3} value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          <div className="span2"><FormActions onCancel={() => setEditing(null)} /></div>
        </form>}
      </Modal>
    </div>
  );
}
