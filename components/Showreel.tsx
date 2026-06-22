"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function Showreel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button className="showreel-cta" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="showreel-cta__orb">play</span>
        <span>showreel / runtime study</span>
      </button>
      {open && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label="MTP showreel">
          <button className="video-modal__close" onClick={() => setOpen(false)} aria-label="Close video">
            <X size={22} />
          </button>
          <div className="video-modal__stage">
            <div className="video-modal__fake">
              <span>mtp runtime / 00:42</span>
              <strong>tools move, context stays</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
