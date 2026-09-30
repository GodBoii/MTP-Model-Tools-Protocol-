"use client";

import Lenis from "@studio-freight/lenis";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const transitionRef = useRef<HTMLDivElement>(null);
  const transitionInFlight = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setLoading(false);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.28,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.78,
      touchMultiplier: 1.25
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;

      const current = `${window.location.pathname}${window.location.search}`;
      const next = `${url.pathname}${url.search}`;
      if (current === next && url.hash) return;
      if (current === next || transitionInFlight.current) return;

      event.preventDefault();
      transitionInFlight.current = true;

      const curtain = transitionRef.current;
      const shell = document.querySelector(".page-shell");
      gsap.killTweensOf([shell, curtain].filter(Boolean));
      if (curtain) gsap.set(curtain, { yPercent: 0, scaleY: 0, transformOrigin: "50% 50%" });

      const timeline = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          router.push(`${url.pathname}${url.search}${url.hash}`);
        }
      });
      if (shell) timeline.to(shell, { autoAlpha: 0, y: -46, scale: 0.965, duration: 0.58 }, 0);
      if (curtain) timeline.to(curtain, { scaleY: 1, duration: 0.78 }, 0.08);
      if (!shell && !curtain) timeline.to({}, { duration: 0.2 });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      window.scrollTo({ top: 0, left: 0 });

      if (transitionInFlight.current && transitionRef.current) {
        gsap.set(transitionRef.current, { scaleY: 1, yPercent: 0 });
        gsap.to(transitionRef.current, {
          yPercent: -100,
          duration: 0.86,
          ease: "expo.inOut",
          delay: 0.08,
          onComplete: () => {
            gsap.set(transitionRef.current, { scaleY: 0, yPercent: 0 });
            transitionInFlight.current = false;
          }
        });
      }

      const shell = document.querySelector(".page-shell");
      if (shell) {
        gsap.fromTo(
          shell,
          { autoAlpha: 0, y: 42, clipPath: "inset(7% 0 0 0)" },
          { autoAlpha: 1, y: 0, scale: 1, clipPath: "inset(0% 0 0 0)", duration: 1.05, ease: "expo.out", delay: transitionInFlight.current ? 0.16 : 0 }
        );
      }
      const revealLines = gsap.utils.toArray(".reveal-line");
      if (revealLines.length) {
        gsap.fromTo(
          revealLines,
          { yPercent: 115 },
          { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.055, delay: 0.1 }
        );
      }
      const maskReveals = gsap.utils.toArray(".mask-reveal");
      if (maskReveals.length) {
        gsap.fromTo(
          maskReveals,
          { clipPath: "inset(18% 8% 18% 8%)", scale: 1.045 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.25, ease: "expo.out", stagger: 0.08, delay: 0.18 }
        );
      }

      const sections = gsap.utils.toArray<HTMLElement>(".page-shell > section:not(:first-child)");
      sections.forEach((section) => {
        gsap.fromTo(section,
          { y: 72, autoAlpha: 0.45 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.15,
            ease: "expo.out",
            scrollTrigger: { trigger: section, start: "top 91%", once: true }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".visual").forEach((visual) => {
        const canvas = visual.querySelector(".visual__canvas");
        if (!canvas) return;
        gsap.fromTo(canvas,
          { scale: 1.075 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: 0.8 } }
        );
      });

      gsap.utils.toArray<HTMLElement>(".case-module--two .visual, .doc-hero .visual").forEach((visual, index) => {
        gsap.fromTo(visual,
          { yPercent: index % 2 ? 7 : -3 },
          { yPercent: index % 2 ? -4 : 3, ease: "none", scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: 1 } }
        );
      });
    });
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => { window.clearTimeout(refresh); ctx.revert(); };
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    const count = { value: 0 };
    const tween = gsap.to(count, {
      value: 92, duration: 0.9, ease: "power3.out",
      onUpdate: () => {
        const el = document.querySelector("[data-loader-count]");
        if (el) el.textContent = String(Math.round(count.value)).padStart(2, "0");
      }
    });
    Promise.all([
      Promise.race([document.fonts.ready, new Promise((resolve) => window.setTimeout(resolve, 1400))]),
      new Promise((resolve) => window.setTimeout(resolve, 520))
    ]).then(() => {
      if (cancelled) return;
      gsap.to(count, {
        value: 100, duration: 0.28, ease: "power2.out",
        onUpdate: () => {
          const el = document.querySelector("[data-loader-count]");
          if (el) el.textContent = String(Math.round(count.value));
        },
        onComplete: () => {
          const loader = document.querySelector(".loader");
          if (!loader) {
            setLoading(false);
            return;
          }
          gsap.to(loader, {
            autoAlpha: 0, yPercent: -100, duration: 0.78, ease: "expo.inOut",
            onComplete: () => setLoading(false)
          });
        }
      });
    });
    return () => { cancelled = true; tween.kill(); };
  }, []);

  return (
    <>
      {loading && (
        <div className="loader" aria-label="Loading MTP website">
          <div data-loader-count>0</div>
          <span />
        </div>
      )}
      <div className="route-transition" ref={transitionRef} aria-hidden="true">
        <span>mtp / route mutation</span>
      </div>
      <GrainCanvas />
      {children}
    </>
  );
}

function GrainCanvas() {
  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("#grain");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let frame = 0;
    let raf = 0;
    const resize = () => {
      canvas.width = 180;
      canvas.height = Math.max(100, Math.round(180 * window.innerHeight / window.innerWidth));
    };
    const draw = () => {
      frame += 1;
      if (frame % 2 === 0) {
        const image = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < image.data.length; i += 4) {
          const value = 220 + Math.random() * 26;
          image.data[i] = value;
          image.data[i + 1] = value;
          image.data[i + 2] = value;
          image.data[i + 3] = 10;
        }
        ctx.putImageData(image, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas id="grain" aria-hidden="true" />;
}
