"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchMenu } from "@/lib/redux/middleware/menu.mdlwr";

type Props = { children: React.ReactNode };

export default function MenuProvider({ children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  return <>{children}</>;
}
