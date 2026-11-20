"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenisRef: Lenis | null = null;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
    lenisRef = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef = null;
    };
  }, []);

  // new page: jump to top, then re-measure pins once content has laid out
  useEffect(() => {
    window.scrollTo(0, 0);
    lenisRef?.scrollTo(0, { immediate: true });
    const a = setTimeout(() => ScrollTrigger.refresh(), 200);
    const b = setTimeout(() => ScrollTrigger.refresh(), 1200);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      window.removeEventListener("load", onLoad);
    };
  }, [pathname]);

  return <>{children}</>;
}
