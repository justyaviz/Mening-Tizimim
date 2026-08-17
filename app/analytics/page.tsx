"use client";

import { BarChart3, FolderKanban, WalletCards } from "lucide-react";
import { useAppData } from "@/components/data-provider";
import { PageHeader } from "@/components/ui";
import { shortMoney } from "@/lib/data";

export default function AnalyticsPage() {
  const { data } = useAppData();
  const income = data.transactions.filter((t) => t.type === "income" && t.currency === "UZS").reduce((s,t) => s + t.amount, 0);
  const expense = data.transactions.filter((t) => t.type === "expense" && t.currency === "UZS").reduce((s,t) => s + t.amount, 0);
  return (
    <div className="pageWrap">
      <PageHeader eyebrow="INSIGHTS" title="Analitika" subtitle="Hozirgi bazadagi loyiha va moliya ma’lumotlaridan tezkor ko‘rsatkichlar." />
      <section className="analyticsGrid">
        <article className="statCard"><div className="statIcon"><FolderKanban size={20}/></div><p>Loyihalar</p><div className="statValue"><strong>{data.projects.length}</strong><span>jami</span></div></article>
        <article className="statCard"><div className="statIcon"><WalletCards size={20}/></div><p>Sof pul oqimi</p><div className="statValue"><strong>{shortMoney(income-expense)}</strong><span>so‘m</span></div></article>
        <article className="statCard"><div className="statIcon"><BarChart3 size={20}/></div><p>O‘rtacha progress</p><div className="statValue"><strong>{data.projects.length ? Math.round(data.projects.reduce((s,p)=>s+p.progress,0)/data.projects.length) : 0}%</strong><span>loyihalar</span></div></article>
      </section>
      <section className="card chartPlaceholder"><div className="chartBars">{[42,68,51,82,63,91,74,58,86,70,95,78].map((v,i)=><i key={i} style={{height:`${v}%`}} />)}</div><div className="chartLegend"><span>v0.4 da vaqt bo‘yicha haqiqiy chartlar</span><b>Daromad · Xarajat · Loyiha rentabelligi</b></div></section>
    </div>
  );
}
