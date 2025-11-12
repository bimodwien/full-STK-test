"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { TMenuNode as Node, MenuTreeProps } from "@/models/menu.model";
import { buildMenuTree, filterMenuTree } from "@/lib/menu-tree";

const INDENT = 18; // px

const MenuTree: React.FC<MenuTreeProps> = ({
  data,
  selectedId,
  onSelect,
  expandAllSignal,
  collapseAllSignal,
  searchQuery,
  onAdd,
  onRename,
  onDelete,
}) => {
  const fullTree = buildMenuTree(data);
  const tree = searchQuery ? filterMenuTree(fullTree, searchQuery) : fullTree;
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [actionMenuFor, setActionMenuFor] = useState<number | null>(null);

  function toggle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    if (expandAllSignal == null) return;
    // expand all nodes that have children
    const idsWithChildren = new Set<number>();
    const walk = (nodes: Node[]) => {
      for (const n of nodes) {
        if (n.children?.length) idsWithChildren.add(n.id);
        if (n.children?.length) walk(n.children);
      }
    };
    walk(tree);
    setExpanded(idsWithChildren);
    // intentionally not depending on `tree` to avoid re-triggering on every render
  }, [expandAllSignal]);

  useEffect(() => {
    if (collapseAllSignal == null) return;
    setExpanded(new Set());
  }, [collapseAllSignal]);

  const Row: React.FC<{ node: Node; depth: number }> = ({ node, depth }) => {
    const isParent = node.children && node.children.length > 0;
    const isOpen = isParent && expanded.has(node.id);
    return (
      <li className="relative">
        <div
          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent ${
            selectedId === node.id ? "bg-accent" : ""
          }`}
        >
          {/* indent + connectors */}
          <div className="relative shrink-0" style={{ width: depth * INDENT }}>
            {depth > 0 && (
              <>
                {/* vertical connector segment for this row */}
                <div
                  className="absolute right-2 top-0 bottom-0 w-px bg-border"
                  aria-hidden
                />
                {/* horizontal connector into the row */}
                <div
                  className="absolute right-2 top-1/2 h-px w-3 -translate-y-1/2 bg-border"
                  aria-hidden
                />
              </>
            )}
          </div>

          {/* caret */}
          {isParent ? (
            <button
              className="h-5 w-5 text-muted-foreground"
              onClick={() => toggle(node.id)}
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="h-5 w-5" />
          )}

          {/* label */}
          <button
            className="truncate text-left font-medium"
            onClick={() => onSelect(node.id)}
          >
            {node.name}
          </button>

          {/* actions as plus button with dropdown */}
          {(onAdd || onRename || onDelete) && (
            <div className="relative ml-auto flex items-center">
              <button
                type="button"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0A4DA8] text-white shadow hover:brightness-110"
                onClick={(e) => {
                  e.stopPropagation();
                  setActionMenuFor((cur) => (cur === node.id ? null : node.id));
                }}
                aria-haspopup="menu"
                aria-expanded={actionMenuFor === node.id}
              >
                <Plus className="h-4 w-4" />
              </button>

              {actionMenuFor === node.id && (
                <div
                  className="absolute right-0 top-full z-10 mt-1 w-32 rounded-md border bg-card p-1 text-sm shadow-lg"
                  role="menu"
                >
                  {onAdd && (
                    <button
                      className="block w-full rounded px-2 py-1.5 text-left hover:bg-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded((s) => new Set(s).add(node.id));
                        onAdd(node.id, "");
                        setActionMenuFor(null);
                      }}
                    >
                      Add
                    </button>
                  )}
                  {onRename && (
                    <button
                      className="block w-full rounded px-2 py-1.5 text-left hover:bg-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRename(node.id, node.name);
                        setActionMenuFor(null);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="block w-full rounded px-2 py-1.5 text-left text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Delete this menu?")) {
                          onDelete(node.id);
                        }
                        setActionMenuFor(null);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {isParent && isOpen && (
          <div className="relative">
            {/* vertical trunk for this children block */}
            <div
              className="absolute top-0 bottom-0 w-px bg-border"
              style={{ left: depth * INDENT + (depth > 0 ? INDENT - 6 : 6) }}
              aria-hidden
            />
            <ul>
              {node.children.map((child) => (
                <Row key={child.id} node={child} depth={depth + 1} />
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <ul className="space-y-0.5">
      {tree.map((node) => (
        <Row key={node.id} node={node} depth={0} />
      ))}
    </ul>
  );
};

export default MenuTree;
