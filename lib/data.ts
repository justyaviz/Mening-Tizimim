export type ProjectStatus = "active" | "paused" | "done" | "lead";
export type ClientStatus = "active" | "lead" | "inactive";
export type ContractStatus = "active" | "ending" | "draft" | "completed";
export type TransactionType = "income" | "expense";
export type Currency = "UZS" | "USD";
export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type PartnerStatus = "active" | "available" | "paused";
export type LessonType = "mistake" | "lesson" | "win";
export type GoalStatus = "planned" | "active" | "done" | "paused";
export type InteractionType = "note" | "call" | "meeting" | "message" | "payment";
export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "overdue" | "cancelled";

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

export type Invoice = {
  id: string;
  number: string;
  title: string;
  client: string;
  project: string;
  contractId: string;
  status: InvoiceStatus;
  amount: number;
  paidAmount: number;
  currency: Currency;
  issueDate: string;
  dueDate: string;
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

export type Partner = {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  telegram: string;
  rate: number;
  currency: Currency;
  rateType: "project" | "monthly" | "day";
  status: PartnerStatus;
  projects: string;
  note: string;
};

export type WorkLog = {
  id: string;
  date: string;
  title: string;
  project: string;
  category: string;
  durationMinutes: number;
  result: string;
  note: string;
};

export type Lesson = {
  id: string;
  date: string;
  title: string;
  project: string;
  type: LessonType;
  situation: string;
  lesson: string;
  action: string;
};

export type Service = {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  currency: Currency;
  unit: "project" | "monthly" | "hour";
  deliveryDays: number;
  costEstimate: number;
  active: boolean;
  note: string;
};

export type Goal = {
  id: string;
  title: string;
  category: string;
  status: GoalStatus;
  targetDate: string;
  progress: number;
  metric: string;
  targetValue: number;
  currentValue: number;
  note: string;
};


export type ClientInteraction = {
  id: string;
  clientId: string;
  clientName: string;
  type: InteractionType;
  date: string;
  title: string;
  summary: string;
  project: string;
  nextAction: string;
};

export type AppData = {
  projects: Project[];
  clients: Client[];
  contracts: Contract[];
  transactions: Transaction[];
  invoices: Invoice[];
  tasks: Task[];
  partners: Partner[];
  workLogs: WorkLog[];
  lessons: Lesson[];
  services: Service[];
  goals: Goal[];
  interactions: ClientInteraction[];
};

export const seedData: AppData = {
  projects: [
    { id: "p-start", name: "Start Education", service: "SMM + Target", client: "Start Education", status: "active", progress: 76, amount: 7000000, currency: "UZS", deadline: "2026-08-31", nextAction: "Kontent rejasi va target optimizatsiyasi", notes: "Oylik marketing va SMM loyiha." },
    { id: "p-aloo", name: "aloo", service: "Marketing + SMM", client: "aloo", status: "active", progress: 64, amount: 4000000, currency: "UZS", deadline: "2026-08-31", nextAction: "Haftalik hisobot va yangi aksiyalar", notes: "Marketing, kontent va reklama jarayonlari." },
    { id: "p-web-01", name: "Web loyiha #01", service: "Website Development", client: "New client", status: "active", progress: 42, amount: 900, currency: "USD", deadline: "2026-08-28", nextAction: "UI bosh sahifani tasdiqlash", notes: "Korporativ web loyiha." },
    { id: "p-brand", name: "Personal Brand", service: "Brandface + Content", client: "Shaxsiy", status: "active", progress: 31, amount: 0, currency: "UZS", deadline: "2026-09-15", nextAction: "Avgust kontent seriyasini yakunlash", notes: "Shaxsiy brendni o'stirish." },
  ],
  clients: [
    { id: "c-start", name: "Start Education", company: "Start Education", role: "SMM mijoz", phone: "", telegram: "", instagram: "@starteducation", status: "active", source: "Existing client", note: "SMM va target loyihasi." },
    { id: "c-aloo", name: "aloo", company: "aloo", role: "Marketing loyiha", phone: "", telegram: "", instagram: "@aloouz", status: "active", source: "Existing client", note: "Marketing va SMM." },
    { id: "c-new", name: "New client", company: "Web Project", role: "Web mijoz", phone: "", telegram: "", instagram: "", status: "active", source: "Referral", note: "Website development." },
  ],
  contracts: [
    { id: "ct-smm", title: "SMM xizmat shartnomasi", client: "Volidam Patir", project: "SMM loyiha", status: "ending", amount: 1200, currency: "USD", billing: "monthly", startDate: "2026-08-01", endDate: "2026-08-25", paymentDay: 1, note: "Muddatni uzaytirish bo'yicha kelishish kerak." },
    { id: "ct-web", title: "Web development", client: "New client", project: "Web loyiha #01", status: "active", amount: 900, currency: "USD", billing: "one_time", startDate: "2026-08-10", endDate: "2026-09-01", paymentDay: 1, note: "Qoldiq to'lov yakunda." },
  ],
  transactions: [
    { id: "t1", type: "income", title: "SMM oylik to'lovi", category: "SMM", project: "Start Education", amount: 7000000, currency: "UZS", date: "2026-08-05", note: "Avgust oyi." },
    { id: "t2", type: "income", title: "Marketing oylik to'lovi", category: "Marketing", project: "aloo", amount: 4000000, currency: "UZS", date: "2026-08-07", note: "Avgust oyi." },
    { id: "t3", type: "expense", title: "Reklama va xizmat xarajati", category: "Ads / Tools", project: "General", amount: 1650000, currency: "UZS", date: "2026-08-12", note: "Ish jarayoni xarajatlari." },
    { id: "t4", type: "expense", title: "Freelancer to'lovi", category: "Team", project: "SMM loyiha", amount: 900000, currency: "UZS", date: "2026-08-14", note: "Qo'shimcha xizmat." },
  ],
  invoices: [
    { id: "inv-start-aug", number: "MT-2026-001", title: "Avgust SMM + Target", client: "Start Education", project: "Start Education", contractId: "", status: "paid", amount: 7000000, paidAmount: 7000000, currency: "UZS", issueDate: "2026-08-01", dueDate: "2026-08-05", note: "Avgust oyi to‘lovi." },
    { id: "inv-aloo-aug", number: "MT-2026-002", title: "Avgust Marketing + SMM", client: "aloo", project: "aloo", contractId: "", status: "paid", amount: 4000000, paidAmount: 4000000, currency: "UZS", issueDate: "2026-08-01", dueDate: "2026-08-07", note: "Avgust oyi to‘lovi." },
    { id: "inv-web-01", number: "MT-2026-003", title: "Web development milestone", client: "New client", project: "Web loyiha #01", contractId: "ct-web", status: "partial", amount: 900, paidAmount: 300, currency: "USD", issueDate: "2026-08-10", dueDate: "2026-09-01", note: "300$ avans qabul qilingan, qoldiq loyiha yakunida." },
    { id: "inv-volidam-aug", number: "MT-2026-004", title: "Avgust SMM xizmati", client: "Volidam Patir", project: "SMM loyiha", contractId: "ct-smm", status: "sent", amount: 1200, paidAmount: 0, currency: "USD", issueDate: "2026-08-01", dueDate: "2026-08-25", note: "Oylik SMM to‘lovi." },
  ],
  tasks: [
    { id: "task-1", title: "Start Education kontent va target rejasini tekshirish", project: "Start Education", status: "todo", priority: "high", dueAt: "2026-08-17T17:00", reminderAt: "2026-08-17T16:30", description: "Bugungi kampaniyalar va kontent chiqishlarini yakuniy tekshirish.", createdAt: "2026-08-17T09:00:00" },
    { id: "task-2", title: "Web loyiha bosh sahifasini yakunlash", project: "Web loyiha #01", status: "doing", priority: "high", dueAt: "2026-08-17T19:00", reminderAt: "2026-08-17T18:30", description: "Desktop va mobile holatlarini tekshirib mijozga preview yuborish.", createdAt: "2026-08-16T18:00:00" },
    { id: "task-3", title: "Kunlik xarajatlarni Moliya bo‘limiga kiritish", project: "General", status: "todo", priority: "medium", dueAt: "2026-08-17T21:00", reminderAt: "2026-08-17T20:30", description: "Bugungi reklama, transport va servis xarajatlarini yozish.", createdAt: "2026-08-17T10:00:00" },
    { id: "task-4", title: "aloo haftalik hisobotini tayyorlash", project: "aloo", status: "todo", priority: "medium", dueAt: "2026-08-18T14:00", reminderAt: "2026-08-18T12:00", description: "Kontent va reklama natijalarini birlashtirish.", createdAt: "2026-08-17T10:30:00" },
  ],
  partners: [
    { id: "partner-1", name: "Mobilograf", specialty: "Video / Mobile content", phone: "", telegram: "@mobilograf", rate: 900000, currency: "UZS", rateType: "project", status: "active", projects: "aloo, Start Education", note: "Reels va reklama videolari uchun." },
    { id: "partner-2", name: "Freelance developer", specialty: "Frontend / Next.js", phone: "", telegram: "@developer", rate: 250, currency: "USD", rateType: "project", status: "available", projects: "Web loyiha #01", note: "Web loyihalarda qo‘shimcha yordam." },
  ],
  workLogs: [
    { id: "work-1", date: "2026-08-17", title: "Start Education target kampaniyalarini optimizatsiya qildim", project: "Start Education", category: "Target", durationMinutes: 80, result: "Kampaniyalar qayta segmentlandi va creative testlar ajratildi.", note: "CPL ni ertaga solishtirish." },
    { id: "work-2", date: "2026-08-17", title: "Mening Tizimim v0.3 ni yakunladim", project: "Mening Tizimim", category: "Web / IT", durationMinutes: 150, result: "Supabase auth, cloud sync va task reminder tayyor.", note: "v0.4 da professional memory modullarini qo‘shish." },
    { id: "work-3", date: "2026-08-16", title: "aloo haftalik aksiyalar dizaynini ko‘rib chiqdim", project: "aloo", category: "Marketing", durationMinutes: 55, result: "Kontent yo‘nalishi va vizual hooklar tasdiqlandi.", note: "" },
  ],
  lessons: [
    { id: "lesson-1", date: "2026-08-10", title: "Avanssiz ish boshlamaslik", project: "Web loyiha #01", type: "lesson", situation: "Mijoz bilan scope to‘liq yopilmasdan ish boshlangan.", lesson: "Har yangi bir martalik loyihada scope + deadline + kamida 50% avans yozma tasdiqlanadi.", action: "Web proposal template ichiga payment milestone qo‘shish." },
    { id: "lesson-2", date: "2026-08-14", title: "Creative testni alohida budget bilan boshlash", project: "Start Education", type: "mistake", situation: "Bir nechta creative bir xil budgetda aralash test qilindi.", lesson: "Creative performance ni toza solishtirish uchun alohida ad set test kerak.", action: "Keyingi kampaniyada 3 creative × alohida test." },
    { id: "lesson-3", date: "2026-08-16", title: "Tizimlashtirish vaqtni tejaydi", project: "Mening Tizimim", type: "win", situation: "Loyiha, task va moliya ma’lumotlari bir joyga yig‘ila boshladi.", lesson: "Ma’lumotni ish jarayonida kiritish oy oxirida hisobot qilishni osonlashtiradi.", action: "Har kun yakunida 5 daqiqalik work log." },
  ],
  services: [
    { id: "service-1", name: "SMM boshqaruvi", category: "Marketing", basePrice: 900, currency: "USD", unit: "monthly", deliveryDays: 30, costEstimate: 250, active: true, note: "Strategiya, kontent boshqaruvi, hisobot." },
    { id: "service-2", name: "Target reklama", category: "Performance", basePrice: 400, currency: "USD", unit: "monthly", deliveryDays: 30, costEstimate: 80, active: true, note: "Setup, monitoring va optimizatsiya. Ad spend alohida." },
    { id: "service-3", name: "Landing page", category: "Web / IT", basePrice: 700, currency: "USD", unit: "project", deliveryDays: 10, costEstimate: 150, active: true, note: "Design + development + deploy." },
    { id: "service-4", name: "Brandface / content shoot", category: "Creative", basePrice: 2500000, currency: "UZS", unit: "project", deliveryDays: 2, costEstimate: 700000, active: true, note: "Kadrda ishtirok + kontent paketi." },
  ],
  goals: [
    { id: "goal-1", title: "Oylik daromadni oshirish", category: "Finance", status: "active", targetDate: "2026-12-31", progress: 48, metric: "USD ekvivalent", targetValue: 5000, currentValue: 2400, note: "Premium SMM va web loyihalar ulushini oshirish." },
    { id: "goal-2", title: "Shaxsiy brendda muntazam kontent", category: "Personal Brand", status: "active", targetDate: "2026-09-30", progress: 35, metric: "Kontent soni", targetValue: 30, currentValue: 11, note: "Haftasiga kamida 3 ta kuchli kontent." },
  ],

  interactions: [
    { id: "interaction-1", clientId: "c-start", clientName: "Start Education", type: "meeting", date: "2026-08-15T14:30", title: "Avgust kampaniyalari bo‘yicha kelishuv", summary: "Kontent, target va mijoz intervyulari bo‘yicha ustuvor yo‘nalishlar kelishildi.", project: "Start Education", nextAction: "Haftalik natijalarni yuborish." },
    { id: "interaction-2", clientId: "c-start", clientName: "Start Education", type: "message", date: "2026-08-17T10:20", title: "Reels materiali tasdiqlandi", summary: "Yangi mijoz fikri videosi tasdiqlandi va joylash vaqti kelishildi.", project: "Start Education", nextAction: "Reelsni joylash va targetga ulash." },
    { id: "interaction-3", clientId: "c-aloo", clientName: "aloo", type: "call", date: "2026-08-16T18:00", title: "Haftalik marketing call", summary: "Aksiya vizuallari va keyingi haftadagi kontent ustuvorliklari ko‘rib chiqildi.", project: "aloo", nextAction: "Haftalik hisobotni tayyorlash." },
    { id: "interaction-4", clientId: "c-new", clientName: "New client", type: "payment", date: "2026-08-10T12:00", title: "Web loyiha avansi", summary: "Website development uchun boshlang‘ich to‘lov va scope tasdiqlandi.", project: "Web loyiha #01", nextAction: "Bosh sahifa previewini yuborish." },
  ],
};

export function normalizeData(raw: Partial<AppData> | null | undefined): AppData {
  const safe = raw && typeof raw === "object" ? raw : {};
  return {
    projects: Array.isArray(safe.projects) ? safe.projects : seedData.projects,
    clients: Array.isArray(safe.clients) ? safe.clients : seedData.clients,
    contracts: Array.isArray(safe.contracts) ? safe.contracts : seedData.contracts,
    transactions: Array.isArray(safe.transactions) ? safe.transactions : seedData.transactions,
    invoices: Array.isArray(safe.invoices) ? safe.invoices : [],
    tasks: Array.isArray(safe.tasks) ? safe.tasks : seedData.tasks,
    partners: Array.isArray(safe.partners) ? safe.partners : seedData.partners,
    workLogs: Array.isArray(safe.workLogs) ? safe.workLogs : seedData.workLogs,
    lessons: Array.isArray(safe.lessons) ? safe.lessons : seedData.lessons,
    services: Array.isArray(safe.services) ? safe.services : seedData.services,
    goals: Array.isArray(safe.goals) ? safe.goals : seedData.goals,
    interactions: Array.isArray(safe.interactions) ? safe.interactions : seedData.interactions,
  };
}

export function invoiceOutstanding(invoice: Invoice) {
  return Math.max(0, invoice.amount - Math.max(0, invoice.paidAmount || 0));
}

export function effectiveInvoiceStatus(invoice: Invoice, today = new Date()): InvoiceStatus {
  if (invoice.status === "cancelled" || invoice.status === "draft") return invoice.status;
  const outstanding = invoiceOutstanding(invoice);
  if (outstanding <= 0) return "paid";
  const paid = Math.max(0, invoice.paidAmount || 0);
  const due = invoice.dueDate ? new Date(`${invoice.dueDate}T23:59:59`) : null;
  if (due && !Number.isNaN(due.getTime()) && due.getTime() < today.getTime()) return "overdue";
  if (paid > 0) return "partial";
  return invoice.status === "paid" ? "sent" : invoice.status;
}

export function makeId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatMoney(amount: number, currency: Currency) {
  if (currency === "USD") return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount) + " $";
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
  return new Intl.DateTimeFormat("uz-UZ", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
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

export function minutesLabel(minutes: number) {
  if (!minutes) return "0 daq";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} daq`;
  return m ? `${h} soat ${m} daq` : `${h} soat`;
}
