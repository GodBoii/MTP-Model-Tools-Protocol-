"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { studioGallery } from "@/content/site";
import { Visual } from "@/components/Visual";

const palettes: [string, string, string][] = [
  ["#111111", "#ff3928", "#e7e7e7"],
  ["#171d22", "#aab7c1", "#ff3928"],
  ["#201915", "#ff3928", "#eaded4"],
  ["#121212", "#dcdcdc", "#ff3928"]
];

export function StudioGallery() {
  const [index, setIndex] = useState(0);
  const item = studioGallery[index];
  const next = () => setIndex((value) => (value + 1) % studioGallery.length);
  const prev = () => setIndex((value) => (value - 1 + studioGallery.length) % studioGallery.length);

  return (
    <section className="studio-slider">
      <Visual title={item.title} colors={palettes[index % palettes.length]} />
      <div className="studio-slider__meta">
        <span>{String(index + 1).padStart(2, "0")} / {String(studioGallery.length).padStart(2, "0")}</span>
        <h2>{item.title}</h2>
        <p>{item.tone}</p>
        <p>{item.year}</p>
        <div>
          <button onClick={prev} aria-label="Previous gallery image"><ArrowLeft size={18} /></button>
          <button onClick={next} aria-label="Next gallery image"><ArrowRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
