import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { BRAND, WIDE } from "@/lib/content";

export const metadata: Metadata = { title: "Contact — NZ Pro Photography" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="Reach out"
        title="Let's begin the *journey*"
        sub="Your story deserves to be remembered beautifully."
        clip="ch2"
      />
      <section className="bg-secondary/60 px-5 py-16 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12">
          <Reveal className="space-y-8 md:col-span-5" stagger={0.12}>
            <p className="text-foreground/75">
              Tell us about your wedding or event, and we&apos;ll be with you through every step, from the first message to your final gallery.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><Phone className="size-5 text-champagne" /><a href={BRAND.phoneHref} className="hover:underline">{BRAND.phone}</a></li>
              <li className="flex items-center gap-3"><Mail className="size-5 text-champagne" /><a href={`mailto:${BRAND.email}`} className="break-all hover:underline">{BRAND.email}</a></li>
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 size-5 shrink-0 text-champagne" />{BRAND.region}</li>
            </ul>
            <p className="text-xs text-muted-foreground">Meetings by appointment only</p>
            <div className="aspect-[16/10] overflow-hidden rounded-3xl">
              <img src={WIDE[3]} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal className="md:col-span-7" y={50}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
