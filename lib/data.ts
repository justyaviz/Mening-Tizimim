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
  clientId?: string;
  business?: string;
  number?: string;
  city?: string;
  contractDate?: string;
  executorName?: string;
  executorStatus?: string;
  customerLegalName?: string;
  customerTin?: string;
  customerRepresentative?: string;
  customerRole?: string;
  customerBasis?: string;
  customerAddress?: string;
  customerBank?: string;
  customerMfo?: string;
  customerAccount?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerResponsible?: string;
  executorTin?: string;
  executorAddress?: string;
  executorBank?: string;
  executorAccount?: string;
  executorPhone?: string;
  executorEmail?: string;
  services?: string[];
  revisionLimit?: number;
  terminationDays?: number;
  contentReels?: number;
  contentPosts?: number;
  storiesPerWeek?: number;
  adCreatives?: number;
  extraPosts?: number;
  shootingDaysPerMonth?: number;
  shootingDays?: string;
  shootingTimeFrom?: string;
  shootingTimeTo?: string;
  shootingDuration?: string;
  shootingLocation?: string;
  workDays?: string[];
  workTimeFrom?: string;
  workTimeTo?: string;
  dayOff?: string;
  urgentContact?: string;
  adIncluded?: boolean;
  adStartDate?: string;
  adDuration?: string;
  adBudget?: string;
  adBudgetPayer?: string;
  adGoal?: string;
  exclusive?: boolean;
  exclusiveDirection?: string;
  exclusiveArea?: string;
  exclusiveRestriction?: string;
  specialTasks?: string[];
  extraAgreements?: string;
  paymentTerms?: string;
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

export const emptyData: AppData = {
  projects: [],
  clients: [],
  contracts: [],
  transactions: [],
  invoices: [],
  tasks: [],
  partners: [],
  workLogs: [],
  lessons: [],
  services: [],
  goals: [],
  interactions: [],
};

export function normalizeData(raw: Partial<AppData> | null | undefined): AppData {
  const safe = raw && typeof raw === "object" ? raw : {};
  return {
    projects: Array.isArray(safe.projects) ? safe.projects : [],
    clients: Array.isArray(safe.clients) ? safe.clients : [],
    contracts: Array.isArray(safe.contracts) ? safe.contracts : [],
    transactions: Array.isArray(safe.transactions) ? safe.transactions : [],
    invoices: Array.isArray(safe.invoices) ? safe.invoices : [],
    tasks: Array.isArray(safe.tasks) ? safe.tasks : [],
    partners: Array.isArray(safe.partners) ? safe.partners : [],
    workLogs: Array.isArray(safe.workLogs) ? safe.workLogs : [],
    lessons: Array.isArray(safe.lessons) ? safe.lessons : [],
    services: Array.isArray(safe.services) ? safe.services : [],
    goals: Array.isArray(safe.goals) ? safe.goals : [],
    interactions: Array.isArray(safe.interactions) ? safe.interactions : [],
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
