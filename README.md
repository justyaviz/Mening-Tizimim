# Mening Tizimim v0.5

Shaxsiy biznes boshqaruv platformasi. Loyiha, mijoz, hamkor, shartnoma, moliya, vazifa, kalendar va professional tarixni bitta joyda saqlaydi.

## v0.5 da yangi

- **Project 360** — har bir loyiha uchun alohida detail sahifa.
- Project 360 ichida vazifalar, pul oqimi, shartnomalar, hamkorlar, work log, darslar va activity history birlashtiriladi.
- **Client 360** — har bir mijoz uchun alohida CRM profil.
- **Aloqa tarixi** — qo‘ng‘iroq, uchrashuv, xabar, izoh va to‘lov yozuvlarini saqlash/tahrirlash/o‘chirish.
- Mijoz profilida unga bog‘langan loyihalar, shartnomalar va moliya ko‘rinadi.
- Global Search loyiha va mijozni endi to‘g‘ridan-to‘g‘ri detail sahifasida ochadi.
- Global Search mijoz aloqa tarixini ham qidiradi.
- Project va Client listlarda **Batafsil** / profile tugmalari qo‘shildi.
- Yangi loyiha yaratishda mavjud CRM mijozlarini datalist orqali tanlash mumkin.
- v0.4 localStorage ma’lumotlari v0.5 ga avtomatik migratsiya qilinadi.
- Yangi Client Interaction ma’lumotlari Supabase workspace JSON payload bilan avtomatik cloud sync qilinadi.

## Mavjud modullar

- Dashboard
- Projects + Project 360
- Clients CRM + Client 360 + interaction history
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
git commit -m "Upgrade Mening Tizimim to v0.5"
git push
```
