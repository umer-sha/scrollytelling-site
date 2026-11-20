"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clip } from "@/components/clip";
import { SplitHeading } from "@/components/split-heading";
import { gsap, useGSAP } from "@/lib/gsap";
import { CLIPS } from "@/lib/content";

export function CTA({ title = "Your story deserves to be *remembered beautifully.*" }: { title?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cta-bg",
        { yPercent: -10, scale: 1.2 },
        { yPercent: 10, scale: 1.05, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-black px-5 py-28 text-white md:px-8 md:py-44">
      <div className="cta-bg absolute inset-0">
        <Clip src={CLIPS.ch4.src} poster={CLIPS.ch4.poster} />
      </div>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/70">Reach out &amp; let&apos;s begin the journey</p>
        <SplitHeading text={title} className="text-[clamp(2.5rem,7vw,6rem)] [&_.italic]:text-[#e3c796]" />
        <p className="mx-auto mt-6 max-w-lg text-white/80">
          Tell us about your wedding or event, and we&apos;ll be with you through every step, from the first message to your final gallery.
        </p>
        <Button asChild size="lg" className="mt-9 rounded-full bg-white text-black hover:bg-white/90">
          <Link href="/contact">Request a quote</Link>
        </Button>
      </div>
    </section>
  );
}
