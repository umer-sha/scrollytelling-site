"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Clip } from "@/components/clip";
import { SplitHeading } from "@/components/split-heading";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/projects";

export function NextProject({ project }: { project: Project }) {
  const root = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".np-bg",
        { yPercent: -8, scale: 1.18 },
        { yPercent: 8, scale: 1.04, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
    },
    { scope: root, dependencies: [project.slug] }
  );

  return (
    <Link
      ref={root}
      href={`/portfolio/${project.slug}`}
      className="group relative block overflow-hidden bg-black px-5 py-32 text-white md:px-8 md:py-52"
    >
      <div className="np-bg absolute inset-0 will-change-transform">
        <Clip src={project.clips.hero.src} poster={project.clips.hero.poster} className="transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-black/55 transition-colors duration-700 group-hover:bg-black/40" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/70">Next story · {project.no}</p>
        <SplitHeading text={project.title} className="max-w-4xl text-[clamp(2.75rem,9vw,8rem)] [&_.italic]:text-[#e3c796]" />
        <span className="mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.25em]">
          Enter the story
          <ArrowRight className="size-5 transition-transform duration-500 group-hover:translate-x-2" />
        </span>
      </div>
    </Link>
  );
}
