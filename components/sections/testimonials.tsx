import { SplitHeading } from "@/components/split-heading";
import { TESTIMONIALS } from "@/lib/content";
import { cn } from "@/lib/utils";

function Row({ reverse }: { reverse?: boolean }) {
  const items = reverse ? [...TESTIMONIALS].reverse() : TESTIMONIALS;
  const loop = [...items, ...items];
  return (
    <div className="marquee overflow-hidden">
      <div className={cn("marquee-track flex gap-5", reverse && "reverse")}>
        {loop.map((t, i) => (
          <figure
            key={`${t.name}-${i}`}
            className="w-[19rem] shrink-0 rounded-3xl border border-border bg-card p-7 md:w-[24rem]"
            aria-hidden={i >= items.length}
          >
            <div className="mb-4 text-champagne" aria-label="5 stars">
              ★★★★★
            </div>
            <blockquote className="font-serif text-2xl font-light leading-snug">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 text-sm text-foreground/70">
              <span className="flex size-9 items-center justify-center rounded-full bg-secondary font-medium text-foreground">
                {t.name[0]}
              </span>
              {t.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-background py-28 md:py-40">
      <div className="mx-auto mb-14 max-w-7xl px-5 md:px-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Kind words</p>
        <SplitHeading text="What clients *say*" className="text-5xl md:text-7xl" />
        <p className="mt-4 text-foreground/70">From couples and families I&apos;ve photographed.</p>
      </div>
      <div className="space-y-5">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
}
