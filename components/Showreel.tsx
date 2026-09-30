"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Showreel() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button ref={trigger} className="showreel-cta" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="showreel-cta__orb">play</span>
        <span>showreel / runtime study</span>
      </button>
      {open && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label="MTP showreel">
          <button className="video-modal__close" onClick={close} aria-label="Close video">
            <X size={22} />
          </button>
          <div className="video-modal__stage">
            <video className="recorded-showreel" controls playsInline preload="none" poster="/media/tui-home.png" aria-label="Recorded MTP terminal UI walkthrough">
              <source src="/media/tui.webm" type="video/webm" />
              <track kind="captions" src="/media/tui.vtt" srcLang="en" label="English" default />
              <a href="/media/tui.webm">Download the walkthrough</a>
            </video>
          </div>
        </div>
      )}
    </>
  );
}
