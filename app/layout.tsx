import type { Metadata, Viewport } from "next";
import { Cormorant, Quicksand } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";
import { Preloader } from "@/components/preloader";
import { SoundProvider } from "@/components/sound";
import { Analytics } from "@vercel/analytics/next";
import { ContentProtection } from "@/components/content-protection";
import { EngagementTracker } from "@/components/engagement-tracker";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";

// Typography direction (inspired by seedjewelry.com, fonts only): a refined Garamond-style serif
// (Cormorant) for headlines, a soft rounded geometric sans (Quicksand) for body copy, and
// bolder wide-tracked uppercase for small labels (see globals.css).
// To change fonts, swap these two imports; everything else uses the CSS variables below.
// Weights start at 400 so Cormorant's hairline 300 is never used over photography.
const display = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Quicksand({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "NZ Pro Photography — Wedding & Event Photographer in San Diego",
  description:
    "I photograph weddings and special events, capturing every moment the way you lived it: the joy, the tears, the first dance.",
};

export const viewport: Viewport = { themeColor: "#fbf8f3", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="grain">
        <SoundProvider>
        <Preloader />
        <SmoothScroll>
          <ScrollProgress />
          <Nav />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
        </SoundProvider>
        <ContentProtection />
        <EngagementTracker />
        <Analytics />
      </body>
    </html>
  );
}
