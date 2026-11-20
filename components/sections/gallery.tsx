"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SplitHeading } from "@/components/split-heading";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function Gallery({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const shots = project.gallery;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const dist = () => Math.max(0, el.scrollWidth - window.innerWidth + 64);

        const scroller = gsap.to(el, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".g-inner").forEach((inner) => {
          gsap.fromTo(
            inner,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: inner.parentElement,
                containerAnimation: scroller,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });
    },
    { scope: root, dependencies: [project.slug] }
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-background py-20 md:flex md:h-[100svh] md:flex-col md:justify-center md:py-0"
    >
      <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-5 md:mb-10 md:px-8">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Selected frames</p>
          <SplitHeading text="Real days, *real feeling*" className="text-[clamp(2.5rem,7vw,5.5rem)]" />
        </div>
        <Button asChild variant="outline" className="hidden rounded-full md:inline-flex">
          <Link href="/portfolio">All stories</Link>
        </Button>
      </div>

      <div className="overflow-x-auto pb-2 [scrollbar-width:none] md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
        <div ref={track} className="flex w-max snap-x snap-mandatory items-center gap-4 px-5 will-change-transform md:gap-8 md:px-8">
          {shots.map((s, i) => (
            <figure
              key={i}
              className={cn(
                "relative shrink-0 snap-center overflow-hidden rounded-2xl bg-muted",
                s.tall
                  ? "aspect-[4/5] w-[66vw] md:h-[58vh] md:w-auto"
                  : "aspect-[16/10] w-[82vw] md:h-[42vh] md:w-auto"
              )}
            >
              <div className="g-inner absolute -inset-x-[9%] inset-y-0">
                <img src={s.src} alt={`Wedding photograph ${i + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-8 px-5 md:hidden">
        <Button asChild variant="outline" className="w-full rounded-full">
          <Link href="/portfolio">All stories</Link>
        </Button>
      </div>
    </section>
  );
}
