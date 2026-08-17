"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Edit3,
  FileSignature,
  Instagram,
  MessageCircle,
  Phone,
  Plus,
  ReceiptText,
  Trash2,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, FormActions, Modal, StatusPill } from "@/components/ui";
import { effectiveInvoiceStatus, formatMoney, formatTaskDate, invoiceOutstanding, makeId, type ClientInteraction, type InteractionType } from "@/lib/data";

function same(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function emptyInteraction(clientId: string, clientName: string): ClientInteraction {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
  return {
    id: makeId("interaction"),
    clientId,
    clientName,
    type: "note",
    date: local,
    title: "",
    summary: "",
    project: "",
    nextAction: "",
  };
}

const typeLabel: Record<InteractionType, string> = {
  note: "Izoh",
  call: "Qo‘ng‘iroq",
  meeting: "Uchrashuv",
  message: "Xabar",
  payment: "To‘lov",
};

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, addInteraction, updateInteraction, removeInteraction } = useAppData();
  const client = data.clients.find((item) => item.id === params.id);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClientInteraction | null>(null);

  const linked = useMemo(() => {
    if (!client) return null;
    const names = [client.name, client.company].filter(Boolean);
    const projects = data.projects.filter((item) => names.some((name) => same(item.client, name)));
    const projectNames = new Set(projects.map((item) => item.name.toLowerCase()));
    const contracts = data.contracts.filter((item) => names.some((name) => same(item.client, name)) || projectNames.has(item.project.toLowerCase()));
    const transactions = data.transactions.filter((item) => projectNames.has(item.project.toLowerCase()));
    const invoices = data.invoices.filter((item) => names.some((name) => same(item.client, name)) || projectNames.has(item.project.toLowerCase()));
    const interactions = data.interactions.filter((item) => item.clientId === client.id || same(item.clientName, client.name));
    return { projects, contracts, transactions, invoices, interactions };
  }, [client, data]);

  if (!client || !linked) {
    return (
      <div className="pageWrap">
        <Link className="backLink" href="/clients"><ArrowLeft size={15} /> Mijozlarga qaytish</Link>
        <EmptyState title="Mijoz topilmadi" text="Bu kontakt o‘chirilgan yoki havola noto‘g‘ri." />
      </div>
    );
  }

  const uzsIncome = linked.transactions.filter((t) => t.type === "income" && t.currency === "UZS").reduce((s, t) => s + t.amount, 0);
  const usdIncome = linked.transactions.filter((t) => t.type === "income" && t.currency === "USD").reduce((s, t) => s + t.amount, 0);
  const activeProjects = linked.projects.filter((p) => p.status === "active").length;
  const activeContracts = linked.contracts.filter((c) => c.status === "active" || c.status === "ending").length;

  function addNew() {
    if (!client) return;
    setEditing(emptyInteraction(client.id, client.name));
    setOpen(true);
  }

  function edit(item: ClientInteraction) {
    setEditing({ ...item });
    setOpen(true);
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!client || !editing?.title.trim()) return;
    const next = { ...editing, clientId: client.id, clientName: client.name };
    data.interactions.some((item) => item.id === next.id) ? updateInteraction(next) : addInteraction(next);
    setOpen(false);
  }

  return (
    <div className="pageWrap">
      <Link className="backLink" href="/clients"><ArrowLeft size={15} /> Mijozlarga qaytish</Link>

      <section className="client360Hero cardLike">
        <div className="client360Identity">
          <div className="client360Avatar"><UserRound size={28} /></div>
          <div>
            <div className="client360Status"><span>CLIENT 360</span><StatusPill value={client.status} /></div>
            <h1>{client.name}</h1>
            <p>{client.company || "Kompaniya yo‘q"} · {client.role || "Rol kiritilmagan"}</p>
          </div>
        </div>
        <div className="client360Contacts">
          {client.phone && <a href={`tel:${client.phone}`}><Phone size={15} /> {client.phone}</a>}
          {client.telegram && <span><MessageCircle size={15} /> {client.telegram}</span>}
          {client.instagram && <span><Instagram size={15} /> {client.instagram}</span>}
          {!client.phone && !client.telegram && !client.instagram && <span>Aloqa ma’lumoti kiritilmagan</span>}
        </div>
      </section>

      <section className="project360Stats clientStats360">
        <article><div className="miniStatIcon"><BriefcaseBusiness size={17} /></div><span>Aktiv loyihalar</span><strong>{activeProjects}</strong><small>{linked.projects.length} ta jami</small></article>
        <article><div className="miniStatIcon"><FileSignature size={17} /></div><span>Aktiv shartnomalar</span><strong>{activeContracts}</strong><small>{linked.contracts.length} ta jami</small></article>
        <article><div className="miniStatIcon"><ReceiptText size={17} /></div><span>UZS daromad</span><strong>{formatMoney(uzsIncome, "UZS")}</strong><small>Ulangan loyihalar bo‘yicha</small></article>
        <article><div className="miniStatIcon"><ReceiptText size={17} /></div><span>USD daromad</span><strong>{formatMoney(usdIncome, "USD")}</strong><small>Ulangan loyihalar bo‘yicha</small></article>
      </section>

      <div className="client360Grid">
        <div className="project360Column">
          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Aloqa tarixi</strong><span>Qo‘ng‘iroq, uchrashuv, xabar va kelishuvlar</span></div><button className="miniPrimaryButton" onClick={addNew}><Plus size={14} /> Yangi yozuv</button></div>
            <div className="interactionTimeline">
              {linked.interactions.length ? linked.interactions.slice().sort((a, b) => b.date.localeCompare(a.date)).map((item) => (
                <article className="interactionItem" key={item.id}>
                  <div className={`interactionType ${item.type}`}><span>{typeLabel[item.type]}</span></div>
                  <div className="interactionBody">
                    <div className="interactionTitleRow"><div><strong>{item.title}</strong><small>{formatTaskDate(item.date)}{item.project ? ` · ${item.project}` : ""}</small></div><div className="rowActions"><button onClick={() => edit(item)}><Edit3 size={14} /></button><button className="dangerButton" onClick={() => window.confirm("Aloqa yozuvini o‘chirasizmi?") && removeInteraction(item.id)}><Trash2 size={14} /></button></div></div>
                    {item.summary && <p>{item.summary}</p>}
                    {item.nextAction && <div className="interactionNext"><span>Keyingi qadam</span><strong>{item.nextAction}</strong></div>}
                  </div>
                </article>
              )) : <div className="detailEmpty">Mijoz bilan aloqa tarixi hali yozilmagan.</div>}
            </div>
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Loyihalar</strong><span>Bu mijozga bog‘langan ishlar</span></div><Link href="/projects">Barcha loyihalar</Link></div>
            <div className="clientProjectList">
              {linked.projects.length ? linked.projects.map((project) => (
                <Link href={`/projects/${project.id}`} className="clientProjectItem" key={project.id}>
                  <div><strong>{project.name}</strong><span>{project.service}</span></div>
                  <div className="clientProjectProgress"><div className="progress"><i style={{ width: `${project.progress}%` }} /></div><b>{project.progress}%</b></div>
                  <StatusPill value={project.status} />
                </Link>
              )) : <div className="detailEmpty">Bu mijozga loyiha biriktirilmagan.</div>}
            </div>
          </section>
        </div>

        <aside className="project360Side">
          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>CRM ma’lumoti</strong><span>Kontaktning qisqa kartasi</span></div></div>
            <div className="crmInfoList">
              <div><span>Manba</span><strong>{client.source || "—"}</strong></div>
              <div><span>Status</span><StatusPill value={client.status} /></div>
              <div><span>Kompaniya</span><strong>{client.company || "—"}</strong></div>
              <div><span>Rol</span><strong>{client.role || "—"}</strong></div>
            </div>
            {client.note && <div className="noteBox crmNote">{client.note}</div>}
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Shartnomalar</strong><span>Mijoz bilan kelishuvlar</span></div><Link href="/contracts">Barchasi</Link></div>
            <div className="contract360List">
              {linked.contracts.length ? linked.contracts.map((contract) => (
                <div className="contract360Item" key={contract.id}>
                  <div><FileSignature size={15} /><strong>{contract.title}</strong></div>
                  <span>{formatMoney(contract.amount, contract.currency)} · {contract.billing === "monthly" ? "oylik" : "bir martalik"}</span>
                  <small><CalendarDays size={12} /> {contract.startDate} → {contract.endDate}</small>
                  <StatusPill value={contract.status} />
                </div>
              )) : <div className="detailEmpty">Shartnoma topilmadi.</div>}
            </div>
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>To‘lovlar / Debitor</strong><span>Mijozdan kutilayotgan hisoblar</span></div><Link href="/payments">Barchasi</Link></div>
            <div className="contract360List">
              {linked.invoices.length ? linked.invoices.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((invoice) => (
                <div className="invoice360Item" key={invoice.id}>
                  <div><ReceiptText size={15} /><strong>{invoice.number} · {invoice.title}</strong></div>
                  <span>{formatMoney(invoice.amount, invoice.currency)} · qoldiq {formatMoney(invoiceOutstanding(invoice), invoice.currency)}</span>
                  <small><CalendarDays size={12} /> To‘lov muddati: {invoice.dueDate}</small>
                  <StatusPill value={effectiveInvoiceStatus(invoice)} />
                </div>
              )) : <div className="detailEmpty">Mijoz bo‘yicha hisob topilmadi.</div>}
            </div>
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Oxirgi pul harakati</strong><span>Mijoz loyihalari bo‘yicha</span></div><Link href="/finance">Moliya</Link></div>
            <div className="detailRows">
              {linked.transactions.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map((tx) => <div className="detailRow" key={tx.id}><div className={`transactionDot ${tx.type}`} /><div><strong>{tx.title}</strong><small>{tx.date} · {tx.project}</small></div><b className={tx.type === "expense" ? "negativeMoney" : "positiveMoney"}>{tx.type === "expense" ? "−" : "+"}{formatMoney(tx.amount, tx.currency)}</b></div>)}
              {!linked.transactions.length && <div className="detailEmpty">Pul harakati topilmadi.</div>}
            </div>
          </section>
        </aside>
      </div>

      <Modal open={open} title={data.interactions.some((item) => item.id === editing?.id) ? "Aloqa yozuvini tahrirlash" : "Yangi aloqa yozuvi"} subtitle={`${client.name} bilan bo‘lgan muhim suhbat yoki kelishuvni yozib qo‘ying.`} onClose={() => setOpen(false)}>
        {editing && <form className="formGrid" onSubmit={save}>
          <label className="field"><span>Turi</span><select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as InteractionType })}><option value="note">Izoh</option><option value="call">Qo‘ng‘iroq</option><option value="meeting">Uchrashuv</option><option value="message">Xabar</option><option value="payment">To‘lov</option></select></label>
          <label className="field"><span>Sana / vaqt</span><input type="datetime-local" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></label>
          <label className="field span2"><span>Sarlavha</span><input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Masalan: Haftalik marketing call" /></label>
          <label className="field span2"><span>Nima gaplashildi?</span><textarea rows={4} value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></label>
          <label className="field"><span>Loyiha</span><input list="client-project-options" value={editing.project} onChange={(e) => setEditing({ ...editing, project: e.target.value })} placeholder="Loyiha nomi" /><datalist id="client-project-options">{linked.projects.map((project) => <option key={project.id} value={project.name} />)}</datalist></label>
          <label className="field"><span>Keyingi qadam</span><input value={editing.nextAction} onChange={(e) => setEditing({ ...editing, nextAction: e.target.value })} placeholder="Keyingi qilinadigan ish" /></label>
          <div className="span2"><FormActions onCancel={() => setOpen(false)} submitLabel="Saqlash" /></div>
        </form>}
      </Modal>
    </div>
  );
}
