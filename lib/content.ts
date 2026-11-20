// All copy below is taken from (or modelled on) nzpro-photography.com.
// Story chapter copy is demo placeholder text in the same voice.

const BASE = "https://nzpro-photography.com";

// Site-wide media shortcuts (page headers, CTA, About/Contact) come from the first project.
// Per-project media lives in lib/projects.ts.
import { PROJECTS } from "./projects";

export const CLIPS = PROJECTS[0].clips;
export const WIDE = PROJECTS[0].wide;
export const TALL = PROJECTS[0].tall;
export const FILM = PROJECTS[0].film;

export const BRAND = {
  name: "NZ Pro Photography",
  short: "NZ PRO",
  phone: "619-212-1741",
  phoneHref: "tel:+16192121741",
  email: "nz.pro2021@gmail.com",
  instagram: "https://www.instagram.com/nz.pro.photography/",
  whatsapp: "https://wa.me/16192121741",
  region: "San Diego area · CA · AZ · NV · OR · MI · Chicago",
  site: BASE,
};

export const NAV = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const SERVICES = [
  {
    no: "01",
    kind: "Photo · Video",
    title: "Weddings",
    body: "Full wedding-day coverage, from the most beautiful moments to the finest details, with natural, elegant photos and cinematic video of the couple and family.",
  },
  {
    no: "02",
    kind: "Photo · Video",
    title: "Engagements & henna nights",
    body: "Warm, natural photos and video that capture the atmosphere of the celebration, your joy, and every detail that makes your night special.",
  },
  {
    no: "03",
    kind: "Photo · Video",
    title: "First Communion & Baptism",
    body: "Beautiful coverage of religious and family occasions, with natural moments of the child and family and every detail of the celebration.",
  },
  {
    no: "04",
    kind: "Photo · Video",
    title: "Events",
    body: "Birthdays, graduations, family gatherings, and every moment that deserves to become a memory.",
  },
  {
    no: "05",
    kind: "Photo",
    title: "Headshots",
    body: "Professional headshots for your business, LinkedIn, and personal brand, with relaxed direction and polished, ready-to-use photos.",
  },
];

export const MORE_SERVICES = [
  { kind: "Photo · Video", title: "Pre-wedding", body: "A relaxed shoot before the big day, perfect for save-the-dates and your wedding slideshow." },
  { kind: "Video", title: "Music video", body: "Creative music videos, from the idea and the locations to the final edit." },
  { kind: "Photo · Video", title: "Birthday events", body: "Birthdays for all ages, with the decorations, the cake and every smile." },
  { kind: "Photo", title: "Portraits", body: "Personal and professional portraits with soft light and natural posing." },
  { kind: "Photo", title: "Newborn", body: "Gentle, safe newborn sessions for your baby's very first days." },
  { kind: "Photo", title: "Kids", body: "Fun, natural photos of your children, just as they are." },
  { kind: "Photo", title: "Maternity", body: "Elegant maternity photos to celebrate the months before your baby arrives." },
  { kind: "Photo", title: "Models & fashion", body: "Portfolio, fashion and brand photos for models and creators." },
  { kind: "Photo · Video", title: "Quinceañera", body: "Full coverage of the big 15th birthday, from the church and the waltz to the party." },
];

export const PILLARS = [
  {
    title: "Creativity",
    body: "Fresh ideas and gentle direction, so every photo and film feels natural and truly yours.",
  },
  {
    title: "Experience",
    body: "A calm, professional team that knows how a wedding day flows, so you can live each moment.",
  },
  {
    title: "Exceptional quality",
    body: "Careful editing, 4K films and every detail delivered in your private online gallery.",
  },
];

export const TESTIMONIALS = [
  { name: "Sahira Yousif", quote: "Beautiful photos and an amazing experience. Highly recommend!" },
  { name: "Ferial Matti", quote: "Very professional and creative. We absolutely loved our photos!" },
  { name: "Nael Yousif", quote: "Excellent photographer! The photos came out beautiful and natural." },
  { name: "Salam Matti", quote: "Absolutely loved the photos! Beautiful work and great attention to detail." },
  { name: "Matti Gabriel", quote: "Fantastic photographer! Professional, creative, and wonderful to work with." },
  { name: "Emily Carter", quote: "Wonderful experience from start to finish. Every moment was captured perfectly." },
  { name: "Michael Brooks", quote: "Professional, friendly, and talented. Highly recommend!" },
];
