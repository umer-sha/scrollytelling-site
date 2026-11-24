"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { PILL } from "@/components/pill";

/**
 * Global sound switch for the story pages.
 * Off by default (browsers block unmuted autoplay until the visitor interacts).
 * Individual <Clip sound /> videos listen to this and only become audible while they are on screen.
 */
type SoundCtx = { enabled: boolean; toggle: () => void };
const Ctx = createContext<SoundCtx>({ enabled: false, toggle: () => {} });
let audioCtx: AudioContext | null = null;
/** One shared Web Audio context (created on the first user-triggered sound-on). */
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  return audioCtx;
}
export const useSound = () => useContext(Ctx);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const toggle = useCallback(() => setEnabled((v) => !v), []);
  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** White pill (same look as Hide text). Placed by <StoryControls />. */
export function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button type="button" onClick={toggle} aria-pressed={enabled} aria-label={enabled ? "Turn sound off" : "Turn sound on"} className={PILL}>
      {enabled ? (
        <Volume2 className="size-4" />
      ) : (
        <span className="relative flex size-4 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#c9a66b] opacity-70" />
          <VolumeX className="relative size-4" />
        </span>
      )}
      <span className="eq flex h-3 items-end gap-[2px]" aria-hidden data-on={enabled}>
        <i /> <i /> <i />
      </span>
      {enabled ? "Sound on" : "Sound off"}
    </button>
  );
}
