import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ProjectCards } from "@/components/project-cards";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = { title: "Portfolio — NZ Pro Photography" };

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        kicker="Portfolio"
        title="Our *stories*"
        sub="Each wedding gets its own film, its own frames and its own story. Pick one to step inside."
        clip="hero"
      />
      <section className="bg-background px-5 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <ProjectCards />
        </div>
      </section>
      <section className="bg-secondary/60 px-5 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Every frame</p>
          <h2 className="mb-10 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-none">
            All the <span className="italic text-champagne">moments</span>
          </h2>
          <PortfolioGrid />
        </div>
      </section>
      <CTA title="Love what you see? *Let's talk.*" />
    </>
  );
}
