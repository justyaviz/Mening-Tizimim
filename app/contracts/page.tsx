"use client";

import { CalendarClock, Edit3, FileSignature, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, PageHeader, StatusPill } from "@/components/ui";
import { formatMoney, makeId, type Contract, type ContractStatus, type Currency } from "@/lib/data";

const emptyContract = (): Contract => ({
  id: makeId("contract"),
  title: "",
  client: "",
  project: "",
  status: "draft",
  amount: 0,
  currency: "UZS",
  billing: "monthly",
  startDate: "2026-08-17",
  endDate: "2026-09-17",
  paymentDay: 1,
  note: "",
});

export default function ContractsPage() {
  const { data, addContract, updateContract, removeContract } = useAppData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | ContractStatus>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contract | null>(null);

  const filtered = useMemo(() => data.contracts.filter((contract) => {
    const q = query.toLowerCase();
    const match = [contract.title, contract.client, contract.project].some((v) => v.toLowerCase().includes(q));
    return match && (filter === "all" || contract.status === filter);
  }), [data.contracts, query, filter]);

  function addNew() { setEditing(emptyContract()); setOpen(true); }
  function edit(item: Contract) { setEditing({ ...item }); setOpen(true); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.title.trim()) return;
    data.contracts.some((c) => c.id === editing.id) ? updateContract(editing) : addContract(editing);
    setOpen(false);
  }

  const active = data.contracts.filter((c) => c.status === "active" || c.status === "ending");
  const uzs = active.filter((c) => c.currency === "UZS").reduce((s, c) => s + c.amount, 0);
  const usd = active.filter((c) => c.currency === "USD").reduce((s, c) => s + c.amount, 0);

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="CONTRACT CONTROL" title="Shartnomalar" subtitle="Muddat, qiymat, to‘lov sanasi va shartnoma holatini nazorat qiling." actionLabel="Yangi shartnoma" onAction={addNew} />

      <section className="summaryStrip">
        <div><span>Jami</span><strong>{data.contracts.length}</strong></div>
        <div><span>Aktiv</span><strong>{active.length}</strong></div>
        <div><span>UZS qiymat</span><strong>{formatMoney(uzs, "UZS")}</strong></div>
        <div><span>USD qiymat</span><strong>{formatMoney(usd, "USD")}</strong></div>
      </section>

      <section className="toolbar cardLike">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Shartnoma, mijoz yoki loyiha..." /></div>
        <div className="segmented">
          {(["all", "active", "ending", "draft", "completed"] as const).map((item) => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item === "all" ? "Barchasi" : item}</button>)}
        </div>
      </section>

      <section className="contractGrid">
        {filtered.map((contract) => (
          <article className="contractCard" key={contract.id}>
            <div className="contractCardHead">
              <div className="entityIcon"><FileSignature size={20} /></div>
              <StatusPill value={contract.status} />
            </div>
            <h2>{contract.title}</h2>
            <p>{contract.client} · {contract.project || "Loyiha biriktirilmagan"}</p>
            <div className="contractAmount">{formatMoney(contract.amount, contract.currency)} <span>{contract.billing === "monthly" ? "/ oy" : "bir martalik"}</span></div>
            <div className="contractDates">
              <div><span>Boshlanish</span><b>{contract.startDate}</b></div>
              <div><span>Tugash</span><b>{contract.endDate}</b></div>
            </div>
            <div className="paymentLine"><CalendarClock size={15} /><span>To‘lov kuni: har oyning <b>{contract.paymentDay}-sanasi</b></span></div>
            {contract.note && <div className="noteBox">{contract.note}</div>}
            <div className="entityActions">
              <button onClick={() => edit(contract)}><Edit3 size={15} /> Tahrirlash</button>
              <button className="dangerButton" onClick={() => window.confirm("Shartnomani o‘chirasizmi?") && removeContract(contract.id)}><Trash2 size={15} /></button>
            </div>
          </article>
        ))}
      </section>
      {!filtered.length && <EmptyState title="Shartnoma topilmadi" text="Yangi shartnoma qo‘shing yoki filtrni o‘zgartiring." />}

      <Modal open={open} title={data.contracts.some((c) => c.id === editing?.id) ? "Shartnomani tahrirlash" : "Yangi shartnoma"} subtitle="Shartnoma bo‘yicha asosiy nazorat ma’lumotlari." onClose={() => setOpen(false)}>
        {editing && <form className="formGrid" onSubmit={save}>
          <label className="field span2"><span>Shartnoma nomi</span><input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
          <label className="field"><span>Mijoz</span><input value={editing.client} onChange={(e) => setEditing({ ...editing, client: e.target.value })} /></label>
          <label className="field"><span>Loyiha</span><input value={editing.project} onChange={(e) => setEditing({ ...editing, project: e.target.value })} /></label>
          <label className="field"><span>Status</span><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as ContractStatus })}><option value="active">active</option><option value="ending">ending</option><option value="draft">draft</option><option value="completed">completed</option></select></label>
          <label className="field"><span>Billing</span><select value={editing.billing} onChange={(e) => setEditing({ ...editing, billing: e.target.value as Contract["billing"] })}><option value="monthly">oylik</option><option value="one_time">bir martalik</option></select></label>
          <label className="field"><span>Qiymat</span><input type="number" min="0" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} /></label>
          <label className="field"><span>Valyuta</span><select value={editing.currency} onChange={(e) => setEditing({ ...editing, currency: e.target.value as Currency })}><option value="UZS">UZS</option><option value="USD">USD</option></select></label>
          <label className="field"><span>Boshlanish</span><input type="date" value={editing.startDate} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} /></label>
          <label className="field"><span>Tugash</span><input type="date" value={editing.endDate} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} /></label>
          <label className="field"><span>To‘lov kuni</span><input type="number" min="1" max="31" value={editing.paymentDay} onChange={(e) => setEditing({ ...editing, paymentDay: Number(e.target.value) })} /></label>
          <label className="field span2"><span>Izoh</span><textarea rows={3} value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          <div className="span2"><FormActions onCancel={() => setOpen(false)} /></div>
        </form>}
      </Modal>
    </div>
  );
}
