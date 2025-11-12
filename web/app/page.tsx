"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchMenu } from "@/lib/redux/middleware/menu.mdlwr";
import { TMenu } from "@/models/menu.model";
import { LayoutGrid, ChevronDown, Search } from "lucide-react";
import MenuTree from "@/components/MenuTree";
import {
  addMenu,
  updateMenu,
  deleteMenu,
} from "@/lib/redux/middleware/menu.mdlwr";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.menu);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [expandAllTick, setExpandAllTick] = useState(0);
  const [collapseAllTick, setCollapseAllTick] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [query, setQuery] = useState("");
  // modal state for add/update (slide-over on the right)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [draftId, setDraftId] = useState<number | null>(null);
  const [draftParentId, setDraftParentId] = useState<number | null>(null);
  const [draftParentName, setDraftParentName] = useState<string>("-");
  const [draftName, setDraftName] = useState<string>("");

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  useEffect(() => {
    // set default selection ke top-level pertama + expand all saat data pertama kali masuk
    if (data?.length) {
      if (!selectedId) {
        const topMenus = data.filter((item) => item.parentId === null);
        if (topMenus.length) setSelectedId(topMenus[0].id);
        else setSelectedId(data[0].id);
      }
      if (!initialized) {
        setExpandAllTick((v) => v + 1);
        setInitialized(true);
      }
    }
  }, [data, selectedId, initialized]);

  // parent map + depth helper
  const parentMap = useMemo(() => {
    const m = new Map<number, number | null>();
    (data || []).forEach((d) => m.set(d.id, d.parentId ?? null));
    return m;
  }, [data]);

  const getDepthById = (id: number | null): number => {
    if (id == null) return 1;
    let depth = 1;
    let current: number | null = id;
    let guard = 0;
    while (current != null && guard < 1000) {
      const nextParentId: number | null = parentMap.get(current) ?? null;
      if (nextParentId == null) break;
      depth += 1;
      current = nextParentId;
      guard++;
    }
    return depth;
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {loading && (
        <div className="rounded-md border bg-card p-3 text-sm">
          Loading menus...
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          Error: {error}
        </div>
      )}
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">/ Menus</div>

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LayoutGrid className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">Menus</h1>
      </div>

      {/* Top controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative inline-flex items-center rounded-lg border bg-card px-3 py-2 text-sm shadow-sm">
          <span className="text-muted-foreground">Menu</span>
          <span className="mx-2 h-4 w-px bg-border" />
          <button className="inline-flex items-center gap-1 font-medium">
            system management <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-56 rounded-md border bg-background pl-8 pr-3 py-2 text-sm"
              placeholder="Search menu..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setExpandAllTick((v) => v + 1)}
            className="rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-foreground ring-1 ring-border hover:bg-accent"
          >
            Expand All
          </button>
          <button
            onClick={() => setCollapseAllTick((v) => v + 1)}
            className="rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-foreground ring-1 ring-border hover:bg-accent"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Main content: left tree + right form panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: tree */}
        <section className="rounded-lg border bg-card p-4 shadow-sm lg:col-span-7">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            system management
          </h2>
          <MenuTree
            data={data || []}
            selectedId={selectedId}
            onSelect={setSelectedId}
            expandAllSignal={expandAllTick}
            collapseAllSignal={collapseAllTick}
            searchQuery={query}
            onAdd={(parentId) => {
              const pName =
                parentId != null
                  ? data?.find((m) => m.id === parentId)?.name ?? "-"
                  : "-";
              setModalMode("add");
              setDraftId(null);
              setDraftParentId(parentId ?? null);
              setDraftParentName(pName);
              setDraftName("");
              setIsModalOpen(true);
            }}
            onRename={(id, currentName) => {
              const item = data?.find((m) => m.id === id) || null;
              const pName =
                item?.parentId != null
                  ? data?.find((m) => m.id === item.parentId)?.name ?? "-"
                  : "-";
              setModalMode("edit");
              setDraftId(id);
              setDraftParentId(item?.parentId ?? null);
              setDraftParentName(pName);
              setDraftName(currentName ?? item?.name ?? "");
              setIsModalOpen(true);
            }}
            onDelete={(id) => dispatch(deleteMenu(id))}
          />
        </section>

        {/* Right: reserved form panel */}
        <section className="rounded-lg border bg-card p-4 shadow-sm lg:col-span-5">
          {!isModalOpen ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Select Add or Edit from the tree to manage menu data
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {modalMode === "add" ? "Add Menu" : "Edit Menu"}
                </h3>
                <button
                  className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="space-y-4">
                {modalMode === "edit" && (
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Menu ID
                    </label>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={draftId ?? "-"}
                      readOnly
                    />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Depth
                  </label>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={
                      modalMode === "add"
                        ? draftParentId == null
                          ? 1
                          : getDepthById(draftParentId) + 1
                        : draftId != null
                        ? getDepthById(draftId)
                        : 1
                    }
                    readOnly
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Parent Data
                  </label>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={draftParentName}
                    readOnly
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Name
                  </label>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="Menu name"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-[#0A4DA8] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50"
                    disabled={!draftName.trim()}
                    onClick={() => {
                      const name = draftName.trim();
                      if (!name) return;
                      if (modalMode === "add") {
                        dispatch(
                          addMenu({ name, parentId: draftParentId ?? null })
                        );
                      } else if (modalMode === "edit" && draftId != null) {
                        dispatch(updateMenu({ id: draftId, name }));
                      }
                      setIsModalOpen(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold ring-1 ring-border hover:bg-accent"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
