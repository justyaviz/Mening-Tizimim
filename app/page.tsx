"use client";

import Image from "next/image";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FileSignature,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Target,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { label: "Bosh sahifa", icon: LayoutDashboard, active: true },
  { label: "Loyihalar", icon: FolderKanban },
  { label: "Mijozlar", icon: UsersRound },
  { label: "Hamkorlar", icon: Handshake },
  { label: "Shartnomalar", icon: FileSignature },
  { label: "Moliya", icon: WalletCards },
  { label: "Vazifalar", icon: ClipboardCheck },
  { label: "Kalendar", icon: CalendarDays },
];

const projects = [
  {
    name: "Start Education",
    type: "SMM + Target",
    progress: 76,
    amount: "7 000 000 so‘m",
    next: "Kontent rejasi · Bugun",
    tone: "blue",
  },
  {
    name: "aloo",
    type: "Marketing + SMM",
    progress: 64,
    amount: "4 000 000 so‘m",
    next: "Reklama hisobot · Ertaga",
    tone: "indigo",
  },
  {
    name: "Web loyiha #01",
    type: "Website Development",
    progress: 42,
    amount: "$900",
    next: "UI tasdiqlash · 20 Avg",
    tone: "cyan",
  },
];

const tasks = [
  { title: "Start Education uchun Reels matnini tasdiqlash", time: "11:30", project: "Start Education" },
  { title: "Yangi SMM shartnomasi bo‘yicha ma’lumotlarni tekshirish", time: "14:00", project: "New client" },
  { title: "Web loyiha bosh sahifasini yakunlash", time: "17:00", project: "Web #01" },
  { title: "Kunlik xarajatlarni kiritish", time: "19:30", project: "Moliya" },
];

const finance = [
  { label: "SMM", value: 82 },
  { label: "Target", value: 58 },
  { label: "Dizayn", value: 34 },
  { label: "Web / IT", value: 67 },
];

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  return (
    <>
      {open && <button className="sidebarOverlay" aria-label="Menyuni yopish" onClick={close} />}
      <aside className={`sidebar ${open ? "sidebarOpen" : ""}`}>
        <div className="brandRow">
          <Image src="/mening-tizimim-logo.png" alt="Mening Tizimim" width={188} height={75} priority />
          <button className="mobileClose" onClick={close} aria-label="Menyuni yopish"><X size={20} /></button>
        </div>

        <div className="workspaceBadge">
          <div className="avatar">YT</div>
          <div>
            <strong>Yaviz workspace</strong>
            <span>Shaxsiy tizim</span>
          </div>
          <ChevronRight size={16} />
        </div>

        <nav className="navList">
          {nav.map(({ label, icon: Icon, active }) => (
            <button key={label} className={`navItem ${active ? "active" : ""}`}>
              <Icon size={19} strokeWidth={2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebarBottom">
          <button className="navItem"><BarChart3 size={19} /><span>Analitika</span></button>
          <button className="navItem"><Settings size={19} /><span>Sozlamalar</span></button>
          <div className="version">Mening Tizimim <b>v0.1</b></div>
        </div>
      </aside>
    </>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="appShell">
      <Sidebar open={menuOpen} close={() => setMenuOpen(false)} />

      <section className="content">
        <header className="topbar">
          <button className="menuButton" onClick={() => setMenuOpen(true)} aria-label="Menyuni ochish"><Menu /></button>
          <div className="searchBox">
            <Search size={18} />
            <input placeholder="Loyiha, mijoz, shartnoma qidirish..." />
            <kbd>⌘ K</kbd>
          </div>
          <div className="topActions">
            <button className="iconButton"><Bell size={19} /><span className="notifyDot" /></button>
            <div className="profileMini">
              <div className="avatar small">YT</div>
              <div className="profileText"><strong>Yaviz</strong><span>Admin</span></div>
            </div>
          </div>
        </header>

        <div className="pageWrap">
          <div className="welcomeRow">
            <div>
              <p className="eyebrow">DUSHANBA · 17 AVGUST</p>
              <h1>Assalomu alaykum, Yaviz 👋</h1>
              <p className="subtitle">Bugungi ishlaringiz, pul oqimi va loyihalaringiz bir joyda.</p>
            </div>
            <button className="primaryButton"><Plus size={18} /> Yangi qo‘shish</button>
          </div>

          <section className="statsGrid">
            <StatCard icon={FolderKanban} label="Aktiv loyihalar" value="8" hint="2 ta deadline yaqin" trend="+2 bu oy" />
            <StatCard icon={CircleDollarSign} label="Avgust daromad" value="24.5 mln" hint="so‘m" trend="+18.4%" />
            <StatCard icon={WalletCards} label="Avgust xarajat" value="8.2 mln" hint="so‘m" trend="33.4% daromaddan" />
            <StatCard icon={BriefcaseBusiness} label="Kutilayotgan to‘lov" value="11.7 mln" hint="4 ta to‘lov" trend="7 kun ichida" />
          </section>

          <section className="dashboardGrid">
            <div className="card projectsCard">
              <CardHeader title="Aktiv loyihalar" subtitle="Eng muhim ishlardan qisqa holat" action="Barchasi" />
              <div className="projectList">
                {projects.map((project) => (
                  <div className="projectRow" key={project.name}>
                    <div className={`projectIcon ${project.tone}`}><Target size={18} /></div>
                    <div className="projectMain">
                      <div className="projectHead"><strong>{project.name}</strong><span>{project.amount}</span></div>
                      <div className="projectMeta"><span>{project.type}</span><span>{project.progress}%</span></div>
                      <div className="progress"><i style={{ width: `${project.progress}%` }} /></div>
                      <small>{project.next}</small>
                    </div>
                    <button className="ghostIcon"><MoreHorizontal size={18} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card tasksCard">
              <CardHeader title="Bugungi vazifalar" subtitle="4 ta vazifa rejalashtirilgan" action="Kalendar" />
              <div className="taskList">
                {tasks.map((task, i) => (
                  <label className="taskRow" key={task.title}>
                    <input type="checkbox" />
                    <span className="fakeCheck" />
                    <span className="taskContent">
                      <strong>{task.title}</strong>
                      <small><b>{task.time}</b> · {task.project}</small>
                    </span>
                    <span className={`priority priority${i + 1}`} />
                  </label>
                ))}
              </div>
              <button className="addTask"><Plus size={16} /> Vazifa qo‘shish</button>
            </div>

            <div className="card financeCard">
              <CardHeader title="Daromad manbalari" subtitle="Avgust · xizmatlar kesimida" action="Moliya" />
              <div className="financeTotal">
                <span>Jami tushum</span>
                <strong>24 500 000 <small>so‘m</small></strong>
              </div>
              <div className="bars">
                {finance.map((item) => (
                  <div className="barRow" key={item.label}>
                    <span>{item.label}</span>
                    <div className="barTrack"><i style={{ width: `${item.value}%` }} /></div>
                    <b>{item.value}%</b>
                  </div>
                ))}
              </div>
            </div>

            <div className="card contractsCard">
              <CardHeader title="Shartnomalar" subtitle="Nazorat talab qiladiganlar" action="Barchasi" />
              <div className="contractItem">
                <div className="contractDate"><b>25</b><span>AVG</span></div>
                <div><strong>SMM xizmat shartnomasi</strong><p>Volidam Patir · tugashiga 8 kun</p></div>
                <span className="status warning">Yaqin</span>
              </div>
              <div className="contractItem">
                <div className="contractDate"><b>01</b><span>SEP</span></div>
                <div><strong>Web development</strong><p>New client · to‘lov sanasi</p></div>
                <span className="status success">Aktiv</span>
              </div>
              <div className="miniInsight">
                <FileSignature size={19} />
                <div><strong>6 ta aktiv shartnoma</strong><span>Umumiy oylik qiymat: 31.5 mln so‘m</span></div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle: string; action: string }) {
  return (
    <div className="cardHeader">
      <div><h2>{title}</h2><p>{subtitle}</p></div>
      <button>{action} <ChevronRight size={15} /></button>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint, trend }: { icon: React.ElementType; label: string; value: string; hint: string; trend: string }) {
  return (
    <article className="statCard">
      <div className="statTop"><div className="statIcon"><Icon size={20} /></div><span className="trend">{trend}</span></div>
      <p>{label}</p>
      <div className="statValue"><strong>{value}</strong><span>{hint}</span></div>
    </article>
  );
}
