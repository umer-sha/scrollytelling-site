"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { gsap, useGSAP } from "@/lib/gsap";
import { SERVICES } from "@/lib/content";

export function ServicesList({ items = SERVICES }: { items?: { no?: string; kind: string; title: string; body: string }[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".svc-row").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%", once: true } });
        tl.fromTo(row.querySelector(".svc-line"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.out" }, 0).from(
          row.querySelectorAll(".svc-part"),
          { y: 26, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 },
          0.1
        );
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      {items.map((s, i) => (
        <Link key={s.title} href="/contact" className="svc-row group relative block py-7 md:py-10">
          <span className="svc-line absolute inset-x-0 top-0 h-px origin-left bg-border" />
          <div className="grid grid-cols-[auto_1fr] items-start gap-x-4 md:grid-cols-[auto_1fr_auto] md:gap-x-10">
            <span className="svc-part pt-1.5 font-serif text-lg italic text-champagne md:pt-2">{s.no ?? String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="svc-part font-serif text-3xl font-light transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">{s.title}</h3>
              <p className="svc-part mt-3 max-w-xl text-sm leading-relaxed text-foreground/65 md:text-base">{s.body}</p>
              <Badge variant="outline" className="svc-part mt-4 md:hidden">{s.kind}</Badge>
            </div>
            <div className="svc-part hidden flex-col items-end gap-4 md:flex">
              <Badge variant="outline">{s.kind}</Badge>
              <ArrowUpRight className="size-6 text-foreground/40 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-champagne" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
