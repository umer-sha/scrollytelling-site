# NZ Pro Photography — multi-story scrollytelling site

Next.js 15 (App Router) · TypeScript · Tailwind v4 · shadcn/ui primitives · GSAP ScrollTrigger · Lenis

    npm install
    npm run dev   # http://localhost:3000

## Pages
| Route | What it is |
| --- | --- |
| `/` | Hero, stories showcase (stacking full-screen cards, one per project), services, testimonials |
| `/portfolio` | Story cards + a filterable grid of every photo and film (filter by story / photos / films) |
| `/portfolio/<slug>` | A project's own scrollytelling page: hero → scroll-lit intro → pinned 4-chapter story → horizontal gallery → expanding film → next story |
| `/services` `/about` `/contact` | Supporting pages |

## Projects
- 01 `skyline-wedding` · 02 `grand-celebration` (titles/copy are placeholders — edit in `lib/projects.ts`)
- `ballroom-wedding` is an earlier cut of a ballroom wedding. It is kept intact (media + entry) but marked `draft: true`, so it is hidden. Delete that one line in `lib/projects.ts` to show it again.
- Story numbers (01, 02…) are automatic from the order in `lib/projects.ts`.
- Media for each lives in `public/media/projects/<slug>/` (`video/` hero, ch1–ch4, party, aerial, film · `photos/` p01–p14 wide, t01–t05 portrait 4:5)

## Adding project 3, 4, 5…
1. `scripts/new-project.sh <slug> <video.mp4> [1|2 if the video is sideways]` (needs ffmpeg) — creates the media folder at high quality.
   Overwrite any file with a hand-picked one (same name) for best results.
2. Copy a project block in `lib/projects.ts`, change `slug`, `title`, copy, `ratio` ("16/9" for most phone/camera video) and gallery picks.
3. Done. The home showcase, `/portfolio`, project page, next-story links and media grid pick it up automatically.

## Typography
Direction borrowed from seedjewelry.com (fonts only): headlines in Cormorant (refined Garamond-style serif, regular/medium weights), body in Quicksand (soft rounded sans), small uppercase labels set bolder and wide-tracked.
To change, swap the two font imports in `app/layout.tsx`.

## Motion notes
- Videos play only while on screen; in the pinned story only the visible chapter decodes video, so scrolling stays smooth even at 1080p. Pins use `anticipatePin`, phone toolbar resizes don't re-measure pins, Lenis smoothing is tuned.
- `prefers-reduced-motion` disables Lenis and all pinned/scrubbed motion.


## Sound, hide text, and media quality
- **Sound:** story pages have a "Sound on/off" pill (bottom-left). It is off by default (browsers block unmuted autoplay). When on, only the video actually on screen is audible, with a fade; when that part scrolls away its sound fades out. The pinned story plays the sound of the current chapter only. Implemented in `components/sound.tsx` + `components/clip.tsx` (`sound` / `audible` props).
- **Hide text:** prominent white "Hide text / Show text" pill in the hero, story and film sections (`components/hide-text.tsx`); it fades the copy and lightens the dark overlay so the footage shows clean.
- **Media:** all clips/stills are cut from the ORIGINAL videos by `scripts/build-media.sh`. This ZIP ships the `lite` profile (small files, audio kept). For maximum quality, with ffmpeg installed run:

      scripts/build-media.sh hq <your-skyline-video.mp4> <your-celebration-video.mp4>

  (the celebration video is stored sideways; the script rotates it). Adding project 3+: `scripts/new-project.sh`.
- The hidden `ballroom-wedding` draft keeps its photos here; its videos are in the earlier `nzpro-part1` ZIP.

## Phones
Same design and scroll experience as desktop. On phones every clip fills the screen as a vertical frame (a 9:16 window of the landscape footage, centred on the subject). Per-clip centring and letterbox-bar cropping live in `lib/focus.ts` (new projects default to centred).
Each video section (hero, chapters, film) has its own Sound + Hide text pills in its bottom-left corner (`SectionControls` in `components/hide-text.tsx`); Hide text is per section, the sound switch is shared.
Clip sound reaches exactly zero at the last frame of each loop (and eases in over 0.4 s), via a Web Audio gain node so it also works on iPhones.

## Content protection (deterrent, not a vault)
- `middleware.ts`: blocks known scraper/AI bots and scripted clients (403) and serves `/media/*` only to pages of this site (no hotlinking, no direct open, no cross-site embeds). Edit `BLOCKED_UA` to tune.
- `app/robots.ts` + `next.config.ts` headers: AI crawlers disallowed, `noai/noimageai`, no framing, CORP same-origin on media.
- `components/content-protection.tsx` + `globals.css`: right-click is locked site-wide, no long-press save or drag on media, save/view-source/print/devtools shortcuts blocked, no print. Lightbox photos/videos carry a faint (c) watermark; video download buttons are off.
- Honest limit: anything a browser can show can be screen-recorded or pulled from the network tab by a determined person. For real protection, keep full-resolution originals off the site and watermark deliverables.

## Analytics (Vercel)
`<Analytics />` is in `app/layout.tsx`. Run `npm install`, then in the Vercel project open **Analytics -> Enable**, and redeploy. You will see visitors, pages, referrers, countries, devices (anonymous, no names).
Vercel does not report time-on-page, so `components/engagement-tracker.tsx` sends a custom event `page_time` (path + bucket of active seconds) and `film_play`. Custom events require a Vercel Pro plan; filter by event in the Analytics dashboard.
