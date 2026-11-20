"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  text: string; // wrap italic runs in *asterisks*, e.g. "Your day, *kept forever.*"
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** play on mount instead of on scroll */
  immediate?: boolean;
  delay?: number;
};

export function SplitHeading({ text, as = "h2", className, immediate, delay = 0 }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const Tag = as as "h2";

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".w", ref.current);
      gsap.from(words, {
        yPercent: 115,
        rotate: 3,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.07,
        delay,
        scrollTrigger: immediate
          ? undefined
          : { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    { scope: ref }
  );

  let em = false;
  const nodes = text.split(" ").map((raw, i) => {
    let w = raw;
    if (w.startsWith("*")) {
      em = true;
      w = w.slice(1);
    }
    const ends = w.endsWith("*");
    if (ends) w = w.slice(0, -1);
    const italic = em;
    if (ends) em = false;
    return (
      <span key={i} className="word-mask">
        <span className={cn("w", italic && "italic text-champagne")}>{w}</span>
        {" "}
      </span>
    );
  });

  return (
    <Tag ref={ref} className={cn("font-serif font-light leading-[1.02] tracking-tight", className)}>
      {nodes}
    </Tag>
  );
}
