"use client";

import {
  CheckCircle2,
  CircleAlert,
  CircleDollarSign,
  Clock3,
  Edit3,
  ReceiptText,
  Search,
  Trash2,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, PageHeader, StatusPill } from "@/components/ui";
import {
  effectiveInvoiceStatus,
  formatMoney,
  invoiceOutstanding,
  makeId,
  shortMoney,
  type Contract,
  type Currency,
  type Invoice,
  type InvoiceStatus,
} from "@/lib/data";

function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function nextInvoiceNumber(existing: Invoice[]) {
  const year = new Date().getFullYear();
  const max = existing.reduce((current, invoice) => {
    const match = invoice.number.match(/(\d+)$/);
    return Math.max(current, match ? Number(match[1]) : 0);
  }, 0);
  return `MT-${year}-${String(max + 1).padStart(3, "0")}`;
}

function nextContractDueDate(paymentDay: number) {
  const now = new Date();
  const requestedDay = Math.max(1, Math.min(31, paymentDay || 1));
  let year = now.getFullYear();
  let month = now.getMonth();
  const dayFor = (y: number, m: number) => Math.min(requestedDay, new Date(y, m + 1, 0).getDate());
  let day = dayFor(year, month);
  if (now.getDate() > day) {
    month += 1;
    if (month > 11) { month = 0; year += 1; }
    day = dayFor(year, month);
  }
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function emptyInvoice(existing: Invoice[]): Invoice {
  const today = todayKey();
  return {
    id: makeId("invoice"),
    number: nextInvoiceNumber(existing),
    title: "",
    client: "",
    project: "",
    contractId: "",
    status: "sent",
    amount: 0,
    paidAmount: 0,
    currency: "UZS",
    issueDate: today,
    dueDate: today,
    note: "",
  };
}

type Filter = "all" | InvoiceStatus | "receivable";

const statusLabel: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Yuborilgan",
  partial: "Qisman",
  paid: "To‘langan",
  overdue: "Kechikkan",
  cancelled: "Bekor",
};

export default function PaymentsPage() {
  const { data, addInvoice, updateInvoice, removeInvoice, addTransaction } = useAppData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paying, setPaying] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const invoices = useMemo(() => data.invoices.map((invoice) => ({
    ...invoice,
    effectiveStatus: effectiveInvoiceStatus(invoice),
    outstanding: invoiceOutstanding(invoice),
  })), [data.invoices]);

  const filtered = useMemo(() => invoices.filter((item) => {
    const q = query.trim().toLowerCase();
    const match = !q || [item.number, item.title, item.client, item.project, item.note].some((value) => value.toLowerCase().includes(q));
    const statusMatch = filter === "all"
      || (filter === "receivable" && item.outstanding > 0 && !["draft", "cancelled"].includes(item.effectiveStatus))
      || item.effectiveStatus === filter;
    return match && statusMatch;
  }).sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [invoices, query, filter]);

  const totals = useMemo(() => {
    const sum = (currency: Currency, predicate: (invoice: (typeof invoices)[number]) => boolean) => invoices
      .filter((invoice) => invoice.currency === currency && predicate(invoice))
      .reduce((total, invoice) => total + invoice.outstanding, 0);
    const receivable = (invoice: (typeof invoices)[number]) => invoice.outstanding > 0 && !["draft", "cancelled"].includes(invoice.effectiveStatus);
    const overdue = (invoice: (typeof invoices)[number]) => invoice.effectiveStatus === "overdue";
    const monthlyContracts = data.contracts.filter((contract) => contract.billing === "monthly" && (contract.status === "active" || contract.status === "ending"));
    return {
      uzsReceivable: sum("UZS", receivable),
      usdReceivable: sum("USD", receivable),
      uzsOverdue: sum("UZS", overdue),
      usdOverdue: sum("USD", overdue),
      overdueCount: invoices.filter(overdue).length,
      monthlyUzs: monthlyContracts.filter((c) => c.currency === "UZS").reduce((s, c) => s + c.amount, 0),
      monthlyUsd: monthlyContracts.filter((c) => c.currency === "USD").reduce((s, c) => s + c.amount, 0),
    };
  }, [invoices, data.contracts]);

  const debtors = useMemo(() => {
    const grouped = new Map<string, { client: string; uzs: number; usd: number; overdue: number; count: number; nearestDue: string }>();
    invoices.forEach((invoice) => {
      if (invoice.outstanding <= 0 || ["draft", "cancelled"].includes(invoice.effectiveStatus)) return;
      const key = invoice.client.trim().toLowerCase() || "noma’lum";
      const row = grouped.get(key) || { client: invoice.client || "Noma’lum mijoz", uzs: 0, usd: 0, overdue: 0, count: 0, nearestDue: "" };
      if (invoice.currency === "UZS") row.uzs += invoice.outstanding; else row.usd += invoice.outstanding;
      row.count += 1;
      if (invoice.effectiveStatus === "overdue") row.overdue += 1;
      if (invoice.dueDate && (!row.nearestDue || invoice.dueDate < row.nearestDue)) row.nearestDue = invoice.dueDate;
      grouped.set(key, row);
    });
    return [...grouped.values()].sort((a, b) => b.overdue - a.overdue || a.nearestDue.localeCompare(b.nearestDue));
  }, [invoices]);

  function addNew() {
    setEditing(emptyInvoice(data.invoices));
    setOpen(true);
  }

  function addFromContract(contract: Contract) {
    const dueDate = nextContractDueDate(contract.paymentDay);
    const existing = data.invoices.find((invoice) => invoice.contractId === contract.id && invoice.dueDate === dueDate);
    if (existing) {
      edit(existing);
      return;
    }
    const item = emptyInvoice(data.invoices);
    item.title = contract.title;
    item.client = contract.client;
    item.project = contract.project;
    item.contractId = contract.id;
    item.amount = contract.amount;
    item.currency = contract.currency;
    item.dueDate = dueDate;
    item.note = `Oylik shartnoma asosida yaratilgan hisob. To‘lov kuni: ${contract.paymentDay}.`;
    setEditing(item);
    setOpen(true);
  }

  function edit(invoice: Invoice) {
    setEditing({ ...invoice, status: effectiveInvoiceStatus(invoice) });
    setOpen(true);
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!editing || !editing.title.trim() || !editing.client.trim() || editing.amount <= 0) return;
    const normalized: Invoice = {
      ...editing,
      paidAmount: Math.max(0, Math.min(editing.amount, editing.paidAmount || 0)),
    };
    normalized.status = effectiveInvoiceStatus(normalized);
    data.invoices.some((invoice) => invoice.id === normalized.id) ? updateInvoice(normalized) : addInvoice(normalized);
    setOpen(false);
  }

  function openPayment(invoice: Invoice) {
    const outstanding = invoiceOutstanding(invoice);
    if (outstanding <= 0) return;
    setPaying(invoice);
    setPaymentAmount(outstanding);
    setPaymentOpen(true);
  }

  function recordPayment(event: React.FormEvent) {
    event.preventDefault();
    if (!paying) return;
    const outstanding = invoiceOutstanding(paying);
    const amount = Math.max(0, Math.min(outstanding, Number(paymentAmount)));
    if (!amount) return;
    const nextPaid = Math.min(paying.amount, (paying.paidAmount || 0) + amount);
    const next: Invoice = {
      ...paying,
      paidAmount: nextPaid,
      status: nextPaid >= paying.amount ? "paid" : "partial",
    };
    updateInvoice(next);
    addTransaction({
      id: makeId("transaction"),
      type: "income",
      title: `${paying.number} · ${paying.title}`,
      category: "Invoice payment",
      project: paying.project,
      amount,
      currency: paying.currency,
      date: todayKey(),
      note: `${paying.client} dan to‘lov. Hisob: ${paying.number}.`,
    });
    setPaymentOpen(false);
    setPaying(null);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="PAYMENT CONTROL" title="To‘lovlar & Debitorlar" subtitle="Kim qancha to‘lashi kerak, qaysi to‘lov kechikkan va qancha pul kutilayotganini nazorat qiling." actionLabel="Yangi hisob" onAction={addNew} />

      <section className="paymentStats">
        <article className="paymentStat receivable"><div className="paymentStatIcon"><WalletCards size={20} /></div><div><span>Kutilayotgan UZS</span><strong>{shortMoney(totals.uzsReceivable)} so‘m</strong><small>{totals.usdReceivable ? `+ ${formatMoney(totals.usdReceivable, "USD")}` : "Debitor qoldiq"}</small></div></article>
        <article className="paymentStat overdue"><div className="paymentStatIcon"><CircleAlert size={20} /></div><div><span>Kechikkan to‘lov</span><strong>{totals.overdueCount} ta</strong><small>{totals.uzsOverdue ? `${shortMoney(totals.uzsOverdue)} so‘m` : totals.usdOverdue ? formatMoney(totals.usdOverdue, "USD") : "Kechikkan qarz yo‘q"}</small></div></article>
        <article className="paymentStat recurring"><div className="paymentStatIcon"><CircleDollarSign size={20} /></div><div><span>Oylik recurring</span><strong>{totals.monthlyUzs ? `${shortMoney(totals.monthlyUzs)} so‘m` : formatMoney(totals.monthlyUsd, "USD")}</strong><small>{totals.monthlyUzs && totals.monthlyUsd ? `+ ${formatMoney(totals.monthlyUsd, "USD")}` : "Aktiv oylik shartnomalar"}</small></div></article>
        <article className="paymentStat invoices"><div className="paymentStatIcon"><ReceiptText size={20} /></div><div><span>Hisoblar</span><strong>{data.invoices.length} ta</strong><small>{data.invoices.filter((x) => effectiveInvoiceStatus(x) === "paid").length} ta yopilgan</small></div></article>
      </section>

      <section className="toolbar cardLike paymentToolbar">
        <div className="tableSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hisob raqami, mijoz, loyiha..." /></div>
        <div className="segmented paymentFilter">
          {(["all", "receivable", "overdue", "partial", "paid"] as const).map((item) => (
            <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>
              {item === "all" ? "Barchasi" : item === "receivable" ? "Qoldiq bor" : item === "overdue" ? "Kechikkan" : item === "partial" ? "Qisman" : "To‘langan"}
            </button>
          ))}
        </div>
      </section>

      <section className="entityTable cardLike paymentTable">
        <div className="entityTableHead paymentCols"><span>Hisob / Mijoz</span><span>Status</span><span>Muddat</span><span>Summa</span><span>To‘langan</span><span>Qoldiq</span><span /></div>
        {filtered.map((invoice) => (
          <div className={`entityTableRow paymentCols ${invoice.effectiveStatus === "overdue" ? "invoiceOverdueRow" : ""}`} key={invoice.id}>
            <div className="personCell"><div className="invoiceIcon"><ReceiptText size={16} /></div><div><strong>{invoice.number} · {invoice.title}</strong><small>{invoice.client}{invoice.project ? ` · ${invoice.project}` : ""}</small></div></div>
            <div><StatusPill value={statusLabel[invoice.effectiveStatus]} /></div>
            <div className="invoiceDue"><strong>{invoice.dueDate || "—"}</strong><small>{invoice.effectiveStatus === "overdue" ? "Muddat o‘tgan" : `Berilgan: ${invoice.issueDate}`}</small></div>
            <div className="invoiceMoney"><strong>{formatMoney(invoice.amount, invoice.currency)}</strong></div>
            <div className="invoiceMoney paid"><strong>{formatMoney(invoice.paidAmount || 0, invoice.currency)}</strong></div>
            <div className={`invoiceMoney outstanding ${invoice.outstanding <= 0 ? "zero" : ""}`}><strong>{formatMoney(invoice.outstanding, invoice.currency)}</strong></div>
            <div className="rowActions paymentActions">
              {invoice.outstanding > 0 && invoice.effectiveStatus !== "cancelled" && <button className="receiveButton" title="To‘lov qabul qilish" onClick={() => openPayment(invoice)}><CheckCircle2 size={14} /></button>}
              <button title="Tahrirlash" onClick={() => edit(invoice)}><Edit3 size={14} /></button>
              <button className="dangerButton" title="O‘chirish" onClick={() => window.confirm("Hisobni o‘chirasizmi?") && removeInvoice(invoice.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </section>
      {!filtered.length && <EmptyState title="Hisob topilmadi" text="Yangi hisob yarating yoki filtrni o‘zgartiring." />}

      <section className="debtorPanel cardLike">
        <div className="recurringHead"><div><WalletCards size={17} /><div><strong>Kim menga qancha to‘lashi kerak?</strong><span>Ochiq hisoblar mijozlar kesimida jamlangan</span></div></div><span className="debtorCount">{debtors.length} mijoz</span></div>
        <div className="debtorList">
          {debtors.length ? debtors.map((debtor) => (
            <div className={`debtorItem ${debtor.overdue ? "hasOverdue" : ""}`} key={debtor.client}>
              <div className="debtorAvatar">{debtor.client.slice(0, 2).toUpperCase()}</div>
              <div className="debtorCopy"><strong>{debtor.client}</strong><span>{debtor.count} ta ochiq hisob · eng yaqin muddat {debtor.nearestDue || "—"}</span></div>
              <div className="debtorMoney"><strong>{debtor.uzs ? formatMoney(debtor.uzs, "UZS") : "—"}</strong><span>{debtor.usd ? formatMoney(debtor.usd, "USD") : "USD qoldiq yo‘q"}</span></div>
              <StatusPill value={debtor.overdue ? `${debtor.overdue} kechikkan` : "Nazoratda"} />
            </div>
          )) : <div className="detailEmpty">Hozircha ochiq debitor qoldiq yo‘q.</div>}
        </div>
      </section>

      <section className="recurringPanel cardLike">
        <div className="recurringHead"><div><Clock3 size={17} /><div><strong>Oylik recurring income</strong><span>Aktiv oylik shartnomalardan kutilayotgan doimiy tushum</span></div></div></div>
        <div className="recurringList">
          {data.contracts.filter((contract) => contract.billing === "monthly" && (contract.status === "active" || contract.status === "ending")).map((contract) => (
            <div className="recurringItem" key={contract.id}>
              <div><strong>{contract.client}</strong><span>{contract.title} · {contract.project}</span></div>
              <div><strong>{formatMoney(contract.amount, contract.currency)}</strong><span>har oy {contract.paymentDay}-sana</span></div>
              <div className="recurringActions"><StatusPill value={contract.status === "ending" ? "Yaqin" : "Aktiv"} /><button className="miniInvoiceButton" onClick={() => addFromContract(contract)}>Hisob yaratish</button></div>
            </div>
          ))}
          {!data.contracts.some((contract) => contract.billing === "monthly" && (contract.status === "active" || contract.status === "ending")) && <div className="detailEmpty">Aktiv oylik shartnoma yo‘q.</div>}
        </div>
      </section>

      <Modal open={open} title={data.invoices.some((invoice) => invoice.id === editing?.id) ? "Hisobni tahrirlash" : "Yangi hisob"} subtitle="Mijozdan olinadigan to‘lovni oldindan nazoratga qo‘ying." onClose={() => setOpen(false)}>
        {editing && <form className="formGrid" onSubmit={save}>
          <label className="field"><span>Hisob raqami</span><input required value={editing.number} onChange={(e) => setEditing({ ...editing, number: e.target.value })} /></label>
          <label className="field"><span>Status</span><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as InvoiceStatus })}><option value="draft">Draft</option><option value="sent">Yuborilgan</option><option value="partial">Qisman</option><option value="paid">To‘langan</option><option value="overdue">Kechikkan</option><option value="cancelled">Bekor</option></select></label>
          <label className="field span2"><span>Nomi</span><input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Masalan: Avgust SMM xizmati" /></label>
          <label className="field"><span>Mijoz</span><input list="invoice-client-options" required value={editing.client} onChange={(e) => setEditing({ ...editing, client: e.target.value })} /><datalist id="invoice-client-options">{data.clients.map((client) => <option key={client.id} value={client.name} />)}</datalist></label>
          <label className="field"><span>Loyiha</span><input list="invoice-project-options" value={editing.project} onChange={(e) => setEditing({ ...editing, project: e.target.value })} /><datalist id="invoice-project-options">{data.projects.map((project) => <option key={project.id} value={project.name} />)}</datalist></label>
          <label className="field"><span>Summa</span><input type="number" min="1" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} /></label>
          <label className="field"><span>Valyuta</span><select value={editing.currency} onChange={(e) => setEditing({ ...editing, currency: e.target.value as Currency })}><option value="UZS">UZS</option><option value="USD">USD</option></select></label>
          <label className="field"><span>Berilgan sana</span><input type="date" value={editing.issueDate} onChange={(e) => setEditing({ ...editing, issueDate: e.target.value })} /></label>
          <label className="field"><span>To‘lov muddati</span><input type="date" value={editing.dueDate} onChange={(e) => setEditing({ ...editing, dueDate: e.target.value })} /></label>
          <label className="field"><span>Oldin to‘langan</span><input type="number" min="0" max={editing.amount || undefined} value={editing.paidAmount} onChange={(e) => setEditing({ ...editing, paidAmount: Number(e.target.value) })} /></label>
          <label className="field"><span>Shartnoma</span><select value={editing.contractId} onChange={(e) => setEditing({ ...editing, contractId: e.target.value })}><option value="">Biriktirilmagan</option>{data.contracts.map((contract) => <option key={contract.id} value={contract.id}>{contract.client} · {contract.title}</option>)}</select></label>
          <label className="field span2"><span>Izoh</span><textarea rows={3} value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          <div className="span2"><FormActions onCancel={() => setOpen(false)} submitLabel="Hisobni saqlash" /></div>
        </form>}
      </Modal>

      <Modal open={paymentOpen} title="To‘lov qabul qilish" subtitle={paying ? `${paying.client} · ${paying.number}` : undefined} onClose={() => setPaymentOpen(false)}>
        {paying && <form className="paymentReceiveForm" onSubmit={recordPayment}>
          <div className="paymentReceiveSummary"><span>Jami hisob</span><strong>{formatMoney(paying.amount, paying.currency)}</strong><span>Hozirgi qoldiq</span><strong>{formatMoney(invoiceOutstanding(paying), paying.currency)}</strong></div>
          <label className="field"><span>Qabul qilingan summa</span><input autoFocus type="number" min="1" max={invoiceOutstanding(paying)} value={paymentAmount} onChange={(e) => setPaymentAmount(Number(e.target.value))} /></label>
          <p className="paymentReceiveHint">Saqlanganda bu summa avtomatik ravishda Moliya bo‘limiga kirim sifatida ham qo‘shiladi.</p>
          <FormActions onCancel={() => setPaymentOpen(false)} submitLabel="To‘lovni yozish" />
        </form>}
      </Modal>
    </div>
  );
}
