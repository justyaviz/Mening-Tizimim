"use client";

import { ArrowLeft, Check, Eye, FileDown, FilePlus2, RotateCcw, Save } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useAppData } from "@/components/data-provider";
import { formatMoney, makeId, type Contract, type Currency } from "@/lib/data";

const SERVICE_OPTIONS = [
  "SMM boshqaruv",
  "Kontent strategiya",
  "Mobilografiya",
  "Video montaj",
  "Grafik dizayn",
  "Copywriting",
  "Stories yuritish",
  "Kontent joylashtirish",
  "Target reklama",
  "Oylik hisobot",
];

const WEEK_DAYS = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];
const TOTAL_PAGES = 8;

function emptyContract(): Contract {
  return {
    id: makeId("contract"),
    title: "Marketing xizmatlari bo‘yicha hamkorlik shartnomasi",
    client: "",
    project: "",
    clientId: "",
    business: "",
    number: "",
    city: "Toshkent shahri",
    contractDate: new Date().toISOString().slice(0, 10),
    executorName: "",
    executorStatus: "O‘zini o‘zi band qilgan shaxs",
    executorTin: "",
    executorAddress: "",
    executorBank: "",
    executorAccount: "",
    executorPhone: "",
    executorEmail: "",
    customerLegalName: "",
    customerTin: "",
    customerRepresentative: "",
    customerRole: "Direktor",
    customerBasis: "ustav asosida",
    customerAddress: "",
    customerBank: "",
    customerMfo: "",
    customerAccount: "",
    customerPhone: "",
    customerEmail: "",
    customerResponsible: "",
    services: ["SMM boshqaruv", "Mobilografiya", "Video montaj", "Target reklama"],
    revisionLimit: 2,
    terminationDays: 15,
    contentReels: 0,
    contentPosts: 0,
    storiesPerWeek: 0,
    adCreatives: 0,
    extraPosts: 0,
    shootingDaysPerMonth: 0,
    shootingDays: "",
    shootingTimeFrom: "",
    shootingTimeTo: "",
    shootingDuration: "",
    shootingLocation: "",
    workDays: ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
    workTimeFrom: "09:00",
    workTimeTo: "19:00",
    dayOff: "Yakshanba",
    urgentContact: "",
    adIncluded: true,
    adStartDate: "",
    adDuration: "",
    adBudget: "",
    adBudgetPayer: "Buyurtmachi",
    adGoal: "Xabarlar / Lead / Sotuv",
    exclusive: false,
    exclusiveDirection: "",
    exclusiveArea: "",
    exclusiveRestriction: "",
    specialTasks: ["", "", "", "", ""],
    extraAgreements: "",
    paymentTerms: "Oy boshida 100% oldindan to‘lov",
    status: "draft",
    amount: 0,
    currency: "UZS",
    billing: "monthly",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    paymentDay: 1,
    note: "",
  };
}

function readableDate(value?: string) {
  if (!value) return "___ __________ 20___-yil";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}-yil`;
}

function blank(value?: string, fallback = "____________________________") {
  return value?.trim() || fallback;
}

function numberOrBlank(value?: number) {
  return value && value > 0 ? String(value) : "______";
}

function PaperBackground() {
  return <img src="/mening-tizimim-letterhead.png" alt="" className="contractPaperBg" />;
}

function buildVerifyUrl(documentId: string, number?: string, contractDate?: string, business?: string) {
  const params = new URLSearchParams({
    doc: documentId,
    number: number || "",
    date: contractDate || "",
    business: business || "",
  });
  const origin = typeof window !== "undefined" ? window.location.origin : "https://meningtizimim.uz";
  return `${origin}/verify?${params.toString()}`;
}

function buildQrUrl(payload: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(payload)}`;
}

function ContractPage({ children, page, contractNo, documentId }: { children: React.ReactNode; page: number; contractNo?: string; documentId: string }) {
  return (
    <article className="contractPaper" data-contract-page={page}>
      <PaperBackground />
      <div className="contractPaperContent">{children}</div>
      <div className="contractFooterMeta">
        <span>Shartnoma № {contractNo || "________"}</span>
        <span>Document ID: {documentId}</span>
        <span>{page}/{TOTAL_PAGES}</span>
      </div>
    </article>
  );
}

function ContractBuilderContent() {
  const { data, addContract, updateContract } = useAppData();
  const params = useSearchParams();
  const editId = params.get("id");
  const [draft, setDraft] = useState<Contract>(emptyContract);
  const [section, setSection] = useState("contract");
  const [previewOnly, setPreviewOnly] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (!editId) return;
    const found = data.contracts.find((item) => item.id === editId);
    if (found) {
      const defaults = emptyContract();
      setDraft({
        ...defaults,
        ...found,
        services: found.services?.length ? found.services : defaults.services,
        workDays: found.workDays?.length ? found.workDays : defaults.workDays,
        specialTasks: found.specialTasks?.length ? [...found.specialTasks, "", "", "", "", ""].slice(0, 5) : defaults.specialTasks,
      });
    }
  }, [editId, data.contracts]);

  const selectedClient = data.clients.find((item) => item.id === draft.clientId) || data.clients.find((item) => item.name === draft.client);
  const progress = useMemo(() => {
    const required = [
      draft.contractDate,
      draft.number,
      draft.city,
      draft.client,
      draft.business,
      draft.executorName,
      draft.customerLegalName,
      draft.startDate,
      draft.endDate,
      draft.amount > 0 ? "yes" : "",
      draft.services?.length ? "yes" : "",
    ];
    return Math.round((required.filter(Boolean).length / required.length) * 100);
  }, [draft]);

  const servicesText = (draft.services?.length ? draft.services : SERVICE_OPTIONS.slice(0, 4)).join(", ");
  const isExisting = data.contracts.some((item) => item.id === draft.id);
  const documentId = useMemo(() => {
    const clean = (draft.number || draft.id).replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase();
    return `MT-CN-${new Date().getFullYear()}-${clean.slice(-16) || "NEW"}`;
  }, [draft.id, draft.number]);
  const verifyUrl = useMemo(() => buildVerifyUrl(documentId, draft.number, draft.contractDate, draft.business), [documentId, draft.number, draft.contractDate, draft.business]);
  const qrUrl = useMemo(() => buildQrUrl(verifyUrl), [verifyUrl]);
  const verificationCode = useMemo(() => documentId.replace(/[^0-9]/g, "").slice(-4) || documentId.slice(-4), [documentId]);

  useEffect(() => {
    let active = true;
    import("qrcode")
      .then(({ default: QRCode }) => QRCode.toDataURL(verifyUrl, { width: 240, margin: 0, errorCorrectionLevel: "M" }))
      .then((url) => { if (active) setQrDataUrl(url); })
      .catch(() => { if (active) setQrDataUrl(""); });
    return () => { active = false; };
  }, [verifyUrl]);

  const has = (name: string) => Boolean(draft.services?.includes(name));

  function patch<K extends keyof Contract>(key: K, value: Contract[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function chooseClient(clientId: string) {
    const client = data.clients.find((item) => item.id === clientId);
    setDraft((prev) => ({
      ...prev,
      clientId,
      client: client?.name || "",
      business: client?.company || prev.business || "",
      customerLegalName: client?.company || prev.customerLegalName || "",
      customerPhone: client?.phone || prev.customerPhone || "",
    }));
  }

  function toggleService(service: string) {
    const current = draft.services || [];
    patch("services", current.includes(service) ? current.filter((item) => item !== service) : [...current, service]);
  }

  function toggleWorkDay(day: string) {
    const current = draft.workDays || [];
    patch("workDays", current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);
  }

  function patchTask(index: number, value: string) {
    const tasks = [...(draft.specialTasks || ["", "", "", "", ""]), "", "", "", "", ""].slice(0, 5);
    tasks[index] = value;
    patch("specialTasks", tasks);
  }

  function saveContract() {
    const prepared: Contract = {
      ...draft,
      title: "Marketing xizmatlari bo‘yicha hamkorlik shartnomasi",
      status: draft.status === "draft" && draft.startDate && draft.endDate ? "active" : draft.status,
    };
    isExisting ? updateContract(prepared) : addContract(prepared);
    setDraft(prepared);
    setSaved(true);
  }

  function reset() {
    if (window.confirm("Kiritilgan ma’lumotlarni tozalaysizmi?")) setDraft(emptyContract());
  }

  function newDocument() {
    setDraft(emptyContract());
    window.history.replaceState({}, "", "/contracts/builder");
    setSaved(false);
  }

  async function wordDownload() {
    const pages = Array.from(document.querySelectorAll<HTMLElement>("[data-contract-page]"));
    const body = pages
      .map((page) => `<div class="page">${page.querySelector(".contractPaperContent")?.innerHTML || ""}</div>`)
      .join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:25mm 18mm 20mm}body{font-family:'Times New Roman',serif;font-size:11pt;line-height:1.45;color:#111}.page{page-break-after:always}.page:last-child{page-break-after:auto}h1{text-align:center;font-size:14pt}h2{text-align:center;font-size:11.5pt;margin-top:18px}.contractSubtitle{text-align:center;font-size:9.5pt}.contractLead,.legalBody p{text-align:justify}.appendixTable{width:100%;border-collapse:collapse}.appendixRow{display:flex;border-bottom:1px solid #ddd;padding:5px 0}.appendixRow b{width:42%}.signatureGrid{display:grid;grid-template-columns:1fr 1fr;gap:30px}.documentVerification{margin-top:18px;border:1px solid #d8e4ef;background:#f7fbff;padding:14px;display:flex;justify-content:space-between;gap:16px;align-items:center}.documentVerification img{width:110px;height:110px;object-fit:contain}.documentVerification b{display:block;margin-bottom:6px}.verifyCodeBig{font-size:28px;line-height:1;font-weight:700;color:#274762}.verifyUrl{font-size:8pt;color:#4d6478;word-break:break-all}</style></head><body>${body}</body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Marketing-shartnoma-${draft.number || "yangi"}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function pdfDownload() {
    const pages = Array.from(document.querySelectorAll<HTMLElement>("[data-contract-page]"));
    if (!pages.length || pdfBusy) return;

    setPdfBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      if (document.fonts?.ready) await document.fonts.ready;

      const imageNodes = pages.flatMap((page) => Array.from(page.querySelectorAll<HTMLImageElement>("img")));
      await Promise.all(imageNodes.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          setTimeout(done, 2500);
        });
      }));

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });

      for (let index = 0; index < pages.length; index += 1) {
        const page = pages[index];
        const oldShadow = page.style.boxShadow;
        const oldTransform = page.style.transform;
        page.style.boxShadow = "none";
        page.style.transform = "none";

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: "#ffffff",
          imageTimeout: 5000,
          windowWidth: Math.max(document.documentElement.clientWidth, 1400),
        });

        page.style.boxShadow = oldShadow;
        page.style.transform = oldTransform;

        const imgData = canvas.toDataURL("image/jpeg", 0.96);
        if (index > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      }

      const safeNo = (draft.number || documentId).replace(/[^a-zA-Z0-9_-]+/g, "-");
      pdf.save(`Mening-Tizimim-Shartnoma-${safeNo}.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
      window.alert("PDF yaratishda xatolik yuz berdi. Sahifani yangilab qayta urinib ko‘ring.");
    } finally {
      setPdfBusy(false);
    }
  }

  const nav = [
    { id: "contract", n: "01", label: "Shartnoma", count: "6/6" },
    { id: "executor", n: "02", label: "Bajaruvchi", count: draft.executorName ? "7/7" : "1/7" },
    { id: "customer", n: "03", label: "Buyurtmachi", count: draft.customerLegalName ? "10/10" : "1/10" },
    { id: "services", n: "04", label: "Xizmatlar", count: `${draft.services?.length || 0}/10` },
    { id: "project", n: "05", label: "Loyiha shartlari", count: "Maxsus" },
    { id: "requisites", n: "06", label: "Rekvizitlar", count: "2-ilova" },
  ];

  return (
    <div className={`contractBuilderPage ${previewOnly ? "previewOnly" : ""}`}>
      <div className="contractBuilderTopbar">
        <div className="builderCrumb"><Link href="/contracts"><ArrowLeft size={16} /> Shartnomalar</Link><span>/</span><b>Marketing shartnomasi</b></div>
        <div className="builderActions">
          <button onClick={reset}><RotateCcw size={16} /> Qayta tiklash</button>
          <button onClick={newDocument}><FilePlus2 size={16} /> Yangi hujjat</button>
          <button className="primary" onClick={saveContract}><Save size={16} /> {saved ? "Saqlandi" : "Saqlash"}</button>
          <button onClick={wordDownload}><FileDown size={16} /> Word yuklash</button>
          <button onClick={pdfDownload} disabled={pdfBusy}><FileDown size={16} /> {pdfBusy ? "PDF tayyorlanmoqda..." : "PDF yuklash"}</button>
          <button onClick={() => setPreviewOnly((v) => !v)}><Eye size={16} /> {previewOnly ? "Tahrirlash" : "Ko‘rinish"}</button>
        </div>
      </div>

      <div className="contractBuilderShell">
        {!previewOnly && (
          <aside className="contractSections">
            <div className="contractSectionsHead"><b>BO‘LIMLAR</b><span>{progress}% tayyor</span></div>
            {nav.map((item) => (
              <button key={item.id} className={section === item.id ? "active" : ""} onClick={() => setSection(item.id)}>
                <span className="sectionNo">{item.n}</span><strong>{item.label}</strong><em>{item.count}</em>
              </button>
            ))}
          </aside>
        )}

        {!previewOnly && (
          <main className="contractFormPane">
            <section className="builderHero">
              <div><span>MENING TIZIMIM • CONTRACT BUILDER v0.8</span><h1>Professional marketing shartnomasi</h1><p>Asosiy shartnoma + 1-ilova loyiha shartlari + 2-ilova rekvizitlar.</p></div>
              <div className="progressRing"><b>{progress}%</b><small>tayyor</small></div>
            </section>

            {section === "contract" && (
              <BuilderCard title="Shartnoma va loyiha">
                <label className="builderField"><span>Shartnoma tuzilgan sana *</span><input type="date" value={draft.contractDate || ""} onChange={(e) => patch("contractDate", e.target.value)} /></label>
                <label className="builderField"><span>Shartnoma raqami *</span><input placeholder="Masalan: MT-01/2026" value={draft.number || ""} onChange={(e) => patch("number", e.target.value)} /></label>
                <label className="builderField"><span>Shartnoma tuzilgan joy *</span><input placeholder="Masalan: Toshkent shahri" value={draft.city || ""} onChange={(e) => patch("city", e.target.value)} /></label>
                <label className="builderField"><span>Mijozga biriktirish *</span><select value={draft.clientId || ""} onChange={(e) => chooseClient(e.target.value)}><option value="">Mijozni tanlang</option>{data.clients.map((client) => <option key={client.id} value={client.id}>{client.name}{client.company ? ` — ${client.company}` : ""}</option>)}</select></label>
                <label className="builderField"><span>Biznes / brend *</span><input placeholder="Masalan: aloo" value={draft.business || ""} onChange={(e) => patch("business", e.target.value)} /></label>
                <label className="builderField"><span>Loyiha</span><select value={draft.project} onChange={(e) => patch("project", e.target.value)}><option value="">Loyiha tanlanmagan</option>{data.projects.filter((p) => !draft.client || p.client === draft.client || p.name === draft.business).map((project) => <option key={project.id} value={project.name}>{project.name}</option>)}</select></label>
              </BuilderCard>
            )}

            {section === "executor" && (
              <>
                <BuilderCard title="Bajaruvchi">
                  <label className="builderField"><span>Huquqiy maqomi *</span><select value={draft.executorStatus || ""} onChange={(e) => patch("executorStatus", e.target.value)}><option>O‘zini o‘zi band qilgan shaxs</option><option>Yakka tartibdagi tadbirkor</option><option>Yuridik shaxs</option><option>Jismoniy shaxs</option></select></label>
                  <label className="builderField"><span>F.I.Sh. / tashkilot nomi *</span><input value={draft.executorName || ""} onChange={(e) => patch("executorName", e.target.value)} /></label>
                  <label className="builderField"><span>STIR / JShShIR</span><input value={draft.executorTin || ""} onChange={(e) => patch("executorTin", e.target.value)} /></label>
                  <label className="builderField"><span>Manzil</span><input value={draft.executorAddress || ""} onChange={(e) => patch("executorAddress", e.target.value)} /></label>
                  <label className="builderField"><span>Telefon</span><input value={draft.executorPhone || ""} onChange={(e) => patch("executorPhone", e.target.value)} /></label>
                  <label className="builderField"><span>E-mail</span><input value={draft.executorEmail || ""} onChange={(e) => patch("executorEmail", e.target.value)} /></label>
                </BuilderCard>
                <BuilderCard title="Bajaruvchi bank / to‘lov rekvizitlari">
                  <label className="builderField"><span>Bank</span><input value={draft.executorBank || ""} onChange={(e) => patch("executorBank", e.target.value)} /></label>
                  <label className="builderField"><span>Hisob raqami / karta rekvizitlari</span><input value={draft.executorAccount || ""} onChange={(e) => patch("executorAccount", e.target.value)} /></label>
                </BuilderCard>
              </>
            )}

            {section === "customer" && (
              <BuilderCard title="Buyurtmachi">
                <label className="builderField"><span>To‘liq yuridik nomi *</span><input value={draft.customerLegalName || ""} onChange={(e) => patch("customerLegalName", e.target.value)} /></label>
                <label className="builderField"><span>STIR</span><input value={draft.customerTin || ""} onChange={(e) => patch("customerTin", e.target.value)} /></label>
                <label className="builderField"><span>Rahbar / vakil F.I.Sh.</span><input value={draft.customerRepresentative || ""} onChange={(e) => patch("customerRepresentative", e.target.value)} /></label>
                <label className="builderField"><span>Vakil lavozimi</span><input value={draft.customerRole || ""} onChange={(e) => patch("customerRole", e.target.value)} /></label>
                <label className="builderField"><span>Faoliyat yuritish / vakillik asosi</span><input placeholder="Masalan: ustav asosida" value={draft.customerBasis || ""} onChange={(e) => patch("customerBasis", e.target.value)} /></label>
                <label className="builderField"><span>Yuridik manzil</span><input value={draft.customerAddress || ""} onChange={(e) => patch("customerAddress", e.target.value)} /></label>
                <label className="builderField"><span>Telefon</span><input value={draft.customerPhone || ""} onChange={(e) => patch("customerPhone", e.target.value)} /></label>
                <label className="builderField"><span>E-mail</span><input value={draft.customerEmail || ""} onChange={(e) => patch("customerEmail", e.target.value)} /></label>
                <label className="builderField"><span>Mas’ul shaxs</span><input value={draft.customerResponsible || ""} onChange={(e) => patch("customerResponsible", e.target.value)} /></label>
                <label className="builderField"><span>Kontakt mijoz</span><input disabled value={selectedClient ? `${selectedClient.name}${selectedClient.phone ? ` · ${selectedClient.phone}` : ""}` : "Mijoz tanlanmagan"} /></label>
              </BuilderCard>
            )}

            {section === "services" && (
              <>
                <BuilderCard title="Marketing xizmatlari">
                  <p className="builderHint">Asosiy hujjat nomi doim <b>“Marketing xizmatlari ko‘rsatish bo‘yicha hamkorlik shartnomasi”</b>. Tanlangan xizmatlar qavs ichida ko‘rsatiladi.</p>
                  <div className="serviceChecks">{SERVICE_OPTIONS.map((service) => <button type="button" key={service} className={draft.services?.includes(service) ? "checked" : ""} onClick={() => toggleService(service)}><span>{draft.services?.includes(service) && <Check size={14} />}</span>{service}</button>)}</div>
                </BuilderCard>
                <BuilderCard title="Kontent hajmi">
                  <div className="builderTwoCol"><label className="builderField"><span>Oyiga Reels/video</span><input type="number" min="0" value={draft.contentReels || ""} onChange={(e) => patch("contentReels", Number(e.target.value))} /></label><label className="builderField"><span>Oyiga post/karusel</span><input type="number" min="0" value={draft.contentPosts || ""} onChange={(e) => patch("contentPosts", Number(e.target.value))} /></label></div>
                  <div className="builderTwoCol"><label className="builderField"><span>Haftasiga Stories</span><input type="number" min="0" value={draft.storiesPerWeek || ""} onChange={(e) => patch("storiesPerWeek", Number(e.target.value))} /></label><label className="builderField"><span>Oyiga reklama kreativi</span><input type="number" min="0" value={draft.adCreatives || ""} onChange={(e) => patch("adCreatives", Number(e.target.value))} /></label></div>
                  <label className="builderField"><span>Oyiga qo‘shimcha post</span><input type="number" min="0" value={draft.extraPosts || ""} onChange={(e) => patch("extraPosts", Number(e.target.value))} /></label>
                </BuilderCard>
              </>
            )}

            {section === "project" && (
              <>
                <BuilderCard title="Muddati va to‘lov">
                  <div className="builderTwoCol"><label className="builderField"><span>Boshlanish *</span><input type="date" value={draft.startDate} onChange={(e) => patch("startDate", e.target.value)} /></label><label className="builderField"><span>Tugash *</span><input type="date" value={draft.endDate} onChange={(e) => patch("endDate", e.target.value)} /></label></div>
                  <div className="builderTwoCol"><label className="builderField"><span>Oylik xizmat haqi *</span><input type="number" min="0" value={draft.amount || ""} onChange={(e) => patch("amount", Number(e.target.value))} /></label><label className="builderField"><span>Valyuta</span><select value={draft.currency} onChange={(e) => patch("currency", e.target.value as Currency)}><option value="UZS">UZS</option><option value="USD">USD</option></select></label></div>
                  <label className="builderField"><span>To‘lov shakli</span><select value={draft.paymentTerms || ""} onChange={(e) => patch("paymentTerms", e.target.value)}><option>Oy boshida 100% oldindan to‘lov</option><option>Oy yakunida 100% to‘lov</option><option>Qisman oldindan va qisman oy yakunida</option><option>Boshqa kelishilgan tartib</option></select></label>
                  <div className="builderTwoCol"><label className="builderField"><span>To‘lov kuni</span><input type="number" min="1" max="31" value={draft.paymentDay} onChange={(e) => patch("paymentDay", Number(e.target.value))} /></label><label className="builderField"><span>Tuzatishlar soni</span><input type="number" min="0" value={draft.revisionLimit || 0} onChange={(e) => patch("revisionLimit", Number(e.target.value))} /></label></div>
                  <label className="builderField"><span>Bekor qilish haqida oldindan xabar</span><div className="inputSuffix"><input type="number" min="1" value={draft.terminationDays || 15} onChange={(e) => patch("terminationDays", Number(e.target.value))} /><span>kalendar kun</span></div></label>
                </BuilderCard>

                <BuilderCard title="Syomka va ish tartibi">
                  <div className="builderTwoCol"><label className="builderField"><span>Oyiga syomka kunlari</span><input type="number" min="0" value={draft.shootingDaysPerMonth || ""} onChange={(e) => patch("shootingDaysPerMonth", Number(e.target.value))} /></label><label className="builderField"><span>Asosiy syomka kunlari</span><input placeholder="Masalan: Seshanba, Juma" value={draft.shootingDays || ""} onChange={(e) => patch("shootingDays", e.target.value)} /></label></div>
                  <div className="builderTwoCol"><label className="builderField"><span>Syomka boshlanishi</span><input type="time" value={draft.shootingTimeFrom || ""} onChange={(e) => patch("shootingTimeFrom", e.target.value)} /></label><label className="builderField"><span>Syomka tugashi</span><input type="time" value={draft.shootingTimeTo || ""} onChange={(e) => patch("shootingTimeTo", e.target.value)} /></label></div>
                  <label className="builderField"><span>Bir syomka davomiyligi</span><input placeholder="Masalan: 3-4 soat" value={draft.shootingDuration || ""} onChange={(e) => patch("shootingDuration", e.target.value)} /></label>
                  <label className="builderField"><span>Syomka lokatsiyasi</span><input value={draft.shootingLocation || ""} onChange={(e) => patch("shootingLocation", e.target.value)} /></label>
                  <span className="builderFieldLabel">Bajaruvchining ish kunlari</span>
                  <div className="dayChecks">{WEEK_DAYS.map((day) => <button type="button" key={day} className={draft.workDays?.includes(day) ? "checked" : ""} onClick={() => toggleWorkDay(day)}>{draft.workDays?.includes(day) ? "[X]" : "[ ]"} {day}</button>)}</div>
                  <div className="builderTwoCol"><label className="builderField"><span>Ish vaqti</span><input type="time" value={draft.workTimeFrom || ""} onChange={(e) => patch("workTimeFrom", e.target.value)} /></label><label className="builderField"><span>gacha</span><input type="time" value={draft.workTimeTo || ""} onChange={(e) => patch("workTimeTo", e.target.value)} /></label></div>
                  <div className="builderTwoCol"><label className="builderField"><span>Dam olish kuni</span><input value={draft.dayOff || ""} onChange={(e) => patch("dayOff", e.target.value)} /></label><label className="builderField"><span>Tezkor aloqa uchun mas’ul shaxs</span><input value={draft.urgentContact || ""} onChange={(e) => patch("urgentContact", e.target.value)} /></label></div>
                </BuilderCard>

                <BuilderCard title="Target reklama va eksklyuzivlik">
                  <label className="builderToggle"><input type="checkbox" checked={Boolean(draft.adIncluded)} onChange={(e) => patch("adIncluded", e.target.checked)} /><span>Target reklama xizmat paketiga kiradi</span></label>
                  <div className="builderTwoCol"><label className="builderField"><span>Reklama boshlanishi</span><input type="date" value={draft.adStartDate || ""} onChange={(e) => patch("adStartDate", e.target.value)} /></label><label className="builderField"><span>Davomiyligi</span><input value={draft.adDuration || ""} onChange={(e) => patch("adDuration", e.target.value)} /></label></div>
                  <label className="builderField"><span>Oylik reklama budjeti</span><input value={draft.adBudget || ""} onChange={(e) => patch("adBudget", e.target.value)} /></label>
                  <div className="builderTwoCol"><label className="builderField"><span>Budjetni to‘lovchi</span><input value={draft.adBudgetPayer || ""} onChange={(e) => patch("adBudgetPayer", e.target.value)} /></label><label className="builderField"><span>Asosiy reklama maqsadi</span><input value={draft.adGoal || ""} onChange={(e) => patch("adGoal", e.target.value)} /></label></div>
                  <label className="builderToggle"><input type="checkbox" checked={Boolean(draft.exclusive)} onChange={(e) => patch("exclusive", e.target.checked)} /><span>Eksklyuziv hamkorlik</span></label>
                  {draft.exclusive && <><label className="builderField"><span>Eksklyuziv yo‘nalish</span><input value={draft.exclusiveDirection || ""} onChange={(e) => patch("exclusiveDirection", e.target.value)} /></label><label className="builderField"><span>Hudud</span><input value={draft.exclusiveArea || ""} onChange={(e) => patch("exclusiveArea", e.target.value)} /></label><label className="builderField"><span>Qo‘shimcha cheklov</span><input value={draft.exclusiveRestriction || ""} onChange={(e) => patch("exclusiveRestriction", e.target.value)} /></label></>}
                </BuilderCard>

                <BuilderCard title="Maxsus vazifalar va qo‘shimcha kelishuvlar">
                  {(draft.specialTasks || ["", "", "", "", ""]).map((task, index) => <label className="builderField" key={index}><span>Vazifa {index + 1}</span><input value={task} onChange={(e) => patchTask(index, e.target.value)} /></label>)}
                  <label className="builderField"><span>Qo‘shimcha kelishuvlar</span><textarea rows={4} value={draft.extraAgreements || ""} onChange={(e) => patch("extraAgreements", e.target.value)} /></label>
                  <label className="builderField"><span>Ichki izoh</span><textarea rows={3} value={draft.note} onChange={(e) => patch("note", e.target.value)} /></label>
                </BuilderCard>
              </>
            )}

            {section === "requisites" && (
              <>
                <BuilderCard title="Buyurtmachi bank rekvizitlari">
                  <label className="builderField"><span>Bank</span><input value={draft.customerBank || ""} onChange={(e) => patch("customerBank", e.target.value)} /></label>
                  <label className="builderField"><span>MFO</span><input value={draft.customerMfo || ""} onChange={(e) => patch("customerMfo", e.target.value)} /></label>
                  <label className="builderField"><span>Hisob raqami</span><input value={draft.customerAccount || ""} onChange={(e) => patch("customerAccount", e.target.value)} /></label>
                </BuilderCard>
                <BuilderCard title="Hujjat identifikatsiyasi">
                  <div className="docIdCard"><small>Document ID</small><strong>{documentId}</strong><p>Har bir PDF sahifasining footerida shartnoma raqami, Document ID va sahifa raqami chiqadi.</p></div>
                </BuilderCard>
              </>
            )}
          </main>
        )}

        <section className="contractPreviewPane">
          <div className="previewHead"><div><span className="liveDot" /> <b>Jonli ko‘rinish</b></div><small>Times New Roman • A4 • {TOTAL_PAGES} sahifa</small></div>
          <div className="paperStack">
            <ContractPage page={1} contractNo={draft.number} documentId={documentId}>
              <h1>MARKETING XIZMATLARI KO‘RSATISH BO‘YICHA<br />HAMKORLIK SHARTNOMASI</h1>
              <div className="contractSubtitle">({servicesText})</div>
              <div className="contractMeta"><b>{blank(draft.city, "________________ shahri")}</b><b>№ {blank(draft.number, "________")}</b><b>{readableDate(draft.contractDate)}</b></div>
              <p className="contractLead">Bir tomondan, <b>{blank(draft.customerLegalName || draft.business)}</b>{draft.customerTin ? `, STIR: ${draft.customerTin}` : ""}, keyingi o‘rinlarda <b>“Buyurtmachi”</b> deb yuritiluvchi, <b>{blank(draft.customerRepresentative)}</b> nomidan, {blank(draft.customerBasis, "tegishli vakolat asosida")}, ikkinchi tomondan <b>{blank(draft.executorName)}</b>, huquqiy maqomi: <b>{blank(draft.executorStatus)}</b>, keyingi o‘rinlarda <b>“Bajaruvchi”</b> deb yuritiluvchi, birgalikda <b>“Taraflar”</b>, alohida holda esa <b>“Taraf”</b> deb atalib, ushbu Shartnomani quyidagilar haqida tuzdilar.</p>
              <LegalSection n="1" title="SHARTNOMA PREDMETI">
                <p><b>1.1.</b> Bajaruvchi Buyurtmachining brendi, mahsulotlari, xizmatlari, loyihalari va marketing faoliyati uchun ijtimoiy tarmoqlarni yuritish, kontent yaratish, reklama va Taraflar kelishgan boshqa marketing xizmatlarini ko‘rsatadi.</p>
                <p><b>1.2.</b> Buyurtmachi Bajaruvchi tomonidan ko‘rsatilgan xizmatlarni qabul qilish va ushbu Shartnoma hamda uning ilovalarida belgilangan miqdor va tartibda haq to‘lash majburiyatini oladi.</p>
                <p><b>1.3.</b> Har bir loyiha bo‘yicha xizmatlarning aniq turi, hajmi, oylik kontent soni, ish tartibi, xizmat narxi, shartnoma muddati va boshqa individual shartlar ushbu Shartnomaning <b>1-ilovasi — “Loyiha bo‘yicha maxsus shartlar”</b>da belgilanadi.</p>
                <p><b>1.4.</b> 1-ilova ushbu Shartnomaning ajralmas qismi hisoblanadi. 1-ilovada ko‘rsatilmagan xizmatlar standart majburiyatlarga kirmaydi va alohida kelishuv asosida bajarilishi mumkin.</p>
              </LegalSection>
              <LegalSection n="2" title="XIZMAT TURLARI">
                {(has("SMM boshqaruv") || has("Kontent strategiya") || has("Stories yuritish") || has("Kontent joylashtirish")) && <p><b>2.1. SMM xizmatlari.</b> Brendning ijtimoiy tarmoqlardagi faoliyatini yuritish, kontent strategiyasi va rejasini shakllantirish, post, Reels, Stories va boshqa kontent g‘oyalarini ishlab chiqish, matn va ssenariylar tayyorlash, vizual hamda kommunikatsiya yo‘nalishini nazorat qilish, kelishilgan kontentlarni joylashtirish va umumiy natijalarni tahlil qilish.</p>}
                {has("Mobilografiya") && <p><b>2.2. Mobilografiya.</b> Kelishilgan syomka kunlarida video va foto materiallar olish, Reels, Stories, reklama va boshqa formatlar uchun kadrlar tayyorlash, zarur hollarda ssenariy yoki syomka rejasi ishlab chiqish.</p>}
                {has("Video montaj") && <p><b>2.3. Video montaj.</b> Videoni kesish va yig‘ish, musiqa, subtitr, matn, oddiy grafik elementlar, rang va ovozga asosiy ishlov berish hamda kontent formatiga moslashtirish.</p>}
                {has("Target reklama") && <p><b>2.4. Target reklama.</b> Reklama kampaniyalarini yaratish, auditoriyalarni shakllantirish, kreativlarni joylashtirish va test qilish, kampaniyalarni kuzatish, zarur hollarda optimallashtirish va natijalarni tahlil qilish.</p>}
                {(has("Grafik dizayn") || has("Copywriting") || has("Oylik hisobot")) && <p><b>2.5. Boshqa marketing xizmatlari.</b> Grafik dizayn, copywriting, oylik hisobot va boshqa tanlangan xizmatlarning aniq hajmi 1-ilovada belgilanadi.</p>}
                <p><b>2.6.</b> Reklama budjeti Bajaruvchining oylik xizmat haqiga kirmaydi, agar 1-ilovada boshqacha yozilmagan bo‘lsa.</p>
              </LegalSection>
            </ContractPage>

            <ContractPage page={2} contractNo={draft.number} documentId={documentId}>
              <LegalSection n="3" title="KONTENT HAJMI">
                <p><b>3.1.</b> Har bir loyiha bo‘yicha bir oyda ishlab chiqilishi kerak bo‘lgan taxminiy yoki o‘rtacha kontent hajmi 1-ilovada belgilanadi.</p>
                <p><b>3.2.</b> Kontent hajmi Reels/video, post/karusel, Stories, reklama kreativlari va qo‘shimcha kontent bo‘yicha alohida ko‘rsatiladi.</p>
                <p><b>3.3.</b> Kontent soni “o‘rtacha” deb belgilangan hollarda haftalar kesimida miqdor marketing ehtiyojiga qarab farq qilishi mumkin, biroq umumiy oylik ish hajmi kelishilgan doirada olib boriladi.</p>
                <p><b>3.4.</b> Kelishilgan hajmdan tashqari qo‘shimcha kontent alohida xizmat sifatida baholanishi mumkin.</p>
              </LegalSection>
              <LegalSection n="4" title="SYOMKA KUNLARI VA ISH TARTIBI">
                <p><b>4.1.</b> Bajaruvchining Buyurtmachi loyihasi bo‘yicha asosiy ish kunlari va ish soatlari 1-ilovada belgilanadi.</p>
                <p><b>4.2.</b> Belgilangan ish vaqtidan tashqari kelgan topshiriqlar keyingi ish vaqtida ko‘rib chiqilishi mumkin. Shoshilinch topshiriqlar imkoniyat va alohida kelishuv asosida bajariladi.</p>
                <p><b>4.3.</b> Syomka kunlari oldindan kelishiladi. Buyurtmachi lokatsiya, mahsulotlar, syomkada qatnashadigan xodimlar, zarur ruxsatlar va boshqa sharoitlarni tayyorlaydi.</p>
                <p><b>4.4.</b> Buyurtmachining sababi bilan belgilangan syomka o‘tkazilmasa, yangi sana Bajaruvchining ish jadvalidan kelib chiqib belgilanadi.</p>
                <p><b>4.5.</b> Bajaruvchi doimiy ravishda Buyurtmachining ofisi yoki savdo nuqtasida bo‘lish majburiyatini olmaydi, agar 1-ilovada alohida ko‘rsatilmagan bo‘lsa.</p>
              </LegalSection>
              <LegalSection n="5" title="KONTENTNI TASDIQLASH VA TUZATISHLAR">
                <p><b>5.1.</b> Tayyorlangan materiallar Buyurtmachining mas’ul vakiliga tasdiqlash uchun yuborilishi mumkin. Tasdiqlash Telegram, WhatsApp yoki Taraflar kelishgan boshqa aloqa vositasi orqali amalga oshirilishi mumkin.</p>
                <p><b>5.2.</b> Buyurtmachi tomonidan tasdiqlangan material joylashtirish uchun ma’qullangan hisoblanadi. Buyurtmachi bergan noto‘g‘ri ma’lumot oqibatlari uchun Bajaruvchi javobgar bo‘lmaydi.</p>
                <p><b>5.3.</b> Har bir material bo‘yicha standart tuzatishlar soni <b>{draft.revisionLimit || 0} martagacha</b>.</p>
                <p><b>5.4.</b> Tasdiqlangan konsepsiyani to‘liq o‘zgartirish, videoni yangidan suratga olish yoki dastlabki topshiriqdan sezilarli farq qiluvchi o‘zgartirish yangi topshiriq hisoblanishi mumkin.</p>
              </LegalSection>
            </ContractPage>

            <ContractPage page={3} contractNo={draft.number} documentId={documentId}>
              <LegalSection n="6" title="TARGET REKLAMA ISH TARTIBI">
                <p><b>6.1.</b> Target reklama kampaniyalarining boshlanish sanasi, davomiyligi va reklama budjeti 1-ilovada yoki Taraflarning yozma kelishuvida belgilanadi.</p>
                <p><b>6.2.</b> Bajaruvchi reklama kampaniyasini Buyurtmachining reklama budjeti mavjud bo‘lgan va zarur materiallar taqdim etilgan vaqtdan boshlab ishga tushiradi.</p>
                <p><b>6.3.</b> Reklama natijasi budjet, mahsulot va xizmat narxi, auditoriya talabi, mavsum, Buyurtmachining savdo bo‘limi faoliyati, platforma algoritmlari, kreativlar va bozor holatiga bog‘liq.</p>
                <p><b>6.4.</b> Alohida yozma KPI kelishuvi mavjud bo‘lmasa, Bajaruvchi aniq miqdordagi sotuv, murojaat, obunachi, ko‘rish yoki daromadni kafolatlamaydi.</p>
                <p><b>6.5.</b> Uchinchi tomon platformalarining texnik nosozliklari, algoritmik o‘zgarishlari yoki Bajaruvchiga bog‘liq bo‘lmagan cheklovlari uchun Bajaruvchi javobgar emas.</p>
              </LegalSection>
              <LegalSection n="7" title="BUYURTMACHINING MAJBURIYATLARI">
                <p><b>7.1.</b> Bajaruvchiga ishni bajarish uchun zarur ma’lumotlarni o‘z vaqtida beradi.</p>
                <p><b>7.2.</b> Narxlar, aksiyalar, mahsulotlar, xizmatlar va boshqa tijorat ma’lumotlarining to‘g‘riligini ta’minlaydi.</p>
                <p><b>7.3.</b> Zarur akkauntlar va reklama kabinetlariga tegishli kirish huquqlarini beradi, kontent va reklama materiallarini imkon qadar o‘z vaqtida tasdiqlaydi.</p>
                <p><b>7.4.</b> Syomka kunlarida zarur sharoitlarni yaratadi va Shartnomada ko‘rsatilgan xizmat haqini o‘z vaqtida to‘laydi.</p>
              </LegalSection>
              <LegalSection n="8" title="BAJARUVCHINING MAJBURIYATLARI">
                <p><b>8.1.</b> Xizmatlarni professional va vijdonan bajaradi, kelishilgan ish hajmini bajarishga harakat qiladi va Buyurtmachining brend uslubi hamda marketing yo‘nalishiga rioya qiladi.</p>
                <p><b>8.2.</b> Buyurtmachiga tegishli maxfiy ma’lumotlarni uchinchi shaxslarga tarqatmaydi va akkauntlardan faqat xizmat ko‘rsatish maqsadida foydalanadi.</p>
                <p><b>8.3.</b> O‘ziga biriktirilgan vazifalarni kelishilgan muddatlarda bajaradi va zarur hollarda bajarilgan ishlar bo‘yicha hisobot beradi.</p>
              </LegalSection>
            </ContractPage>

            <ContractPage page={4} contractNo={draft.number} documentId={documentId}>
              <LegalSection n="9" title="XIZMAT HAQI VA TO‘LOV TARTIBI">
                <p><b>9.1.</b> Bajaruvchining xizmatlari uchun Buyurtmachi tomonidan to‘lanadigan o‘zgarmas oylik xizmat haqi 1-ilovada belgilanadi.</p>
                <p><b>9.2.</b> Belgilangan xizmat haqi Shartnoma amal qiladigan davr mobaynida Taraflardan birining bir tomonlama qarori bilan o‘zgartirilmaydi. Narxni o‘zgartirish faqat o‘zaro yozma kelishuv bilan amalga oshiriladi.</p>
                <p><b>9.3.</b> To‘lov tartibi va aniq to‘lov sanasi 1-ilovada belgilanadi.</p>
                <p><b>9.4.</b> Target reklama budjeti, bloggerlar, aktyorlar, modellar, professional studiya, maxsus lokatsiya, transport, rekvizit, maxsus uskunalar va uchinchi tomon xizmatlari oylik xizmat haqiga kirmaydi, agar 1-ilovada boshqacha belgilanmagan bo‘lsa.</p>
              </LegalSection>
              <LegalSection n="10" title="EKSKLYUZIVLIK VA RAQOBATCHI BRENDLAR BILAN HAMKORLIK">
                <p><b>10.1.</b> Agar 1-ilovada “Eksklyuziv hamkorlik” faollashtirilgan bo‘lsa, Bajaruvchi Shartnoma amal qiladigan davr mobaynida belgilangan yo‘nalishdagi to‘g‘ridan-to‘g‘ri raqobatchi brendlar bilan tanlangan marketing xizmatlari bo‘yicha hamkorlik qilmaydi.</p>
                <p><b>10.2.</b> Eksklyuzivlik faqat 1-ilovada ko‘rsatilgan mahsulot yoki xizmat kategoriyasi, hudud va brend segmenti doirasida amal qiladi.</p>
                <p><b>10.3.</b> Eksklyuzivlik Bajaruvchining ushbu yo‘nalishga aloqador bo‘lmagan boshqa kompaniyalar bilan ishlash huquqini cheklamaydi va Shartnoma tugashi bilan avtomatik ravishda tugaydi, agar Taraflar yozma ravishda boshqacha kelishmagan bo‘lsa.</p>
              </LegalSection>
              <LegalSection n="11" title="SHARTNOMA MUDDATI">
                <p><b>11.1.</b> Shartnoma 1-ilovada ko‘rsatilgan sanadan boshlab kuchga kiradi va <b>{readableDate(draft.startDate)}</b> dan <b>{readableDate(draft.endDate)}</b> gacha amal qiladi.</p>
                <p><b>11.2.</b> Ushbu muddat Taraflarning o‘zaro yozma kelishuvisiz bir tomonlama o‘zgartirilmaydi. Hamkorlik davom ettirilsa, muddat yangi ilova yoki qo‘shimcha kelishuv bilan uzaytirilishi mumkin.</p>
              </LegalSection>
              <LegalSection n="12" title="SHARTNOMANI MUDDATIDAN OLDIN BEKOR QILISH">
                <p><b>12.1.</b> Taraflardan biri Shartnomani muddatidan oldin bekor qilishni istasa, boshqa Tarafga kamida <b>{draft.terminationDays || 15} kalendar kun</b> oldin yozma ravishda xabar beradi.</p>
                <p><b>12.2.</b> Shartnoma bekor qilingunga qadar amalda bajarilgan xizmatlar bo‘yicha o‘zaro hisob-kitob to‘liq amalga oshiriladi.</p>
              </LegalSection>
            </ContractPage>

            <ContractPage page={5} contractNo={draft.number} documentId={documentId}>
              <LegalSection n="13" title="INTELLEKTUAL MULK VA KONTENT HUQUQLARI">
                <p><b>13.1.</b> Buyurtmachi tomonidan taqdim etilgan logotiplar, foto, video, firma uslubi va boshqa materiallarga bo‘lgan huquqlar Buyurtmachida qoladi.</p>
                <p><b>13.2.</b> Bajaruvchi tomonidan ushbu Shartnoma doirasida tayyorlangan va haq to‘langan yakuniy kontentdan Buyurtmachi o‘z biznes faoliyatida foydalanishi mumkin.</p>
                <p><b>13.3.</b> Xizmat haqi to‘liq to‘lanmagan materiallar bo‘yicha foydalanish masalasi Taraflarning alohida kelishuviga muvofiq hal etiladi.</p>
                <p><b>13.4.</b> Bajaruvchi tayyorlangan ishlarni portfolio va professional keys sifatida namoyish qilishi mumkin, agar 1-ilovada Buyurtmachi tomonidan maxfiylik talabi alohida belgilanmagan bo‘lsa.</p>
              </LegalSection>
              <LegalSection n="14" title="MAXFIYLIK">
                <p><b>14.1.</b> Bajaruvchi reklama kabinetlari, login va kirish ma’lumotlari, sotuv ma’lumotlari, marketing strategiyalari, mijozlar bazasi, ichki hujjatlar, moliyaviy ma’lumotlar hamda e’lon qilinmagan aksiyalar va loyihalarni maxfiy saqlaydi.</p>
                <p><b>14.2.</b> Buyurtmachi ham Bajaruvchining tijorat siri hisoblangan ichki ish jarayonlari va yopiq ma’lumotlarini uning roziligisiz uchinchi shaxslarga bermaydi.</p>
              </LegalSection>
              <LegalSection n="15" title="ELEKTRON ALOQA VA ISHCHI YOZISHMALAR">
                <p><b>15.1.</b> Taraflar kundalik ish jarayonida WhatsApp, Telegram, elektron pochta va Taraflar kelishgan boshqa aloqa kanallaridan foydalanishi mumkin.</p>
                <p><b>15.2.</b> Mazkur kanallardagi texnik topshiriqlar, kontent tasdiqlari, syomka sanalari, reklama budjeti bo‘yicha kelishuvlar, tuzatishlar va kundalik ish ko‘rsatmalari ishchi yozishmalar sifatida qabul qilinadi.</p>
                <p><b>15.3.</b> Asosiy moliyaviy shartlar, oylik narx, amal qilish muddati yoki eksklyuzivlik shartlarini o‘zgartirish alohida yozma qo‘shimcha kelishuv bilan rasmiylashtiriladi.</p>
              </LegalSection>
              <LegalSection n="16" title="TARAFLARNING JAVOBGARLIGI">
                <p><b>16.1.</b> Taraflar ushbu Shartnoma bo‘yicha o‘z majburiyatlarini lozim darajada bajarishlari shart.</p>
                <p><b>16.2.</b> Buyurtmachi material yoki ma’lumotlarni kech taqdim etganligi sababli yuzaga kelgan kechikish uchun Bajaruvchi javobgar emas.</p>
                <p><b>16.3.</b> Buyurtmachi tasdiqlagan noto‘g‘ri narx, manzil, telefon raqami, aksiya sharti yoki boshqa ma’lumot e’lon qilinishi natijasidagi oqibatlar uchun Buyurtmachi javobgar bo‘ladi.</p>
              </LegalSection>
              <LegalSection n="17" title="FORS-MAJOR">
                <p><b>17.1.</b> Taraflarning nazoratidan tashqarida bo‘lgan favqulodda va oldindan ko‘rib bo‘lmaydigan holatlar sababli majburiyatlarni bajarish imkonsiz bo‘lsa, Taraflar amaldagi qonunchilikka muvofiq javobgarlik masalasini hal qiladilar.</p>
              </LegalSection>
              <LegalSection n="18" title="NIZOLARNI HAL QILISH">
                <p><b>18.1.</b> Ushbu Shartnoma bilan bog‘liq kelishmovchiliklar birinchi navbatda muzokara yo‘li bilan hal qilinadi. Muzokara orqali hal qilishning imkoni bo‘lmasa, nizo O‘zbekiston Respublikasining amaldagi qonunchiligiga muvofiq ko‘rib chiqiladi.</p>
              </LegalSection>
              <LegalSection n="19" title="YAKUNIY QOIDALAR">
                <p><b>19.1.</b> Ushbu Shartnoma va uning ilovalari birgalikda yagona kelishuvni tashkil etadi.</p>
                <p><b>19.2.</b> Har bir loyiha bo‘yicha individual shartlar 1-ilovada belgilanadi. 1-ilovadagi maxsus shart bilan umumiy qoida o‘rtasida farq mavjud bo‘lsa, aynan shu loyiha uchun 1-ilovadagi maxsus shart qo‘llaniladi.</p>
                <p><b>19.3.</b> Shartnoma ikki nusxada tuziladi, Taraflarning har biriga bittadan nusxa beriladi.</p>
              </LegalSection>
            </ContractPage>

            <ContractPage page={6} contractNo={draft.number} documentId={documentId}>
              <AppendixHeader no="1-ILOVA" title="LOYIHA BO‘YICHA MAXSUS SHARTLAR" subtitle={`Asosiy Shartnoma № ${draft.number || "________"} • ${readableDate(draft.contractDate)}`} />
              <AppendixBlock title="1. LOYIHA">
                <AppendixRow label="Brend / loyiha nomi" value={draft.business || draft.project} />
                <AppendixRow label="Loyiha" value={draft.project} />
                <AppendixRow label="Faoliyat yo‘nalishi" value={draft.business} />
              </AppendixBlock>
              <AppendixBlock title="2. SHARTNOMA MUDDATI">
                <AppendixRow label="Boshlanish sanasi" value={readableDate(draft.startDate)} />
                <AppendixRow label="Tugash sanasi" value={readableDate(draft.endDate)} />
              </AppendixBlock>
              <AppendixBlock title="3. OYLIK O‘ZGARMAS XIZMAT HAQI">
                <AppendixRow label="Xizmat haqi" value={draft.amount ? formatMoney(draft.amount, draft.currency) + " / oy" : ""} strong />
                <AppendixRow label="To‘lov shakli" value={draft.paymentTerms} />
                <AppendixRow label="To‘lov muddati" value={`Har oyning ${draft.paymentDay || "___"}-sanasigacha`} />
              </AppendixBlock>
              <AppendixBlock title="4. XIZMAT PAKETI">
                <div className="serviceStatusGrid">{SERVICE_OPTIONS.map((service) => <div key={service}><span>{service}</span><b>{draft.services?.includes(service) ? "[X] Ha" : "[ ] Yo‘q"}</b></div>)}</div>
              </AppendixBlock>
              <AppendixBlock title="5. KONTENT HAJMI">
                <AppendixRow label="Oyiga o‘rtacha Reels/video" value={`${numberOrBlank(draft.contentReels)} dona`} />
                <AppendixRow label="Oyiga o‘rtacha post/karusel" value={`${numberOrBlank(draft.contentPosts)} dona`} />
                <AppendixRow label="Haftasiga o‘rtacha Stories" value={`${numberOrBlank(draft.storiesPerWeek)} dona`} />
                <AppendixRow label="Oyiga reklama kreativlari" value={`${numberOrBlank(draft.adCreatives)} dona`} />
                <AppendixRow label="Oyiga qo‘shimcha post" value={`${numberOrBlank(draft.extraPosts)} dona`} />
              </AppendixBlock>
            </ContractPage>

            <ContractPage page={7} contractNo={draft.number} documentId={documentId}>
              <AppendixHeader no="1-ILOVA DAVOMI" title="LOYIHA BO‘YICHA MAXSUS SHARTLAR" subtitle={`Asosiy Shartnoma № ${draft.number || "________"}`} />
              <AppendixBlock title="6. SYOMKA">
                <AppendixRow label="Oyiga syomka kunlari" value={`${numberOrBlank(draft.shootingDaysPerMonth)} kun`} />
                <AppendixRow label="Haftaning asosiy syomka kunlari" value={draft.shootingDays} />
                <AppendixRow label="Syomka vaqti" value={`${blank(draft.shootingTimeFrom, "____")} dan ${blank(draft.shootingTimeTo, "____")} gacha`} />
                <AppendixRow label="Bir syomka davomiyligi" value={draft.shootingDuration} />
                <AppendixRow label="Syomka lokatsiyasi" value={draft.shootingLocation} />
              </AppendixBlock>
              <AppendixBlock title="7. ISH TARTIBI">
                <AppendixRow label="Bajaruvchining ish kunlari" value={(draft.workDays || []).join(", ")} />
                <AppendixRow label="Ish vaqti" value={`${blank(draft.workTimeFrom, "____")} dan ${blank(draft.workTimeTo, "____")} gacha`} />
                <AppendixRow label="Dam olish kuni" value={draft.dayOff} />
                <AppendixRow label="Tezkor aloqa uchun mas’ul shaxs" value={draft.urgentContact} />
              </AppendixBlock>
              <AppendixBlock title="8. TARGET REKLAMA">
                <AppendixRow label="Target reklama xizmat paketiga kiradi" value={draft.adIncluded ? "Ha" : "Yo‘q"} />
                <AppendixRow label="Reklama boshlanishi" value={draft.adStartDate ? readableDate(draft.adStartDate) : ""} />
                <AppendixRow label="Reklama davomiyligi" value={draft.adDuration} />
                <AppendixRow label="Oylik reklama budjeti" value={draft.adBudget} />
                <AppendixRow label="Budjetni to‘lovchi" value={draft.adBudgetPayer} />
                <AppendixRow label="Asosiy reklama maqsadi" value={draft.adGoal} />
              </AppendixBlock>
              <AppendixBlock title="9. EKSKLYUZIVLIK">
                <AppendixRow label="Eksklyuziv hamkorlik" value={draft.exclusive ? "Ha" : "Yo‘q"} />
                {draft.exclusive && <><AppendixRow label="Yo‘nalish" value={draft.exclusiveDirection} /><AppendixRow label="Hudud" value={draft.exclusiveArea} /><AppendixRow label="Qo‘shimcha cheklov" value={draft.exclusiveRestriction} /></>}
              </AppendixBlock>
              <AppendixBlock title="10. MAXSUS VAZIFALAR VA QO‘SHIMCHA KELISHUVLAR">
                <div className="specialTasksPrint">{(draft.specialTasks || []).map((task, index) => <p key={index}><b>{index + 1}.</b> {blank(task, "________________________________________________________")}</p>)}</div>
                {draft.extraAgreements?.trim() && <p className="appendixNote"><b>Qo‘shimcha kelishuvlar:</b> {draft.extraAgreements}</p>}
              </AppendixBlock>
            </ContractPage>

            <ContractPage page={8} contractNo={draft.number} documentId={documentId}>
              <AppendixHeader no="2-ILOVA" title="TARAFLARNING REKVIZITLARI" subtitle={`Asosiy Shartnoma № ${draft.number || "________"}`} />
              <div className="requisiteColumns">
                <div className="requisiteCard">
                  <h3>BUYURTMACHI</h3>
                  <AppendixRow label="To‘liq yuridik nomi" value={draft.customerLegalName} />
                  <AppendixRow label="Brend nomi" value={draft.business} />
                  <AppendixRow label="Rahbar F.I.Sh." value={draft.customerRepresentative} />
                  <AppendixRow label="Lavozimi" value={draft.customerRole} />
                  <AppendixRow label="Faoliyat yuritish asosi" value={draft.customerBasis} />
                  <AppendixRow label="STIR" value={draft.customerTin} />
                  <AppendixRow label="Yuridik manzil" value={draft.customerAddress} />
                  <AppendixRow label="Bank" value={draft.customerBank} />
                  <AppendixRow label="MFO" value={draft.customerMfo} />
                  <AppendixRow label="Hisob raqami" value={draft.customerAccount} />
                  <AppendixRow label="Telefon" value={draft.customerPhone} />
                  <AppendixRow label="E-mail" value={draft.customerEmail} />
                  <AppendixRow label="Mas’ul shaxs" value={draft.customerResponsible} />
                  <div className="signatureArea"><span>Imzo:</span><b>________________________</b><small>M.O.</small></div>
                </div>
                <div className="requisiteCard">
                  <h3>BAJARUVCHI</h3>
                  <AppendixRow label="F.I.Sh. / tashkilot nomi" value={draft.executorName} />
                  <AppendixRow label="Huquqiy maqomi" value={draft.executorStatus} />
                  <AppendixRow label="STIR / JShShIR" value={draft.executorTin} />
                  <AppendixRow label="Manzil" value={draft.executorAddress} />
                  <AppendixRow label="Bank" value={draft.executorBank} />
                  <AppendixRow label="Hisob raqami / karta" value={draft.executorAccount} />
                  <AppendixRow label="Telefon" value={draft.executorPhone} />
                  <AppendixRow label="E-mail" value={draft.executorEmail} />
                  <div className="signatureArea"><span>Imzo:</span><b>________________________</b></div>
                </div>
              </div>
              <div className="documentVerification">
                <div className="verifyTextBlock">
                  <b>MENING TIZIMIM ELEKTRON HUJJAT TEKSHIRUVI</b>
                  <p>Mazkur hujjat Mening Tizimim platformasida yaratilgan elektron nusxa hisoblanadi. Hujjatning haqiqiyligini tekshirish uchun QR-kodni skaner qiling yoki hujjat identifikatori orqali tizimdagi tekshiruv sahifasini oching.</p>
                  <div className="verifyMetaLines">
                    <span><strong>Document ID:</strong> {documentId}</span>
                    <span><strong>Qo‘lda tekshirish kodi:</strong> {verificationCode}</span>
                    <span className="verifyUrl">{verifyUrl}</span>
                  </div>
                </div>
                <div className="verifyQrWrap">
                  <span className="verifyCodeBig">{verificationCode}</span>
                  <img src={qrDataUrl || qrUrl} alt={`Hujjatni tekshirish QR kodi ${documentId}`} className="verifyQrImage" />
                </div>
              </div>
            </ContractPage>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ContractBuilderPage() {
  return (
    <Suspense fallback={<div className="contractBuilderLoading">Shartnoma konstruktori yuklanmoqda...</div>}>
      <ContractBuilderContent />
    </Suspense>
  );
}

function BuilderCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="builderCard"><header><span /><h2>{title}</h2></header><div className="builderCardBody">{children}</div></section>;
}

function LegalSection({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return <section className="legalSection"><h2>{n}. {title}</h2><div className="legalBody">{children}</div></section>;
}

function AppendixHeader({ no, title, subtitle }: { no: string; title: string; subtitle: string }) {
  return <div className="appendixHeader"><strong>{no}</strong><h1>{title}</h1><p>{subtitle}</p></div>;
}

function AppendixBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="appendixBlock"><h2>{title}</h2><div>{children}</div></section>;
}

function AppendixRow({ label, value, strong = false }: { label: string; value?: string; strong?: boolean }) {
  return <div className="appendixRow"><b>{label}</b><span className={strong ? "strong" : ""}>{blank(value, "________________________________________________")}</span></div>;
}
