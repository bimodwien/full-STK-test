export type TMenu = {
  id: number;
  name: string;
  parentId: number | null;
  children?: TMenu[];
  order?: number;
};

// Tree node with non-optional children for rendering purposes
export type TMenuNode = {
  id: number;
  name: string;
  parentId: number | null;
  order?: number;
  children: TMenuNode[];
};

// Props contract for MenuTree component
export type MenuTreeProps = {
  data: TMenu[]; // can be flat or nested
  selectedId: number | null;
  onSelect: (id: number) => void;
  expandAllSignal?: number; // increment to expand all
  collapseAllSignal?: number; // increment to collapse all
  // optional features
  searchQuery?: string;
  onAdd?: (parentId: number | null, name: string) => void;
  onRename?: (id: number, name: string) => void;
  onDelete?: (id: number) => void;
};
