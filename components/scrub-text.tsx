"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Large statement whose words light up one by one as you scroll. */
export function ScrubText({ eyebrow, text }: { eyebrow?: string; text: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".sw",
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
          }
        );
      });
    },
    { scope: root, dependencies: [text] }
  );

  return (
    <section ref={root} className="bg-background px-5 py-28 md:px-8 md:py-44">
      <div className="mx-auto max-w-5xl">
        {eyebrow && <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</p>}
        <p className="font-serif text-[clamp(1.9rem,4.8vw,4.25rem)] font-light leading-[1.12]">
          {text.split(" ").map((w, i) => (
            <span key={i} className="sw inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
