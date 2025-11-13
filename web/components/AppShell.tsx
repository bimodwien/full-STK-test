"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu as MenuIcon } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar: static on md+, off-canvas on <md */}
      <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 bg-background text-foreground">
        {/* Mobile top bar with burger */}
        <div className="sticky top-0 z-20 flex items-center gap-2 border-b bg-white px-3 py-2 lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-200"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
