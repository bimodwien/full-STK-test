import { TMenu } from "@/models/menu.model";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type menuState = {
  data: TMenu[];
  loading: boolean;
  error: string | null;
};

const initialState: menuState = {
  data: [],
  loading: false,
  error: null,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<TMenu[]>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addMenuLocal: (state, action: PayloadAction<TMenu>) => {
      const item = action.payload;
      if (item.parentId == null) {
        state.data.push(item);
        return;
      }
      const insertRecursively = (menus: TMenu[]): boolean => {
        for (const m of menus) {
          if (m.id === item.parentId) {
            m.children = m.children ? [...m.children, item] : [item];
            return true;
          }
          if (m.children && insertRecursively(m.children)) return true;
        }
        return false;
      };
      insertRecursively(state.data);
    },
    updateMenuLocal: (state, action: PayloadAction<TMenu>) => {
      const updateRecursively = (menus: TMenu[]): TMenu[] =>
        menus.map((menu) =>
          menu.id === action.payload.id
            ? { ...menu, ...action.payload }
            : { ...menu, children: updateRecursively(menu.children ?? []) }
        );
      state.data = updateRecursively(state.data);
    },
    deleteMenuLocal: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const removeRecursively = (menus: TMenu[]): TMenu[] =>
        menus.filter((menu) => {
          menu.children = removeRecursively(menu.children ?? []);
          return menu.id !== id;
        });
      state.data = removeRecursively(state.data);
    },
  },
});

export const {
  setMenu,
  setLoading,
  setError,
  addMenuLocal,
  updateMenuLocal,
  deleteMenuLocal,
} = menuSlice.actions;

export default menuSlice.reducer;
