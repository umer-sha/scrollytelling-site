import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/reveal";
import { BRAND, PILLARS, TALL, WIDE } from "@/lib/content";

export const metadata: Metadata = { title: "About — NZ Pro Photography" };

export default function AboutPage() {
  return (
    <>
      <PageHeader kicker="Meet your photographer" title="*NZ PRO*" sub="Your moments, beautifully kept." clip="ch1" />

      <section className="bg-background px-5 py-20 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5" y={60}>
            <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl bg-muted">
              <img src={TALL[0]} alt="Portrait from a wedding by NZ Pro Photography" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal className="md:col-span-7 md:pl-10" stagger={0.12}>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Your story, beautifully remembered</p>
            <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-light leading-none">
              Wedding &amp; event <span className="italic text-champagne">photography and videography</span>
            </h2>
            <p className="max-w-xl text-foreground/75">
              I photograph weddings and special events, capturing every moment the way you lived it: the joy, the tears, the first dance. Fresh ideas, gentle direction, and a calm, professional team that knows how a wedding day flows, so you can simply live it.
            </p>
            <p className="text-sm text-muted-foreground">Serving {BRAND.region}.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/60 px-5 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Creativity · Experience · Exceptional quality</p>
          <h2 className="font-serif text-[clamp(2.5rem,7vw,6rem)] font-light leading-none">
            Why choose <span className="italic text-champagne">us?</span>
          </h2>
          <Reveal stagger={0.15} className="mt-12 grid gap-5 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div key={p.title} className="rounded-3xl border border-border bg-card p-8">
                <span className="font-serif text-5xl font-light italic text-champagne">0{i + 1}</span>
                <h3 className="mt-6 font-serif text-3xl font-light">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-background px-5 py-20 md:px-8 md:py-32">
        <Reveal stagger={0.12} className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {[WIDE[2], WIDE[7], WIDE[11]].map((s, i) => (
            <div key={i} className="aspect-[4/3] overflow-hidden rounded-2xl">
              <img src={s} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </Reveal>
      </section>
      <CTA />
    </>
  );
}
