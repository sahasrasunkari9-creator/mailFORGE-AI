import { useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { IconX } from "./icons";

/* ---------------- Button ---------------- */

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "soft";
type BtnSize = "sm" | "md" | "lg";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  loading?: boolean;
  icon?: ReactNode;
}

const VARIANTS: Record<BtnVariant, string> = {
  primary:
    "bg-gradient-to-b from-aqua-400 to-aqua-500 text-ink-950 font-semibold hover:from-aqua-300 hover:to-aqua-400 shadow-[0_10px_28px_-10px_rgba(56,226,198,0.55)] border border-aqua-300/40",
  secondary:
    "glass-chip text-mist-100 hover:border-aqua-400/40 hover:bg-aqua-400/10 font-medium",
  ghost: "text-mist-300 hover:text-mist-100 hover:bg-white/5 font-medium",
  danger:
    "bg-danger-500/15 text-danger-300 border border-danger-500/30 hover:bg-danger-500/25 font-medium",
  soft: "bg-white/5 text-mist-200 border border-white/10 hover:bg-white/10 font-medium",
};

const SIZES: Record<BtnSize, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-[15px] gap-2.5 rounded-xl",
};

export function Spinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("h-4 w-4 animate-spin", className)} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...rest
}: BtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "inline-flex select-none items-center justify-center whitespace-nowrap transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

/* ---------------- GlassCard ---------------- */

export function GlassCard({
  className,
  children,
  hover = false,
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl",
        hover &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-aqua-400/30 hover:shadow-[0_24px_60px_-24px_rgba(56,226,198,0.3)]",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ---------------- Chip (selectable pill) ---------------- */

export function Chip({
  active,
  onClick,
  children,
  className,
  disabled,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border px-3 text-[13px] font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50",
        active
          ? "border-aqua-400/60 bg-aqua-400/15 text-aqua-200 shadow-[0_0_18px_-4px_rgba(56,226,198,0.5)]"
          : "border-white/10 bg-white/[0.04] text-mist-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-mist-100",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ---------------- Field ---------------- */

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist-400">{label}</span>
        {hint && <span className="text-[11px] text-mist-500">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-danger-300">
          <span className="inline-block h-1 w-1 rounded-full bg-danger-400" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------------- Modal ---------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="anim-fade-in fixed inset-0 z-[90] flex items-end justify-center bg-ink-950/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "glass anim-modal-in max-h-[88vh] w-full overflow-y-auto rounded-2xl p-5 scrollbar-slim sm:p-6",
          wide ? "max-w-2xl" : "max-w-md"
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="font-display text-lg font-semibold text-mist-100">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-mist-400 transition-colors hover:bg-white/5 hover:text-mist-100"
            aria-label="Close"
          >
            <IconX className="h-4.5 w-4.5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Section label ---------------- */

export function SectionTitle({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[13px] font-semibold text-mist-200">
      {icon && <span className="text-aqua-300">{icon}</span>}
      {children}
      <span className="ml-2 h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}
