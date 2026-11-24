"use client";

import { useEffect } from "react";

/**
 * Client-side deterrents against casual saving of photos/videos: right-click / long-press menu,
 * dragging media out of the page, and the usual save / view-source / print / devtools shortcuts.
 * Text, forms and normal scrolling are untouched. (This stops casual copying only; see README.)
 */
export function ContentProtection() {
  useEffect(() => {
    const isMedia = (t: EventTarget | null) => t instanceof Element && !!t.closest("img, video, picture, canvas");
    const inField = (t: EventTarget | null) => t instanceof Element && !!t.closest("input, textarea, select, [contenteditable]");

    const onMenu = (e: Event) => {
      if (!inField(e.target)) e.preventDefault(); // right-click is locked across the whole site
    };
    const onDrag = (e: Event) => isMedia(e.target) && e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (inField(e.target)) return;
      const k = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      if (
        e.key === "F12" ||
        (mod && ["s", "u", "p"].includes(k)) ||
        (mod && e.shiftKey && ["i", "j", "c"].includes(k)) ||
        (e.metaKey && e.altKey && ["i", "j", "u"].includes(k))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onMenu);
    document.addEventListener("dragstart", onDrag);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("contextmenu", onMenu);
      document.removeEventListener("dragstart", onDrag);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
