"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AppData, Client, ClientInteraction, Contract, Goal, Invoice, Lesson, Partner, Project, Service, Task, Transaction, WorkLog } from "@/lib/data";
import { normalizeData, seedData } from "@/lib/data";
import { getSupabaseClient } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";

const STORAGE_KEY = "mening-tizimim-v0.6-data";
const OLD_STORAGE_KEYS = ["mening-tizimim-v0.5-data", "mening-tizimim-v0.4-data", "mening-tizimim-v0.3-data", "mening-tizimim-v0.2-data"];

function findLocalBackup(userId?: string) {
  const keys = userId
    ? [`${STORAGE_KEY}-${userId}`, STORAGE_KEY, ...OLD_STORAGE_KEYS.map((key) => `${key}-${userId}`), ...OLD_STORAGE_KEYS]
    : [STORAGE_KEY, ...OLD_STORAGE_KEYS];
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
}

export type SyncStatus = "local" | "loading" | "syncing" | "synced" | "error";

type DataContextValue = {
  data: AppData;
  ready: boolean;
  syncStatus: SyncStatus;
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
  resetDemo: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { configured, user, loading: authLoading } = useAuth();
  const [data, setData] = useState<AppData>(seedData);
  const [ready, setReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(configured ? "loading" : "local");
  const hydratedFor = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function hydrate() {
      if (!configured) {
        try {
          const saved = findLocalBackup();
          if (saved) setData(normalizeData(JSON.parse(saved)));
        } catch {
          setData(seedData);
        } finally {
          hydratedFor.current = "local";
          setReady(true);
          setSyncStatus("local");
        }
        return;
      }

      if (!user) {
        hydratedFor.current = null;
        setReady(false);
        setSyncStatus("loading");
        return;
      }

      if (hydratedFor.current === user.id) return;
      setReady(false);
      setSyncStatus("loading");

      const supabase = getSupabaseClient();
      if (!supabase) return;

      try {
        const { data: row, error } = await supabase
          .from("workspace_data")
          .select("payload")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (cancelled) return;

        if (row?.payload) {
          setData(normalizeData(row.payload as Partial<AppData>));
        } else {
          const local = findLocalBackup(user.id);
          const initial = local ? normalizeData(JSON.parse(local)) : seedData;
          setData(initial);
          const { error: insertError } = await supabase.from("workspace_data").upsert({
            user_id: user.id,
            payload: initial,
            updated_at: new Date().toISOString(),
          });
          if (insertError) throw insertError;
        }

        hydratedFor.current = user.id;
        setReady(true);
        setSyncStatus("synced");
      } catch (error) {
        console.error("Cloud hydrate failed", error);
        if (cancelled) return;
        try {
          const saved = findLocalBackup(user.id);
          setData(saved ? normalizeData(JSON.parse(saved)) : seedData);
        } catch {
          setData(seedData);
        }
        hydratedFor.current = user.id;
        setReady(true);
        setSyncStatus("error");
      }
    }

    hydrate();
    return () => { cancelled = true; };
  }, [authLoading, configured, user]);

  useEffect(() => {
    if (!ready) return;
    try {
      const backupKey = configured && user ? `${STORAGE_KEY}-${user.id}` : STORAGE_KEY;
      localStorage.setItem(backupKey, JSON.stringify(data));
    } catch {
      // local backup is best-effort
    }

    if (!configured || !user || hydratedFor.current !== user.id) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    setSyncStatus("syncing");
    const timer = window.setTimeout(async () => {
      const { error } = await supabase.from("workspace_data").upsert({
        user_id: user.id,
        payload: data,
        updated_at: new Date().toISOString(),
      });
      setSyncStatus(error ? "error" : "synced");
      if (error) console.error("Cloud sync failed", error);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [data, ready, configured, user]);

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
    data,
    ready,
    syncStatus,
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
    toggleTask: (id) => setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => task.id === id
        ? {
            ...task,
            status: task.status === "done" ? "todo" : "done",
            completedAt: task.status === "done" ? undefined : new Date().toISOString(),
          }
        : task),
    })),
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
    resetDemo: () => setData(seedData),
  }), [data, ready, syncStatus]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used inside DataProvider");
  return ctx;
}
