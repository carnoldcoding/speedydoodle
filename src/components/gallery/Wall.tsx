import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { describePicture, picturePath, sized, type Picture } from "@/lib/gallery";
import type { ListKey, OpenedFrom } from "./lists";

// "in": the panel draws itself. "soft": it arrives finished, with a short fade. "done": it shows finished.
type Drawn = { state: "in" | "soft" | "done"; delay: number };

const DONE: Drawn = { state: "done", delay: 0 };

// The galleries that the visitor has already opened in this visit to the site.
const seen = new Set<ListKey>();

// The first pictures load at once, so the first screen paints fast.
const EAGER = 8;

interface WallProps {
  listKey: ListKey;
  pictures: Picture[];
  // A press on a panel. The page keeps the panel, to return the focus to it.
  onOpen: (panel: HTMLElement) => void;
}

// The wall: columns of panels with different heights. Give it `key={listKey}`, so that each
// choice of the bar gets a new wall. A panel with no state is hidden only when JavaScript runs.
export function Wall({ listKey, pictures, onOpen }: WallProps) {
  const [alreadySeen] = useState(() => seen.has(listKey));
  // A drawing that arrives after the wall was made (a refresh of the list) shows finished.
  const [first] = useState(() => new Set(pictures.map(picturePath)));
  const [drawn, setDrawn] = useState<Record<string, Drawn>>({});
  const wall = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is in an effect, so the build of the pages never marks a gallery as seen.
    seen.add(listKey);
    const element = wall.current;
    if (alreadySeen || !element) return;
    // True until the first screen of this gallery has started its animation.
    let firstScreen = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const arrived: Record<string, Drawn> = {};
        let order = 0;
        for (const entry of entries) {
          const path = (entry.target as HTMLElement).dataset.path;
          if (!entry.isIntersecting || !path) continue;
          // Panels on the first screen start 60 ms apart.
          arrived[path] = firstScreen ? { state: "in", delay: order++ * 60 } : { state: "soft", delay: 0 };
          observer.unobserve(entry.target);
        }
        firstScreen = false;
        if (Object.keys(arrived).length > 0) setDrawn((before) => ({ ...before, ...arrived }));
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    element.querySelectorAll("[data-path]").forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, [listKey, alreadySeen]);

  const opened: OpenedFrom = { from: listKey };

  return (
    <div ref={wall} className="wall">
      {pictures.map((picture, index) => {
        const path = picturePath(picture);
        const state = alreadySeen || !first.has(path) ? DONE : drawn[path];
        // A small tilt, different for each panel, and always the same for the same panel.
        const tilt = (((index * 37) % 9) - 4) * 0.45;
        const style = {
          "--tilt": `${tilt === 0 ? 0.6 : tilt}deg`,
          "--d": state?.delay ? `${state.delay}ms` : undefined,
          aspectRatio: `${picture.width} / ${picture.height}`,
        } as CSSProperties;
        return (
          <Link
            key={path}
            to={path}
            state={opened}
            preventScrollReset
            className="ink-box pic wall-panel"
            style={style}
            data-path={path}
            data-state={state?.state}
            data-testid="gallery-panel"
            onClick={(event) => onOpen(event.currentTarget)}
          >
            <img
              src={sized(picture.url, 520)}
              srcSet={`${sized(picture.url, 320)} 320w, ${sized(picture.url, 520)} 520w, ${sized(picture.url, 800)} 800w`}
              sizes="(max-width: 700px) 46vw, (max-width: 860px) 380px, 300px"
              alt={describePicture(picture)}
              width={picture.width}
              height={picture.height}
              loading={index < EAGER ? "eager" : "lazy"}
              decoding="async"
            />
            <svg className="ink-line" aria-hidden="true">
              <rect width="100%" height="100%" pathLength={1} />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}
