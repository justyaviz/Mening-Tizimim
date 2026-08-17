"use client";

import { Cloud, Database, Download, RefreshCw, ShieldCheck } from "lucide-react";
import { useAppData } from "@/components/data-provider";
import { PageHeader } from "@/components/ui";

export default function SettingsPage() {
  const { data, syncStatus, syncError, lastSyncedAt, reloadFromDatabase } = useAppData();

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mening-tizimim-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const totalRecords = data.projects.length + data.clients.length + data.contracts.length + data.transactions.length + data.invoices.length + data.tasks.length + data.partners.length + data.workLogs.length + data.lessons.length + data.services.length + data.goals.length + data.interactions.length;

  return (
    <div className="pageWrap">
      <PageHeader eyebrow="SYSTEM" title="Sozlamalar" subtitle="Railway PostgreSQL, xavfsizlik va backup holatini boshqaring." />
      <section className="settingsStack">
        <article className="settingsCard cardLike"><div><Database size={19}/><div><strong>Asosiy ma’lumotlar bazasi</strong><p>Barcha loyiha, mijoz, shartnoma, moliya, to‘lov, vazifa va boshqa ma’lumotlar Railway PostgreSQL ichidagi <code>workspace_data</code> jadvalida saqlanadi. Demo va localStorage ishlatilmaydi.</p></div></div><span className={`status ${syncStatus === "error" ? "warning" : syncStatus === "synced" ? "success" : "info"}`}>{syncStatus}</span></article>
        <article className="settingsCard cardLike"><div><Cloud size={19}/><div><strong>Avtomatik sinxronizatsiya</strong><p>{syncError ? `Xato: ${syncError}` : lastSyncedAt ? `Oxirgi saqlash: ${new Date(lastSyncedAt).toLocaleString("uz-UZ")}` : "Database bilan birinchi sinxronizatsiya kutilmoqda."}</p></div></div><button className="secondaryButton" onClick={() => void reloadFromDatabase()}><RefreshCw size={15}/> Qayta yuklash</button></article>
        <article className="settingsCard cardLike"><div><ShieldCheck size={19}/><div><strong>Database xavfsizligi</strong><p><code>DATABASE_URL</code> faqat Next.js server tomonida ishlatiladi va brauzerga yuborilmaydi. Railway private connection’dan foydalanish tavsiya etiladi.</p></div></div><span className="status success">Server only</span></article>
        <article className="settingsCard cardLike"><div><Database size={19}/><div><strong>Saqlangan obyektlar</strong><p>Hozir workspace ichida jami <b>{totalRecords}</b> ta yozuv bor.</p></div></div><span className="status neutral">PostgreSQL</span></article>
        <article className="settingsCard cardLike"><div><Download size={19}/><div><strong>Backup yuklab olish</strong><p>Database’dagi barcha workspace ma’lumotlarini JSON nusxa sifatida kompyuterga saqlaydi.</p></div></div><button className="secondaryButton" onClick={exportData}>Yuklab olish</button></article>
      </section>
    </div>
  );
}
