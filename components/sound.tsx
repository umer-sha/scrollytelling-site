"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Global sound switch for the story pages.
 * Off by default (browsers block unmuted autoplay until the visitor interacts).
 * Individual <Clip sound /> videos listen to this and only become audible while they are on screen.
 */
type SoundCtx = { enabled: boolean; toggle: () => void };
const Ctx = createContext<SoundCtx>({ enabled: false, toggle: () => {} });
export const useSound = () => useContext(Ctx);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const toggle = useCallback(() => setEnabled((v) => !v), []);
  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Floating pill, bottom-left. Render it once on any page whose videos have sound. */
export function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      className="fixed bottom-4 left-4 z-[60] flex items-center gap-3 rounded-full border border-white/30 bg-black/55 py-2.5 pl-4 pr-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/75 md:bottom-6 md:left-6"
    >
      {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
      <span className="eq flex h-3 items-end gap-[2px]" aria-hidden data-on={enabled}>
        <i /> <i /> <i />
      </span>
      Sound {enabled ? "on" : "off"}
    </button>
  );
}
