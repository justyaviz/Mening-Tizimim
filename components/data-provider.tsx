"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AppData, Client, Contract, Project, Transaction } from "@/lib/data";
import { seedData } from "@/lib/data";

const STORAGE_KEY = "mening-tizimim-v0.2-data";

type DataContextValue = {
  data: AppData;
  ready: boolean;
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
  resetDemo: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(seedData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData(JSON.parse(saved));
    } catch {
      setData(seedData);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const value = useMemo<DataContextValue>(() => ({
    data,
    ready,
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
    resetDemo: () => setData(seedData),
  }), [data, ready]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used inside DataProvider");
  return ctx;
}
