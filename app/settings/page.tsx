"use client";

import { RotateCcw, ShieldCheck } from "lucide-react";
import { useAppData } from "@/components/data-provider";
import { PageHeader } from "@/components/ui";

export default function SettingsPage() {
  const { resetDemo } = useAppData();
  return (
    <div className="pageWrap">
      <PageHeader eyebrow="SYSTEM" title="Sozlamalar" subtitle="Mening Tizimim v0.2 lokal demo sozlamalari." />
      <section className="settingsStack">
        <article className="settingsCard cardLike"><div><ShieldCheck size={19}/><div><strong>Ma’lumotlarni saqlash</strong><p>v0.2 ma’lumotlarni brauzer localStorage’da saqlaydi. Backend hali ulanmagan.</p></div></div><span className="status info">Local</span></article>
        <article className="settingsCard cardLike"><div><RotateCcw size={19}/><div><strong>Demo ma’lumotlarni tiklash</strong><p>Qo‘shilgan va o‘zgartirilgan lokal ma’lumotlarni boshlang‘ich holatga qaytaradi.</p></div></div><button className="secondaryButton" onClick={() => window.confirm("Demo ma’lumotlarni tiklaysizmi?") && resetDemo()}>Tiklash</button></article>
      </section>
    </div>
  );
}
