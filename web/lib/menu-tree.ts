import { TMenu, TMenuNode } from "@/models/menu.model";

function sortNodes(nodes: TMenuNode[]): TMenuNode[] {
  return nodes
    .map((n) => ({
      ...n,
      children: sortNodes(n.children ?? []),
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function fromFlat(flat: TMenu[]): TMenuNode[] {
  const map = new Map<number, TMenuNode>();
  const roots: TMenuNode[] = [];
  for (const item of flat) {
    map.set(item.id, {
      id: item.id,
      name: item.name,
      parentId: item.parentId,
      order: item.order,
      children: [],
    });
  }
  for (const node of map.values()) {
    if (node.parentId == null) {
      roots.push(node);
    } else {
      const parent = map.get(node.parentId);
      if (parent) parent.children.push(node);
    }
  }
  return sortNodes(roots);
}

function fromNested(nested: TMenu[]): TMenuNode[] {
  const toNode = (m: TMenu): TMenuNode => ({
    id: m.id,
    name: m.name,
    parentId: m.parentId ?? null,
    order: m.order,
    children: (m.children ?? []).map(toNode),
  });
  return sortNodes(nested.map(toNode));
}

export function buildMenuTree(data: TMenu[]): TMenuNode[] {
  const hasNested = data.some(
    (d) => Array.isArray(d.children) && d.children.length > 0
  );
  return hasNested ? fromNested(data) : fromFlat(data);
}

export function filterMenuTree(nodes: TMenuNode[], query: string): TMenuNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;
  const walk = (arr: TMenuNode[]): TMenuNode[] => {
    const out: TMenuNode[] = [];
    for (const n of arr) {
      const children = walk(n.children ?? []);
      const isMatch = n.name.toLowerCase().includes(q);
      if (isMatch || children.length) {
        out.push({ ...n, children });
      }
    }
    return out;
  };
  return walk(nodes);
}
