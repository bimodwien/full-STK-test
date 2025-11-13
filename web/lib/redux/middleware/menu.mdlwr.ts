import axios from "axios";
import { AppDispatch } from "../store";
import {
  setMenu,
  setLoading,
  setError,
  addMenuLocal,
  updateMenuLocal,
  deleteMenuLocal,
} from "../slices/menu.slice";
import { TMenu } from "@/models/menu.model";

const url = process.env.NEXT_PUBLIC_API_URL + "/menu";

export const fetchMenu = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<TMenu[]>(url);
    dispatch(setMenu(response.data));
  } catch (error) {
    dispatch(setError("Failed to set loading state"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addMenu =
  (payload: { name: string; parentId?: number | null }) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await axios.post(url, payload);
      dispatch(addMenuLocal(res.data));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message));
      return false;
    }
  };

export const updateMenu =
  (payload: { id: number; name?: string; parentId?: number | null }) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await axios.put(`${url}/${payload.id}`, payload);
      dispatch(updateMenuLocal(res.data));
      return true;
    } catch (err: any) {
      dispatch(setError(err.message));
      return false;
    }
  };

export const deleteMenu = (id: number) => async (dispatch: AppDispatch) => {
  try {
    await axios.delete(`${url}/${id}`);
    dispatch(deleteMenuLocal(id));
    return true;
  } catch (err: any) {
    dispatch(setError(err.message));
    return false;
  }
};
