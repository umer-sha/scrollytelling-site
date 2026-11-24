"use client";

import { useEffect, useRef, useState } from "react";
import { getAudioContext, useSound } from "@/components/sound";
import { cn } from "@/lib/utils";
import { framingFor } from "@/lib/focus";

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

  // Volume = switch fade (450 ms) x loop-end fade. The loop-end fade reaches exactly zero at the last frame
  // (and eases back in over the first 0.4 s), so the sound finishes in step with the picture.
  // Phones (iOS especially) ignore video.volume, so the level is set through a Web Audio gain node.
  const gain = useRef(0);
  const node = useRef<GainNode | null>(null);
  useEffect(() => {
    const v = local.current;
    if (!v) return;
    const target = audibleNow ? 1 : 0;
    if (target && !node.current) {
      try {
        const ac = getAudioContext();
        if (ac) {
          ac.resume().catch(() => {});
          const g = ac.createGain();
          g.gain.value = 0;
          ac.createMediaElementSource(v).connect(g).connect(ac.destination);
          node.current = g;
        }
      } catch {}
    }
    if (target) v.muted = false;
    let raf = 0;
    let last = performance.now();
    const set = (x: number) => {
      const lvl = Math.min(1, Math.max(0, x));
      if (node.current) node.current.gain.value = lvl;
      else v.volume = lvl;
    };
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      gain.current = target > gain.current ? Math.min(1, gain.current + dt / 450) : Math.max(0, gain.current - dt / 450);
      const d = v.duration;
      let edge = 1;
      if (isFinite(d) && d > 0) {
        const t = v.currentTime + 0.06; // audio output latency
        const out = Math.min(1, Math.max(0, (d - t) / 1.4));
        const inn = Math.min(1, v.currentTime / 0.4);
        const e = Math.min(out, inn);
        edge = e * e * (3 - 2 * e);
      }
      set(gain.current * edge);
      if (target === 0 && gain.current === 0) {
        if (!node.current) v.muted = true;
        return;
      }
      raf = requestAnimationFrame(step);
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

  const { x, zoom } = framingFor(src);
  return (
    <div className="relative h-full w-full overflow-hidden">
      <video
        ref={(el) => {
          local.current = el;
          if (typeof videoRef === "function") videoRef(el);
          else if (videoRef) (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
        }}
        // phones: full-screen vertical frame (cover) centred on the subject; letterbox bars cropped by zoom
        style={{ "--fx": `${x}%`, "--zoom": zoom } as React.CSSProperties}
        className={cn("h-full w-full object-cover max-md:[object-position:var(--fx)_50%] max-md:[transform-origin:var(--fx)_50%] max-md:scale-(--zoom)", className)}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
      />
    </div>
  );
}
