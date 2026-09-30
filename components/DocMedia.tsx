import Image from "next/image";
import { demos } from "@/content/demos";

export function DocMedia({ slug }: { slug: string }) {
  const videos = slug === "home" ? demos : demos.filter((demo) => demo.guide === `/docs/${slug}`);
  const screens = slug === "tui-operating-guide" || slug === "home" ? [
    { id: "tui-setup", description: "Provider setup with masked credentials and a model field. Open it with /backend or /apikey." },
    { id: "tui-chats", description: "Separate conversation tabs and a draft in the second chat. Ctrl+N creates a chat; F1 through F9 switch chats." },
  ] : [];
  if (!videos.length && !screens.length) return null;
  return (
    <section className="doc-manual-section doc-media" aria-label="Recorded examples">
      <div className="doc-manual-section__intro"><span>recorded examples</span><h2>See MTP in use</h2><p>Captured output and terminal screens from MTPX 0.1.37. These offline demos make no cloud requests.</p></div>
      <div className="doc-manual">
        {videos.map((demo) => <section className="doc-content-section" key={demo.id}>
          <div className="doc-content-section__label"><span>video</span><span>{demo.title}</span></div>
          <div className="doc-markdown"><figure><video controls playsInline preload="none" poster={`/media/${demo.id}.png`} aria-label={demo.title}><source src={`/media/${demo.id}.webm`} type="video/webm" /><track kind="captions" src={`/media/${demo.id}.vtt`} srcLang="en" label="English" default /><a href={`/media/${demo.id}.webm`}>Download {demo.title}</a></video><figcaption><p>{demo.description}</p></figcaption></figure><a href={demo.guide}>Read the guide ↗</a></div>
        </section>)}
        {screens.map((screen) => <section className="doc-content-section" key={screen.id}>
          <div className="doc-content-section__label"><span>image</span><span>terminal UI</span></div>
          <div className="doc-markdown"><figure><Image src={`/media/${screen.id}.png`} alt={screen.description} width={1440} height={960} sizes="(max-width: 900px) 96vw, 65vw" /><figcaption><p>{screen.description}</p></figcaption></figure></div>
        </section>)}
      </div>
    </section>
  );
}
