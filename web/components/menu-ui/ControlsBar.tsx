"use client";

import React from "react";
import { Search } from "lucide-react";
import { ControlsBarProps } from "@/models/ui.model";

export default function ControlsBar({
  query,
  onQueryChange,
  onExpandAll,
  onCollapseAll,
}: ControlsBarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={onExpandAll}
          className="rounded-3xl bg-[#1D2939] px-5 py-2 text-sm font-semibold text-white ring-1 ring-border hover:bg-[#111827] cursor-pointer"
        >
          Expand All
        </button>
        <button
          onClick={onCollapseAll}
          className="rounded-3xl bg-secondary px-5 py-2 text-sm font-semibold text-foreground ring-1 ring-border hover:bg-accent cursor-pointer"
        >
          Collapse All
        </button>
      </div>

      <div className="relative ml-auto min-w-40 flex-1 sm:flex-none sm:w-64">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className="w-full rounded-md border bg-background pl-8 pr-3 py-2 text-sm"
          placeholder="Search menu..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
    </div>
  );
}
