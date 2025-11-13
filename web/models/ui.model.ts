import { TMenu } from "@/models/menu.model";

// Props contract for MenuTree component (TSX type centralized here)
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

// Root selector header (root filter + add root)
export type RootSelectorProps = {
  currentLabel: string;
  topRoots: TMenu[];
  selectedRootId: number | "all";
  onSelectRoot: (id: number | "all") => void;
  onAddRoot: () => void;
};

// Controls above tree
export type ControlsBarProps = {
  query: string;
  onQueryChange: (v: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
};

// Right panel form
export type MenuFormPanelProps = {
  isOpen: boolean;
  mode: "add" | "edit";
  draftId: number | null;
  draftName: string;
  draftDepth: number;
  draftParentLabel: string;
  onDraftNameChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
};
