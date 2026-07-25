"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Opens a template's live demo in a modal.
 *
 * The iframe is created only once the modal opens and is unmounted the moment
 * it closes, so no catalogue page ever loads 17 Three.js demos at once
 * (design brief §8). The demos are mobile-first, so the frame is phone-shaped.
 */
export default function DemoButton({
  demoUrl,
  name,
  className,
  children,
}: {
  demoUrl: string;
  name: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setLoaded(false);
    openerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    // Stop the page behind the modal from scrolling while it is open.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <>
      <button ref={openerRef} type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={"Demo " + name}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <button
            type="button"
            aria-label="Tutup demo"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-text/60 backdrop-blur-sm"
          />

          <div className="relative flex max-h-full w-full max-w-[420px] flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-display text-lg font-semibold text-white drop-shadow">{name}</p>
              <div className="flex items-center gap-2">
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-surface/90 px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:bg-surface"
                >
                  Buka tab baru
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Tutup demo"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-lg leading-none text-text transition-colors hover:bg-surface"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="relative aspect-[9/17] w-full overflow-hidden rounded-3xl bg-bg shadow-lg">
              {!loaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-muted">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
                  <span className="text-xs">Memuat demo...</span>
                </div>
              )}
              <iframe
                src={demoUrl}
                title={"Demo " + name}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className="h-full w-full border-0"
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
