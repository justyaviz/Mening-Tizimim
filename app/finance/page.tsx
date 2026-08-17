"use client";

import { ArrowDownLeft, ArrowUpRight, Search, Trash2, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, PageHeader, StatusPill } from "@/components/ui";
import { formatMoney, makeId, shortMoney, type Currency, type Transaction, type TransactionType } from "@/lib/data";

const emptyTransaction = (): Transaction => ({
  id: makeId("transaction"),
  type: "income",
  title: "",
  category: "",
  project: "",
  amount: 0,
  currency: "UZS",
  date: "2026-08-17",
  note: "",
});

export default function FinancePage() {
  const { data, addTransaction, removeTransaction } = useAppData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | TransactionType>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const filtered = useMemo(() => data.transactions.filter((item) => {
    const q = query.toLowerCase();
    const match = [item.title, item.category, item.project, item.note].some((v) => v.toLowerCase().includes(q));
    return match && (filter === "all" || item.type === filter);
  }).sort((a, b) => b.date.localeCompare(a.date)), [data.transactions, query, filter]);

  const uzsIncome = data.transactions.filter((t) => t.type === "income" && t.currency === "UZS").reduce((s, t) => s + t.amount, 0);
  const uzsExpense = data.transactions.filter((t) => t.type === "expense" && t.currency === "UZS").reduce((s, t) => s + t.amount, 0);
  const usdIncome = data.transactions.filter((t) => t.type === "income" && t.currency === "USD").reduce((s, t) => s + t.amount, 0);
  const usdExpense = data.transactions.filter((t) => t.type === "expense" && t.currency === "USD").reduce((s, t) => s + t.amount, 0);

  function addNew(type: TransactionType = "income") {
    const item = emptyTransaction();
    item.type = type;
    setEditing(item);
    setOpen(true);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.title.trim() || editing.amount <= 0) return;
    addTransaction(editing);
    setOpen(false);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="MONEY CONTROL" title="Moliya" subtitle="Daromad, xarajat va loyiha pul oqimini bitta joyda kuzating." actionLabel="Kirim qo‘shish" onAction={() => addNew("income")} />

      <section className="financeStats">
        <article className="financeStat income"><div><span>UZS daromad</span><strong>{shortMoney(uzsIncome)} so‘m</strong></div><ArrowDownLeft size={22} /></article>
        <article className="financeStat expense"><div><span>UZS xarajat</span><strong>{shortMoney(uzsExpense)} so‘m</strong></div><ArrowUpRight size={22} /></article>
        <article className="financeStat balance"><div><span>UZS sof oqim</span><strong>{shortMoney(uzsIncome - uzsExpense)} so‘m</strong></div><WalletCards size={22} /></article>
        <article className="financeStat usd"><div><span>USD oqim</span><strong>+{formatMoney(usdIncome, "USD")} / -{formatMoney(usdExpense, "USD")}</strong></div><WalletCards size={22} /></article>
      </section>

      <section className="toolbar cardLike financeToolbar">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tranzaksiya, kategoriya, loyiha..." /></div>
        <div className="segmented">
          {(["all", "income", "expense"] as const).map((item) => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item === "all" ? "Barchasi" : item === "income" ? "Kirim" : "Xarajat"}</button>)}
        </div>
        <button className="secondaryButton compact" onClick={() => addNew("expense")}>+ Xarajat</button>
      </section>

      <section className="entityTable cardLike">
        <div className="entityTableHead financeCols"><span>Tranzaksiya</span><span>Turi</span><span>Loyiha</span><span>Sana</span><span>Summa</span><span /></div>
        {filtered.map((item) => (
          <div className="entityTableRow financeCols" key={item.id}>
            <div className="personCell"><div className={`moneyIcon ${item.type}`} >{item.type === "income" ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</div><div><strong>{item.title}</strong><small>{item.category || "Kategoriya yo‘q"}</small></div></div>
            <div><StatusPill value={item.type} /></div>
            <div className="mutedText">{item.project || "—"}</div>
            <div className="mutedText">{item.date}</div>
            <div className={`amountCell ${item.type}`}>{item.type === "income" ? "+" : "−"}{formatMoney(item.amount, item.currency)}</div>
            <div className="rowActions"><button className="dangerButton" onClick={() => window.confirm("Tranzaksiyani o‘chirasizmi?") && removeTransaction(item.id)}><Trash2 size={15} /></button></div>
          </div>
        ))}
      </section>
      {!filtered.length && <EmptyState title="Tranzaksiya topilmadi" text="Yangi kirim/xarajat qo‘shing yoki filtrni o‘zgartiring." />}

      <Modal open={open} title={editing?.type === "expense" ? "Yangi xarajat" : "Yangi kirim"} subtitle="Pul oqimini tizimga kiriting." onClose={() => setOpen(false)}>
        {editing && <form className="formGrid" onSubmit={save}>
          <label className="field"><span>Turi</span><select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as TransactionType })}><option value="income">Kirim</option><option value="expense">Xarajat</option></select></label>
          <label className="field"><span>Sana</span><input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></label>
          <label className="field span2"><span>Nomi</span><input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Masalan: Avgust SMM to‘lovi" /></label>
          <label className="field"><span>Kategoriya</span><input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="SMM, Web, Ads..." /></label>
          <label className="field"><span>Loyiha</span><input value={editing.project} onChange={(e) => setEditing({ ...editing, project: e.target.value })} /></label>
          <label className="field"><span>Summa</span><input type="number" min="1" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} /></label>
          <label className="field"><span>Valyuta</span><select value={editing.currency} onChange={(e) => setEditing({ ...editing, currency: e.target.value as Currency })}><option value="UZS">UZS</option><option value="USD">USD</option></select></label>
          <label className="field span2"><span>Izoh</span><textarea rows={3} value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          <div className="span2"><FormActions onCancel={() => setOpen(false)} submitLabel="Tranzaksiyani saqlash" /></div>
        </form>}
      </Modal>
    </div>
  );
}
