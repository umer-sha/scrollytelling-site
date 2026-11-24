"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { Clip } from "@/components/clip";
import { SectionControls, Fadeable } from "@/components/hide-text";
import { SplitHeading } from "@/components/split-heading";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/projects";

export function ProjectHero({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useGSAP(
    () => {
      gsap.from(".ph-bg", { scale: 1.2, duration: 2.4, delay: 0.1, ease: "power3.out" });
      gsap.from(".ph-fade", { y: 22, autoAlpha: 0, duration: 1, stagger: 0.12, delay: 0.5, ease: "power3.out" });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".ph-bg", { scale: 1.15, yPercent: 12, ease: "none", scrollTrigger: st });
        gsap.to(".ph-copy", { yPercent: -16, autoAlpha: 0, ease: "none", scrollTrigger: st });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-black text-white">
      <div className="ph-bg absolute inset-0 will-change-transform">
        <Clip src={project.clips.hero.src} poster={project.clips.hero.poster} sound />
      </div>
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/45 transition-opacity duration-700 ${hidden ? "opacity-25" : "opacity-100"}`} />

      <div className="ph-copy relative z-10 mx-auto w-full max-w-7xl px-5 pb-28 md:px-8 md:pb-28">
        <Fadeable hidden={hidden}>
        <p className="ph-fade mb-4 text-[11px] uppercase tracking-[0.3em] text-white/75 md:text-xs">
          Story {project.no} · {project.type}
        </p>
        <SplitHeading
          as="h1"
          immediate
          delay={0.35}
          text={project.title}
          className="max-w-5xl text-[clamp(2.75rem,9vw,8rem)] [&_.italic]:text-[#e3c796]"
        />
        <p className="ph-fade mt-5 max-w-md text-base text-white/85 md:text-lg">{project.tagline}</p>
        </Fadeable>
      </div>

      <div className="ph-fade absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-7xl items-center justify-end px-5 text-[11px] uppercase tracking-[0.3em] text-white/70 md:px-8">
        <Link href="/portfolio" className="flex items-center gap-2 hover:text-white">
          <ArrowLeft className="size-4" /> All stories
        </Link>
        <span className="hidden items-center gap-2 md:flex">
          Scroll <ArrowDown className="size-4 animate-bounce" />
        </span>
      </div>
      <SectionControls hidden={hidden} onToggle={() => setHidden((v) => !v)} />
    </section>
  );
}

