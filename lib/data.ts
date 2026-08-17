export type ProjectStatus = "active" | "paused" | "done" | "lead";
export type ClientStatus = "active" | "lead" | "inactive";
export type ContractStatus = "active" | "ending" | "draft" | "completed";
export type TransactionType = "income" | "expense";
export type Currency = "UZS" | "USD";
export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Project = {
  id: string;
  name: string;
  service: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  amount: number;
  currency: Currency;
  deadline: string;
  nextAction: string;
  notes?: string;
};

export type Client = {
  id: string;
  name: string;
  company: string;
  role: string;
  phone: string;
  telegram: string;
  instagram: string;
  status: ClientStatus;
  source: string;
  note: string;
};

export type Contract = {
  id: string;
  title: string;
  client: string;
  project: string;
  status: ContractStatus;
  amount: number;
  currency: Currency;
  billing: "monthly" | "one_time";
  startDate: string;
  endDate: string;
  paymentDay: number;
  note: string;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  category: string;
  project: string;
  amount: number;
  currency: Currency;
  date: string;
  note: string;
};

export type Task = {
  id: string;
  title: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string;
  reminderAt: string;
  description: string;
  createdAt: string;
  completedAt?: string;
};

export type AppData = {
  projects: Project[];
  clients: Client[];
  contracts: Contract[];
  transactions: Transaction[];
  tasks: Task[];
};

export const seedData: AppData = {
  projects: [
    {
      id: "p-start",
      name: "Start Education",
      service: "SMM + Target",
      client: "Start Education",
      status: "active",
      progress: 76,
      amount: 7000000,
      currency: "UZS",
      deadline: "2026-08-31",
      nextAction: "Kontent rejasi va target optimizatsiyasi",
      notes: "Oylik marketing va SMM loyiha.",
    },
    {
      id: "p-aloo",
      name: "aloo",
      service: "Marketing + SMM",
      client: "aloo",
      status: "active",
      progress: 64,
      amount: 4000000,
      currency: "UZS",
      deadline: "2026-08-31",
      nextAction: "Haftalik hisobot va yangi aksiyalar",
      notes: "Marketing, kontent va reklama jarayonlari.",
    },
    {
      id: "p-web-01",
      name: "Web loyiha #01",
      service: "Website Development",
      client: "New client",
      status: "active",
      progress: 42,
      amount: 900,
      currency: "USD",
      deadline: "2026-08-28",
      nextAction: "UI bosh sahifani tasdiqlash",
      notes: "Korporativ web loyiha.",
    },
    {
      id: "p-brand",
      name: "Personal Brand",
      service: "Brandface + Content",
      client: "Shaxsiy",
      status: "active",
      progress: 31,
      amount: 0,
      currency: "UZS",
      deadline: "2026-09-15",
      nextAction: "Avgust kontent seriyasini yakunlash",
      notes: "Shaxsiy brendni o'stirish.",
    },
  ],
  clients: [
    {
      id: "c-start",
      name: "Start Education",
      company: "Start Education",
      role: "SMM mijoz",
      phone: "",
      telegram: "",
      instagram: "@starteducation",
      status: "active",
      source: "Existing client",
      note: "SMM va target loyihasi.",
    },
    {
      id: "c-aloo",
      name: "aloo",
      company: "aloo",
      role: "Marketing loyiha",
      phone: "",
      telegram: "",
      instagram: "@aloouz",
      status: "active",
      source: "Existing client",
      note: "Marketing va SMM.",
    },
    {
      id: "c-new",
      name: "New client",
      company: "Web Project",
      role: "Web mijoz",
      phone: "",
      telegram: "",
      instagram: "",
      status: "active",
      source: "Referral",
      note: "Website development.",
    },
  ],
  contracts: [
    {
      id: "ct-smm",
      title: "SMM xizmat shartnomasi",
      client: "Volidam Patir",
      project: "SMM loyiha",
      status: "ending",
      amount: 1200,
      currency: "USD",
      billing: "monthly",
      startDate: "2026-08-01",
      endDate: "2026-08-25",
      paymentDay: 1,
      note: "Muddatni uzaytirish bo'yicha kelishish kerak.",
    },
    {
      id: "ct-web",
      title: "Web development",
      client: "New client",
      project: "Web loyiha #01",
      status: "active",
      amount: 900,
      currency: "USD",
      billing: "one_time",
      startDate: "2026-08-10",
      endDate: "2026-09-01",
      paymentDay: 1,
      note: "Qoldiq to'lov yakunda.",
    },
  ],
  transactions: [
    {
      id: "t1",
      type: "income",
      title: "SMM oylik to'lovi",
      category: "SMM",
      project: "Start Education",
      amount: 7000000,
      currency: "UZS",
      date: "2026-08-05",
      note: "Avgust oyi.",
    },
    {
      id: "t2",
      type: "income",
      title: "Marketing oylik to'lovi",
      category: "Marketing",
      project: "aloo",
      amount: 4000000,
      currency: "UZS",
      date: "2026-08-07",
      note: "Avgust oyi.",
    },
    {
      id: "t3",
      type: "expense",
      title: "Reklama va xizmat xarajati",
      category: "Ads / Tools",
      project: "General",
      amount: 1650000,
      currency: "UZS",
      date: "2026-08-12",
      note: "Ish jarayoni xarajatlari.",
    },
    {
      id: "t4",
      type: "expense",
      title: "Freelancer to'lovi",
      category: "Team",
      project: "SMM loyiha",
      amount: 900000,
      currency: "UZS",
      date: "2026-08-14",
      note: "Qo'shimcha xizmat.",
    },
  ],
  tasks: [
    {
      id: "task-1",
      title: "Start Education kontent va target rejasini tekshirish",
      project: "Start Education",
      status: "todo",
      priority: "high",
      dueAt: "2026-08-17T17:00",
      reminderAt: "2026-08-17T16:30",
      description: "Bugungi kampaniyalar va kontent chiqishlarini yakuniy tekshirish.",
      createdAt: "2026-08-17T09:00:00",
    },
    {
      id: "task-2",
      title: "Web loyiha bosh sahifasini yakunlash",
      project: "Web loyiha #01",
      status: "doing",
      priority: "high",
      dueAt: "2026-08-17T19:00",
      reminderAt: "2026-08-17T18:30",
      description: "Desktop va mobile holatlarini tekshirib mijozga preview yuborish.",
      createdAt: "2026-08-16T18:00:00",
    },
    {
      id: "task-3",
      title: "Kunlik xarajatlarni Moliya bo‘limiga kiritish",
      project: "General",
      status: "todo",
      priority: "medium",
      dueAt: "2026-08-17T21:00",
      reminderAt: "2026-08-17T20:30",
      description: "Bugungi reklama, transport va servis xarajatlarini yozish.",
      createdAt: "2026-08-17T10:00:00",
    },
    {
      id: "task-4",
      title: "aloo haftalik hisobotini tayyorlash",
      project: "aloo",
      status: "todo",
      priority: "medium",
      dueAt: "2026-08-18T14:00",
      reminderAt: "2026-08-18T12:00",
      description: "Kontent va reklama natijalarini birlashtirish.",
      createdAt: "2026-08-17T10:30:00",
    },
  ],
};

export function normalizeData(raw: Partial<AppData> | null | undefined): AppData {
  const safe = raw && typeof raw === "object" ? raw : {};
  return {
    projects: Array.isArray(safe.projects) ? safe.projects : seedData.projects,
    clients: Array.isArray(safe.clients) ? safe.clients : seedData.clients,
    contracts: Array.isArray(safe.contracts) ? safe.contracts : seedData.contracts,
    transactions: Array.isArray(safe.transactions) ? safe.transactions : seedData.transactions,
    tasks: Array.isArray(safe.tasks) ? safe.tasks : seedData.tasks,
  };
}

export function makeId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatMoney(amount: number, currency: Currency) {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount) + " $";
  }
  return new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(amount).replace(/,/g, " ") + " so‘m";
}

export function shortMoney(amount: number) {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} mlrd`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} mln`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)} ming`;
  return `${amount}`;
}

export function formatTaskDate(value: string) {
  if (!value) return "Muddat yo‘q";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function dateKey(value: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value.slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
