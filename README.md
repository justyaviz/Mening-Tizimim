# Mening Tizimim v0.7

Shaxsiy biznes boshqaruv platformasi. Loyiha, mijoz, hamkor, shartnoma, moliya, vazifa, kalendar va professional tarixni bitta joyda saqlaydi.

## v0.7 da yangi

- **To‘lovlar & Debitorlar** — invoice/hisob, qoldiq va kechikkan to‘lovlarni nazorat qilish.
- Hisob statuslari: draft, yuborilgan, qisman, to‘langan, kechikkan va bekor.
- Qisman to‘lov yozilganda qoldiq avtomatik hisoblanadi.
- To‘lov qabul qilinganda Moliya bo‘limiga avtomatik kirim tranzaksiyasi yaratiladi.
- Aktiv oylik shartnomalardan **recurring income** ko‘rsatkichi.
- To‘lov deadline’lari Kalendar va Global Search bilan integratsiya qilindi.
- Dashboard’da Payment Control pulse paydo bo‘ldi.
- v0.5 local/cloud payload v0.7 formatiga avtomatik migratsiya qilinadi.
- v0.5 dagi Project 360, Client 360, CRM history va barcha avvalgi modullar saqlanadi.

## Mavjud modullar

- Dashboard
- Projects + Project 360
- Clients CRM + Client 360 + interaction history
- Partners CRM
- Contracts
- Finance
- Payments & Receivables
- Tasks + reminders
- Calendar
- Work Journal
- Lessons / Mistakes / Wins
- Services catalog
- Goals
- Analytics
- Global Search
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
git commit -m "Upgrade Mening Tizimim to v0.7"
git push
```


## v0.7 Contract Builder

`/contracts/builder` sahifasi Marketing xizmatlari shartnomasini to‘ldirish, mijoz/biznes/loyihaga biriktirish, A4 blankada jonli ko‘rish va Word/PDF uchun chiqarishga tayyorlaydi.
