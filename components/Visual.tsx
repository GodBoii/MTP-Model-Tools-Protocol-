"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { projectGradient } from "@/lib/motion";

export function Visual({ title, colors, tall = false }: { title: string; colors: [string, string, string]; tall?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTargetMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColorA: { value: new THREE.Color(colors[0]) },
      uColorB: { value: new THREE.Color(colors[1]) },
      uColorC: { value: new THREE.Color(colors[2]) }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uHover;
        uniform vec2 uMouse;
        uniform vec2 uVelocity;
        uniform vec2 uResolution;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float band(vec2 uv, float angle, float offset) {
          vec2 dir = vec2(cos(angle), sin(angle));
          float line = dot(uv, dir) + offset;
          return smoothstep(0.48, 0.5, fract(line * 4.0));
        }

        void main() {
          vec2 uv = vUv;
          vec2 aspectUv = vec2(uv.x * uResolution.x / max(uResolution.y, 1.0), uv.y);
          vec2 aspectMouse = vec2(uMouse.x * uResolution.x / max(uResolution.y, 1.0), uMouse.y);
          float dist = distance(aspectUv, aspectMouse);
          float radius = mix(0.16, 0.42, uHover);
          float falloff = smoothstep(radius, 0.0, dist);

          vec2 grid = vec2(34.0 * uResolution.x / max(uResolution.y, 1.0), 34.0);
          vec2 blockUv = floor(uv * grid) / grid;
          float pulse = hash(blockUv + floor(uTime * 2.0));
          vec2 dragged = blockUv - uVelocity * (0.22 + pulse * 0.35) * falloff;
          vec2 sampleUv = mix(uv, dragged, falloff * 0.94);

          float diagonal = band(sampleUv, 2.25, sin(uTime * 0.18) * 0.08);
          float gridLine = step(0.965, fract(sampleUv.x * 18.0)) + step(0.965, fract(sampleUv.y * 18.0));
          float redPlate = smoothstep(0.44, 0.62, sampleUv.x + sampleUv.y + sin(uTime * 0.35) * 0.08);
          vec3 color = mix(uColorA, uColorC, redPlate);
          color = mix(color, uColorB, diagonal * 0.38 + falloff * 0.62);
          color += gridLine * 0.08;

          float split = length(uVelocity) * falloff * 1.8;
          color.r += split;
          color.b -= split * 0.55;
          color = mix(color, vec3(hash(blockUv + uTime) * 0.16), falloff * pulse * 0.18);
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
      uniforms.uResolution.value.set(rect.width, rect.height);
    };

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      uniforms.uTargetMouse.value.set(
        (event.clientX - rect.left) / Math.max(1, rect.width),
        1 - (event.clientY - rect.top) / Math.max(1, rect.height)
      );
      uniforms.uHover.value = 1;
    };

    const onLeave = () => {
      uniforms.uHover.value = 0;
    };
    let raf = 0;
    let last = 0;
    const render = (time: number) => {
      const delta = Math.min(0.04, (time - last) / 1000 || 0.016);
      last = time;
      if (!prefersReduced) uniforms.uTime.value += delta;

      const dx = uniforms.uTargetMouse.value.x - uniforms.uMouse.value.x;
      const dy = uniforms.uTargetMouse.value.y - uniforms.uMouse.value.y;
      uniforms.uMouse.value.x += dx * 0.13;
      uniforms.uMouse.value.y += dy * 0.13;
      uniforms.uVelocity.value.x += (dx - uniforms.uVelocity.value.x) * 0.11;
      uniforms.uVelocity.value.y += (dy - uniforms.uVelocity.value.y) * 0.11;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    resize();
    render(0);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, [colors]);

  return (
    <div className={`visual mask-reveal ${tall ? "visual--tall" : ""}`} style={projectGradient(colors)} aria-label={`${title} visual`} ref={wrapRef}>
      <canvas className="visual__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="visual__grid" />
      <div className="visual__mark">{title.slice(0, 2)}</div>
      <div className="visual__scan">{title}</div>
    </div>
  );
}
