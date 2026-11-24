"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  /** reveal direct children one after another */
  stagger?: number;
};

export function Reveal({ children, className, y = 36, delay = 0, stagger }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const targets = stagger ? Array.from(ref.current!.children) : ref.current;
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power3.out",
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
