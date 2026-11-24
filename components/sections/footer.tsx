import Link from "next/link";
import { BRAND, NAV } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-foreground px-5 py-16 text-background md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-serif text-[clamp(3.5rem,14vw,11rem)] font-light leading-none tracking-tight">
          NZ <span className="italic text-accent">Pro</span>
        </p>
        <p className="mt-3 text-sm text-background/60">Capturing moments with style &amp; precision</p>

        <div className="mt-14 grid gap-10 border-t border-background/15 pt-10 text-sm sm:grid-cols-3">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-background/50">Explore</p>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.href}><Link href={n.href} className="hover:text-accent">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-background/50">Contact</p>
            <ul className="space-y-2">
              <li><a href={BRAND.phoneHref} className="hover:text-accent">{BRAND.phone}</a></li>
              <li><a href={`mailto:${BRAND.email}`} className="break-all hover:text-accent">{BRAND.email}</a></li>
              <li className="text-background/60">{BRAND.region}</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-background/50">Follow</p>
            <ul className="space-y-2">
              <li><a href={BRAND.instagram} target="_blank" rel="noreferrer" className="hover:text-accent">Instagram</a></li>
              <li><a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="hover:text-accent">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-12 text-xs text-background/40">Demo concept for NZ Pro Photography · © 2026 NZ Pro Photography</p>
      </div>
    </footer>
  );
}
