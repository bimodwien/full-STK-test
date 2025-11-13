## Full STK Test — Monorepo

This repository contains a Menu management system with a NestJS API and a Next.js Web UI.

Folders:

- `api/` — NestJS + Prisma (PostgreSQL) REST API for hierarchical menus
- `web/` — Next.js front-end for browsing and editing the menu tree

## Quick start

Clone the repo, then set up the API and Web in parallel.

Prereqs

- Node.js 18+ and npm 9+
- PostgreSQL 13+ (local or Docker)

### 1) API setup (NestJS)

In `api/`:

```bash
npm install

# configure environment
cp .env.example .env
# .env should include at least:
# DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public
# PORT=8001

# prisma
npx prisma generate
npx prisma migrate dev --name init

# run
npm run start:dev
# Swagger: http://localhost:8001/api/docs
```

API details and endpoints: see `api/README.md`.

### 2) Web setup (Next.js)

In `web/`:

```bash
npm install

# environment
cp .env.example .env.local  # or echo NEXT_PUBLIC_API_URL=... > .env.local

# run
npm run dev
# App: http://localhost:3000
```

Web UI usage and behavior: see `web/README.md`.

## What’s inside

### API (NestJS + Prisma)

- Menu model with self-relation (parent/children)
- CRUD endpoints:
  - GET /menu — nested tree
  - GET /menu/:id — item + children
  - POST /menu — create (root or child)
  - PUT /menu/:id — update
  - DELETE /menu/:id — delete (children first)
- ValidationPipe, CORS, Swagger at `/api/docs`

### Web (Next.js)

- Desktop: two columns (tree on left, form panel on right)
- Mobile: off-canvas sidebar for the tree; form stacks below
- Header bar: Root selector dropdown (All or specific root) + "Add root menu" button
- Controls: Expand/Collapse, Search above the tree (outside card)
- Row actions via a blue plus (hover on desktop, tap-to-reveal on mobile)
- Right panel shows Add/Edit form with live Depth and Parent Data
- Notifications: success toasts on Add/Edit/Delete (sonner); Delete uses a confirmation Alert Dialog (shadcn) instead of the browser alert

Key files

- `web/components/menu-ui/RootSelector.tsx` — root filter and Add root
- `web/components/menu-ui/ControlsBar.tsx` — expand/collapse + search
- `web/components/menu-ui/MenuFormPanel.tsx` — right-side form panel
- `web/components/menu-ui/MenuTree.tsx` — tree with plus dropdown actions
- `web/components/AppShell.tsx` and `web/components/Sidebar.tsx` — layout + navigation
- `web/models/ui.model.ts` — centralized UI prop types

## Environment variables

- API: `DATABASE_URL`, optional `PORT` (default 8001)
- Web: `NEXT_PUBLIC_API_URL` (point to the API base URL)

## Scripts

In `api/`:

```bash
npm run start:dev
npm run build
npm run lint
npm run test
```

In `web/`:

```bash
npm run dev
npm run build
npm run lint
npm run start   # start production server after build
```

## Production

Run both apps in production mode.

API (NestJS):

```bash
cd api
npm install
npm run build
npm run start:prod
# Swagger: http://localhost:8001/api/docs
```

Web (Next.js):

```bash
cd web
npm install
npm run build
npm run start
# App: http://localhost:3000
```

## Notes

- Ensure the API is up before starting the Web app.
- Prisma schema changes require `npx prisma generate` and `npx prisma migrate dev` in `api/`.
