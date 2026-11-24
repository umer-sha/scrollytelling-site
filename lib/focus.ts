/**
 * Phone framing. On phones every clip fills the whole screen as a vertical (9:16) frame, so a window
 * of the landscape footage is shown. Per clip: `x` = horizontal centre of that window in % (where the
 * subject is), per project: `zoom` crops away black letterbox bars baked into the file.
 * New projects work without an entry (centred, no zoom); add one to fine-tune.
 */
type Framing = { zoom?: number; x: Record<string, number> };

const FRAMING: Record<string, Framing> = {
  "skyline-wedding": { zoom: 1.34, x: { hero: 50, ch1: 80, ch2: 45, ch3: 52, ch4: 45, party: 50, aerial: 45 } },
  "grand-celebration": { x: { hero: 50, ch1: 55, ch2: 50, ch3: 50, ch4: 40, party: 45, aerial: 45 } },
};

export function framingFor(src: string): { x: number; zoom: number } {
  const m = src.match(/\/projects\/([^/]+)\/video\/([^/.]+)\./);
  const f = m && FRAMING[m[1]];
  return { x: (f && f.x[m![2]]) ?? 50, zoom: (f && f.zoom) ?? 1 };
}
