# Railway PostgreSQL ulash

## 1. Variable
Railway ichida `Mening-Tizimim` service → **Variables** ga kiring.

Eng yaxshi variant:

```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

`Postgres` nomi sizdagi database service nomiga qarab farq qilishi mumkin.

Agar Railway allaqachon `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` variablelarini app service'ga bergan bo‘lsa, kod ulardan ham foydalana oladi.

## 2. Deploy
Deploydan keyin quyidagi endpointni oching:

```text
/api/health/db
```

Muvaffaqiyatli javob:

```json
{"ok":true,"database":"railway","serverTime":"..."}
```

## 3. Jadval
`workspace_data` jadvali API birinchi ishga tushganda avtomatik yaratiladi.

Qo‘lda yaratish kerak bo‘lsa `database/schema.sql` ni Postgres Query panelida ishga tushiring.

## 4. Saqlash modeli
Barcha platforma ma’lumotlari `workspace_data.payload` JSONB ichida saqlanadi:

- projects
- clients
- contracts
- transactions
- invoices
- tasks
- partners
- workLogs
- lessons
- services
- goals
- interactions

Demo seed va localStorage fallback mavjud emas.
