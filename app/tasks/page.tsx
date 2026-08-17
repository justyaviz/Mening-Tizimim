"use client";

import { CheckCircle2, Clock3 } from "lucide-react";
import { PageHeader } from "@/components/ui";

const demo = [
  ["Bugungi asosiy vazifalarni yakunlash", "Bugun · 17:00"],
  ["Mijozlardan kelgan javoblarni tekshirish", "Bugun · 18:00"],
  ["Kunlik moliya yozuvlarini kiritish", "Bugun · 20:00"],
];

export default function TasksPage() {
  return (
    <div className="pageWrap">
      <PageHeader eyebrow="MY DAY" title="Vazifalar" subtitle="v0.2 da navigatsiya tayyor. To‘liq vazifa CRUD va reminder v0.3 da ulanadi." />
      <section className="card taskPreview">
        {demo.map(([title, meta]) => <label className="taskPreviewRow" key={title}><input type="checkbox" /><span className="taskPreviewCheck"><CheckCircle2 size={17} /></span><span><strong>{title}</strong><small><Clock3 size={12} />{meta}</small></span></label>)}
      </section>
    </div>
  );
}
