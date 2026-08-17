# Changelog

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
