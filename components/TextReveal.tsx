import { splitWords } from "@/lib/motion";

export function TextReveal({ text, as: Tag = "div", className = "" }: { text: string; as?: keyof JSX.IntrinsicElements; className?: string }) {
  return (
    <Tag className={`text-reveal ${className}`}>
      {splitWords(text).map((word, index) => (
        <span className="word" key={`${word}-${index}`}>
          <span className="reveal-line">{word}{index < splitWords(text).length - 1 ? "\u00a0" : ""}</span>
        </span>
      ))}
    </Tag>
  );
}
