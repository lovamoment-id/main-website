"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import heroFrames from "@/lib/hero-frames.json";

const FRAME_MS = 2200;

/**
 * Phone frame in the hero, cross-fading through the opening screen of several
 * templates (design brief §3a). Deliberately not an iframe: the hero sits above
 * the fold and decides LCP, and the Three.js templates are heavy on mid-range
 * Android. Frames come from scripts/extract-hero-frames.mjs.
 */
export default function HeroPhone() {
  const { frames, width, height } = heroFrames;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (frames.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, FRAME_MS);
    return () => clearInterval(id);
  }, [frames.length]);

  return (
    <div className="relative mx-auto w-[240px] sm:w-[270px]">
      {/* floating badges (design brief §3a) */}
      <span className="absolute -left-8 top-16 z-20 rounded-full bg-surface px-3 py-1.5 text-[11px] font-semibold text-text shadow-lg sm:-left-12">
        Akses instan
      </span>
      <span className="absolute -right-6 bottom-24 z-20 rounded-full bg-surface px-3 py-1.5 text-[11px] font-semibold text-text shadow-lg sm:-right-10">
        Aktif selamanya
      </span>

      <div className="relative rounded-[2.2rem] border-[6px] border-black bg-black shadow-xl shadow-black/25">
        <div className="absolute left-1/2 top-[6px] z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/20" />
        <div className="relative overflow-hidden rounded-[1.7rem] bg-bg" style={{ aspectRatio: width + "/" + height }}>
          {frames.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="270px"
              priority={i === 0}
              className={
                "object-cover transition-opacity duration-700 " +
                (i === index ? "opacity-100" : "opacity-0")
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
