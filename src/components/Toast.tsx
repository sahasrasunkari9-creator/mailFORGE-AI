import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { IconAlert, IconCheck, IconInfo, IconX } from "./icons";
import { uid } from "../lib/engine";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  msg: string;
}

interface ToastCtx {
  push: (type: ToastType, msg: string) => void;
}

const Ctx = createContext<ToastCtx>({ push: () => {} });

export function useToast() {
  return useContext(Ctx);
}

const STYLES: Record<ToastType, { border: string; icon: ReactNode }> = {
  success: { border: "border-l-aqua-400", icon: <IconCheck className="h-4 w-4 text-aqua-300" /> },
  error: { border: "border-l-danger-400", icon: <IconAlert className="h-4 w-4 text-danger-300" /> },
  info: { border: "border-l-ember-400", icon: <IconInfo className="h-4 w-4 text-ember-300" /> },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    window.clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (type: ToastType, msg: string) => {
      const id = uid();
      setItems((prev) => [...prev.slice(-3), { id, type, msg }]);
      timers.current[id] = window.setTimeout(() => remove(id), 4200);
    },
    [remove]
  );

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-3 top-3 z-[120] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-5 sm:top-5 sm:items-end">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "anim-toast-in pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-white/10 border-l-2 bg-ink-850/95 px-4 py-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl",
              STYLES[t.type].border
            )}
          >
            <span className="shrink-0">{STYLES[t.type].icon}</span>
            <p className="flex-1 text-[13px] font-medium leading-snug text-mist-100">{t.msg}</p>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 rounded-md p-1 text-mist-500 transition-colors hover:bg-white/5 hover:text-mist-200"
              aria-label="Dismiss"
            >
              <IconX className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
