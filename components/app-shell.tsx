"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  FileSignature,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { configured, loading, user, signOut } = useAuth();
  const { data, ready, syncStatus } = useAppData();

  useEffect(() => {
    if (!configured || loading) return;
    if (!user && pathname !== "/login") router.replace("/login");
    if (user && pathname === "/login") router.replace("/");
  }, [configured, loading, user, pathname, router]);

  const alerts = useMemo(() => {
    const now = Date.now();
    return data.tasks
      .filter((task) => task.status !== "done" && task.dueAt)
      .map((task) => ({ ...task, dueTime: new Date(task.dueAt).getTime() }))
      .filter((task) => Number.isFinite(task.dueTime) && task.dueTime <= now + 24 * 60 * 60 * 1000)
      .sort((a, b) => a.dueTime - b.dueTime)
      .slice(0, 5);
  }, [data.tasks]);

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

  return (
    <main className="appShell">
      {menuOpen && <button className="sidebarOverlay" aria-label="Menyuni yopish" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? "sidebarOpen" : ""}`}>
        <div className="brandRow">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image src="/mening-tizimim-logo.png" alt="Mening Tizimim" width={188} height={75} priority />
          </Link>
          <button className="mobileClose" onClick={() => setMenuOpen(false)} aria-label="Menyuni yopish"><X size={20} /></button>
        </div>

        <div className="workspaceBadge">
          <div className="avatar">{initials}</div>
          <div className="workspaceMeta">
            <strong>Mening workspace</strong>
            <span title={displayEmail}>{configured ? displayEmail : "Shaxsiy local tizim"}</span>
          </div>
          <span className={`workspaceLive ${syncStatus === "error" ? "syncError" : ""}`}>{configured ? (syncStatus === "synced" ? "CLOUD" : syncStatus.toUpperCase()) : "LOCAL"}</span>
        </div>

        <nav className="navList">
          {nav.map(({ label, icon: Icon, href }) => (
            <Link key={href} href={href} className={`navItem ${isActive(href) ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
              <Icon size={19} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebarBottom">
          <Link href="/analytics" className={`navItem ${isActive("/analytics") ? "active" : ""}`}><BarChart3 size={19} /><span>Analitika</span></Link>
          <Link href="/settings" className={`navItem ${isActive("/settings") ? "active" : ""}`}><Settings size={19} /><span>Sozlamalar</span></Link>
          {configured && user && <button className="navItem sidebarLogout" onClick={handleSignOut}><LogOut size={19} /><span>Chiqish</span></button>}
          <div className="version">Mening Tizimim <b>v0.3</b></div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="menuButton" onClick={() => setMenuOpen(true)} aria-label="Menyuni ochish"><Menu /></button>
          <div className="searchBox">
            <Search size={18} />
            <input placeholder="Loyiha, mijoz, shartnoma qidirish..." aria-label="Global qidiruv" />
            <kbd>⌘ K</kbd>
          </div>
          <div className="topActions">
            <div className="notificationWrap">
              <button className="iconButton" aria-label="Bildirishnomalar" onClick={() => setNotificationsOpen((v) => !v)}>
                <Bell size={19} />
                {alerts.length > 0 && <span className="notifyDot" />}
              </button>
              {notificationsOpen && (
                <div className="notificationPanel">
                  <div className="notificationHead"><div><strong>Bildirishnomalar</strong><span>{alerts.length} ta yaqin vazifa</span></div><Cloud size={17} /></div>
                  {alerts.length ? alerts.map((task) => (
                    <Link href="/tasks" className="notificationItem" key={task.id} onClick={() => setNotificationsOpen(false)}>
                      <CheckCircle2 size={16} />
                      <span><strong>{task.title}</strong><small>{formatTaskDate(task.dueAt)} · {task.project || "Umumiy"}</small></span>
                    </Link>
                  )) : <div className="notificationEmpty">Hozircha yaqin reminder yo‘q.</div>}
                </div>
              )}
            </div>
            <div className="profileMini">
              <div className="avatar small">{initials}</div>
              <div className="profileText"><strong>Yaviz</strong><span>{configured ? "Cloud Admin" : "Local Admin"}</span></div>
            </div>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
