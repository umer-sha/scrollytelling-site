"use client";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small inline "Hide text / Show text" control (plain text style, sits under a section's copy). */
export function HideTextButton({
  hidden,
  onToggle,
  className,
}: {
  hidden: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={hidden}
      className={cn(
        "pointer-events-auto inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80 underline-offset-[6px] transition-colors hover:text-white hover:underline",
        className
      )}
    >
      {hidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
      {hidden ? "Show text" : "Hide text"}
    </button>
  );
}

/** Wrapper that fades its children out (and ignores clicks) when `hidden`. */
export function Fadeable({ hidden, className, children }: { hidden: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("transition-[opacity,transform] duration-700 ease-out", hidden && "pointer-events-none translate-y-3 opacity-0", className)}>
      {children}
    </div>
  );
}
