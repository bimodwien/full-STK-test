"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchMenu } from "@/lib/redux/middleware/menu.mdlwr";
import { TMenu } from "@/models/menu.model";
import { LayoutGrid } from "lucide-react";
import MenuTree from "@/components/menu-ui/MenuTree";
import RootSelector from "@/components/menu-ui/RootSelector";
import ControlsBar from "@/components/menu-ui/ControlsBar";
import MenuFormPanel from "@/components/menu-ui/MenuFormPanel";
import { toast } from "sonner";
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
  const [selectedRootId, setSelectedRootId] = useState<number | "all">("all");
  // modal state for add/update (slide-over on the right)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [draftId, setDraftId] = useState<number | null>(null);
  const [draftParentId, setDraftParentId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState<string>("");

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  useEffect(() => {
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

  // parent map + depth helper (support nested data)
  const parentMap = useMemo(() => {
    const m = new Map<number, number | null>();
    const walk = (arr: TMenu[], parent: number | null) => {
      for (const n of arr || []) {
        m.set(n.id, parent);
        if (n.children && n.children.length) walk(n.children, n.id);
      }
    };
    if (data && data.length) walk(data, null);
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

  // Nested lookups for node/name by id
  const findNodeById = (id: number): TMenu | null => {
    const walk = (arr: TMenu[]): TMenu | null => {
      for (const n of arr) {
        if (n.id === id) return n;
        if (n.children) {
          const got = walk(n.children);
          if (got) return got;
        }
      }
      return null;
    };
    return walk(data || []);
  };

  const findNameById = (id: number | null): string => {
    if (id == null) return "-";
    const node = findNodeById(id);
    return node?.name ?? "-";
  };

  // Derive depth and parent label based on current draft values to avoid stale/missing info
  const draftDepth = useMemo(() => {
    if (modalMode === "add") {
      return draftParentId == null ? 1 : getDepthById(draftParentId) + 1;
    }
    if (modalMode === "edit" && draftId != null) {
      return getDepthById(draftId);
    }
    return 1;
  }, [modalMode, draftParentId, draftId, parentMap]);

  const draftParentLabel = useMemo(() => {
    if (modalMode === "add") {
      return findNameById(draftParentId);
    }
    if (modalMode === "edit" && draftId != null) {
      const item = findNodeById(draftId);
      return findNameById(item?.parentId ?? null);
    }
    return "-";
  }, [modalMode, draftParentId, draftId, data]);

  // Top-level roots list and filtered data by selected root
  const topRoots = useMemo(
    () => (data || []).filter((m) => m.parentId == null),
    [data]
  );
  const currentRootLabel = useMemo(() => {
    if (selectedRootId === "all") return "All Menus";
    const r = topRoots.find((r) => r.id === selectedRootId);
    return r?.name ?? "All Menus";
  }, [selectedRootId, topRoots]);

  const filteredData = useMemo(() => {
    if (selectedRootId === "all") return data || [];
    const node = findNodeById(selectedRootId);
    return node ? [node] : [];
  }, [data, selectedRootId]);

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
      <div className="text-sm text-muted-foreground">/ Menus</div>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LayoutGrid className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">Menus</h1>
      </div>
      <RootSelector
        currentLabel={currentRootLabel}
        topRoots={topRoots}
        selectedRootId={selectedRootId}
        onSelectRoot={(id) => {
          setSelectedRootId(id);
          setCollapseAllTick((v) => v + 1);
        }}
        onAddRoot={() => {
          setModalMode("add");
          setDraftId(null);
          setDraftParentId(null);
          setDraftName("");
          setIsModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column container: controls outside the tree card */}
        <div className="lg:col-span-7">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            {currentRootLabel}
          </h2>
          {/* Controls row outside the bordered tree card */}
          <ControlsBar
            query={query}
            onQueryChange={setQuery}
            onExpandAll={() => setExpandAllTick((v) => v + 1)}
            onCollapseAll={() => setCollapseAllTick((v) => v + 1)}
          />

          {/* Tree card only */}
          <section className="rounded-lg border bg-card p-4 shadow-sm">
            <MenuTree
              data={filteredData}
              selectedId={selectedId}
              onSelect={setSelectedId}
              expandAllSignal={expandAllTick}
              collapseAllSignal={collapseAllTick}
              searchQuery={query}
              onAdd={(parentId) => {
                setModalMode("add");
                setDraftId(null);
                setDraftParentId(parentId ?? null);
                setDraftName("");
                setIsModalOpen(true);
              }}
              onRename={(id, currentName) => {
                const item = findNodeById(id);
                setModalMode("edit");
                setDraftId(id);
                setDraftParentId(item?.parentId ?? null);
                setDraftName(currentName ?? item?.name ?? "");
                setIsModalOpen(true);
              }}
              onDelete={(id) => {
                void (async () => {
                  const ok = (await dispatch(
                    deleteMenu(id)
                  )) as unknown as boolean;
                  if (ok) toast.success("Menu deleted");
                  else toast.error("Failed to delete menu");
                })();
              }}
            />
          </section>
        </div>

        {/* Right panel: blank when idle; styled form when active */}
        <section
          className={`${
            isModalOpen ? "rounded-lg border bg-card p-4 shadow-sm" : ""
          } lg:col-span-5`}
        >
          <MenuFormPanel
            isOpen={isModalOpen}
            mode={modalMode}
            draftId={draftId}
            draftName={draftName}
            draftDepth={draftDepth}
            draftParentLabel={draftParentLabel}
            onDraftNameChange={setDraftName}
            onSave={() => {
              const name = draftName.trim();
              if (!name) return;
              void (async () => {
                if (modalMode === "add") {
                  const ok = (await dispatch(
                    addMenu({ name, parentId: draftParentId ?? null })
                  )) as unknown as boolean;
                  if (ok) toast.success("Menu created");
                  else toast.error("Failed to create menu");
                } else if (modalMode === "edit" && draftId != null) {
                  const ok = (await dispatch(
                    updateMenu({ id: draftId, name })
                  )) as unknown as boolean;
                  if (ok) toast.success("Menu updated");
                  else toast.error("Failed to update menu");
                }
                setIsModalOpen(false);
              })();
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </section>
      </div>
    </div>
  );
}
