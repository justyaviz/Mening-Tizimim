# Mening Tizimim — v0.2

Personal business operating system for managing projects, clients, contracts, finance and daily work.

## v0.2 includes

- Real App Router navigation for every sidebar item
- Dashboard connected to shared local data
- Projects module: search, filter, create, edit, delete, progress, deadline, pricing
- Clients CRM: search, filter, create, edit, delete, contact details
- Contracts module: create, edit, delete, status, dates, billing and payment day
- Finance module: income/expense entries, filters, UZS/USD tracking and cash-flow summary
- Local persistence with `localStorage`
- Analytics preview using live local data
- Tasks, Calendar, Partners and Settings route shells ready for v0.3
- Responsive desktop/mobile layout
- Mening Tizimim blue/navy brand system

> v0.2 is still frontend-first. Data is saved in the current browser via localStorage. Authentication and a real cloud database are planned for a later version.

## Stack

- Next.js 15
- React 19
- TypeScript
- Lucide icons
- Plain CSS

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm run build
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Mening Tizimim v0.2"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

If v0.1 is already in the repository:

```bash
git add .
git commit -m "Upgrade Mening Tizimim to v0.2"
git push
```

## Suggested v0.3

1. Supabase/PostgreSQL database
2. Authentication and private admin account
3. Full Tasks CRUD + reminders
4. Calendar events and deadlines
5. Partners/team cost tracking
6. Project detail page with activity history
7. Contract file upload
8. Monthly P&L and profitability analytics

## Brand

- Primary: `#0C67FD`
- Dark navy: `#091735`
- Secondary blue: `#098FFC`
- Font direction: Poppins
