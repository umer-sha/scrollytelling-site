"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { BRAND } from "@/lib/content";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [`Name: ${f.get("name")}`, `Service: ${f.get("service") || "-"}`, `Event date: ${f.get("date") || "TBD"}`, "", `${f.get("message")}`].join("\n");
    window.location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent("Quote request")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-[0_30px_80px_-40px_rgba(60,40,20,0.35)] md:p-10">
      <h2 className="font-serif text-3xl font-light md:text-4xl">Request a quote</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-foreground/70">Your name</span>
          <Input name="name" required placeholder="Jane & John" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-foreground/70">Event date</span>
          <Input name="date" type="date" />
        </label>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="text-foreground/70">Service</span>
        <Input name="service" placeholder="Wedding, engagement, event…" />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-foreground/70">Tell us about your day</span>
        <Textarea name="message" required placeholder="Venue, guest count, photo + film…" />
      </label>
      <Button type="submit" size="lg" className="w-full rounded-full">
        {sent ? "Opening your email app…" : "Send request"}
      </Button>
    </form>
  );
}
