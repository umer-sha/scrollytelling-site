"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, NAV } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 60);
      setHidden(y > last && y > 300);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const light = !solid && !open; // white text while over the dark page headers

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          solid && !open ? "border-b border-border/70 bg-background/85 backdrop-blur-md" : "bg-transparent",
          light ? "text-white" : "text-foreground"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link href="/" className="font-serif text-xl tracking-[0.28em] md:text-2xl">
            {BRAND.short}
          </Link>
          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "group relative text-sm tracking-wide opacity-80 transition-opacity hover:opacity-100",
                  pathname === n.href && "opacity-100"
                )}
              >
                {n.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px w-full origin-left bg-accent transition-transform duration-300",
                    pathname === n.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className={cn("hidden rounded-full sm:inline-flex", light && "bg-white text-black hover:bg-white/90")}
            >
              <Link href="/contact">Book now</Link>
            </Button>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="flex size-11 items-center justify-center md:hidden"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-center bg-background px-8 transition-[clip-path] duration-700 [transition-timing-function:cubic-bezier(.76,0,.24,1)] md:hidden",
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
        )}
      >
        <nav className="space-y-2">
          {[{ label: "Home", href: "/" }, ...NAV].map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              style={{ transitionDelay: open ? `${250 + i * 70}ms` : "0ms" }}
              className={cn(
                "block font-serif text-5xl font-light transition-all duration-700",
                open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                pathname === n.href && "italic text-champagne"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-12 space-y-1 text-sm text-muted-foreground">
          <a href={BRAND.phoneHref} className="block">{BRAND.phone}</a>
          <a href={`mailto:${BRAND.email}`} className="block">{BRAND.email}</a>
        </div>
      </div>
    </>
  );
}
