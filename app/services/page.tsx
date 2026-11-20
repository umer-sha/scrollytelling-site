import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ServicesList } from "@/components/sections/services-list";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/reveal";
import { MORE_SERVICES, SERVICES } from "@/lib/content";

export const metadata: Metadata = { title: "Services — NZ Pro Photography" };

const STEPS = [
  { t: "Say hello", b: "Tell us about your day. Meetings are by appointment, and we're with you from the first message." },
  { t: "Plan together", b: "We map out the flow of your day so you can live every moment while we cover it." },
  { t: "Capture", b: "Natural direction, a calm team, photo and cinematic video of the couple and family." },
  { t: "Deliver", b: "Careful editing, 4K films and every detail in your private online gallery." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        kicker="What I do"
        title="Photo & video *services*"
        sub="From getting ready to the last dance, captured in photos and film."
        clip="ch3"
      />

      <section className="bg-background px-5 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <ServicesList />
        </div>
      </section>

      <section className="bg-secondary/60 px-5 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">More services</p>
          <h2 className="mb-10 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-none">
            Beyond the <span className="italic text-champagne">wedding day</span>
          </h2>
          <ServicesList items={MORE_SERVICES.map((m, i) => ({ ...m, no: String(i + SERVICES.length + 1).padStart(2, "0") }))} />
        </div>
      </section>

      <section className="bg-background px-5 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">How it works</p>
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-none">
            From first message <span className="italic text-champagne">to final gallery</span>
          </h2>
          <Reveal stagger={0.12} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="rounded-3xl border border-border bg-card p-7">
                <span className="font-serif text-5xl font-light italic text-champagne">0{i + 1}</span>
                <h3 className="mt-5 font-serif text-3xl font-light">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{s.b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <CTA title="Ready to plan your day? *Request a quote.*" />
    </>
  );
}
