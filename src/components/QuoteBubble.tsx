import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/content";
import { FADE_TIME, nextQuote, stayTime } from "@/lib/quotes";
import { InkParts } from "./InkParts";

// The customer quotes of the home page: one speech bubble that shows one testimonial at a
// time, and a row of dots below it.
//
// The HTML holds each testimonial in a speech bubble of its own. With no JavaScript, the
// bubbles show one below the other. With JavaScript, the style sheet puts them in the same
// place, shows the outline of the first one only, and shows the words of one testimonial.
// The bubble is then as high as the longest testimonial, so a change moves nothing.
export function QuoteBubble({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  // True after a visitor has pressed a dot. The bubble then changes no more by itself.
  const [stopped, setStopped] = useState(false);
  // The things that hold the change for a time: the bubble is off the screen, the browser
  // tab is hidden, the pointer is over the bubble, the keyboard focus is in the bubble.
  const [onScreen, setOnScreen] = useState(false);
  const [tabShown, setTabShown] = useState(true);
  const [pointerOver, setPointerOver] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  // True when the device asks for less motion. The bubble then does not change by itself.
  const [lessMotion, setLessMotion] = useState(false);
  // True when the last change came from the timer, so the next wait includes the fade.
  const afterFade = useRef(false);
  const box = useRef<HTMLDivElement>(null);

  const count = testimonials.length;
  // The list can become shorter when the page reads the content again in the browser.
  const shown = count ? index % count : 0;

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.5 });
    observer.observe(element);

    const readTab = () => setTabShown(document.visibilityState === "visible");
    readTab();
    document.addEventListener("visibilitychange", readTab);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const readMotion = () => setLessMotion(motion.matches);
    readMotion();
    motion.addEventListener("change", readMotion);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", readTab);
      motion.removeEventListener("change", readMotion);
    };
  }, []);

  const running = count > 1 && !stopped && !lessMotion && onScreen && tabShown && !pointerOver && !focusInside;
  const text = testimonials[shown]?.text ?? "";

  useEffect(() => {
    if (!running) return;
    // After a change by the timer, the old text goes out and the new text comes in first.
    const wait = stayTime(text) + (afterFade.current ? 2 * FADE_TIME : 0);
    const timer = window.setTimeout(() => {
      afterFade.current = true;
      setIndex(nextQuote(shown, count));
    }, wait);
    return () => window.clearTimeout(timer);
  }, [running, shown, count, text]);

  if (count === 0) return null;

  const choose = (position: number) => {
    afterFade.current = false;
    setStopped(true);
    setIndex(position);
  };

  return (
    <div
      ref={box}
      className="max-w-[560px]"
      // A touch has no pointer that stays over the bubble, so only a mouse holds the change.
      onPointerEnter={(event) => event.pointerType === "mouse" && setPointerOver(true)}
      onPointerLeave={() => setPointerOver(false)}
      onFocus={() => setFocusInside(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocusInside(false)}
    >
      <div className="quotes">
        {testimonials.map((quote, position) => (
          // Only the first bubble is a part of the entrance of the section. With JavaScript,
          // the other bubbles show no outline of their own.
          <figure key={`${position} ${quote.name}`} className="ink-box bubble" {...(position === 0 ? { "data-m": "" } : {})}>
            <InkParts radius={22} />
            <div className="ink-in px-[22px] py-[18px]">
              <div className="quote-words" data-on={position === shown ? "" : undefined} aria-hidden={position === shown ? undefined : true}>
                <blockquote>"{quote.text}"</blockquote>
                <p className="mt-2 font-bold">{quote.name}</p>
              </div>
            </div>
          </figure>
        ))}
      </div>
      {count > 1 ? (
        <div className="quote-dots" role="group" aria-label="Customer quotes" data-m>
          {testimonials.map((quote, position) => (
            <button
              key={`${position} ${quote.name}`}
              type="button"
              className="quote-dot"
              aria-label={`Quote from ${quote.name}`}
              aria-current={position === shown ? "true" : undefined}
              onClick={() => choose(position)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
