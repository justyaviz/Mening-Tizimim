"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  FileSignature,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  NotebookTabs,
  Search,
  Settings,
  Target,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useAppData } from "@/components/data-provider";
import { formatTaskDate } from "@/lib/data";

const nav = [
  { label: "Bosh sahifa", icon: LayoutDashboard, href: "/" },
  { label: "Loyihalar", icon: FolderKanban, href: "/projects" },
  { label: "Mijozlar", icon: UsersRound, href: "/clients" },
  { label: "Hamkorlar", icon: Handshake, href: "/partners" },
  { label: "Shartnomalar", icon: FileSignature, href: "/contracts" },
  { label: "Moliya", icon: WalletCards, href: "/finance" },
  { label: "Vazifalar", icon: ClipboardCheck, href: "/tasks" },
  { label: "Kalendar", icon: CalendarDays, href: "/calendar" },
  { label: "Qilgan ishlarim", icon: NotebookTabs, href: "/work" },
  { label: "Xatolar & Darslar", icon: Lightbulb, href: "/lessons" },
  { label: "Xizmatlarim", icon: BriefcaseBusiness, href: "/services" },
  { label: "Maqsadlar", icon: Target, href: "/goals" },
];

type SearchResult = { title: string; meta: string; href: string; kind: string };

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { configured, loading, user, signOut } = useAuth();
  const { data, ready, syncStatus } = useAppData();

  useEffect(() => {
    if (!configured || loading) return;
    if (!user && pathname !== "/login") router.replace("/login");
    if (user && pathname === "/login") router.replace("/");
  }, [configured, loading, user, pathname, router]);

  useEffect(() => {
    function hotkey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === "Escape") {
        setSearchFocused(false);
        setSearchQuery("");
      }
    }
    window.addEventListener("keydown", hotkey);
    return () => window.removeEventListener("keydown", hotkey);
  }, []);

  const alerts = useMemo(() => {
    const now = Date.now();
    return data.tasks
      .filter((task) => task.status !== "done" && task.dueAt)
      .map((task) => ({ ...task, dueTime: new Date(task.dueAt).getTime() }))
      .filter((task) => Number.isFinite(task.dueTime) && task.dueTime <= now + 24 * 60 * 60 * 1000)
      .sort((a, b) => a.dueTime - b.dueTime)
      .slice(0, 5);
  }, [data.tasks]);

  const searchResults = useMemo<SearchResult[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    const results: SearchResult[] = [];
    const add = (title: string, meta: string, href: string, kind: string, haystack: string) => {
      if (haystack.toLowerCase().includes(q)) results.push({ title, meta, href, kind });
    };
    data.projects.forEach((x) => add(x.name, `${x.client} · ${x.service}`, "/projects", "Loyiha", `${x.name} ${x.client} ${x.service} ${x.nextAction}`));
    data.clients.forEach((x) => add(x.name, `${x.company} · ${x.role}`, "/clients", "Mijoz", `${x.name} ${x.company} ${x.role} ${x.instagram}`));
    data.contracts.forEach((x) => add(x.title, `${x.client} · ${x.project}`, "/contracts", "Shartnoma", `${x.title} ${x.client} ${x.project} ${x.note}`));
    data.tasks.forEach((x) => add(x.title, `${x.project || "Umumiy"} · ${x.status}`, "/tasks", "Vazifa", `${x.title} ${x.project} ${x.description}`));
    data.partners.forEach((x) => add(x.name, `${x.specialty} · ${x.status}`, "/partners", "Hamkor", `${x.name} ${x.specialty} ${x.projects} ${x.telegram}`));
    data.workLogs.forEach((x) => add(x.title, `${x.date} · ${x.project || "Umumiy"}`, "/work", "Ish", `${x.title} ${x.project} ${x.result} ${x.note}`));
    data.lessons.forEach((x) => add(x.title, `${x.type} · ${x.project || "Umumiy"}`, "/lessons", "Dars", `${x.title} ${x.project} ${x.situation} ${x.lesson} ${x.action}`));
    data.services.forEach((x) => add(x.name, `${x.category} · ${x.unit}`, "/services", "Xizmat", `${x.name} ${x.category} ${x.note}`));
    data.goals.forEach((x) => add(x.title, `${x.category} · ${x.progress}%`, "/goals", "Maqsad", `${x.title} ${x.category} ${x.metric} ${x.note}`));
    return results.slice(0, 9);
  }, [data, searchQuery]);

  if (pathname === "/login") return <>{children}</>;

  if (configured && (loading || !user || !ready)) {
    return (
      <div className="systemLoader">
        <Image src="/mening-tizimim-icon.png" alt="Mening Tizimim" width={58} height={58} />
        <strong>Mening Tizimim</strong>
        <span>{!user && !loading ? "Kirish sahifasiga yo‘naltirilmoqda..." : "Tizim yuklanmoqda..."}</span>
      </div>
    );
  }

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const displayEmail = user?.email || "Local workspace";
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "YT";

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  function chooseResult(result: SearchResult) {
    setSearchQuery("");
    setSearchFocused(false);
    router.push(result.href);
  }

  return (
    <main className="appShell">
      {menuOpen && <button className="sidebarOverlay" aria-label="Menyuni yopish" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? "sidebarOpen" : ""}`}>
        <div className="brandRow">
          <Link href="/" onClick={() => setMenuOpen(false)}><Image src="/mening-tizimim-logo.png" alt="Mening Tizimim" width={188} height={75} priority /></Link>
          <button className="mobileClose" onClick={() => setMenuOpen(false)} aria-label="Menyuni yopish"><X size={20} /></button>
        </div>

        <div className="workspaceBadge">
          <div className="avatar">{initials}</div>
          <div className="workspaceMeta"><strong>Mening workspace</strong><span title={displayEmail}>{configured ? displayEmail : "Shaxsiy local tizim"}</span></div>
          <span className={`workspaceLive ${syncStatus === "error" ? "syncError" : ""}`}>{configured ? (syncStatus === "synced" ? "CLOUD" : syncStatus.toUpperCase()) : "LOCAL"}</span>
        </div>

        <nav className="navList">
          {nav.map(({ label, icon: Icon, href }) => (
            <Link key={href} href={href} className={`navItem ${isActive(href) ? "active" : ""}`} onClick={() => setMenuOpen(false)}><Icon size={19} strokeWidth={2} /><span>{label}</span></Link>
          ))}
        </nav>

        <div className="sidebarBottom">
          <Link href="/analytics" className={`navItem ${isActive("/analytics") ? "active" : ""}`}><BarChart3 size={19} /><span>Analitika</span></Link>
          <Link href="/settings" className={`navItem ${isActive("/settings") ? "active" : ""}`}><Settings size={19} /><span>Sozlamalar</span></Link>
          {configured && user && <button className="navItem sidebarLogout" onClick={handleSignOut}><LogOut size={19} /><span>Chiqish</span></button>}
          <div className="version">Mening Tizimim <b>v0.4</b></div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="menuButton" onClick={() => setMenuOpen(true)} aria-label="Menyuni ochish"><Menu /></button>
          <div className="searchWrapV4">
            <div className="searchBox">
              <Search size={18} />
              <input ref={searchRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} placeholder="Butun tizim bo‘yicha qidirish..." aria-label="Global qidiruv" />
              <kbd>⌘ K</kbd>
            </div>
            {searchFocused && searchQuery.trim().length >= 2 && (
              <div className="globalSearchPanel">
                <div className="globalSearchHead"><span>Natijalar</span><b>{searchResults.length}</b></div>
                {searchResults.length ? searchResults.map((result, index) => (
                  <button key={`${result.kind}-${result.title}-${index}`} className="globalSearchItem" onMouseDown={(e) => e.preventDefault()} onClick={() => chooseResult(result)}>
                    <span className="searchKind">{result.kind}</span>
                    <span className="searchCopy"><strong>{result.title}</strong><small>{result.meta}</small></span>
                  </button>
                )) : <div className="notificationEmpty">“{searchQuery}” bo‘yicha hech narsa topilmadi.</div>}
              </div>
            )}
          </div>
          <div className="topActions">
            <div className="notificationWrap">
              <button className="iconButton" aria-label="Bildirishnomalar" onClick={() => setNotificationsOpen((v) => !v)}><Bell size={19} />{alerts.length > 0 && <span className="notifyDot" />}</button>
              {notificationsOpen && (
                <div className="notificationPanel">
                  <div className="notificationHead"><div><strong>Bildirishnomalar</strong><span>{alerts.length} ta yaqin vazifa</span></div><Cloud size={17} /></div>
                  {alerts.length ? alerts.map((task) => (
                    <Link href="/tasks" className="notificationItem" key={task.id} onClick={() => setNotificationsOpen(false)}><CheckCircle2 size={16} /><span><strong>{task.title}</strong><small>{formatTaskDate(task.dueAt)} · {task.project || "Umumiy"}</small></span></Link>
                  )) : <div className="notificationEmpty">Hozircha yaqin reminder yo‘q.</div>}
                </div>
              )}
            </div>
            <div className="profileMini"><div className="avatar small">{initials}</div><div className="profileText"><strong>Yaviz</strong><span>{configured ? "Cloud Admin" : "Local Admin"}</span></div></div>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
