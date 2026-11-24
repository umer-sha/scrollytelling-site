"use client";

import { Watermark } from "@/components/watermark";
import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PROJECTS, plain, type ClipKey } from "@/lib/projects";
import { cn } from "@/lib/utils";

type Item = { kind: "photo" | "film"; src: string; poster?: string; ratio: string; project: string };

const FILM_ORDER: ClipKey[] = ["hero", "ch2", "ch1", "ch3", "aerial", "ch4", "party"];

const filmsOf = (slug: string): Item[] => {
  const p = PROJECTS.find((x) => x.slug === slug)!;
  return FILM_ORDER.map((k) => ({ kind: "film", src: p.clips[k].src, poster: p.clips[k].poster, ratio: p.ratio, project: slug }));
};
const photosOf = (slug: string): Item[] => {
  const p = PROJECTS.find((x) => x.slug === slug)!;
  return [
    ...p.wide.map((src) => ({ kind: "photo" as const, src, ratio: p.ratio, project: slug })),
    ...p.tall.map((src) => ({ kind: "photo" as const, src, ratio: "4/5", project: slug })),
  ];
};

// round-robin so every project shows up evenly in mixed views
const zip = <T,>(lists: T[][]): T[] => {
  const out: T[] = [];
  for (let i = 0; i < Math.max(0, ...lists.map((l) => l.length)); i++) lists.forEach((l) => l[i] && out.push(l[i]));
  return out;
};

// interleave photos and films so the "All" view has rhythm
const mix = (photos: Item[], films: Item[]): Item[] => {
  const out: Item[] = [];
  let f = 0;
  photos.forEach((p, i) => {
    out.push(p);
    if (i % 2 === 1 && films[f]) out.push(films[f++]);
  });
  while (films[f]) out.push(films[f++]);
  return out;
};

function build(slug: string | "all") {
  const slugs = slug === "all" ? PROJECTS.map((p) => p.slug) : [slug];
  const photos = zip(slugs.map(photosOf));
  const films = zip(slugs.map(filmsOf));
  return { all: mix(photos, films), photo: photos, film: films };
}

const TABS = [
  { id: "all", label: "All" },
  { id: "photo", label: "Photos" },
  { id: "film", label: "Films" },
] as const;

export function PortfolioGrid() {
  const root = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [proj, setProj] = useState<string>("all");
  const [light, setLight] = useState<Item | null>(null);
  const items = build(proj)[tab];

  useGSAP(
    () => {
      ScrollTrigger.batch(".pg-item", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.fromTo(els, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" }),
      });
    },
    { scope: root, dependencies: [tab, proj], revertOnUpdate: true }
  );

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(t);
  }, [tab, proj]);

  useEffect(() => {
    if (!light) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLight(null);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [light]);

  const chip = (active: boolean) =>
    cn("rounded-full border px-5 py-2 text-sm transition-colors", active ? "border-foreground bg-foreground text-background" : "border-foreground/20 hover:border-accent");

  return (
    <div ref={root}>
      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setProj("all")} className={chip(proj === "all")}>All stories</button>
          {PROJECTS.map((p) => (
            <button key={p.slug} onClick={() => setProj(p.slug)} className={chip(proj === p.slug)}>
              {plain(p.title)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={chip(tab === t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div key={tab + proj} className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((it, i) => (
          <button
            key={it.src + i}
            onClick={() => setLight(it)}
            className="pg-item group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-muted text-left opacity-0"
            style={{ aspectRatio: it.ratio }}
          >
            {it.kind === "film" ? (
              <video
                src={it.src}
                poster={it.poster}
                muted
                loop
                playsInline
                preload="none"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            ) : (
              <img src={it.src} alt="Wedding photograph" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            )}
            {it.kind === "film" && (
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">
                <Play className="size-3 fill-white" /> Film
              </span>
            )}
          </button>
        ))}
      </div>

      {light && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-3 md:p-10" onClick={() => setLight(null)}>
          <button aria-label="Close" className="absolute right-4 top-4 text-white" onClick={() => setLight(null)}>
            <X className="size-8" />
          </button>
          {light.kind === "film" ? (
            <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}><video src={light.src} controls controlsList="nodownload noremoteplayback" disablePictureInPicture autoPlay loop playsInline className="max-h-full max-w-full rounded-xl" /><Watermark /></div>
          ) : (
            <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}><img src={light.src} alt="" draggable={false} className="max-h-full max-w-full rounded-xl object-contain" /><Watermark /></div>
          )}
        </div>
      )}
    </div>
  );
}
