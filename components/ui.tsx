"use client";

import { Plus, X } from "lucide-react";

export function PageHeader({ eyebrow, title, subtitle, actionLabel, onAction }: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="welcomeRow pageHeaderRow">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      {actionLabel && onAction && (
        <button className="primaryButton" onClick={onAction}><Plus size={18} /> {actionLabel}</button>
      )}
    </div>
  );
}

export function Modal({ open, title, subtitle, children, onClose }: {
  open: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="modalLayer" role="dialog" aria-modal="true">
      <button className="modalBackdrop" aria-label="Yopish" onClick={onClose} />
      <section className="modalCard">
        <div className="modalHead">
          <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
          <button className="iconButton modalClose" onClick={onClose} aria-label="Yopish"><X size={18} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="emptyState">
      <div className="emptyDot" />
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

export function StatusPill({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const tone = normalized.includes("paid") || normalized.includes("to‘langan") || normalized.includes("tolangan") || normalized.includes("active") || normalized.includes("aktiv") || normalized.includes("income")
    ? "success"
    : normalized.includes("overdue") || normalized.includes("kechik")
      ? "danger"
      : normalized.includes("ending") || normalized.includes("yaqin") || normalized.includes("lead") || normalized.includes("partial") || normalized.includes("qisman")
        ? "warning"
        : normalized.includes("done") || normalized.includes("completed") || normalized.includes("yakun") || normalized.includes("cancel") || normalized.includes("bekor")
          ? "neutral"
          : "info";
  return <span className={`status ${tone}`}>{value}</span>;
}

export function FormActions({ onCancel, submitLabel = "Saqlash" }: { onCancel: () => void; submitLabel?: string }) {
  return (
    <div className="formActions">
      <button type="button" className="secondaryButton" onClick={onCancel}>Bekor qilish</button>
      <button type="submit" className="primaryButton formPrimary">{submitLabel}</button>
    </div>
  );
}
