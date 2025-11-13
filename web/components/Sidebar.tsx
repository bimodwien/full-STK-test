"use client";
import React from "react";
import Link from "next/link";
import {
  FolderClosed,
  Grid2x2,
  LayoutGrid,
  Users,
  Trophy,
  Menu as MenuIcon,
} from "lucide-react";

type NavItem = {
  key: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

const items: NavItem[] = [
  { key: "systems", label: "Systems", href: "/systems", icon: FolderClosed },
  {
    key: "system-code",
    label: "System Code",
    href: "/system-code",
    icon: Grid2x2,
  },
  {
    key: "properties",
    label: "Properties",
    href: "/properties",
    icon: Grid2x2,
  },
  {
    key: "menus",
    label: "Menus",
    href: "/",
    icon: LayoutGrid,
    active: true,
  },
  { key: "api-list", label: "API List", href: "/api-list", icon: Grid2x2 },
  { key: "users", label: "Users & Group", href: "/users", icon: Users },
  {
    key: "competition",
    label: "Competition",
    href: "/competition",
    icon: FolderClosed,
  },
];

type SidebarProps = {
  isOpen?: boolean; // for mobile off-canvas
  onClose?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  return (
    <>
      {/* Backdrop on mobile when open */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col gap-6 bg-[#0A4DA8] p-4 text-white transition-transform md:w-80 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {/* Simple logo placeholder */}
            <div className="h-6 w-6 rounded-md bg-white/20" />
            <span className="text-sm font-semibold leading-tight md:text-base">
              Solusi Teknologi
              <br />
              Kreatif
            </span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15 lg:hidden"
            onClick={onClose}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Nav container */}
        <nav className="rounded-2xl bg-white/10 p-2 ring-1 ring-white/10">
          <ul className="flex flex-col gap-1">
            {items.map(({ key, label, href = "#", icon: Icon, active }) => {
              return (
                <li key={key}>
                  <Link
                    href={href}
                    className={`group flex items-center gap-3 rounded-xl px-4 py-4 text-base transition 
                    ${
                      active
                        ? "bg-white text-[#0A4DA8] shadow-sm"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-md border text-current ${
                        active
                          ? "border-[#0A4DA8]/20 bg-white"
                          : "border-white/15 bg-white/10"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active ? "text-[#0A4DA8]" : "text-white"
                        }`}
                      />
                    </span>
                    <span className="font-semibold tracking-wide">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom spacer to push content nicely */}
        <div className="mt-auto" />
      </aside>
    </>
  );
};

export default Sidebar;
