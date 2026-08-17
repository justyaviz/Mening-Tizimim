"use client";

import { ArrowLeft, Check, Eye, FileDown, FilePlus2, RotateCcw, Save, Search } from "lucide-react";
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
  "Kontent joylashtirish",
  "Target reklama",
  "Oylik hisobot",
];

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
    customerLegalName: "",
    customerTin: "",
    customerRepresentative: "",
    customerRole: "Direktor",
    services: ["SMM boshqaruv", "Mobilografiya", "Video montaj", "Target reklama"],
    revisionLimit: 2,
    terminationDays: 15,
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

function PaperBackground() {
  return <img src="/mening-tizimim-letterhead.png" alt="" className="contractPaperBg" />;
}

function ContractPage({ children, page }: { children: React.ReactNode; page: number }) {
  return <article className="contractPaper" data-contract-page={page}><PaperBackground /><div className="contractPaperContent">{children}</div><span className="contractPageNumber">{page}</span></article>;
}

function ContractBuilderContent() {
  const { data, addContract, updateContract } = useAppData();
  const params = useSearchParams();
  const editId = params.get("id");
  const [draft, setDraft] = useState<Contract>(emptyContract);
  const [section, setSection] = useState("contract");
  const [previewOnly, setPreviewOnly] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!editId) return;
    const found = data.contracts.find((item) => item.id === editId);
    if (found) setDraft({ ...emptyContract(), ...found, services: found.services?.length ? found.services : emptyContract().services });
  }, [editId, data.contracts]);

  const selectedClient = data.clients.find((item) => item.id === draft.clientId) || data.clients.find((item) => item.name === draft.client);
  const progress = useMemo(() => {
    const required = [draft.contractDate, draft.number, draft.city, draft.client, draft.business, draft.executorName, draft.customerLegalName, draft.startDate, draft.endDate, draft.amount > 0 ? "yes" : ""];
    return Math.round(required.filter(Boolean).length / required.length * 100);
  }, [draft]);

  const servicesText = (draft.services?.length ? draft.services : SERVICE_OPTIONS.slice(0, 4)).join(", ");
  const isExisting = data.contracts.some((item) => item.id === draft.id);

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
    }));
  }

  function toggleService(service: string) {
    const current = draft.services || [];
    patch("services", current.includes(service) ? current.filter((item) => item !== service) : [...current, service]);
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
    const body = pages.map((page) => `<div class="page">${page.querySelector(".contractPaperContent")?.innerHTML || ""}</div>`).join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:22mm 18mm 20mm}body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.5;color:#111}.page{page-break-after:always}.page:last-child{page-break-after:auto}h1{text-align:center;font-size:14pt}h2{text-align:center;font-size:12pt;margin-top:24px}.contractSubtitle{text-align:center;font-size:9.5pt}.contractLead{text-align:justify}.legalP{text-align:justify;text-indent:1cm;margin:8px 0}.signatureGrid{display:grid;grid-template-columns:1fr 1fr;gap:30px}.signatureBox{border-top:1px solid #999;padding-top:10px}</style></head><body>${body}</body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Marketing-shartnoma-${draft.number || "yangi"}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function pdfDownload() {
    window.print();
  }

  const nav = [
    { id: "contract", n: "01", label: "Shartnoma", count: "3/3" },
    { id: "executor", n: "02", label: "Bajaruvchi", count: draft.executorName ? "2/2" : "1/2" },
    { id: "customer", n: "03", label: "Buyurtmachi", count: draft.customerLegalName ? "4/5" : "1/5" },
    { id: "terms", n: "04", label: "Hamkorlik shartlari", count: `${draft.services?.length || 0}/9` },
  ];

  return <div className={`contractBuilderPage ${previewOnly ? "previewOnly" : ""}`}>
    <div className="contractBuilderTopbar">
      <div className="builderCrumb"><Link href="/contracts"><ArrowLeft size={16} /> Shartnomalar</Link><span>/</span><b>Marketing shartnomasi</b></div>
      <div className="builderActions">
        <button onClick={reset}><RotateCcw size={16} /> Qayta tiklash</button>
        <button onClick={newDocument}><FilePlus2 size={16} /> Yangi hujjat</button>
        <button className="primary" onClick={saveContract}><Save size={16} /> {saved ? "Saqlandi" : "Saqlash"}</button>
        <button onClick={wordDownload}><FileDown size={16} /> Word yuklash</button>
        <button onClick={pdfDownload}><FileDown size={16} /> PDF yuklash</button>
        <button onClick={() => setPreviewOnly((v) => !v)}><Eye size={16} /> {previewOnly ? "Tahrirlash" : "Ko‘rinish"}</button>
      </div>
    </div>

    <div className="contractBuilderShell">
      {!previewOnly && <aside className="contractSections">
        <div className="contractSectionsHead"><b>BO‘LIMLAR</b><span>{progress}% tayyor</span></div>
        {nav.map((item) => <button key={item.id} className={section === item.id ? "active" : ""} onClick={() => setSection(item.id)}><span className="sectionNo">{item.n}</span><strong>{item.label}</strong><em>{item.count}</em></button>)}
      </aside>}

      {!previewOnly && <main className="contractFormPane">
        <section className="builderHero"><div><span>MENING TIZIMIM • CONTRACT BUILDER</span><h1>Shartnoma ma’lumotlarini kiriting</h1><p>Ko‘k yulduzchali maydonlar majburiy. Hujjat o‘ng tomonda avtomatik yangilanadi.</p></div><div className="progressRing"><b>{progress}%</b><small>tayyor</small></div></section>

        {section === "contract" && <>
          <BuilderCard title="Shartnoma">
            <label className="builderField"><span>Shartnoma tuzilgan sana *</span><input type="date" value={draft.contractDate || ""} onChange={(e) => patch("contractDate", e.target.value)} /></label>
            <label className="builderField"><span>Shartnoma raqami *</span><input placeholder="Masalan: MT-01/2026" value={draft.number || ""} onChange={(e) => patch("number", e.target.value)} /></label>
            <label className="builderField"><span>Shartnoma tuzilgan joy *</span><input placeholder="Masalan: Toshkent shahri" value={draft.city || ""} onChange={(e) => patch("city", e.target.value)} /></label>
            <label className="builderField"><span>Mijozga biriktirish *</span><select value={draft.clientId || ""} onChange={(e) => chooseClient(e.target.value)}><option value="">Mijozni tanlang</option>{data.clients.map((client) => <option key={client.id} value={client.id}>{client.name}{client.company ? ` — ${client.company}` : ""}</option>)}</select></label>
            <label className="builderField"><span>Biznes / brend *</span><input placeholder="Masalan: aloo" value={draft.business || ""} onChange={(e) => patch("business", e.target.value)} /></label>
            <label className="builderField"><span>Loyiha</span><select value={draft.project} onChange={(e) => patch("project", e.target.value)}><option value="">Loyiha tanlanmagan</option>{data.projects.filter((p) => !draft.client || p.client === draft.client || p.name === draft.business).map((project) => <option key={project.id} value={project.name}>{project.name}</option>)}</select></label>
          </BuilderCard>
        </>}

        {section === "executor" && <BuilderCard title="Bajaruvchi">
          <label className="builderField"><span>Bajaruvchining huquqiy maqomi *</span><select value={draft.executorStatus || ""} onChange={(e) => patch("executorStatus", e.target.value)}><option>O‘zini o‘zi band qilgan shaxs</option><option>Yakka tartibdagi tadbirkor</option><option>Yuridik shaxs</option><option>Jismoniy shaxs</option></select></label>
          <label className="builderField"><span>Bajaruvchining F.I.Sh. yoki tashkilot nomi *</span><input value={draft.executorName || ""} onChange={(e) => patch("executorName", e.target.value)} /></label>
        </BuilderCard>}

        {section === "customer" && <BuilderCard title="Buyurtmachi">
          <label className="builderField"><span>Yuridik / to‘liq nomi *</span><input value={draft.customerLegalName || ""} onChange={(e) => patch("customerLegalName", e.target.value)} /></label>
          <label className="builderField"><span>STIR</span><input value={draft.customerTin || ""} onChange={(e) => patch("customerTin", e.target.value)} /></label>
          <label className="builderField"><span>Vakil F.I.Sh.</span><input value={draft.customerRepresentative || ""} onChange={(e) => patch("customerRepresentative", e.target.value)} /></label>
          <label className="builderField"><span>Vakil lavozimi</span><input value={draft.customerRole || ""} onChange={(e) => patch("customerRole", e.target.value)} /></label>
          <label className="builderField"><span>Kontakt mijoz</span><input disabled value={selectedClient ? `${selectedClient.name}${selectedClient.phone ? ` · ${selectedClient.phone}` : ""}` : "Mijoz tanlanmagan"} /></label>
        </BuilderCard>}

        {section === "terms" && <>
          <BuilderCard title="Marketing xizmatlari">
            <p className="builderHint">Hujjatning asosiy nomi doim <b>“Marketing xizmatlari”</b> bo‘ladi. Tanlangan xizmatlar qavs ichida ko‘rsatiladi.</p>
            <div className="serviceChecks">{SERVICE_OPTIONS.map((service) => <button type="button" key={service} className={draft.services?.includes(service) ? "checked" : ""} onClick={() => toggleService(service)}><span>{draft.services?.includes(service) && <Check size={14} />}</span>{service}</button>)}</div>
          </BuilderCard>
          <BuilderCard title="Muddati va to‘lov">
            <div className="builderTwoCol"><label className="builderField"><span>Boshlanish *</span><input type="date" value={draft.startDate} onChange={(e) => patch("startDate", e.target.value)} /></label><label className="builderField"><span>Tugash *</span><input type="date" value={draft.endDate} onChange={(e) => patch("endDate", e.target.value)} /></label></div>
            <div className="builderTwoCol"><label className="builderField"><span>Oylik xizmat haqi *</span><input type="number" min="0" value={draft.amount || ""} onChange={(e) => patch("amount", Number(e.target.value))} /></label><label className="builderField"><span>Valyuta</span><select value={draft.currency} onChange={(e) => patch("currency", e.target.value as Currency)}><option value="UZS">UZS</option><option value="USD">USD</option></select></label></div>
            <div className="builderTwoCol"><label className="builderField"><span>To‘lov kuni</span><input type="number" min="1" max="31" value={draft.paymentDay} onChange={(e) => patch("paymentDay", Number(e.target.value))} /></label><label className="builderField"><span>Tuzatishlar soni</span><input type="number" min="0" value={draft.revisionLimit || 0} onChange={(e) => patch("revisionLimit", Number(e.target.value))} /></label></div>
            <label className="builderField"><span>Bekor qilish haqida oldindan xabar</span><div className="inputSuffix"><input type="number" min="1" value={draft.terminationDays || 15} onChange={(e) => patch("terminationDays", Number(e.target.value))} /><span>kalendar kun</span></div></label>
            <label className="builderField"><span>Qo‘shimcha shart / izoh</span><textarea rows={4} value={draft.note} onChange={(e) => patch("note", e.target.value)} /></label>
          </BuilderCard>
        </>}
      </main>}

      <section className="contractPreviewPane">
        <div className="previewHead"><div><span className="liveDot" /> <b>Jonli ko‘rinish</b></div><small>Hujjat shriftida: Times New Roman</small></div>
        <div className="paperStack">
          <ContractPage page={1}>
            <h1>MARKETING XIZMATLARI KO‘RSATISH BO‘YICHA<br />HAMKORLIK SHARTNOMASI</h1>
            <div className="contractSubtitle">({servicesText})</div>
            <div className="contractMeta"><b>{blank(draft.city, "________________ shahri")}</b><b>№ {blank(draft.number, "________")}</b><b>{readableDate(draft.contractDate)}</b></div>
            <p className="contractLead">Bir tomondan, <b>{blank(draft.customerLegalName || draft.business)}</b>{draft.customerTin ? `, STIR: ${draft.customerTin}` : ""}, keyingi o‘rinlarda <b>“Buyurtmachi”</b> deb yuritiluvchi, {blank(draft.customerRepresentative)} nomidan, ikkinchi tomondan <b>{blank(draft.executorName)}</b>, huquqiy maqomi: <b>{blank(draft.executorStatus)}</b>, keyingi o‘rinlarda <b>“Bajaruvchi”</b> deb yuritiluvchi, birgalikda <b>“Taraflar”</b> deb atalib, ushbu Shartnomani quyidagilar haqida tuzdilar.</p>
            <LegalSection n="1" title="SHARTNOMA PREDMETI">
              <p><b>1.1.</b> Bajaruvchi Buyurtmachining <b>{blank(draft.business, "brendi")}</b>, mahsulotlari, xizmatlari, loyihalari va marketing faoliyati uchun marketing xizmatlarini ko‘rsatadi.</p>
              <p><b>1.2.</b> Mazkur marketing xizmatlari doirasiga Taraflar tanlagan xizmatlar kiradi: <b>{servicesText}</b>.</p>
              <p><b>1.3.</b> Buyurtmachi ko‘rsatilgan xizmatlarni qabul qiladi va ushbu Shartnomada belgilangan tartibda haq to‘laydi.</p>
              <p><b>1.4.</b> Har bir loyiha bo‘yicha aniq ish hajmi, kontent soni, syomka, reklama budjeti va boshqa individual shartlar Taraflarning yozma kelishuvi bilan aniqlashtiriladi.</p>
            </LegalSection>
            <LegalSection n="2" title="MARKETING XIZMATLARI VA ISH TARTIBI">
              <p><b>2.1.</b> Bajaruvchi tanlangan marketing yo‘nalishlari bo‘yicha strategiya, kontent, kreativ, reklama va kommunikatsiya ishlarini kelishilgan hajmda amalga oshiradi.</p>
              <p><b>2.2.</b> Reklama platformalariga to‘lanadigan reklama budjeti xizmat haqiga kirmaydi, agar Taraflar yozma ravishda boshqacha kelishmagan bo‘lsa.</p>
              <p><b>2.3.</b> Murakkab 3D, VFX, professional studiya, aktyor/model, maxsus lokatsiya va uchinchi tomon xizmatlari alohida kelishiladi.</p>
            </LegalSection>
          </ContractPage>

          <ContractPage page={2}>
            <LegalSection n="3" title="KONTENT, TASDIQLASH VA TUZATISHLAR">
              <p><b>3.1.</b> Kontent hajmi marketing ehtiyojidan kelib chiqib rejalashtiriladi va loyiha bo‘yicha alohida kelishiladi.</p>
              <p><b>3.2.</b> Tayyor materiallar Buyurtmachining mas’ul vakiliga Telegram, WhatsApp yoki boshqa kelishilgan kanal orqali tasdiqlash uchun yuborilishi mumkin.</p>
              <p><b>3.3.</b> Har bir material bo‘yicha standart tuzatishlar soni <b>{draft.revisionLimit || 0} martagacha</b>.</p>
              <p><b>3.4.</b> Tasdiqlangan konsepsiyani to‘liq o‘zgartirish, qayta syomka yoki dastlabki topshiriqdan sezilarli farq qiluvchi o‘zgartirish yangi topshiriq deb baholanishi mumkin.</p>
            </LegalSection>
            <LegalSection n="4" title="BUYURTMACHINING MAJBURIYATLARI">
              <p><b>4.1.</b> Ish uchun zarur ma’lumotlar, narxlar, aksiyalar, materiallar va kirish huquqlarini o‘z vaqtida taqdim etadi.</p>
              <p><b>4.2.</b> Kontent va reklama materiallarini imkon qadar o‘z vaqtida tasdiqlaydi.</p>
              <p><b>4.3.</b> Syomka zarur bo‘lsa, lokatsiya, mahsulot, xodimlar va ruxsatlarni tayyorlaydi.</p>
              <p><b>4.4.</b> Shartnomada ko‘rsatilgan xizmat haqini o‘z vaqtida to‘laydi.</p>
            </LegalSection>
            <LegalSection n="5" title="BAJARUVCHINING MAJBURIYATLARI">
              <p><b>5.1.</b> Xizmatlarni professional va vijdonan bajaradi, brend uslubi va marketing yo‘nalishiga rioya qiladi.</p>
              <p><b>5.2.</b> Buyurtmachining maxfiy ma’lumotlari va akkauntlaridan faqat xizmat ko‘rsatish maqsadida foydalanadi.</p>
              <p><b>5.3.</b> Kelishilgan muddatlarda vazifalarni bajaradi va zarur hollarda bajarilgan ishlar bo‘yicha hisobot beradi.</p>
            </LegalSection>
            <LegalSection n="6" title="TARGET REKLAMA VA NATIJALAR">
              <p><b>6.1.</b> Reklama natijalari budjet, mahsulot narxi, auditoriya talabi, mavsum, kreativ, savdo bo‘limi va platforma algoritmlariga bog‘liq.</p>
              <p><b>6.2.</b> Alohida yozma KPI bo‘lmasa, Bajaruvchi aniq miqdordagi sotuv, lead, obunachi, ko‘rish yoki daromadni kafolatlamaydi.</p>
            </LegalSection>
          </ContractPage>

          <ContractPage page={3}>
            <LegalSection n="7" title="XIZMAT HAQI VA TO‘LOV TARTIBI">
              <p><b>7.1.</b> Bajaruvchining xizmatlari uchun oylik xizmat haqi <b>{draft.amount ? formatMoney(draft.amount, draft.currency) : "________________"}</b> etib belgilanadi.</p>
              <p><b>7.2.</b> To‘lov har oyning <b>{draft.paymentDay || "___"}-sanasigacha</b> amalga oshiriladi.</p>
              <p><b>7.3.</b> Reklama budjeti, blogger, aktyor, model, studiya, transport, rekvizit va uchinchi tomon xarajatlari alohida to‘lanadi.</p>
            </LegalSection>
            <LegalSection n="8" title="SHARTNOMA MUDDATI">
              <p><b>8.1.</b> Shartnoma <b>{readableDate(draft.startDate)}</b> dan <b>{readableDate(draft.endDate)}</b> gacha amal qiladi.</p>
              <p><b>8.2.</b> Hamkorlik davom ettirilsa, Taraflar muddatni yangi qo‘shimcha kelishuv bilan uzaytirishi mumkin.</p>
            </LegalSection>
            <LegalSection n="9" title="MUDDATIDAN OLDIN BEKOR QILISH">
              <p><b>9.1.</b> Taraflardan biri Shartnomani muddatidan oldin bekor qilishni istasa, boshqa Tarafga kamida <b>{draft.terminationDays || 15} kalendar kun</b> oldin yozma xabar beradi.</p>
              <p><b>9.2.</b> Bekor qilish sanasigacha amalda bajarilgan xizmatlar bo‘yicha o‘zaro hisob-kitob to‘liq amalga oshiriladi.</p>
            </LegalSection>
            <LegalSection n="10" title="INTELLEKTUAL MULK VA MAXFIYLIK">
              <p><b>10.1.</b> Buyurtmachi taqdim etgan logotip, foto, video va firma uslubiga bo‘lgan huquqlar Buyurtmachida qoladi.</p>
              <p><b>10.2.</b> Haqi to‘langan yakuniy materiallardan Buyurtmachi o‘z biznes faoliyatida foydalanishi mumkin.</p>
              <p><b>10.3.</b> Taraflar moliyaviy ma’lumotlar, loginlar, strategiyalar, mijozlar bazasi va e’lon qilinmagan loyihalarni maxfiy saqlaydi.</p>
            </LegalSection>
          </ContractPage>

          <ContractPage page={4}>
            <LegalSection n="11" title="ELEKTRON ALOQA VA ISHCHI YOZISHMALAR">
              <p><b>11.1.</b> Telegram, WhatsApp, elektron pochta va Taraflar kelishgan boshqa aloqa kanallaridagi texnik topshiriqlar, tasdiqlar, syomka sanalari, tuzatishlar va kundalik ko‘rsatmalar ishchi yozishmalar sifatida qabul qilinadi.</p>
              <p><b>11.2.</b> Oylik narx, muddat va boshqa asosiy moliyaviy shartlarni o‘zgartirish alohida yozma kelishuv bilan rasmiylashtiriladi.</p>
            </LegalSection>
            <LegalSection n="12" title="JAVOBGARLIK, FORS-MAJOR VA NIZOLAR">
              <p><b>12.1.</b> Taraflar o‘z majburiyatlarini lozim darajada bajarishlari shart.</p>
              <p><b>12.2.</b> Buyurtmachi ma’lumot yoki materiallarni kech taqdim etsa, shu sababli yuzaga kelgan kechikish uchun Bajaruvchi javobgar bo‘lmaydi.</p>
              <p><b>12.3.</b> Taraflarning nazoratidan tashqaridagi favqulodda holatlarda javobgarlik amaldagi qonunchilikka muvofiq hal qilinadi.</p>
              <p><b>12.4.</b> Kelishmovchiliklar avvalo muzokara yo‘li bilan, buning imkoni bo‘lmasa O‘zbekiston Respublikasi amaldagi qonunchiligiga muvofiq ko‘rib chiqiladi.</p>
            </LegalSection>
            <LegalSection n="13" title="YAKUNIY QOIDALAR">
              <p><b>13.1.</b> Shartnoma ikki nusxada tuziladi va Taraflarning har biriga bittadan nusxa beriladi.</p>
              <p><b>13.2.</b> Qo‘shimcha shartlar: {blank(draft.note, "yo‘q")}</p>
            </LegalSection>
            <h2>TARAFLARNING REKVIZITLARI VA IMZOLARI</h2>
            <div className="signatureGrid">
              <div className="signatureBox"><b>BUYURTMACHI</b><p>{blank(draft.customerLegalName || draft.business)}</p><p>Vakil: {blank(draft.customerRepresentative)}</p><p>Lavozimi: {blank(draft.customerRole)}</p><p>STIR: {blank(draft.customerTin)}</p><p className="signatureLine">Imzo: __________________</p></div>
              <div className="signatureBox"><b>BAJARUVCHI</b><p>{blank(draft.executorName)}</p><p>{blank(draft.executorStatus)}</p><p className="signatureLine">Imzo: __________________</p></div>
            </div>
          </ContractPage>
        </div>
      </section>
    </div>
  </div>;
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
