import type { CSSProperties } from "react";
import { cn } from "cn";

interface TitleProps {
  as?: "h1" | "h2" | "h3" | "span";
  text: string;
  // One word of the text that gets the ink line under it.
  underline?: string;
  big?: boolean;
  className?: string;
  style?: CSSProperties;
}

// The ink line under one word of a title.
const InkLine = () => (
  <svg className="underline-ink" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
    <path pathLength={1} d="M3 8 C 30 2, 50 13, 78 7 S 128 2, 152 8 S 186 11, 197 5" />
  </svg>
);

// A comic title. Each letter is its own element, so the letters can arrive one by one.
// A screen reader reads the label of the heading, not the single letters. With as="span",
// the heading around the title gives the label.
export function Title({ as: Tag = "h2", text, underline, big, className, style }: TitleProps) {
  let count = 0;
  const words = text.split(" ");
  return (
    <Tag className={cn("title", big && "title-big", className)} style={style} aria-label={Tag === "span" ? undefined : text} data-m>
      {words.map((word, index) => {
        const letters = (
          <span className="word">
            {[...word].map((letter, position) => (
              <span key={position} className="ch" style={{ "--c": count++ } as CSSProperties}>
                {letter}
              </span>
            ))}
          </span>
        );
        return (
          <span key={index} aria-hidden="true">
            {word === underline ? (
              <span className="underlined">
                {letters}
                <InkLine />
              </span>
            ) : (
              letters
            )}
            {index < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}
