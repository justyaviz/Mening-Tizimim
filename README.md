# Mening Tizimim v0.9

Shaxsiy biznes operatsion tizimi. v0.9 dan boshlab barcha ish ma’lumotlari Railway PostgreSQL bazasida saqlanadi. Demo seed va localStorage saqlash olib tashlangan.

## Railway setup

1. Railway project ichida Postgres service yarating/ulang.
2. `Mening-Tizimim` service → Variables ichida `DATABASE_URL` ni Postgres service `DATABASE_URL` qiymatiga reference qiling.
3. Deploy qiling. API birinchi ishga tushganda `workspace_data` jadvalini avtomatik yaratadi.
4. Health check: `/api/health/db` ochilganda `{ ok: true }` qaytishi kerak.

Qo‘lda schema kerak bo‘lsa: `database/schema.sql`.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Database architecture

- `workspace_data.workspace_key = main`
- `payload` — barcha Projects, Clients, Contracts, Finance, Invoices, Tasks, Partners, Work Logs, Lessons, Services, Goals va Client Interactions uchun JSONB source of truth.
- Har bir UI o‘zgarishi `/api/workspace` orqali PostgreSQL'ga avtomatik saqlanadi.
- Demo fallback yo‘q. Database ishlamasa tizim `error` holatini ko‘rsatadi va ma’lumotni yashirincha localStorage'ga saqlamaydi.

## v0.9.1 upgrade note

Agar repo v0.8.x dan yangilanayotgan bo‘lsa, eski `components/auth-provider.tsx` va `lib/supabase.ts` fayllari Git tarixida qolib ketishi mumkin. v0.9.1 ularni dependency-free compatibility shim bilan overwrite qiladi. `@supabase/supabase-js` o‘rnatish kerak emas.
