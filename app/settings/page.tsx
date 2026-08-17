"use client";

import { Cloud, Download, RotateCcw, ShieldCheck, UserRound } from "lucide-react";
import { useAppData } from "@/components/data-provider";
import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/components/ui";

export default function SettingsPage() {
  const { data, resetDemo, syncStatus } = useAppData();
  const { configured, user } = useAuth();

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mening-tizimim-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="SYSTEM" title="Sozlamalar" subtitle="Cloud, xavfsizlik va ma’lumotlar holatini boshqaring." />
      <section className="settingsStack">
        <article className="settingsCard cardLike"><div><Cloud size={19}/><div><strong>Ma’lumotlarni saqlash</strong><p>{configured ? "Supabase cloud baza faol. Har bir o‘zgarish avtomatik sinxronlanadi va local backup ham saqlanadi." : "Supabase env sozlanmagan. Tizim localStorage demo rejimida ishlayapti."}</p></div></div><span className={`status ${syncStatus === "error" ? "warning" : configured ? "success" : "info"}`}>{syncStatus}</span></article>
        <article className="settingsCard cardLike"><div><UserRound size={19}/><div><strong>Admin hisob</strong><p>{configured ? (user?.email || "Auth session yuklanmoqda") : "Local Admin · login o‘chiq"}</p></div></div><span className="status neutral">{configured ? "Supabase Auth" : "Demo"}</span></article>
        <article className="settingsCard cardLike"><div><ShieldCheck size={19}/><div><strong>Maxfiylik</strong><p>Supabase RLS policy har bir userga faqat o‘z workspace ma’lumotini o‘qish va yangilashga ruxsat beradi.</p></div></div><span className="status success">RLS ready</span></article>
        <article className="settingsCard cardLike"><div><Download size={19}/><div><strong>Backup yuklab olish</strong><p>Barcha loyiha, CRM, moliya, work log, dars, xizmat va maqsadlarni JSON backup sifatida saqlang.</p></div></div><button className="secondaryButton" onClick={exportData}>Yuklab olish</button></article>
        <article className="settingsCard cardLike"><div><RotateCcw size={19}/><div><strong>Demo ma’lumotlarni tiklash</strong><p>Hozirgi workspace ma’lumotlarini boshlang‘ich v0.4 demo holatiga qaytaradi.</p></div></div><button className="secondaryButton" onClick={() => window.confirm("Demo ma’lumotlarni tiklaysizmi?") && resetDemo()}>Tiklash</button></article>
      </section>
    </div>
  );
}
