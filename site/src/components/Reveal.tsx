"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and lifts its children into place the first time they scroll into view
 * (design brief §8: opacity and transform only, no layout-shifting properties).
 *
 * Content is NOT hidden in the server-rendered HTML. If it were, anyone whose
 * JavaScript fails to run would get a permanently blank page. Instead it starts
 * visible and only arms itself on mount, and only for elements still below the
 * fold, which the visitor cannot see being hidden anyway. Anything already on
 * screen at mount is left alone, so nothing flashes.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Stagger, in ms, for siblings revealed together. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen: leave it visible rather than hide-then-reveal.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setArmed(true);

    let observerReported = false;
    const io = new IntersectionObserver(
      (entries) => {
        observerReported = true;
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);

    /* Observing normally produces a report right away, even a negative one. If
       none arrives the observer is not running at all (a tab that was never
       rendered, an exotic engine), and without this the content would sit
       behind opacity:0 forever. Reveal it rather than lose it. */
    const failsafe = setTimeout(() => {
      if (!observerReported) setShown(true);
    }, 3000);

    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  const hidden = armed && !shown;

  return (
    <div
      ref={ref}
      style={hidden ? undefined : { transitionDelay: delay + "ms" }}
      className={
        "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none " +
        (hidden ? "translate-y-6 opacity-0 " : "translate-y-0 opacity-100 ") +
        className
      }
    >
      {children}
    </div>
  );
}
