"use client";

import { useEffect, useRef } from "react";

const PX_PER_FRAME = 0.4;
const NUDGE = 304; // one card (280px) plus the gap (24px)
const RESUME_AFTER_CLICK_MS = 1500;

/**
 * Horizontally scrolling product belt (design brief §3c).
 *
 * The cards are rendered on the server and passed in as children, so this
 * client component only owns the motion. Two identical runs sit side by side;
 * once the first run has scrolled past, scrollLeft jumps back by exactly half
 * the track, which is invisible because the content there is identical.
 *
 * Auto-scroll pauses on hover, on touch, while dragging, and briefly after an
 * arrow-button click (so the click's smooth scroll doesn't fight the next
 * animation frame), and never starts at all under prefers-reduced-motion. The
 * belt stays scrollable by hand, by arrow button, or by drag in every case.
 */
export default function ProductBelt({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Wrap distance is where the second run starts, NOT scrollWidth / 2: the
       flex gap between the two runs belongs to neither, so halving the track
       lands half a gap short and the loop visibly stutters. Measured here and
       on resize rather than per frame, since offsetLeft forces layout. */
    let wrapAt = 0;
    const measure = () => {
      const [first, second] = el.children as unknown as HTMLElement[];
      wrapAt = second ? second.offsetLeft - first.offsetLeft : el.scrollWidth;
    };
    measure();
    window.addEventListener("resize", measure);

    let raf = 0;
    const step = () => {
      if (!pausedRef.current && !draggingRef.current && wrapAt > 0) {
        el.scrollLeft =
          el.scrollLeft >= wrapAt ? el.scrollLeft - wrapAt : el.scrollLeft + PX_PER_FRAME;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      // let clicks on buttons and links through untouched
      if ((e.target as HTMLElement).closest("a,button")) return;
      draggingRef.current = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  useEffect(() => () => clearTimeout(resumeTimerRef.current), []);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    pause();
    el.scrollBy({ left: dir * NUDGE, behavior: "smooth" });
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(resume, RESUME_AFTER_CLICK_MS);
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>div>*]:w-[280px] [&>div>*]:shrink-0"
      >
        <div className="flex shrink-0 gap-6">{children}</div>
        {/* duplicate run, purely so the loop can wrap without a visible seam */}
        <div className="flex shrink-0 gap-6" aria-hidden="true">
          {children}
        </div>
      </div>

      <button
        type="button"
        aria-label="Geser ke kiri"
        onClick={() => nudge(-1)}
        onMouseEnter={pause}
        onMouseLeave={resume}
        className="absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 p-3 text-text shadow-md ring-1 ring-primary/12 transition-colors hover:bg-surface sm:flex"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12.5 5 7.5 10l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Geser ke kanan"
        onClick={() => nudge(1)}
        onMouseEnter={pause}
        onMouseLeave={resume}
        className="absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 p-3 text-text shadow-md ring-1 ring-primary/12 transition-colors hover:bg-surface sm:flex"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
