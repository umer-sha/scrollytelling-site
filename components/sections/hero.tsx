"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Clip } from "@/components/clip";
import { SplitHeading } from "@/components/split-heading";
import { gsap, useGSAP } from "@/lib/gsap";
import { CLIPS } from "@/lib/content";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // entrance (after the preloader lifts)
      gsap.from(".hero-bg", { scale: 1.25, duration: 2.6, delay: 1.5, ease: "power3.out" });
      gsap.from(".hero-fade", { y: 26, autoAlpha: 0, duration: 1, stagger: 0.12, delay: 2.1, ease: "power3.out" });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-bg", { scale: 1.18, yPercent: 12, ease: "none", scrollTrigger: st });
        gsap.to(".hero-copy", { yPercent: -18, autoAlpha: 0, ease: "none", scrollTrigger: st });
        gsap.to(".hero-veil", { opacity: 0.85, ease: "none", scrollTrigger: st });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-black text-white">
      <div className="hero-bg absolute inset-0">
        <Clip src={CLIPS.hero.src} poster={CLIPS.hero.poster} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/45" />
      <div className="hero-veil pointer-events-none absolute inset-0 bg-black opacity-0" />

      <div className="hero-copy relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 md:px-8 md:pb-24">
        <p className="hero-fade mb-4 text-[11px] uppercase tracking-[0.3em] text-white/75 md:text-xs">
          San Diego area · Weddings &amp; events
        </p>
        <SplitHeading
          as="h1"
          immediate
          delay={1.9}
          text="Your wedding day, *kept forever.*"
          className="max-w-4xl text-[clamp(2.75rem,9.5vw,8.5rem)] [&_.italic]:text-[#e3c796]"
        />
        <p className="hero-fade mt-5 max-w-md text-base leading-relaxed text-white/85 md:text-lg">
          I photograph weddings and special events, capturing every moment the way you lived it: the joy, the tears, the first dance.
        </p>
        <div className="hero-fade mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-white/90">
            <Link href="/contact">Book a consultation</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-white/50 text-white hover:bg-white hover:text-black">
            <Link href="/portfolio">View portfolio</Link>
          </Button>
        </div>
      </div>

      <div className="hero-fade absolute bottom-6 right-5 z-10 hidden items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/70 md:flex md:right-8">
        Scroll <ArrowDown className="size-4 animate-bounce" />
      </div>
    </section>
  );
}

