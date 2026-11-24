/**
 * PROJECTS: the single source of truth for every story on the site.
 *
 * To add a project:
 *   1. Run  scripts/new-project.sh <slug> <video.mp4> [rotate]   (creates public/media/projects/<slug>/)
 *   2. Copy one block below, change the slug/title/copy, and pick which stills go in the gallery.
 *      (Story numbers are automatic. Add `draft: true` to keep an entry hidden while you work on it.)
 *   That's it. The home page, /portfolio, the project page, "next project" links
 *   and the portfolio grid are all generated from this list.
 *
 * Titles use *asterisks* for the italic gold word.
 * Titles and copy here are placeholders; edit freely.
 */

export type ClipKey = "hero" | "ch1" | "ch2" | "ch3" | "ch4" | "party" | "aerial";
export type Clip = { src: string; poster: string };
export type Shot = { src: string; tall?: boolean };
export type Chapter = { no: string; title: string; body: string; clip: ClipKey };

export type Project = {
  slug: string;
  no: string; // "01"
  title: string; // "The *Skyline* Wedding"
  type: string; // "Wedding film & photography"
  tagline: string;
  intro: string; // big scroll-revealed statement
  filmLabel: string;
  ratio: string; // aspect ratio of this project's wide clips/stills, e.g. "16/9"
  clips: Record<ClipKey, Clip>;
  film: string;
  wide: string[]; // p01..p14 (16:9)
  tall: string[]; // t01..t05 (4:5)
  gallery: Shot[];
  chapters: Chapter[];
};

const pad = (n: number) => String(n).padStart(2, "0");
const CLIP_KEYS: ClipKey[] = ["hero", "ch1", "ch2", "ch3", "ch4", "party", "aerial"];

/** Builds all media paths for public/media/projects/<slug>/ using the standard file names. */
function media(slug: string, wide = 14, tall = 5) {
  const base = `/media/projects/${slug}`;
  const clips = Object.fromEntries(
    CLIP_KEYS.map((k) => [k, { src: `${base}/video/${k}.mp4`, poster: `${base}/video/${k}.jpg` }])
  ) as Record<ClipKey, Clip>;
  return {
    clips,
    film: `${base}/video/film.mp4`,
    wide: Array.from({ length: wide }, (_, i) => `${base}/photos/p${pad(i + 1)}.jpg`),
    tall: Array.from({ length: tall }, (_, i) => `${base}/photos/t${pad(i + 1)}.jpg`),
  };
}

const m1 = media("skyline-wedding");
const m2 = media("ballroom-wedding");
const m3 = media("grand-celebration");

type Entry = Omit<Project, "no"> & { draft?: boolean };

/** Order here = order on the site. Numbers (01, 02, …) are generated from the position. */
const ENTRIES: Entry[] = [
  {
    slug: "skyline-wedding",
    title: "The *Skyline* Wedding",
    type: "Wedding film & photography",
    tagline: "Soft light, a big skyline, quiet moments.",
    intro:
      "Soft light, steady hands and a skyline at golden hour. A wedding told the way it was lived: quietly at first, then all at once.",
    filmLabel: "Skyline wedding film",
    ratio: "16/9",
    ...m1,
    gallery: [
      { src: m1.tall[2], tall: true },
      { src: m1.wide[0] },
      { src: m1.wide[5] },
      { src: m1.tall[0], tall: true },
      { src: m1.wide[6] },
      { src: m1.wide[4] },
      { src: m1.tall[3], tall: true },
      { src: m1.wide[11] },
      { src: m1.wide[12] },
      { src: m1.wide[13] },
      { src: m1.tall[1], tall: true },
    ],
    chapters: [
      { no: "01", title: "The quiet before", clip: "ch1", body: "A last look in the mirror, a brother's steady hands on a bow tie, a hug that says everything. The details you'll want to remember most." },
      { no: "02", title: "Just the two of you", clip: "ch2", body: "Soft light, gentle direction, and a skyline behind you. Portraits that feel natural and truly yours." },
      { no: "03", title: "Every detail", clip: "ch3", body: "The florals, the cake, the glassware you spent months choosing. Held in frame long after the day is over." },
      { no: "04", title: "The last dance", clip: "ch4", body: "From the first dance to the final song, photo and 4K film that carry you straight back to the floor." },
    ],
  },
  {
    slug: "grand-celebration",
    title: "A *Grand* Celebration",
    type: "Wedding film & photography",
    tagline: "Sparklers, candlelight and a room on its feet.",
    intro:
      "A watch, a gown, a pair of shoes waiting by the door. Then sparklers over a floor of fog, a ballroom glowing with candlelight, and a whole family on its feet.",
    filmLabel: "Grand celebration film",
    ratio: "16/9",
    ...m3,
    gallery: [
      { src: m3.tall[0], tall: true },
      { src: m3.wide[7] },
      { src: m3.wide[9] },
      { src: m3.tall[4], tall: true },
      { src: m3.wide[8] },
      { src: m3.wide[12] },
      { src: m3.tall[2], tall: true },
      { src: m3.wide[11] },
      { src: m3.tall[1], tall: true },
      { src: m3.wide[13] },
      { src: m3.wide[10] },
    ],
    chapters: [
      { no: "01", title: "Before everything", clip: "ch1", body: "The shoes, the perfume, the gown on its stand, the suit waiting by the arch. The quiet details that set the tone for the day." },
      { no: "02", title: "The promise", clip: "ch2", body: "A quiet look, rings on a linen table, a tear, a kiss, and the first sparklers of the night." },
      { no: "03", title: "The room", clip: "ch3", body: "Every candle, every centerpiece, every seat placed with care. Photographed before the first guest sits down, then the cake and the couple arriving." },
      { no: "04", title: "The celebration", clip: "ch4", body: "Grandparents on the floor, cousins cheering, the whole room on its feet. The joy of the day, in motion." },
    ],
  },
  {
    // Earlier cut of a ballroom wedding, kept intact but hidden for now (draft).
    // Delete the next line to publish it again; it will take the next free number.
    draft: true,
    slug: "ballroom-wedding",
    title: "The *Ballroom* Wedding",
    type: "Wedding film & photography",
    tagline: "Candlelight, fog and a room on its feet.",
    intro:
      "A ballroom glowing with candlelight, a first dance in rolling fog, and a room full of family on its feet. Every detail, every cheer.",
    filmLabel: "Ballroom wedding film",
    ratio: "16/9",
    ...m2,
    gallery: [
      { src: m2.tall[0], tall: true },
      { src: m2.wide[7] },
      { src: m2.wide[1] },
      { src: m2.tall[1], tall: true },
      { src: m2.wide[11] },
      { src: m2.wide[8] },
      { src: m2.tall[2], tall: true },
      { src: m2.wide[9] },
      { src: m2.tall[3], tall: true },
      { src: m2.wide[10] },
    ],
    chapters: [
      { no: "01", title: "Before everything", clip: "ch1", body: "A watch, a gown, a pair of shoes waiting by the door. The quiet details that set the tone for the whole day." },
      { no: "02", title: "The promise", clip: "ch2", body: "Golden-hour light, a hand on a shoulder, a laugh caught mid-glance. Portraits that feel like the two of you." },
      { no: "03", title: "The room", clip: "ch3", body: "Every candle, every centerpiece, every seat placed with care. Photographed before the first guest arrives." },
      { no: "04", title: "The celebration", clip: "ch4", body: "Grandparents dancing, cousins cheering, the whole room on its feet. The joy of the day, in motion." },
    ],
  },
];

export const PROJECTS: Project[] = ENTRIES.filter((e) => !e.draft).map(({ draft: _draft, ...e }, i) => ({
  ...e,
  no: pad(i + 1),
}));

export const plain = (s: string) => s.replace(/\*/g, "");
export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
};
