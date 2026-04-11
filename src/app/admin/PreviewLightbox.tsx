"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export type PreviewLightboxProps = {
  src: string;
  onClose: () => void;
};

/** * Full-screen preview overlay; closes on backdrop click or Escape. */
export function PreviewLightbox({ src, onClose }: PreviewLightboxProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged submission preview"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-4 top-4 rounded-md border border-white/20 bg-black/40 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
      >
        Close
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element -- signed external URLs */}
      <img
        src={src}
        alt=""
        className="max-h-[min(90vh,900px)] max-w-[min(90vw,1200px)] object-contain shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>,
    document.body,
  );
}
