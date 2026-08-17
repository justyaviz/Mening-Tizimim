"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AppData, Client, ClientInteraction, Contract, Goal, Invoice, Lesson, Partner, Project, Service, Task, Transaction, WorkLog } from "@/lib/data";
import { emptyData, normalizeData } from "@/lib/data";

export type SyncStatus = "loading" | "syncing" | "synced" | "error";

type DataContextValue = {
  data: AppData;
  ready: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  syncError: string | null;
  reloadFromDatabase: () => Promise<void>;
  addProject: (item: Project) => void;
  updateProject: (item: Project) => void;
  removeProject: (id: string) => void;
  addClient: (item: Client) => void;
  updateClient: (item: Client) => void;
  removeClient: (id: string) => void;
  addContract: (item: Contract) => void;
  updateContract: (item: Contract) => void;
  removeContract: (id: string) => void;
  addTransaction: (item: Transaction) => void;
  removeTransaction: (id: string) => void;
  addInvoice: (item: Invoice) => void;
  updateInvoice: (item: Invoice) => void;
  removeInvoice: (id: string) => void;
  addTask: (item: Task) => void;
  updateTask: (item: Task) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addPartner: (item: Partner) => void;
  updatePartner: (item: Partner) => void;
  removePartner: (id: string) => void;
  addWorkLog: (item: WorkLog) => void;
  updateWorkLog: (item: WorkLog) => void;
  removeWorkLog: (id: string) => void;
  addLesson: (item: Lesson) => void;
  updateLesson: (item: Lesson) => void;
  removeLesson: (id: string) => void;
  addService: (item: Service) => void;
  updateService: (item: Service) => void;
  removeService: (id: string) => void;
  addGoal: (item: Goal) => void;
  updateGoal: (item: Goal) => void;
  removeGoal: (id: string) => void;
  addInteraction: (item: ClientInteraction) => void;
  updateInteraction: (item: ClientInteraction) => void;
  removeInteraction: (id: string) => void;
  replaceData: (next: AppData) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [ready, setReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const hydratedSuccessfully = useRef(false);
  const lastSavedJson = useRef(JSON.stringify(emptyData));

  async function reloadFromDatabase() {
    setSyncStatus("loading");
    setSyncError(null);
    try {
      const response = await fetch("/api/workspace", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || "Database ma’lumotlarini yuklab bo‘lmadi.");
      const next = normalizeData(body.payload);
      const serialized = JSON.stringify(next);
      lastSavedJson.current = serialized;
      hydratedSuccessfully.current = true;
      setData(next);
      setLastSyncedAt(body.updatedAt || null);
      setSyncStatus("synced");
    } catch (error) {
      hydratedSuccessfully.current = false;
      setData(emptyData);
      setSyncStatus("error");
      setSyncError(error instanceof Error ? error.message : "Database bilan aloqa xatosi.");
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    void reloadFromDatabase();
  }, []);

  useEffect(() => {
    if (!ready || !hydratedSuccessfully.current) return;
    const serialized = JSON.stringify(data);
    if (serialized === lastSavedJson.current) return;

    setSyncStatus("syncing");
    setSyncError(null);
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/workspace", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: serialized,
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body?.error || "Databasega saqlashda xato.");
        lastSavedJson.current = serialized;
        setLastSyncedAt(body.updatedAt || new Date().toISOString());
        setSyncStatus("synced");
      } catch (error) {
        setSyncStatus("error");
        setSyncError(error instanceof Error ? error.message : "Databasega saqlashda xato.");
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [data, ready]);

  useEffect(() => {
    if (!ready || typeof window === "undefined" || !("Notification" in window)) return;
    const check = () => {
      if (Notification.permission !== "granted") return;
      const now = Date.now();
      data.tasks.forEach((task) => {
        if (task.status === "done" || !task.reminderAt) return;
        const reminder = new Date(task.reminderAt).getTime();
        const diff = now - reminder;
        if (!Number.isFinite(reminder) || diff < 0 || diff > 12 * 60 * 60 * 1000) return;
        const seenKey = `mening-tizimim-reminder-${task.id}-${task.reminderAt}`;
        if (sessionStorage.getItem(seenKey)) return;
        new Notification("Mening Tizimim", {
          body: `${task.title}${task.project ? ` · ${task.project}` : ""}`,
          icon: "/mening-tizimim-icon.png",
        });
        sessionStorage.setItem(seenKey, "1");
      });
    };
    check();
    const timer = window.setInterval(check, 60_000);
    return () => window.clearInterval(timer);
  }, [data.tasks, ready]);

  const value = useMemo<DataContextValue>(() => ({
    data, ready, syncStatus, lastSyncedAt, syncError, reloadFromDatabase,
    addProject: (item) => setData((prev) => ({ ...prev, projects: [item, ...prev.projects] })),
    updateProject: (item) => setData((prev) => ({ ...prev, projects: prev.projects.map((p) => p.id === item.id ? item : p) })),
    removeProject: (id) => setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) })),
    addClient: (item) => setData((prev) => ({ ...prev, clients: [item, ...prev.clients] })),
    updateClient: (item) => setData((prev) => ({ ...prev, clients: prev.clients.map((p) => p.id === item.id ? item : p) })),
    removeClient: (id) => setData((prev) => ({ ...prev, clients: prev.clients.filter((p) => p.id !== id) })),
    addContract: (item) => setData((prev) => ({ ...prev, contracts: [item, ...prev.contracts] })),
    updateContract: (item) => setData((prev) => ({ ...prev, contracts: prev.contracts.map((p) => p.id === item.id ? item : p) })),
    removeContract: (id) => setData((prev) => ({ ...prev, contracts: prev.contracts.filter((p) => p.id !== id) })),
    addTransaction: (item) => setData((prev) => ({ ...prev, transactions: [item, ...prev.transactions] })),
    removeTransaction: (id) => setData((prev) => ({ ...prev, transactions: prev.transactions.filter((p) => p.id !== id) })),
    addInvoice: (item) => setData((prev) => ({ ...prev, invoices: [item, ...prev.invoices] })),
    updateInvoice: (item) => setData((prev) => ({ ...prev, invoices: prev.invoices.map((p) => p.id === item.id ? item : p) })),
    removeInvoice: (id) => setData((prev) => ({ ...prev, invoices: prev.invoices.filter((p) => p.id !== id) })),
    addTask: (item) => setData((prev) => ({ ...prev, tasks: [item, ...prev.tasks] })),
    updateTask: (item) => setData((prev) => ({ ...prev, tasks: prev.tasks.map((t) => t.id === item.id ? item : t) })),
    removeTask: (id) => setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) })),
    toggleTask: (id) => setData((prev) => ({ ...prev, tasks: prev.tasks.map((task) => task.id === id ? { ...task, status: task.status === "done" ? "todo" : "done", completedAt: task.status === "done" ? undefined : new Date().toISOString() } : task) })),
    addPartner: (item) => setData((prev) => ({ ...prev, partners: [item, ...prev.partners] })),
    updatePartner: (item) => setData((prev) => ({ ...prev, partners: prev.partners.map((p) => p.id === item.id ? item : p) })),
    removePartner: (id) => setData((prev) => ({ ...prev, partners: prev.partners.filter((p) => p.id !== id) })),
    addWorkLog: (item) => setData((prev) => ({ ...prev, workLogs: [item, ...prev.workLogs] })),
    updateWorkLog: (item) => setData((prev) => ({ ...prev, workLogs: prev.workLogs.map((p) => p.id === item.id ? item : p) })),
    removeWorkLog: (id) => setData((prev) => ({ ...prev, workLogs: prev.workLogs.filter((p) => p.id !== id) })),
    addLesson: (item) => setData((prev) => ({ ...prev, lessons: [item, ...prev.lessons] })),
    updateLesson: (item) => setData((prev) => ({ ...prev, lessons: prev.lessons.map((p) => p.id === item.id ? item : p) })),
    removeLesson: (id) => setData((prev) => ({ ...prev, lessons: prev.lessons.filter((p) => p.id !== id) })),
    addService: (item) => setData((prev) => ({ ...prev, services: [item, ...prev.services] })),
    updateService: (item) => setData((prev) => ({ ...prev, services: prev.services.map((p) => p.id === item.id ? item : p) })),
    removeService: (id) => setData((prev) => ({ ...prev, services: prev.services.filter((p) => p.id !== id) })),
    addGoal: (item) => setData((prev) => ({ ...prev, goals: [item, ...prev.goals] })),
    updateGoal: (item) => setData((prev) => ({ ...prev, goals: prev.goals.map((p) => p.id === item.id ? item : p) })),
    removeGoal: (id) => setData((prev) => ({ ...prev, goals: prev.goals.filter((p) => p.id !== id) })),
    addInteraction: (item) => setData((prev) => ({ ...prev, interactions: [item, ...prev.interactions] })),
    updateInteraction: (item) => setData((prev) => ({ ...prev, interactions: prev.interactions.map((p) => p.id === item.id ? item : p) })),
    removeInteraction: (id) => setData((prev) => ({ ...prev, interactions: prev.interactions.filter((p) => p.id !== id) })),
    replaceData: (next) => setData(normalizeData(next)),
  }), [data, ready, syncStatus, lastSyncedAt, syncError]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used inside DataProvider");
  return ctx;
}
