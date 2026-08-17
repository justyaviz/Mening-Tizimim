"use client";

import { BarChart3, Clock3, FolderKanban, Lightbulb, WalletCards } from "lucide-react";
import { useMemo } from "react";
import { useAppData } from "@/components/data-provider";
import { PageHeader } from "@/components/ui";
import { minutesLabel, shortMoney } from "@/lib/data";

const monthNames = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];

export default function AnalyticsPage() {
  const { data } = useAppData();
  const income = data.transactions.filter((t) => t.type === "income" && t.currency === "UZS").reduce((s,t) => s + t.amount, 0);
  const expense = data.transactions.filter((t) => t.type === "expense" && t.currency === "UZS").reduce((s,t) => s + t.amount, 0);
  const workMinutes = data.workLogs.reduce((s, x) => s + x.durationMinutes, 0);

  const monthly = useMemo(() => {
    const bucket = new Map<string, { label: string; income: number; expense: number }>();
    data.transactions.filter((x) => x.currency === "UZS").forEach((x) => {
      const [year, month] = x.date.split("-").map(Number);
      if (!year || !month) return;
      const key = `${year}-${String(month).padStart(2, "0")}`;
      const prev = bucket.get(key) || { label: `${monthNames[month - 1]} ${String(year).slice(2)}`, income: 0, expense: 0 };
      prev[x.type] += x.amount;
      bucket.set(key, prev);
    });
    const values = Array.from(bucket.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([, value]) => value);
    if (!values.length) return [{ label: "Avg 26", income: 0, expense: 0 }];
    return values;
  }, [data.transactions]);

  const maxMonth = Math.max(1, ...monthly.flatMap((x) => [x.income, x.expense]));

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    data.transactions.filter((x) => x.type === "income" && x.currency === "UZS").forEach((x) => map.set(x.category || "Boshqa", (map.get(x.category || "Boshqa") || 0) + x.amount));
    return Array.from(map.entries()).sort((a,b) => b[1] - a[1]).slice(0, 6);
  }, [data.transactions]);
  const maxCategory = Math.max(1, ...categories.map(([, value]) => value));

  const workCategories = useMemo(() => {
    const map = new Map<string, number>();
    data.workLogs.forEach((x) => map.set(x.category || "Boshqa", (map.get(x.category || "Boshqa") || 0) + x.durationMinutes));
    return Array.from(map.entries()).sort((a,b) => b[1] - a[1]).slice(0, 6);
  }, [data.workLogs]);
  const maxWork = Math.max(1, ...workCategories.map(([, value]) => value));

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="INSIGHTS V0.4" title="Analitika" subtitle="Pul, ish va loyiha tarixidan avtomatik yig‘ilgan shaxsiy biznes ko‘rsatkichlari." />
      <section className="analyticsGrid">
        <article className="statCard"><div className="statIcon"><FolderKanban size={20}/></div><p>Loyihalar</p><div className="statValue"><strong>{data.projects.length}</strong><span>{data.projects.filter((x) => x.status === "active").length} aktiv</span></div></article>
        <article className="statCard"><div className="statIcon"><WalletCards size={20}/></div><p>Sof pul oqimi</p><div className="statValue"><strong>{shortMoney(income-expense)}</strong><span>so‘m</span></div></article>
        <article className="statCard"><div className="statIcon"><BarChart3 size={20}/></div><p>O‘rtacha progress</p><div className="statValue"><strong>{data.projects.length ? Math.round(data.projects.reduce((s,p)=>s+p.progress,0)/data.projects.length) : 0}%</strong><span>loyihalar</span></div></article>
        <article className="statCard"><div className="statIcon"><Clock3 size={20}/></div><p>Work log vaqti</p><div className="statValue"><strong>{minutesLabel(workMinutes)}</strong><span>{data.workLogs.length} yozuv</span></div></article>
      </section>

      <section className="analyticsV4Grid">
        <article className="analyticsPanel">
          <div className="analyticsPanelHead"><div><strong>Daromad va xarajat</strong><span>UZS · oylar bo‘yicha</span></div><WalletCards size={18} /></div>
          <div className="monthBars">
            {monthly.map((month) => <div className="monthBarGroup" key={month.label}><i style={{ height: `${Math.max(2, (month.income / maxMonth) * 100)}%` }} /><i className="expense" style={{ height: `${Math.max(2, (month.expense / maxMonth) * 100)}%` }} /><span>{month.label}</span></div>)}
          </div>
          <div className="analyticsLegend"><span><i />Daromad</span><span><i className="expense" />Xarajat</span></div>
        </article>

        <article className="analyticsPanel">
          <div className="analyticsPanelHead"><div><strong>Daromad manbalari</strong><span>Qaysi xizmat ko‘proq pul olib kelmoqda</span></div><BarChart3 size={18} /></div>
          <div className="categoryList">
            {categories.length ? categories.map(([name, value]) => <div className="categoryRow" key={name}><div><strong>{name}</strong><small>{Math.round((value / Math.max(income,1)) * 100)}% ulush</small><div className="categoryBar"><i style={{ width: `${(value / maxCategory) * 100}%` }} /></div></div><span className="categoryValue">{shortMoney(value)}</span></div>) : <div className="notificationEmpty">Daromad ma’lumoti yo‘q.</div>}
          </div>
        </article>

        <article className="analyticsPanel">
          <div className="analyticsPanelHead"><div><strong>Vaqt qayerga ketmoqda?</strong><span>Work log kategoriyalari</span></div><Clock3 size={18} /></div>
          <div className="categoryList">
            {workCategories.length ? workCategories.map(([name, value]) => <div className="categoryRow" key={name}><div><strong>{name}</strong><small>{minutesLabel(value)}</small><div className="categoryBar"><i style={{ width: `${(value / maxWork) * 100}%` }} /></div></div><span className="categoryValue">{Math.round((value / Math.max(workMinutes,1)) * 100)}%</span></div>) : <div className="notificationEmpty">Work log ma’lumoti yo‘q.</div>}
          </div>
        </article>

        <article className="analyticsPanel">
          <div className="analyticsPanelHead"><div><strong>O‘rganish bazasi</strong><span>Xato, dars va yutuqlar</span></div><Lightbulb size={18} /></div>
          <div className="lessonMiniStats">
            <div><span>Xato</span><strong>{data.lessons.filter((x) => x.type === "mistake").length}</strong></div>
            <div><span>Dars</span><strong>{data.lessons.filter((x) => x.type === "lesson").length}</strong></div>
            <div><span>Yutuq</span><strong>{data.lessons.filter((x) => x.type === "win").length}</strong></div>
            <div><span>Maqsad</span><strong>{data.goals.filter((x) => x.status === "active").length}</strong></div>
          </div>
        </article>
      </section>
    </div>
  );
}
