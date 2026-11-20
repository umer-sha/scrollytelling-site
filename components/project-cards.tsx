"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Clip } from "@/components/clip";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PROJECTS, plain } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function ProjectCards() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.batch(".pc-card", {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.fromTo(els, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.15, ease: "power3.out" }),
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="grid gap-x-6 gap-y-12 md:grid-cols-2">
      {PROJECTS.map((p, i) => (
        <Link
          key={p.slug}
          href={`/portfolio/${p.slug}`}
          className={cn("pc-card group block opacity-0", i % 2 === 1 && "md:mt-24")}
          aria-label={plain(p.title)}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-black sm:aspect-[16/11] md:aspect-[4/5] lg:aspect-[16/11]">
            <Clip
              src={p.clips.hero.src}
              poster={p.clips.hero.poster}
              className="transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 rounded-full bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white backdrop-blur">
              Story {p.no}
            </span>
            <span className="absolute bottom-5 right-5 flex size-12 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-5" />
            </span>
          </div>
          <div className="mt-5 flex items-start justify-between gap-6">
            <h3 className="font-serif text-4xl font-light leading-none md:text-5xl">
              {p.title.split("*").map((part, k) => (k % 2 ? <span key={k} className="italic text-champagne">{part}</span> : part))}
            </h3>
            <span className="mt-2 hidden shrink-0 text-[11px] uppercase tracking-[0.25em] text-muted-foreground sm:block">{p.type}</span>
          </div>
          <p className="mt-3 max-w-md text-foreground/70">{p.tagline}</p>
        </Link>
      ))}
    </div>
  );
}
