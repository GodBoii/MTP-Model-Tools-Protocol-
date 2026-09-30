"use client";

import { X, Play } from "lucide-react";
import { useRef } from "react";

export function Showreel() {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  function close() {
    video.current?.pause();
    dialog.current?.close();
    trigger.current?.focus();
  }

  return (
    <>
      <button ref={trigger} className="demo-play" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">
        <Play size={18} /> Watch the terminal walkthrough
      </button>
      <dialog ref={dialog} className="demo-dialog" data-lenis-prevent aria-labelledby="demo-title" onCancel={close} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className="demo-dialog__header">
          <h2 id="demo-title">Provider setup and chat navigation</h2>
          <button onClick={close} aria-label="Close video"><X size={24} /></button>
        </div>
        <video ref={video} controls playsInline preload="none" poster="/media/tui-home.png">
          <source src="/media/tui.webm" type="video/webm" />
          <track kind="captions" src="/media/tui.vtt" srcLang="en" label="English" default />
          <a href="/media/tui.webm">Download the walkthrough</a>
        </video>
        <p>Recorded from the 0.1.37 Textual app. Offline UI states, with no chat requests or credentials.</p>
      </dialog>
    </>
  );
}
