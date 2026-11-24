"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { SectionControls, Fadeable } from "@/components/hide-text";
import { track } from "@vercel/analytics";
import { Watermark } from "@/components/watermark";
import { Clip } from "@/components/clip";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/projects";

export function Film({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".film-frame", { clipPath: "inset(24% 14% 24% 14% round 32px)" });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(".film-frame", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(".film-vid", { scale: 1.3 }, { scale: 1, ease: "power2.out", duration: 1 }, 0)
          .to(".film-title", { yPercent: -60, autoAlpha: 0, ease: "power2.in", duration: 0.45 }, 0.15)
          .fromTo(".film-cta", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, ease: "power3.out", duration: 0.35 }, 0.65);
      });
    },
    { scope: root, dependencies: [project.slug] }
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <section ref={root} className="relative h-[100svh] min-h-[520px] overflow-hidden bg-background">
        <div className="film-title pointer-events-none absolute inset-x-0 top-[9%] z-10 px-5 text-center md:top-[11%]">
          <Fadeable hidden={hidden}>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Featured film</p>
          <h2 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-none">
            Modern elegance <span className="italic text-champagne">on film</span>
          </h2>
          </Fadeable>
        </div>

        <div className="film-frame absolute inset-0 bg-black will-change-[clip-path]">
          <div className="film-vid absolute inset-0 will-change-transform">
            <Clip src={project.clips.party.src} poster={project.clips.party.poster} sound={!open} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>

        <div className="film-cta pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 px-5 pb-24 text-white opacity-0 md:px-12 md:pb-24">
          <div>
            <Fadeable hidden={hidden}>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">{project.filmLabel}</p>
              <p className="font-serif text-4xl font-light md:text-6xl">Watch the film</p>
            </Fadeable>
          </div>
          <button
            onClick={() => {
              setOpen(true);
              track("film_play", { project: project.slug });
            }}
            aria-label="Play the wedding film"
            className="pointer-events-auto group flex size-16 shrink-0 items-center justify-center rounded-full border border-white/60 backdrop-blur transition-all hover:scale-110 hover:bg-white md:size-20"
          >
            <Play className="size-6 fill-white text-white transition-colors group-hover:fill-black group-hover:text-black" />
          </button>
        </div>
        <SectionControls hidden={hidden} onToggle={() => setHidden((v) => !v)} />
      </section>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-3 md:p-10" onClick={() => setOpen(false)}>
          <button aria-label="Close" className="absolute right-4 top-4 text-white" onClick={() => setOpen(false)}>
            <X className="size-8" />
          </button>
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <video src={project.film} controls controlsList="nodownload noremoteplayback" disablePictureInPicture autoPlay playsInline className="max-h-full w-full rounded-xl" />
            <Watermark />
          </div>
        </div>
      )}
    </>
  );
}

