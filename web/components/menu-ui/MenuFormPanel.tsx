"use client";

import React from "react";
import { MenuFormPanelProps } from "@/models/ui.model";

export default function MenuFormPanel(props: MenuFormPanelProps) {
  const {
    isOpen,
    mode,
    draftId,
    draftName,
    draftDepth,
    draftParentLabel,
    onDraftNameChange,
    onSave,
    onCancel,
  } = props;

  if (!isOpen) {
    // keep right column width on desktop but don't force page height
    return <div className="hidden lg:block" />;
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {mode === "add" ? "Add Menu" : "Edit Menu"}
        </h3>
        <button
          className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent"
          onClick={onCancel}
        >
          Close
        </button>
      </div>
      <div className="space-y-4 max-w-96">
        {mode === "edit" && (
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
            value={draftDepth}
            readOnly
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Parent Data
          </label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={draftParentLabel}
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
            onChange={(e) => onDraftNameChange(e.target.value)}
            placeholder="Menu name"
            autoFocus
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            className="inline-flex flex-1 items-center justify-center rounded-3xl bg-[#0051AF] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 cursor-pointer"
            disabled={!draftName.trim()}
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
