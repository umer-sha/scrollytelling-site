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
- **Hide text:** inline "Hide text / Show text" control in the hero, story and film sections (`components/hide-text.tsx`); it fades the copy and lightens the dark overlay so the footage shows clean.
- **Media:** all clips/stills are cut from the ORIGINAL videos by `scripts/build-media.sh`. This ZIP ships the `lite` profile (small files, audio kept). For maximum quality, with ffmpeg installed run:

      scripts/build-media.sh hq <your-skyline-video.mp4> <your-celebration-video.mp4>

  (the celebration video is stored sideways; the script rotates it). Adding project 3+: `scripts/new-project.sh`.
- The hidden `ballroom-wedding` draft keeps its photos here; its videos are in the earlier `nzpro-part1` ZIP.
