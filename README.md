# Mening Tizimim v0.4

Shaxsiy biznes boshqaruv platformasi. Loyiha, mijoz, hamkor, shartnoma, moliya, vazifa, kalendar va professional tarixni bitta joyda saqlaydi.

## v0.4 da yangi

- **Qilgan ishlarim / Work Journal** — kunlik ish, loyiha, kategoriya, sarflangan vaqt va natija.
- **Xatolar & Darslar** — mistake / lesson / win yozuvlari va keyingi action.
- **Xizmatlarim** — xizmat katalogi, bazaviy narx, tannarx, marja va muddat.
- **Maqsadlar** — target qiymat, current qiymat va avtomatik progress.
- **Hamkorlar CRM** — freelancer va hamkorlar uchun to‘liq CRUD, rate va loyiha bog‘lanishi.
- **Global Search** — `Cmd/Ctrl + K` bilan loyiha, mijoz, shartnoma, task, hamkor, work log, lesson, service va goal bo‘yicha qidirish.
- **Analitika v0.4** — real tranzaksiyalardan oylar bo‘yicha daromad/xarajat, daromad kategoriyalari, work log vaqt taqsimoti va learning stats.
- Dashboardda yangi professional-memory quick links.
- v0.3 localStorage ma’lumotlari v0.4 ga avtomatik migratsiya qilinadi.

## Mavjud modullar

- Dashboard
- Projects
- Clients CRM
- Partners CRM
- Contracts
- Finance
- Tasks + reminders
- Calendar
- Work Journal
- Lessons / Mistakes / Wins
- Services catalog
- Goals
- Analytics
- Settings + JSON backup
- Supabase Auth + cloud sync + RLS

## Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda `http://localhost:3000` ni oching.

## Supabase cloud ulash

1. Supabase project yarating.
2. `supabase/schema.sql` ni SQL Editor orqali ishga tushiring.
3. `.env.example` dan `.env.local` yarating:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. `npm run dev` yoki Vercel deploy qiling.

Env mavjud bo‘lmasa tizim avtomatik **Local Demo** rejimida ishlaydi.

## GitHub

```bash
git add .
git commit -m "Upgrade Mening Tizimim to v0.4"
git push
```
