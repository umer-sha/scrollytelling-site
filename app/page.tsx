import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/sections/hero";
import { BigMarquee } from "@/components/big-marquee";
import { HomeReel } from "@/components/sections/home-reel";
import { ScrubText } from "@/components/scrub-text";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { ServicesList } from "@/components/sections/services-list";
import { Testimonials } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";
import { SplitHeading } from "@/components/split-heading";

export default function Home() {
  return (
    <>
      <Hero />
      <ScrubText eyebrow="Our work" text="Two weddings. Two films. Every frame told the way it was lived. Step inside." />
      <HomeReel />
      <BigMarquee />
      <FeaturedProjects />
      <section className="bg-background px-5 py-24 md:px-8 md:py-40">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">What I do</p>
              <SplitHeading text="Photo & video *services*" className="text-[clamp(2.5rem,6vw,4.5rem)]" />
              <p className="mt-5 max-w-xs text-foreground/70">From getting ready to the last dance, captured in photos and film.</p>
              <Button asChild variant="outline" className="mt-7 rounded-full">
                <Link href="/services">All services</Link>
              </Button>
            </div>
          </div>
          <div className="md:col-span-8">
            <ServicesList />
          </div>
        </div>
      </section>
      <Testimonials />
      <CTA />
    </>
  );
}
