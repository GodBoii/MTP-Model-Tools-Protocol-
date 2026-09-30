"use client";

import { type ReactNode, useRef, useState } from "react";

export function CodeBlock({ children }: { children?: ReactNode }) {
  const pre = useRef<HTMLPreElement>(null);
  const [status, setStatus] = useState("Copy code");
  async function copy() {
    try {
      await navigator.clipboard.writeText(pre.current?.textContent ?? "");
      setStatus("Copied");
    } catch {
      setStatus("Select code to copy");
    }
  }
  return <div className="code-block"><button onClick={() => { void copy(); }} aria-live="polite">{status}</button><pre ref={pre}>{children}</pre></div>;
}
