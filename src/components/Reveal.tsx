import { useEffect, useRef, type ComponentProps } from "react";
import { cn } from "cn";

interface RevealProps extends ComponentProps<"section"> {
  // "load": the entrance runs when the page loads, with no JavaScript needed. Use it for the
  // first screen of a page, and give each part its delay with the `delay` helper.
  // "scroll": the entrance runs the first time the section scrolls into view.
  mode?: "load" | "scroll";
  dots?: boolean;
}

// The delay of one part of a section. Parts start 90 ms apart.
export const delay = (order: number) => ({ "--d": `${order * 90}ms` }) as React.CSSProperties;

// A section whose parts (each element with data-m) enter one time.
export function Reveal({ mode = "scroll", dots, className, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section || mode !== "scroll") return;
    // Parts start one after another, in the order they are in the page.
    section.querySelectorAll<HTMLElement>("[data-m]").forEach((part, order) => {
      if (!part.style.getPropertyValue("--d")) part.style.setProperty("--d", `${order * 90}ms`);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          section.classList.add("go");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [mode]);

  return (
    <section ref={ref} data-reveal={mode} className={cn(dots && "dots", className)} {...rest}>
      {children}
    </section>
  );
}
