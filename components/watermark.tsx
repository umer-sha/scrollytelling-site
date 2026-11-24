/** Faint repeating © mark laid over lightbox photos/videos so screenshots carry the brand. */
export function Watermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 select-none overflow-hidden"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='170'><text x='20' y='95' transform='rotate(-24 130 85)' fill='white' fill-opacity='0.16' font-family='sans-serif' font-size='15' letter-spacing='3'>© NZ PRO PHOTOGRAPHY</text></svg>\")",
      }}
    />
  );
}
