"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FileSignature,
  FolderKanban,
  MoreHorizontal,
  Plus,
  Lightbulb,
  NotebookTabs,
  ReceiptText,
  Target,
  WalletCards,
} from "lucide-react";
import { useMemo } from "react";
import { useAppData } from "@/components/data-provider";
import { effectiveInvoiceStatus, formatMoney, formatTaskDate, invoiceOutstanding, shortMoney } from "@/lib/data";

export default function Home() {
  const { data, toggleTask } = useAppData();

  const stats = useMemo(() => {
    const activeProjects = data.projects.filter((p) => p.status === "active").length;
    const income = data.transactions.filter((t) => t.type === "income" && t.currency === "UZS").reduce((s, t) => s + t.amount, 0);
    const expense = data.transactions.filter((t) => t.type === "expense" && t.currency === "UZS").reduce((s, t) => s + t.amount, 0);
    const expected = data.contracts.filter((c) => c.status === "active" || c.status === "ending").filter((c) => c.currency === "UZS").reduce((s, c) => s + c.amount, 0);
    const expectedUsd = data.contracts.filter((c) => c.status === "active" || c.status === "ending").filter((c) => c.currency === "USD").reduce((s, c) => s + c.amount, 0);
    return { activeProjects, income, expense, expected, expectedUsd };
  }, [data]);

  const paymentSummary = useMemo(() => {
    const open = data.invoices.filter((invoice) => invoiceOutstanding(invoice) > 0 && !["draft", "cancelled"].includes(effectiveInvoiceStatus(invoice)));
    const overdue = open.filter((invoice) => effectiveInvoiceStatus(invoice) === "overdue");
    return {
      openCount: open.length,
      overdueCount: overdue.length,
      uzs: open.filter((invoice) => invoice.currency === "UZS").reduce((sum, invoice) => sum + invoiceOutstanding(invoice), 0),
      usd: open.filter((invoice) => invoice.currency === "USD").reduce((sum, invoice) => sum + invoiceOutstanding(invoice), 0),
    };
  }, [data.invoices]);

  const currentDate = new Intl.DateTimeFormat("uz-UZ", { weekday: "long", day: "2-digit", month: "long" }).format(new Date()).toUpperCase();
  const active = data.projects.filter((p) => p.status === "active").slice(0, 3);
  const contracts = [...data.contracts].sort((a, b) => a.endDate.localeCompare(b.endDate)).slice(0, 2);
  const todayKey = new Date().toISOString().slice(0, 10);
  const tasks = [...data.tasks].filter((task) => task.status !== "done" && task.dueAt.slice(0, 10) <= todayKey).sort((a, b) => a.dueAt.localeCompare(b.dueAt)).slice(0, 4);

  const categoryTotals = useMemo(() => {
    const items = data.transactions.filter((t) => t.type === "income" && t.currency === "UZS");
    const total = items.reduce((s, t) => s + t.amount, 0) || 1;
    return (Object.entries(items.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})) as Array<[string, number]>).map(([label, value]) => ({ label, value, percent: Math.round((value / total) * 100) })).slice(0, 4);
  }, [data.transactions]);

  return (
    <div className="pageWrap">
      <div className="welcomeRow">
        <div>
          <p className="eyebrow">{currentDate}</p>
          <h1>Assalomu alaykum, Yaviz 👋</h1>
          <p className="subtitle">Bugungi ishlar, pul oqimi va loyihalar bir joyda.</p>
        </div>
        <Link className="primaryButton linkButton" href="/projects"><Plus size={18} /> Yangi loyiha</Link>
      </div>

      <section className="statsGrid">
        <StatCard icon={FolderKanban} label="Aktiv loyihalar" value={String(stats.activeProjects)} hint="ta loyiha" trend={`${data.projects.length} jami`} />
        <StatCard icon={CircleDollarSign} label="Jami daromad" value={shortMoney(stats.income)} hint="so‘m" trend="cloud + local" />
        <StatCard icon={WalletCards} label="Jami xarajat" value={shortMoney(stats.expense)} hint="so‘m" trend={stats.income ? `${Math.round((stats.expense / stats.income) * 100)}% daromaddan` : "0%"} />
        <StatCard icon={BriefcaseBusiness} label="Aktiv shartnomalar" value={String(data.contracts.filter((c) => c.status === "active" || c.status === "ending").length)} hint={stats.expectedUsd ? `${formatMoney(stats.expectedUsd, "USD")} qiymat` : "nazoratda"} trend="shartnomalar" />
      </section>

      <section className="quickModuleStrip">
        <Link href="/work"><NotebookTabs size={17} /><span><strong>{data.workLogs.length}</strong><small>Qilgan ishlarim</small></span></Link>
        <Link href="/lessons"><Lightbulb size={17} /><span><strong>{data.lessons.length}</strong><small>Xato & darslar</small></span></Link>
        <Link href="/goals"><Target size={17} /><span><strong>{data.goals.filter((x) => x.status === "active").length}</strong><small>Aktiv maqsadlar</small></span></Link>
        <Link href="/services"><BriefcaseBusiness size={17} /><span><strong>{data.services.filter((x) => x.active).length}</strong><small>Aktiv xizmatlar</small></span></Link>
        <Link href="/payments"><ReceiptText size={17} /><span><strong>{paymentSummary.openCount}</strong><small>Kutilayotgan to‘lov</small></span></Link>
      </section>

      <Link href="/payments" className={`paymentPulse ${paymentSummary.overdueCount ? "hasOverdue" : ""}`}>
        <div className="paymentPulseIcon"><ReceiptText size={19} /></div>
        <div><span>PAYMENT CONTROL</span><strong>{paymentSummary.openCount ? `${paymentSummary.openCount} ta ochiq hisob` : "Ochiq hisob yo‘q"}</strong><small>{paymentSummary.uzs ? `${shortMoney(paymentSummary.uzs)} so‘m kutilmoqda` : paymentSummary.usd ? `${formatMoney(paymentSummary.usd, "USD")} kutilmoqda` : "Barcha hisoblar yopilgan"}</small></div>
        <div className="paymentPulseRight"><strong>{paymentSummary.overdueCount}</strong><span>kechikkan</span></div>
        <ChevronRight size={17} />
      </Link>

      <section className="dashboardGrid">
        <div className="card projectsCard">
          <CardHeader title="Aktiv loyihalar" subtitle="Eng muhim loyihalarning qisqa holati" href="/projects" action="Barchasi" />
          <div className="projectList">
            {active.map((project, index) => (
              <div className="projectRow" key={project.id}>
                <div className={`projectIcon ${["blue", "indigo", "cyan"][index % 3]}`}><Target size={18} /></div>
                <div className="projectMain">
                  <div className="projectHead"><strong>{project.name}</strong><span>{formatMoney(project.amount, project.currency)}</span></div>
                  <div className="projectMeta"><span>{project.service}</span><span>{project.progress}%</span></div>
                  <div className="progress"><i style={{ width: `${project.progress}%` }} /></div>
                  <small>{project.nextAction}</small>
                </div>
                <button className="ghostIcon" aria-label="Loyiha menyusi"><MoreHorizontal size={18} /></button>
              </div>
            ))}
            {active.length === 0 && <div className="inlineEmpty">Aktiv loyiha yo‘q.</div>}
          </div>
        </div>

        <div className="card tasksCard">
          <CardHeader title="Bugungi vazifalar" subtitle="Tezkor kunlik ro‘yxat" href="/tasks" action="Vazifalar" />
          <div className="taskList">
            {tasks.map((task, i) => (
              <label className="taskRow" key={task.id}>
                <input type="checkbox" checked={task.status === "done"} onChange={() => toggleTask(task.id)} />
                <span className="fakeCheck" />
                <span className="taskContent">
                  <strong>{task.title}</strong>
                  <small><b>{formatTaskDate(task.dueAt)}</b> · {task.project || "Umumiy"}</small>
                </span>
                <span className={`priority priority${i + 1}`} />
              </label>
            ))}
            {tasks.length === 0 && <div className="inlineEmpty">Bugunga kechikkan yoki rejalashtirilgan vazifa yo‘q.</div>}
          </div>
          <Link href="/tasks" className="addTask"><ClipboardCheck size={16} /> Vazifalarga o‘tish</Link>
        </div>

        <div className="card financeCard">
          <CardHeader title="Daromad manbalari" subtitle="Xizmatlar kesimida" href="/finance" action="Moliya" />
          <div className="financeTotal">
            <span>Jami UZS tushum</span>
            <strong>{new Intl.NumberFormat("uz-UZ").format(stats.income)} <small>so‘m</small></strong>
          </div>
          <div className="bars">
            {categoryTotals.length ? categoryTotals.map((item) => (
              <div className="barRow" key={item.label}>
                <span>{item.label}</span>
                <div className="barTrack"><i style={{ width: `${item.percent}%` }} /></div>
                <b>{item.percent}%</b>
              </div>
            )) : <div className="inlineEmpty">Daromad ma’lumoti hali yo‘q.</div>}
          </div>
        </div>

        <div className="card contractsCard">
          <CardHeader title="Shartnomalar" subtitle="Nazorat talab qiladiganlar" href="/contracts" action="Barchasi" />
          {contracts.map((contract) => {
            const date = new Date(`${contract.endDate}T00:00:00`);
            const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date).toUpperCase();
            return (
              <div className="contractItem" key={contract.id}>
                <div className="contractDate"><b>{String(date.getDate()).padStart(2, "0")}</b><span>{month}</span></div>
                <div><strong>{contract.title}</strong><p>{contract.client} · {formatMoney(contract.amount, contract.currency)}</p></div>
                <span className={`status ${contract.status === "ending" ? "warning" : "success"}`}>{contract.status === "ending" ? "Yaqin" : "Aktiv"}</span>
              </div>
            );
          })}
          <div className="miniInsight">
            <FileSignature size={19} />
            <div><strong>{data.contracts.length} ta shartnoma bazada</strong><span>v0.6 da hisoblar, debitorlar va to‘lov qoldiqlari ham cloud bazaga sinxronlanadi.</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CardHeader({ title, subtitle, action, href }: { title: string; subtitle: string; action: string; href: string }) {
  return (
    <div className="cardHeader">
      <div><h2>{title}</h2><p>{subtitle}</p></div>
      <Link href={href}>{action} <ChevronRight size={15} /></Link>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint, trend }: { icon: React.ElementType; label: string; value: string; hint: string; trend: string }) {
  return (
    <article className="statCard">
      <div className="statTop"><div className="statIcon"><Icon size={20} /></div><span className="trend">{trend}</span></div>
      <p>{label}</p>
      <div className="statValue"><strong>{value}</strong><span>{hint}</span></div>
    </article>
  );
}
