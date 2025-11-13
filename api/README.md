## API — Menu Service (NestJS + Prisma)

This service powers the menu management used by the web app. It exposes CRUD endpoints for a hierarchical Menu (parent/child) built on NestJS and Prisma (PostgreSQL).

Swagger docs are available at: http://localhost:8001/api/docs

## Stack

- NestJS 11 (REST, Validation, CORS)
- Prisma ORM (PostgreSQL)
- Swagger (OpenAPI)

## Requirements

- Node.js 18+
- A PostgreSQL database

## Environment variables

Create an `.env` in the `api` directory with at least:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
# optional
PORT=8001
```

## Install & run

```bash
# install deps
npm install

# generate prisma client
npx prisma generate

# apply schema (creates tables)
npx prisma migrate dev --name init

# dev server
npm run start:dev

# open swagger
# http://localhost:${PORT:-8001}/api/docs
```

## Data model

Prisma model (`prisma/schema.prisma`):

```
model Menu {
  id        Int      @id @default(autoincrement())
  name      String
  parentId  Int?
  parent    Menu?    @relation("MenuChildren", fields: [parentId], references: [id])
  children  Menu[]   @relation("MenuChildren")
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Endpoints

Base URL: `http://localhost:8001`

- GET `/menu`
  - Returns the full nested menu tree as an array of root nodes.

- GET `/menu/:id`
  - Returns a single menu item with its immediate children.

- POST `/menu`
  - Body: `{ name: string; parentId?: number | null }`
  - Notes: `parentId` of `0` or `null` will create a root item. If `parentId` is provided but not found, returns `404 Parent menu not found`.

- PUT `/menu/:id`
  - Body: `{ name?: string; parentId?: number | null }`
  - Partially updates the item.

- DELETE `/menu/:id`
  - Removes the menu. Immediate children are deleted first, then the parent.

## Examples

All requests use JSON. Replace host/port with your environment.

### Create (POST /menu)

Request

```
POST /menu
Content-Type: application/json

{
  "name": "User Management",
  "parentId": null
}
```

Response 201

```
{
  "id": 1,
  "name": "User Management",
  "parentId": null,
  "order": 0,
  "createdAt": "2025-11-13T10:00:00.000Z",
  "updatedAt": "2025-11-13T10:00:00.000Z",
  "children": [],
  "parent": null
}
```

Create child under id=1

```
POST /menu
{
  "name": "Roles",
  "parentId": 1
}
```

### List (GET /menu)

Response 200

```
[
  {
    "id": 1,
    "name": "User Management",
    "parentId": null,
    "order": 0,
    "createdAt": "2025-11-13T10:00:00.000Z",
    "updatedAt": "2025-11-13T10:00:00.000Z",
    "children": [
      {
        "id": 2,
        "name": "Roles",
        "parentId": 1,
        "order": 0,
        "createdAt": "2025-11-13T10:01:00.000Z",
        "updatedAt": "2025-11-13T10:01:00.000Z",
        "children": []
      }
    ]
  }
]
```

### Detail (GET /menu/:id)

```
GET /menu/1
```

Response 200

```
{
  "id": 1,
  "name": "User Management",
  "parentId": null,
  "order": 0,
  "createdAt": "2025-11-13T10:00:00.000Z",
  "updatedAt": "2025-11-13T10:00:00.000Z",
  "children": [
    {
      "id": 2,
      "name": "Roles",
      "parentId": 1,
      "order": 0,
      "createdAt": "2025-11-13T10:01:00.000Z",
      "updatedAt": "2025-11-13T10:01:00.000Z"
    }
  ]
}
```

### Update (PUT /menu/:id)

Request

```
PUT /menu/2
{
  "name": "Role Management"
}
```

Response 200

```
{
  "id": 2,
  "name": "Role Management",
  "parentId": 1,
  "order": 0,
  "createdAt": "2025-11-13T10:01:00.000Z",
  "updatedAt": "2025-11-13T10:05:00.000Z"
}
```

### Delete (DELETE /menu/:id)

```
DELETE /menu/2
```

Response 200

```
{
  "id": 2,
  "name": "Role Management",
  "parentId": 1,
  "order": 0,
  "createdAt": "2025-11-13T10:01:00.000Z",
  "updatedAt": "2025-11-13T10:05:00.000Z"
}
```

### DTOs

- CreateMenuDto
  - `name: string` (required)
  - `parentId?: number | null` (optional)

- UpdateMenuDto extends CreateMenuDto (all fields optional)

## Behavior and conventions

- CORS is enabled by default.
- ValidationPipe is active (whitelist=true). Unknown payload fields are stripped.
- Swagger is mounted at `/api/docs`.
- The web app consumes this API via `NEXT_PUBLIC_API_URL + "/menu"`.

## Scripts

```bash
npm run start        # start (prod)
npm run start:dev    # start in watch mode
npm run build        # compile to dist
npm run lint         # eslint --fix
npm run test         # unit tests
npm run test:e2e     # e2e tests
```

## Prisma helpers

```bash
npx prisma generate              # generate client
npx prisma migrate dev --name x  # create/apply a migration
npx prisma studio                # open Prisma Studio
```

## Troubleshooting

- Ensure `DATABASE_URL` is reachable.
- If schema changes, re-run `npx prisma generate` and `npx prisma migrate dev`.
- Swagger not loading? Verify the server runs on the configured `PORT` and check CORS/network settings.
