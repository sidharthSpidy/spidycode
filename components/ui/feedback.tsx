"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  push: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue>({ push: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = (message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.round(Math.random() * 1000);
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3600);
  };

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; type?: ToastType }>;
      push(customEvent.detail.message, customEvent.detail.type ?? "info");
    };

    window.addEventListener("spidy:toast", listener as EventListener);
    return () => window.removeEventListener("spidy:toast", listener as EventListener);
  }, []);

  const value = useMemo(() => ({ push }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-120 flex w-[min(360px,calc(100%-1.5rem))] flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={`rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${toast.type === "error" ? "border-rose-400/30 bg-rose-500/15 text-rose-100" : toast.type === "success" ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100" : "border-cyan-400/30 bg-slate-950/80 text-slate-100"}`}
            >
              <div className="flex items-start gap-2">
                {toast.type === "error" ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : toast.type === "success" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <Info className="mt-0.5 size-4 shrink-0" />}
                <p className="text-sm leading-6">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export function showToast(message: string, type: ToastType = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("spidy:toast", { detail: { message, type } }));
}
