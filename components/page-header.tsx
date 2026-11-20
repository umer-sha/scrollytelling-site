"use client";

import { useRef } from "react";
import { Clip } from "@/components/clip";
import { SplitHeading } from "@/components/split-heading";
import { gsap, useGSAP } from "@/lib/gsap";
import { CLIPS } from "@/lib/content";

export function PageHeader({
  kicker,
  title,
  sub,
  clip = "aerial",
}: {
  kicker: string;
  title: string;
  sub?: string;
  clip?: keyof typeof CLIPS;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(".ph-bg", {
        yPercent: 18,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".ph-copy", {
        yPercent: -25,
        autoAlpha: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.from(".ph-fade", { y: 20, autoAlpha: 0, duration: 1, stagger: 0.12, delay: 1.9, ease: "power3.out" });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex min-h-[70svh] items-end overflow-hidden bg-black text-white md:min-h-[78svh]">
      <div className="ph-bg absolute inset-0">
        <Clip src={CLIPS[clip].src} poster={CLIPS[clip].poster} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/50" />
      <div className="ph-copy relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-32 md:px-8 md:pb-20">
        <p className="ph-fade mb-4 text-xs uppercase tracking-[0.3em] text-white/70">{kicker}</p>
        <SplitHeading as="h1" immediate delay={1.8} text={title} className="text-[clamp(2.75rem,9vw,7.5rem)] [&_.italic]:text-[#e3c796]" />
        {sub && <p className="ph-fade mt-5 max-w-lg text-base text-white/80 md:text-lg">{sub}</p>}
      </div>
    </section>
  );
}
