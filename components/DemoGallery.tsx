import Link from "next/link";
import { demos } from "@/content/demos";

export function DemoGallery() {
  return (
    <section className="demo-gallery" id="demos" aria-labelledby="demos-title">
      <div className="section-heading"><span>01 / in practice</span><h2 id="demos-title">See what runs.</h2><p>Real local output from MTPX 0.1.37, replayed at a readable pace. Every demo runs without an API key.</p></div>
      <div className="demo-grid">
        {demos.map((demo) => (
          <article key={demo.id} className="demo-item">
            <video controls playsInline preload="none" poster={`/media/${demo.id}.png`} aria-label={demo.title}>
              <source src={`/media/${demo.id}.webm`} type="video/webm" />
              <track kind="captions" src={`/media/${demo.id}.vtt`} srcLang="en" label="English" default />
              <a href={`/media/${demo.id}.webm`}>Download {demo.title}</a>
            </video>
            <span className="demo-label">{demo.caption}</span>
            <h3>{demo.title}</h3><p>{demo.description}</p>
            <Link href={demo.guide}>Read the guide <span aria-hidden="true">↗</span></Link>
            <details><summary>Commands and transcript</summary><pre>{demo.transcript}</pre><a href="/media/cli-transcripts.json" download>Download complete recorded output</a></details>
          </article>
        ))}
      </div>
    </section>
  );
}
