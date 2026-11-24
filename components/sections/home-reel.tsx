"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Clip } from "@/components/clip";
import { gsap, useGSAP } from "@/lib/gsap";
import { PROJECTS, plain } from "@/lib/projects";

/**
 * Home-page cinematic reel: one pinned screen that plays through the best beats of EVERY project
 * (wipe transitions, slow push-ins, chapter text, a progress bar split per project).
 * Built from lib/projects.ts, so projects 3, 4, 5 appear here automatically.
 */
const BEATS = PROJECTS.flatMap((p) =>
  p.chapters
    .filter((_, i) => i === 0 || i === 1 || i === 3)
    .map((c) => ({ project: p, chapter: c, clip: p.clips[c.clip] }))
);

export function HomeReel() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const slides = gsap.utils.toArray<HTMLElement>(".hr-slide");
        const texts = gsap.utils.toArray<HTMLElement>(".hr-text");
        const n = BEATS.length;
        const videos = Array.from(root.current!.querySelectorAll<HTMLVideoElement>(".hr-vid video"));
        const playing = videos.map(() => false);
        const setPlaying = (i: number, on: boolean) => {
          if (playing[i] === on) return;
          playing[i] = on;
          if (on) videos[i].play().catch(() => {});
          else videos[i].pause();
        };

        gsap.set(slides.slice(1), { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(texts.slice(1), { autoAlpha: 0, y: 50 });
        gsap.set(texts.slice(1).map((t) => t.querySelector(".hr-link")), { pointerEvents: "none" });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${n * 90}%`,
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const t = self.animation!.time();
              videos.forEach((_, i) => {
                const from = i === 0 ? -1 : i - 0.6 - 0.05;
                const to = i === n - 1 ? Infinity : i + 1 - 0.6 + 0.85;
                setPlaying(i, self.isActive && t >= from && t <= to);
              });
            },
            onToggle: (self) => {
              if (!self.isActive) videos.forEach((_, i) => setPlaying(i, false));
            },
          },
        });

        tl.to(".hr-bar", { scaleX: 1, ease: "none", duration: n - 1 }, 0)
          .fromTo(slides[0].querySelector(".hr-vid"), { scale: 1 }, { scale: 1.1, ease: "none", duration: n - 1 }, 0);

        for (let i = 1; i < n; i++) {
          const at = i - 0.6;
          const newProject = BEATS[i].project.slug !== BEATS[i - 1].project.slug;
          tl.to(texts[i - 1], { autoAlpha: 0, y: -50, duration: 0.35, ease: "power2.in" }, at)
            .to(slides[i], { clipPath: "inset(0% 0% 0% 0%)", duration: newProject ? 1 : 0.8, ease: "power3.inOut" }, at)
            .fromTo(slides[i].querySelector(".hr-vid"), { scale: 1.3 }, { scale: 1, duration: 0.9, ease: "power3.out" }, at)
            .to(slides[i - 1].querySelector(".hr-vid"), { scale: 1.08, yPercent: 4, duration: 0.8 }, at)
            .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, at + 0.45)
            .set(texts[i].querySelector(".hr-link"), { pointerEvents: "auto" }, at + 0.6)
            .set(texts[i - 1].querySelector(".hr-link"), { pointerEvents: "none" }, at);
          if (newProject) {
            // short flash of white light on the cut between two stories
            tl.fromTo(".hr-flash", { opacity: 0 }, { opacity: 0.55, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut" }, at + 0.2);
          }
        }
        tl.to({}, { duration: 0.4 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-[100svh] min-h-[540px] overflow-hidden bg-black text-white" aria-label="Story reel">
      {BEATS.map((b, i) => (
        <div key={i} className="hr-slide absolute inset-0 will-change-[clip-path]">
          <div className="hr-vid absolute inset-0 will-change-transform">
            <Clip src={b.clip.src} poster={b.clip.poster} manual />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50" />
        </div>
      ))}
      <div className="hr-flash pointer-events-none absolute inset-0 z-20 bg-white opacity-0" />

      <div className="pointer-events-none relative z-30 mx-auto flex h-full max-w-7xl flex-col justify-between px-5 pb-12 pt-24 md:px-8 md:pb-16 md:pt-28">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/75 md:text-xs">Selected stories</p>

        <div className="relative h-[19rem] md:h-[24rem]">
          {BEATS.map((b, i) => (
            <div key={i} className="hr-text absolute inset-x-0 bottom-0">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#e3c796] md:text-xs">
                Story {b.project.no} · {plain(b.project.title)}
              </p>
              <h3 className="mt-2 font-serif text-[clamp(2.75rem,8vw,7rem)] leading-[0.95]">{b.chapter.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 md:text-lg">{b.chapter.body}</p>
              <Link
                href={`/portfolio/${b.project.slug}`}
                className="hr-link pointer-events-auto mt-6 inline-flex items-center gap-3 rounded-full border border-white/50 px-6 py-3 text-xs uppercase tracking-[0.25em] backdrop-blur transition-colors hover:bg-white hover:text-black"
              >
                Enter this story <ArrowUpRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/60">Scroll</span>
          <div className="h-px flex-1 bg-white/25">
            <div className="hr-bar h-full origin-left scale-x-0 bg-[#e3c796]" />
          </div>
        </div>
      </div>
    </section>
  );
}

