# Mening Tizimim Changelog

## v0.9.0
- Railway PostgreSQL yagona source of truth bo‘ldi.
- Barcha demo seed ma’lumotlar olib tashlandi; yangi database bo‘sh holatda boshlanadi.
- localStorage va Supabase workspace sync olib tashlandi.
- `/api/workspace` GET/PUT server API qo‘shildi.
- `/api/health/db` database health endpoint qo‘shildi.
- `workspace_data` JSONB jadvali avtomatik yaratiladi.
- Settings Railway DB holati va oxirgi sync vaqtini ko‘rsatadi.

## v0.8.3
- PDF eksportidagi katta bo‘sh joylar tuzatildi.
- Asosiy shartnoma bo‘limlari PDF yaratish vaqtida A4 sahifalarga avtomatik zich joylanadi.
- Bo‘limlar sahifa oralig‘ida keraksiz bo‘shliq qoldirmasdan keyingi mavjud joyga ko‘chiriladi.
- 1-ilova va 2-ilova professional hujjat tartibiga ko‘ra alohida sahifadan boshlanadi.
- PDF footer sahifa soni dinamik hisoblanadi.

## v0.8.2
- PDF tugmasi endi brauzer Print oynasini ochmaydi; haqiqiy .pdf faylni to‘g‘ridan-to‘g‘ri generatsiya qilib yuklaydi.
- A4 preview sahifalari PDFga aynan ko‘rinishidagi kabi render qilinadi.
- Chrome header/footer (sana, URL, page count) PDFga tushmaydi.
- QR kod lokal data-URL sifatida generatsiya qilinadi, PDF capture paytida yo‘qolib qolmaydi.

## v0.8.1
- Shartnoma oxiriga QR asosidagi ichki elektron hujjat tekshiruvi qo‘shildi.
- /verify sahifasi qo‘shildi: Document ID, raqam, sana va brendni tekshirish mumkin.
- PDF/Word chiqishida oxirgi sahifada Document ID, qo‘lda tekshirish kodi va QR kod chiqadi.

## v0.8.0
- Contract Builder qayta qurildi: asosiy shartnoma 19 ta bo‘lim bilan to‘liq struktura.
- Xizmatlar tanloviga qarab SMM, mobilografiya, montaj, target va boshqa marketing xizmatlari dinamik chiqadi.
- 1-ilova: loyiha, muddat, narx, xizmat paketi, kontent hajmi, syomka, ish tartibi, target, eksklyuzivlik va maxsus vazifalar.
- 2-ilova: Buyurtmachi va Bajaruvchining to‘liq rekvizitlari va imzo joylari.
- Contract modeli yangi professional maydonlar bilan kengaytirildi.
- PDF footer: shartnoma raqami, Document ID, sahifa X/8.
- Print layout header/footer safe-zone bilan yangilandi.
- v0.7 localStorage v0.8 formatiga migratsiya qilinadi.

## v0.7.2
- Contract preview header spacing fixed so document title no longer overlaps the logo area.
- Contract pagination rebalanced from 4 sparse pages to 3 fuller pages.
- Signature section compacted for a cleaner last page.
- Improved legal text spacing for denser A4 layout.

# Changelog

## v0.7.1
- Next.js build hotfix: `/contracts/builder` sahifasidagi `useSearchParams()` endi `Suspense` boundary ichida ishlaydi.
- Static prerender paytidagi `missing-suspense-with-csr-bailout` xatosi tuzatildi.

## v0.7.0

- Marketing xizmatlari uchun yangi professional Contract Builder.
- Shartnoma mijoz, biznes/brend va loyiha bilan biriktiriladi.
- A4 jonli ko‘rinish Mening Tizimim firma blankasi/watermark fonida.
- Asosiy nom: “MARKETING XIZMATLARI KO‘RSATISH BO‘YICHA HAMKORLIK SHARTNOMASI”.
- SMM, mobilografiya, montaj, target va boshqa xizmatlar sarlavha ostida qavs ichida dinamik ko‘rsatiladi.
- Bajaruvchi, Buyurtmachi va hamkorlik shartlari uchun bo‘limli builder.
- Contract progress indikatori, saqlash, reset, yangi hujjat va full preview.
- Word (.doc) eksport va browser Print/PDF oqimi.
- Mavjud shartnomani builder ichida ochish/tahrirlash.
- v0.6 localStorage ma’lumotlari v0.7 ga migratsiya qilinadi.

# v0.6.0

- Payment Control: invoice, debitor va qoldiq to‘lovlar moduli.
- Hisob yaratish/tahrirlash/o‘chirish va statuslar: draft, yuborilgan, qisman, to‘langan, kechikkan, bekor.
- Partial payment va avtomatik outstanding hisoblash.
- Payment receipt Moliya tranzaksiyasiga avtomatik yoziladi.
- Recurring income aktiv oylik shartnomalardan hisoblanadi.
- Payment deadline Kalendar va global qidiruvga qo‘shildi.
- Dashboard payment pulse va v0.6 local/cloud migratsiya.


## 0.5.1 — Build hotfix
- Fixed invalid `Work` icon import from `lucide-react` by using `BriefcaseBusiness`.
- Fixed strict TypeScript narrowing in `/clients/[id]` event handlers where `client` could be considered undefined.
- Replaced CSS `align-items: end` with `align-items: flex-end` to remove the autoprefixer mixed-support warning.

## 0.5.0 — 2026-08-17

### Added
- Project 360 dynamic detail pages at `/projects/[id]`.
- Per-project task, finance, contract, partner, work-log, lesson and activity aggregation.
- Client 360 dynamic CRM profiles at `/clients/[id]`.
- Client interaction history with note/call/meeting/message/payment types and CRUD.
- Client-level project, contract and revenue aggregation.
- Direct Project/Client detail navigation from global search.
- Global search support for CRM interaction history.

### Changed
- Local storage key upgraded to `mening-tizimim-v0.5-data` with v0.4/v0.3/v0.2 migration fallback.
- Projects can select existing CRM clients through a datalist.
- Project and client listing pages now expose direct detail/profile actions.
- Workspace payload schema expanded with `interactions` while preserving the single Supabase JSON row architecture.

## 0.4.0 — 2026-08-17

### Added
- Work Journal / “Qilgan ishlarim” CRUD.
- Lessons, mistakes and wins knowledge base.
- Services catalog with price, estimated cost, margin and delivery time.
- Goals module with measurable progress.
- Full partners CRUD.
- Global Cmd/Ctrl + K search across the workspace.
- Real analytics for monthly UZS cashflow, revenue categories and work time.
- Dashboard quick links for the new v0.4 modules.

### Changed
- Sidebar expanded with Work, Lessons, Services and Goals.
- Data model expanded while keeping the single Supabase JSON workspace payload.
- Local storage key upgraded to `mening-tizimim-v0.4-data` with v0.3/v0.2 migration fallback.

## 0.3.0
- Supabase Auth and cloud sync.
- Tasks CRUD, reminders and browser notifications.
- Calendar aggregation.
- Cloud/local migration and JSON backup.

## 0.2.0
- Projects, Clients, Contracts and Finance CRUD.
- LocalStorage persistence and multi-page navigation.