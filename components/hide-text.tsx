"use client";

import { Eye, EyeOff } from "lucide-react";
import { SoundToggle } from "@/components/sound";
import { PILL } from "@/components/pill";
import { cn } from "@/lib/utils";

/** "Hide text / Show text" white pill. Each video section keeps its own `hidden` state. */
export function HideTextButton({ hidden, onToggle, className }: { hidden: boolean; onToggle: () => void; className?: string }) {
  return (
    <button type="button" onClick={onToggle} aria-pressed={hidden} className={cn(PILL, className)}>
      {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      {hidden ? "Show text" : "Hide text"}
    </button>
  );
}

/** Sound + Hide text side by side, pinned to the bottom-left corner of ONE video section (moves with that section). */
export function SectionControls({ hidden, onToggle }: { hidden: boolean; onToggle: () => void }) {
  return (
    <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 md:bottom-6 md:left-6 md:gap-3">
      <SoundToggle />
      <HideTextButton hidden={hidden} onToggle={onToggle} />
    </div>
  );
}

/** Wrapper that fades its children out (and ignores clicks) while `hidden`. */
export function Fadeable({ hidden, className, children }: { hidden: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("transition-[opacity,transform] duration-700 ease-out", hidden && "pointer-events-none translate-y-3 opacity-0", className)}>
      {children}
    </div>
  );
}
