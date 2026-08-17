"use client";

import { Handshake, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/ui";

export default function PartnersPage() {
  return (
    <div className="pageWrap">
      <PageHeader eyebrow="COLLABORATIONS" title="Hamkorlar" subtitle="Freelancer, agentlik, xizmat ko‘rsatuvchi va doimiy hamkorlar uchun bo‘lim." />
      <section className="roadmapGrid">
        <article className="roadmapCard"><div className="entityIcon"><Handshake size={20} /></div><h2>Hamkorlar bazasi</h2><p>Kim bilan qaysi xizmat bo‘yicha ishlashingiz, narxi va roli saqlanadi.</p><span>v0.4 reja</span></article>
        <article className="roadmapCard"><div className="entityIcon"><UsersRound size={20} /></div><h2>Project team</h2><p>Loyiha ichida mobilograf, dizayner, developer va boshqa rollarni biriktirish.</p><span>v0.4 reja</span></article>
      </section>
    </div>
  );
}
