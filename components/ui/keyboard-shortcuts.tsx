"use client";

import { useEffect, useState } from "react";
import { Keyboard } from "lucide-react";

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-110 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white/70 backdrop-blur"
      >
        <Keyboard className="size-3.5" />
        <span>Shortcuts</span>
      </button>
      {open ? (
        <div className="fixed inset-0 z-130 flex items-center justify-center bg-black/60 p-4 backdrop-blur" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-lg font-semibold">Keyboard shortcuts</h2>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"><span>Open shortcuts</span><code className="rounded bg-white/10 px-2 py-1 text-xs">Ctrl/Cmd + K</code></div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"><span>Close panel</span><code className="rounded bg-white/10 px-2 py-1 text-xs">Esc</code></div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
