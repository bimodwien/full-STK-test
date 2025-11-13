## Web — Menu Management UI (Next.js)

This is the front-end for managing hierarchical menus. It connects to the API service documented in `../api/README.md`.

## Stack

- Next.js (App Router, TypeScript)
- Redux Toolkit for state
- Tailwind CSS for styling
- lucide-react icons

## Environment

Create `.env.local` in the `web` directory with:

````
NEXT_PUBLIC_API_URL=http://localhost:8001

Or copy the example file:

```bash
cp .env.example .env.local
````

````

The UI calls `${NEXT_PUBLIC_API_URL}/menu` for all operations and expects the API to be running.

Backend docs: see `../api/README.md`. Swagger UI lives at `${NEXT_PUBLIC_API_URL}/api/docs`.

## Develop

```bash
npm install
npm run dev
# open http://localhost:3000
````

## UI overview

- Two-column layout on desktop:
  - Left: Menu tree with controls
  - Right: Inline form panel for Add/Edit (blank when idle)
- Mobile: Sidebar (tree) becomes off-canvas with a burger toggle; the form stacks below content.

### Controls

- Above the tree (outside the card):
  - Expand All / Collapse All
  - Search (filters nodes but keeps ancestors visible)

### Interactions

- Hover or tap a row to reveal a blue plus next to its label.
  - Desktop: plus appears on hover.
  - Mobile: tap once on a row to reveal the plus; tap again to hide it.
- Clicking the plus opens a dropdown with: Add, Edit, Delete.

### Add

- Choose a row, click the plus, then Add.
- The right panel opens with:
  - Depth: computed from the selected parent (root = 1, child = parent + 1)
  - Parent Data: the selected parent’s name (or “-” for root)
  - Name: input for the new menu name
- Save creates the menu under the selected parent and refreshes the tree.

Note: Adding a brand new root from the UI isn’t included yet. We can add a dedicated “Add root menu” control if needed.

### Edit

- Choose a row, click the plus, then Edit.
- The right panel opens with:
  - Menu ID (read-only)
  - Depth (read-only)
  - Parent Data (read-only)
  - Name (editable)
- Save updates the item and refreshes the tree.

### Delete

- Choose a row, click the plus, then Delete.
- A confirmation will appear; confirm to remove the item. Direct children are deleted first by the API, then the parent.

## Notes

- Depth and Parent Data are derived live from the current tree to avoid stale values.
- The right panel only has borders/background when active; otherwise it stays visually blank to match the mock.
