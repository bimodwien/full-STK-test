"use client";

import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { RootSelectorProps } from "@/models/ui.model";

export default function RootSelector(props: RootSelectorProps) {
  const { currentLabel, topRoots, selectedRootId, onSelectRoot, onAddRoot } =
    props;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative inline-flex items-center rounded-lg border bg-card px-3 py-2 text-sm shadow-sm">
        <span className="text-muted-foreground">Menu</span>
        <span className="mx-2 h-4 w-px bg-border" />
        <button
          className="inline-flex items-center gap-1 font-medium"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {currentLabel} <ChevronDown className="h-4 w-4" />
        </button>

        {open && (
          <div className="absolute left-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-md border bg-card text-sm shadow-lg">
            <button
              className={`block w-full px-3 py-2 text-left hover:bg-accent ${
                selectedRootId === "all" ? "bg-accent/60" : ""
              }`}
              onClick={() => {
                onSelectRoot("all");
                setOpen(false);
              }}
            >
              All Menus
            </button>
            <div className="h-px bg-border" />
            {topRoots.map((r) => (
              <button
                key={r.id}
                className={`block w-full px-3 py-2 text-left hover:bg-accent ${
                  selectedRootId === r.id ? "bg-accent/60" : ""
                }`}
                onClick={() => {
                  onSelectRoot(r.id);
                  setOpen(false);
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className="inline-flex items-center gap-2 rounded-3xl bg-[#1D2939] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 cursor-pointer"
        onClick={onAddRoot}
      >
        <Plus className="h-4 w-4" /> Add root menu
      </button>
    </div>
  );
}
