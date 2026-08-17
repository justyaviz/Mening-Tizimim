# Mening Tizimim v0.3

Shaxsiy professional boshqaruv platformasi: loyihalar, mijozlar, shartnomalar, moliya, vazifalar va deadline’lar bitta joyda.

## v0.3 da nima ishlaydi

- Dashboard
- Projects CRUD
- Clients CRM CRUD
- Contracts CRUD
- Finance CRUD
- Tasks CRUD + status + priority + deadline + reminder
- Live Calendar: task + project deadline + contract deadline
- Supabase email/password Auth
- Supabase cloud database + RLS
- Local backup/fallback
- Browser reminder notifications (ilova ochiq turganda)
- JSON backup export
- Responsive UI

## Ishga tushirish

```bash
npm install
npm run dev
```

Brauzer: `http://localhost:3000`

## Supabase ulash

Supabase ulanmasa loyiha avtomatik **Local demo** rejimida ishlaydi.

1. Supabase’da yangi project yarating.
2. `supabase/schema.sql` faylini Supabase SQL Editor ichida ishga tushiring.
3. `.env.example` dan `.env.local` yarating:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

4. Dev serverni qayta ishga tushiring.
5. `/login` orqali birinchi admin account yarating.
6. Shaxsiy tizim bo‘lsa, account yaratilgach Supabase Auth settings ichida yangi user signup’larini o‘chirib qo‘yish tavsiya etiladi.

## Database arxitekturasi

v0.3 cloud migratsiyani sodda va xavfsiz qilish uchun user workspace’ni bitta `workspace_data` qatorida JSONB ko‘rinishda saqlaydi. `user_id` auth user bilan bog‘langan va RLS orqali faqat o‘sha userga ruxsat beriladi.

Keyingi versiyada kerak bo‘lsa Projects, Tasks, Finance va Clients alohida relational jadvallarga ajratiladi.

## Reminder haqida

v0.3 browser Notification API’dan foydalanadi. `Vazifalar` sahifasida **Reminder yoqish** tugmasini bosing. Reminder ilova brauzerda ochiq turgan paytda tekshiriladi. Ilova yopiq bo‘lganda server push/Telegram reminder v0.4 bosqichiga qoldirilgan.

## GitHub

```bash
git init
git add .
git commit -m "Mening Tizimim v0.3"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Vercel

Vercel Project Settings → Environment Variables ichiga Supabase URL va anon key’ni ham kiriting, so‘ng redeploy qiling.
