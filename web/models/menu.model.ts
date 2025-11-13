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
