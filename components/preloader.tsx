"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      document.documentElement.style.overflow = "hidden";
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setDone(true);
        },
      });
      tl.from(".pl-letter", { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.06 })
        .from(".pl-sub", { autoAlpha: 0, y: 12, duration: 0.6 }, "-=0.4")
        .to(".pl-line", { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, "-=0.6")
        .to(".pl-inner", { autoAlpha: 0, y: -30, duration: 0.5, delay: 0.15 })
        .to(root.current, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.2");
    },
    { scope: root }
  );

  if (done) return null;
  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#231f1b] text-[#fbf8f3]"
    >
      <div className="pl-inner text-center">
        <div className="flex justify-center overflow-hidden font-serif text-6xl font-light tracking-[0.25em] md:text-8xl">
          {"NZ PRO".split("").map((c, i) => (
            <span key={i} className="pl-letter inline-block">{c === " " ? " " : c}</span>
          ))}
        </div>
        <p className="pl-sub mt-3 text-[10px] uppercase tracking-[0.4em] text-[#c9a66b]">Photography &amp; Film</p>
        <div className="pl-line mx-auto mt-6 h-px w-40 origin-left scale-x-0 bg-[#c9a66b]" />
      </div>
    </div>
  );
}
