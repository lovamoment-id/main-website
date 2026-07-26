"use client";

import { useEffect, useRef } from "react";

const PX_PER_FRAME = 0.4;

/**
 * Horizontally scrolling product belt (design brief §3c).
 *
 * The cards are rendered on the server and passed in as children, so this
 * client component only owns the motion. Two identical runs sit side by side;
 * once the first run has scrolled past, scrollLeft jumps back by exactly half
 * the track, which is invisible because the content there is identical.
 *
 * Auto-scroll pauses on hover, on touch, and while dragging, and never starts
 * at all under prefers-reduced-motion. The belt stays scrollable by hand in
 * every one of those cases.
 */
export default function ProductBelt({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);

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

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
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
  );
}
