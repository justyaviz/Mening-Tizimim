"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardCheck,
  FileSignature,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";

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
  const pathname = usePathname();

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

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
          <div className="avatar">YT</div>
          <div>
            <strong>Mening workspace</strong>
            <span>Shaxsiy tizim</span>
          </div>
          <span className="workspaceLive">LIVE</span>
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
          <div className="version">Mening Tizimim <b>v0.2</b></div>
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
            <button className="iconButton" aria-label="Bildirishnomalar"><Bell size={19} /><span className="notifyDot" /></button>
            <div className="profileMini">
              <div className="avatar small">YT</div>
              <div className="profileText"><strong>Yaviz</strong><span>Admin</span></div>
            </div>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
