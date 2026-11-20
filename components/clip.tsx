"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "@/components/sound";
import { cn } from "@/lib/utils";

/**
 * Muted looping background video with a poster so there's never an empty frame.
 * Plays only while on screen (and pauses when the tab is hidden), which keeps
 * scroll animations smooth with several videos on a page.
 */
export function Clip({
  src,
  poster,
  className,
  videoRef,
  manual = false,
  sound = false,
  audible,
}: {
  src: string;
  poster: string;
  className?: string;
  videoRef?: React.Ref<HTMLVideoElement>;
  /** parent decides when to play/pause (used by the pinned story, where all slides overlap) */
  manual?: boolean;
  /** has audio: becomes audible only while ≥40% on screen AND the global sound switch is on */
  sound?: boolean;
  /** parent decides which slide is audible (pinned story); still needs the global switch on */
  audible?: boolean;
}) {
  const local = useRef<HTMLVideoElement | null>(null);
  const { enabled } = useSound();
  const [inView, setInView] = useState(false);
  const audibleNow = enabled && (audible !== undefined ? audible : sound && inView);

  // on-screen test for sound (stricter than the play/pause margin above)
  useEffect(() => {
    const v = local.current;
    if (!v || !sound || audible !== undefined) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, [src, sound, audible]);

  // smooth fade in/out so sound never cuts in or out abruptly
  useEffect(() => {
    const v = local.current;
    if (!v) return;
    const target = audibleNow ? 1 : 0;
    if (target) v.muted = false;
    const from = v.volume;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 450);
      v.volume = Math.min(1, Math.max(0, from + (target - from) * k));
      if (k < 1) raf = requestAnimationFrame(step);
      else if (!target) v.muted = true;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [audibleNow]);

  useEffect(() => {
    const v = local.current;
    if (!v || manual) return;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
      },
      { rootMargin: "120px" }
    );
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [src, manual]);

  return (
    <video
      ref={(el) => {
        local.current = el;
        if (typeof videoRef === "function") videoRef(el);
        else if (videoRef) (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
      }}
      className={cn("h-full w-full object-cover", className)}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
    />
  );
}
