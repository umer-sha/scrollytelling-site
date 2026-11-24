"use client";

import { useRef, useState } from "react";
import { SectionControls, Fadeable } from "@/components/hide-text";
import { Clip } from "@/components/clip";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/projects";

export function Story({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null);
  const chapters = project.chapters;
  const [hidden, setHidden] = useState(false);
  // which chapter is showing and whether the pinned section is on screen (drives which video has sound)
  const [view, setView] = useState({ cur: 0, on: false });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const slides = gsap.utils.toArray<HTMLElement>(".st-slide");
        const texts = gsap.utils.toArray<HTMLElement>(".st-text");
        const dots = gsap.utils.toArray<HTMLElement>(".st-dot");
        const n = chapters.length;
        const videos = Array.from(root.current!.querySelectorAll<HTMLVideoElement>(".st-vid video"));
        const playing = videos.map(() => false);
        // only the slide(s) actually on screen decode video; the others sit paused on their poster
        const setPlaying = (i: number, on: boolean) => {
          if (playing[i] === on) return;
          playing[i] = on;
          if (on) videos[i].play().catch(() => {});
          else videos[i].pause();
        };

        gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(texts.slice(1), { autoAlpha: 0, y: 40 });
        gsap.set(dots.slice(1), { opacity: 0.35 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${n * 110}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const t = self.animation!.time();
              let cur = 0;
              for (let i = 1; i < n; i++) if (t >= i - 0.6 + 0.35) cur = i;
              setView((v) => (v.cur === cur && v.on === self.isActive ? v : { cur, on: self.isActive }));
              videos.forEach((_, i) => {
                const from = i === 0 ? -1 : i - 0.6 - 0.05;
                const to = i === n - 1 ? Infinity : i + 1 - 0.6 + 0.85;
                setPlaying(i, self.isActive && t >= from && t <= to);
              });
            },
            onToggle: (self) => {
              if (!self.isActive) {
                videos.forEach((_, i) => setPlaying(i, false));
                setView((v) => (v.on ? { ...v, on: false } : v));
              }
            },
          },
        });

        tl.to(".st-bar", { scaleX: 1, ease: "none", duration: n - 1 }, 0);
        for (let i = 1; i < n; i++) {
          const at = i - 0.6;
          tl.to(texts[i - 1], { autoAlpha: 0, y: -40, duration: 0.35, ease: "power2.in" }, at)
            .to(slides[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power3.inOut" }, at)
            .fromTo(slides[i].querySelector(".st-vid"), { scale: 1.25 }, { scale: 1, duration: 0.8, ease: "power3.out" }, at)
            .to(slides[i - 1].querySelector(".st-vid"), { scale: 1.06, yPercent: -3, duration: 0.8 }, at)
            .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, at + 0.45)
            .to(dots[i - 1], { opacity: 0.35, duration: 0.2 }, at)
            .to(dots[i], { opacity: 1, duration: 0.2 }, at + 0.3);
        }
        tl.to({}, { duration: 0.4 });
      });
    },
    { scope: root, dependencies: [project.slug] }
  );

  return (
    <section ref={root} id="story" className="relative h-[100svh] min-h-[520px] overflow-hidden bg-black text-white">
      {chapters.map((c, i) => (
        <div key={c.no} className="st-slide absolute inset-0 will-change-[clip-path]">
          <div className="st-vid absolute inset-0 will-change-transform">
            <Clip src={project.clips[c.clip].src} poster={project.clips[c.clip].poster} manual audible={view.on && view.cur === i} />
          </div>
          <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45 transition-opacity duration-700 ${hidden ? "opacity-20" : "opacity-100"}`} />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-5 pb-24 pt-24 md:px-8 md:pb-24 md:pt-28">
        <Fadeable hidden={hidden}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/75 md:text-xs">
            A day in four chapters · {String(view.cur + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
          </p>
        </Fadeable>

        <Fadeable hidden={hidden} className="relative h-[17rem] md:h-[22rem]">
          {chapters.map((c) => (
            <div key={c.no} className="st-text absolute inset-x-0 bottom-0">
              <span className="font-serif text-7xl font-light italic text-[#e3c796] md:text-[10rem] md:leading-none">{c.no}</span>
              <h3 className="mt-1 font-serif text-4xl font-light md:text-7xl">{c.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 md:text-lg">{c.body}</p>
            </div>
          ))}
        </Fadeable>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {chapters.map((c) => (
              <span key={c.no} className="st-dot size-2 rounded-full bg-white" />
            ))}
          </div>
          <div className="h-px flex-1 bg-white/25">
            <div className="st-bar h-full origin-left scale-x-0 bg-[#e3c796]" />
          </div>
        </div>
      </div>
      <SectionControls hidden={hidden} onToggle={() => setHidden((v) => !v)} />
    </section>
  );
}

