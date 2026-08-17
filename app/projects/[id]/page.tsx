"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock3,
  FileSignature,
  Handshake,
  Lightbulb,
  NotebookTabs,
  ReceiptText,
  UserRound,
} from "lucide-react";
import { useMemo } from "react";
import { useAppData } from "@/components/data-provider";
import { EmptyState, StatusPill } from "@/components/ui";
import { effectiveInvoiceStatus, formatMoney, formatTaskDate, invoiceOutstanding, minutesLabel, type Currency } from "@/lib/data";

function same(value: string, projectName: string) {
  return value.trim().toLowerCase() === projectName.trim().toLowerCase();
}

function moneyTotals(items: { amount: number; currency: Currency; type?: "income" | "expense" }[]) {
  const out = { UZS: { income: 0, expense: 0 }, USD: { income: 0, expense: 0 } };
  items.forEach((item) => {
    const kind = item.type === "expense" ? "expense" : "income";
    out[item.currency][kind] += item.amount;
  });
  return out;
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, toggleTask } = useAppData();
  const project = data.projects.find((item) => item.id === params.id);

  const linked = useMemo(() => {
    if (!project) return null;
    const tasks = data.tasks.filter((item) => same(item.project, project.name));
    const contracts = data.contracts.filter((item) => same(item.project, project.name));
    const transactions = data.transactions.filter((item) => same(item.project, project.name));
    const invoices = data.invoices.filter((item) => same(item.project, project.name));
    const workLogs = data.workLogs.filter((item) => same(item.project, project.name));
    const lessons = data.lessons.filter((item) => same(item.project, project.name));
    const partners = data.partners.filter((item) => item.projects.split(",").map((v) => v.trim().toLowerCase()).includes(project.name.toLowerCase()));
    const client = data.clients.find((item) => [item.name, item.company].some((value) => value.trim().toLowerCase() === project.client.trim().toLowerCase()));
    const interactions = data.interactions.filter((item) => same(item.project, project.name));
    return { tasks, contracts, transactions, invoices, workLogs, lessons, partners, client, interactions };
  }, [data, project]);

  if (!project || !linked) {
    return (
      <div className="pageWrap">
        <Link className="backLink" href="/projects"><ArrowLeft size={15} /> Loyihalarga qaytish</Link>
        <EmptyState title="Loyiha topilmadi" text="Bu loyiha o‘chirilgan yoki havola noto‘g‘ri." />
      </div>
    );
  }

  const totals = moneyTotals(linked.transactions);
  const openTasks = linked.tasks.filter((item) => item.status !== "done").length;
  const doneTasks = linked.tasks.filter((item) => item.status === "done").length;
  const totalMinutes = linked.workLogs.reduce((sum, item) => sum + item.durationMinutes, 0);
  const activeContracts = linked.contracts.filter((item) => item.status === "active" || item.status === "ending").length;

  const activity = [
    ...linked.workLogs.map((item) => ({ id: `work-${item.id}`, date: `${item.date}T12:00`, icon: NotebookTabs, title: item.title, meta: item.result || "Qilgan ish" })),
    ...linked.transactions.map((item) => ({ id: `tx-${item.id}`, date: `${item.date}T09:00`, icon: ReceiptText, title: item.title, meta: `${item.type === "income" ? "Kirim" : "Xarajat"} · ${formatMoney(item.amount, item.currency)}` })),
    ...linked.invoices.map((item) => ({ id: `invoice-${item.id}`, date: `${item.issueDate}T08:00`, icon: ReceiptText, title: `${item.number} · ${item.title}`, meta: `Hisob · ${formatMoney(item.amount, item.currency)} · qoldiq ${formatMoney(invoiceOutstanding(item), item.currency)}` })),
    ...linked.interactions.map((item) => ({ id: `i-${item.id}`, date: item.date, icon: UserRound, title: item.title, meta: `${item.clientName} · ${item.summary}` })),
    ...linked.tasks.filter((item) => item.completedAt).map((item) => ({ id: `task-${item.id}`, date: item.completedAt || item.dueAt, icon: CheckCircle2, title: item.title, meta: "Vazifa bajarildi" })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <div className="pageWrap">
      <Link className="backLink" href="/projects"><ArrowLeft size={15} /> Loyihalarga qaytish</Link>

      <section className="project360Hero cardLike">
        <div className="project360Main">
          <div className="project360Eyebrow"><span>PROJECT 360</span><StatusPill value={project.status} /></div>
          <h1>{project.name}</h1>
          <p>{project.service} · {project.client || "Mijoz belgilanmagan"}</p>
          <div className="project360Progress"><div className="progress big"><i style={{ width: `${project.progress}%` }} /></div><b>{project.progress}%</b></div>
        </div>
        <div className="project360Aside">
          <div><span>Loyiha qiymati</span><strong>{formatMoney(project.amount, project.currency)}</strong></div>
          <div><span>Deadline</span><strong>{project.deadline || "—"}</strong></div>
          <div><span>Keyingi qadam</span><strong>{project.nextAction || "Kiritilmagan"}</strong></div>
        </div>
      </section>

      <section className="project360Stats">
        <article><div className="miniStatIcon"><Banknote size={17} /></div><span>Sof pul oqimi</span><strong>{formatMoney(totals.UZS.income - totals.UZS.expense, "UZS")}</strong><small>{formatMoney(totals.USD.income - totals.USD.expense, "USD")}</small></article>
        <article><div className="miniStatIcon"><Circle size={17} /></div><span>Ochiq vazifalar</span><strong>{openTasks}</strong><small>{doneTasks} ta bajarilgan</small></article>
        <article><div className="miniStatIcon"><FileSignature size={17} /></div><span>Shartnomalar</span><strong>{activeContracts}</strong><small>{linked.contracts.length} ta jami</small></article>
        <article><div className="miniStatIcon"><Clock3 size={17} /></div><span>Sarflangan vaqt</span><strong>{minutesLabel(totalMinutes)}</strong><small>{linked.workLogs.length} ta work log</small></article>
      </section>

      <div className="project360Grid">
        <div className="project360Column">
          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Vazifalar</strong><span>Loyiha ichidagi ishlar holati</span></div><Link href="/tasks">Barcha vazifalar</Link></div>
            <div className="detailTaskList">
              {linked.tasks.length ? linked.tasks.slice(0, 7).map((task) => (
                <button key={task.id} className={`detailTask ${task.status === "done" ? "done" : ""}`} onClick={() => toggleTask(task.id)}>
                  <span className="detailTaskCheck">{task.status === "done" ? <CheckCircle2 size={17} /> : <Circle size={17} />}</span>
                  <span className="detailTaskCopy"><strong>{task.title}</strong><small>{formatTaskDate(task.dueAt)} · {task.priority}</small></span>
                  <StatusPill value={task.status} />
                </button>
              )) : <div className="detailEmpty">Bu loyihaga hali vazifa biriktirilmagan.</div>}
            </div>
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Moliya</strong><span>Kirim, xarajat va loyiha foydasi</span></div><Link href="/finance">Moliya bo‘limi</Link></div>
            <div className="finance360Summary">
              <div><span>UZS kirim</span><b>{formatMoney(totals.UZS.income, "UZS")}</b></div>
              <div><span>UZS xarajat</span><b>{formatMoney(totals.UZS.expense, "UZS")}</b></div>
              <div><span>USD kirim</span><b>{formatMoney(totals.USD.income, "USD")}</b></div>
              <div><span>USD xarajat</span><b>{formatMoney(totals.USD.expense, "USD")}</b></div>
            </div>
            <div className="detailRows">
              {linked.transactions.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map((tx) => (
                <div className="detailRow" key={tx.id}><div className={`transactionDot ${tx.type}`} /><div><strong>{tx.title}</strong><small>{tx.date} · {tx.category}</small></div><b className={tx.type === "expense" ? "negativeMoney" : "positiveMoney"}>{tx.type === "expense" ? "−" : "+"}{formatMoney(tx.amount, tx.currency)}</b></div>
              ))}
              {!linked.transactions.length && <div className="detailEmpty">Loyiha bo‘yicha tranzaksiya yo‘q.</div>}
            </div>
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Faoliyat tarixi</strong><span>Ishlar, to‘lovlar va aloqa izlari</span></div></div>
            <div className="activityTimeline">
              {activity.length ? activity.map((item) => {
                const Icon = item.icon;
                return <div className="activityItem" key={item.id}><div className="activityIcon"><Icon size={15} /></div><div><strong>{item.title}</strong><p>{item.meta}</p><small>{formatTaskDate(item.date)}</small></div></div>;
              }) : <div className="detailEmpty">Hali faoliyat tarixi shakllanmagan.</div>}
            </div>
          </section>
        </div>

        <aside className="project360Side">
          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Mijoz</strong><span>Project owner / client</span></div></div>
            {linked.client ? <div className="client360Mini"><div className="personAvatar"><UserRound size={18} /></div><div><strong>{linked.client.name}</strong><span>{linked.client.company} · {linked.client.role}</span>{linked.client.instagram && <small>{linked.client.instagram}</small>}</div><Link href={`/clients/${linked.client.id}`}>Profil</Link></div> : <div className="detailEmpty">CRM bilan bog‘langan mijoz topilmadi.</div>}
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Jamoa / Hamkorlar</strong><span>Loyihaga aloqador odamlar</span></div><Link href="/partners">Hamkorlar</Link></div>
            <div className="team360List">
              {linked.partners.length ? linked.partners.map((partner) => <div className="team360Item" key={partner.id}><div className="miniStatIcon"><Handshake size={15} /></div><div><strong>{partner.name}</strong><span>{partner.specialty}</span><small>{formatMoney(partner.rate, partner.currency)} · {partner.rateType}</small></div><StatusPill value={partner.status} /></div>) : <div className="detailEmpty">Hamkor biriktirilmagan.</div>}
            </div>
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Shartnomalar</strong><span>Huquqiy va billing nazorati</span></div><Link href="/contracts">Barchasi</Link></div>
            <div className="contract360List">
              {linked.contracts.length ? linked.contracts.map((contract) => <div className="contract360Item" key={contract.id}><div><FileSignature size={15} /><strong>{contract.title}</strong></div><span>{formatMoney(contract.amount, contract.currency)} · {contract.billing === "monthly" ? "oylik" : "bir martalik"}</span><small><CalendarClock size={12} /> {contract.startDate} → {contract.endDate}</small><StatusPill value={contract.status} /></div>) : <div className="detailEmpty">Shartnoma biriktirilmagan.</div>}
            </div>
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>To‘lovlar</strong><span>Hisoblar va debitor qoldiq</span></div><Link href="/payments">Payment Control</Link></div>
            <div className="contract360List">
              {linked.invoices.length ? linked.invoices.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((invoice) => (
                <div className="invoice360Item" key={invoice.id}>
                  <div><ReceiptText size={15} /><strong>{invoice.number} · {invoice.title}</strong></div>
                  <span>{invoice.client} · {formatMoney(invoice.amount, invoice.currency)}</span>
                  <small><CalendarClock size={12} /> {invoice.dueDate} · qoldiq {formatMoney(invoiceOutstanding(invoice), invoice.currency)}</small>
                  <StatusPill value={effectiveInvoiceStatus(invoice)} />
                </div>
              )) : <div className="detailEmpty">Bu loyiha bo‘yicha hisob yo‘q.</div>}
            </div>
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Qilgan ishlarim</strong><span>Work log va natijalar</span></div><Link href="/work">Work log</Link></div>
            <div className="work360List">
              {linked.workLogs.length ? linked.workLogs.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((log) => <div className="work360Item" key={log.id}><NotebookTabs size={15} /><div><strong>{log.title}</strong><span>{log.result}</span><small>{log.date} · {minutesLabel(log.durationMinutes)}</small></div></div>) : <div className="detailEmpty">Qilingan ishlar hali yozilmagan.</div>}
            </div>
          </section>

          <section className="detailPanel cardLike">
            <div className="detailPanelHead"><div><strong>Xatolar & darslar</strong><span>Loyiha bo‘yicha o‘rganilganlar</span></div><Link href="/lessons">Darslar</Link></div>
            <div className="lesson360List">
              {linked.lessons.length ? linked.lessons.slice(0, 4).map((lesson) => <div className="lesson360Item" key={lesson.id}><Lightbulb size={15} /><div><strong>{lesson.title}</strong><span>{lesson.lesson}</span><small>{lesson.type} · {lesson.date}</small></div></div>) : <div className="detailEmpty">Bu loyiha bo‘yicha dars yozilmagan.</div>}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
