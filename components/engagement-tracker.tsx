"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";

/**
 * Time-on-page for Vercel Analytics (which does not measure it by itself).
 * Counts only ACTIVE seconds: tab visible and the visitor scrolled/moved/tapped in the last 30 s.
 * Sends one custom event, "page_time" { path, time }, when the visitor leaves the page or changes route.
 * Custom events need a Vercel Pro/Enterprise plan; on Hobby this is a harmless no-op.
 */
const bucket = (s: number) => (s < 10 ? "03-10s" : s < 30 ? "10-30s" : s < 60 ? "30-60s" : s < 180 ? "1-3min" : s < 600 ? "3-10min" : "10min+");

export function EngagementTracker() {
  const path = usePathname();

  useEffect(() => {
    let active = 0;
    let last = Date.now();
    let lastInput = Date.now();
    let sent = false;

    const tick = () => {
      const now = Date.now();
      if (!document.hidden && now - lastInput < 30_000) active += Math.min(now - last, 2000);
      last = now;
    };
    const iv = setInterval(tick, 1000);
    const input = () => (lastInput = Date.now());
    const events = ["scroll", "pointermove", "pointerdown", "keydown", "touchstart", "wheel"] as const;
    events.forEach((e) => window.addEventListener(e, input, { passive: true }));

    const send = () => {
      if (sent) return;
      tick();
      const s = Math.round(active / 1000);
      if (s >= 3) {
        sent = true;
        track("page_time", { path, time: bucket(s) });
      }
    };
    const onHide = () => document.visibilityState === "hidden" && send();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", send);

    return () => {
      send(); // route change
      clearInterval(iv);
      events.forEach((e) => window.removeEventListener(e, input));
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", send);
    };
  }, [path]);

  return null;
}
