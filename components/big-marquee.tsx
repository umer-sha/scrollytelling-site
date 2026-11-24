"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const A = ["Weddings", "Engagements", "Henna nights", "Baptism", "Events"];
const B = ["Cinematic film", "4K video", "Private gallery", "Headshots", "Quinceañera"];

function Line({ words, outline }: { words: string[]; outline?: boolean }) {
  const loop = [...words, ...words];
  return (
    <div className="flex w-max items-center gap-8 whitespace-nowrap">
      {loop.map((w, i) => (
        <span key={i} className="flex items-center gap-8">
          <span
            className={
              outline
                ? "font-serif text-[clamp(3.5rem,11vw,10rem)] font-light italic text-transparent [-webkit-text-stroke:1px_var(--foreground)]"
                : "font-serif text-[clamp(3.5rem,11vw,10rem)] font-light"
            }
          >
            {w}
          </span>
          <span className="text-3xl text-champagne md:text-5xl">✦</span>
        </span>
      ))}
    </div>
  );
}

export function BigMarquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const trig = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 };
      gsap.fromTo(".m1", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: trig });
      gsap.fromTo(".m2", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger: trig });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="overflow-hidden bg-background py-14 md:py-24" aria-hidden>
      <div className="m1"><Line words={A} /></div>
      <div className="m2 mt-2"><Line words={B} outline /></div>
    </div>
  );
}
