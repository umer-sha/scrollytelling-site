"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Clip } from "@/components/clip";
import { SplitHeading } from "@/components/split-heading";
import { gsap, useGSAP } from "@/lib/gsap";
import { PROJECTS } from "@/lib/projects";
import { cn } from "@/lib/utils";

/**
 * Home-page showcase: one full-screen card per project. Cards stack as you scroll
 * (CSS sticky, so it stays smooth) while the card underneath recedes.
 * Adds itself automatically for every entry in lib/projects.ts.
 */
export function FeaturedProjects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".fp-card");
        cards.forEach((card, i) => {
          // media drifts slowly while its own card is on screen
          gsap.fromTo(
            card.querySelector(".fp-media"),
            { yPercent: i === 0 ? 0 : -8, scale: 1.12 },
            { yPercent: 8, scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } }
          );
          // when the next card slides over, this one recedes
          const next = cards[i + 1];
          if (next) {
            gsap.to(card.querySelector(".fp-inner"), {
              scale: 0.92,
              yPercent: -4,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
            });
            gsap.to(card.querySelector(".fp-dim"), {
              opacity: 0.7,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
            });
          }
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="stories" className="bg-background">
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-8 md:px-8 md:pb-20 md:pt-12">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Stories</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitHeading text="Every wedding, *its own film*" className="max-w-3xl text-[clamp(2.5rem,7vw,5.5rem)]" />
          <Link href="/portfolio" className="text-sm uppercase tracking-[0.25em] underline-offset-8 hover:underline">
            All stories
          </Link>
        </div>
      </div>

      <div className="relative">
        {PROJECTS.map((p, i) => (
          <article
            key={p.slug}
            className={cn("fp-card sticky top-0 h-[100svh] min-h-[540px] overflow-hidden bg-black text-white", i > 0 && "rounded-t-[1.75rem] md:rounded-t-[2.5rem]")}
            style={{ zIndex: i + 1 }}
          >
            <div className="fp-inner absolute inset-0 will-change-transform">
              <div className="fp-media absolute inset-0 will-change-transform">
                <Clip src={p.clips.hero.src} poster={p.clips.hero.poster} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

              <Link href={`/portfolio/${p.slug}`} className="absolute inset-0 z-10" aria-label={`Open story: ${p.title.replace(/\*/g, "")}`} />

              <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-between px-5 pb-12 pt-24 md:px-8 md:pb-16">
                <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.3em] text-white/75 md:text-xs">
                  <span>Story {p.no} / {String(PROJECTS.length).padStart(2, "0")}</span>
                  <span>{p.type}</span>
                </div>
                <div>
                  <SplitHeading text={p.title} className="max-w-4xl text-[clamp(2.75rem,9vw,8rem)] [&_.italic]:text-[#e3c796]" />
                  <p className="mt-4 max-w-md text-base text-white/85 md:text-lg">{p.tagline}</p>
                  <span className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/50 px-6 py-3 text-xs uppercase tracking-[0.25em] backdrop-blur">
                    Enter the story <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </div>
            </div>
            <div className="fp-dim pointer-events-none absolute inset-0 z-30 bg-black opacity-0" />
          </article>
        ))}
      </div>
    </section>
  );
}
