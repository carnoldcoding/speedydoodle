import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { describePicture, picturePath, sized, type Picture } from "@/lib/gallery";
import { Burst } from "./Burst";

interface LargeViewProps {
  // The drawings of the wall behind, in the order of the wall.
  pictures: Picture[];
  // The drawing that the address names.
  open: Picture;
  // The panel that opened the large view. The focus returns to it.
  opener: RefObject<HTMLElement | null>;
  // Change the address to this drawing.
  onGo: (picture: Picture) => void;
  onClose: () => void;
}

interface Controls {
  step: (delta: number) => void;
  jump: (path: string) => void;
  close: () => void;
}

// One picture, large, with the next and the previous one a key press away.
// The slides are made by hand, not by React: a new picture is loaded in full before anything
// moves, and the old slide leaves from the place where a finger left it.
export function LargeView({ pictures, open, opener, onGo, onClose }: LargeViewProps) {
  const openPath = picturePath(open);
  // The drawing that the counter and the burst show. It changes at the press, before the address.
  const [path, setPath] = useState(openPath);
  const spotRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls | null>(null);
  const live = useRef({
    pictures,
    onGo,
    onClose,
    path: openPath,
    // The number of the newest request, so that an older one can stop.
    request: 0,
    // True while the address is behind a press of next or previous.
    asked: false,
    closed: false,
  });

  // The handlers below are made one time. They read the newest list and callbacks from here.
  useLayoutEffect(() => {
    live.current.pictures = pictures;
    live.current.onGo = onGo;
    live.current.onClose = onClose;
  });

  useLayoutEffect(() => {
    const spot = spotRef.current;
    const stage = stageRef.current;
    if (!spot || !stage) return;
    const state = live.current;
    state.closed = false;

    const indexOf = (wanted: string) => state.pictures.findIndex((picture) => picturePath(picture) === wanted);
    const at = (index: number) => state.pictures[(index + state.pictures.length) % state.pictures.length];
    const preload = (index: number) => {
      const image = new Image();
      image.src = sized(at(index).url, 1600);
    };

    // Move a slide off to one side and remove it. It starts from where it is now,
    // which is the middle, or the place that a finger dragged it to.
    const leave = (slide: HTMLElement, direction: number) => {
      slide.querySelector("img")?.removeAttribute("data-testid");
      slide.style.animation = "none";
      slide.style.transition = "translate 180ms cubic-bezier(.4, 0, 1, 1), opacity 180ms linear";
      // Read the layout one time, so that the browser starts the transition from the current place.
      void slide.offsetWidth;
      slide.style.translate = `${direction * -110}px 0`;
      slide.style.opacity = "0";
      setTimeout(() => slide.remove(), 230);
    };

    const show = async (index: number, direction: number) => {
      if (state.pictures.length === 0) return;
      const picture = at(index);
      state.path = picturePath(picture);
      setPath(state.path);
      const mine = ++state.request;
      const image = new Image();
      image.alt = describePicture(picture);
      image.draggable = false;
      image.src = sized(picture.url, 1600);
      // Wait until the browser has the picture ready to paint.
      try {
        await image.decode();
      } catch {
        // A picture that fails to load still shows its frame.
      }
      // The visitor pressed again while this picture loaded. The newer request shows its picture.
      if (mine !== state.request) return;

      for (const old of Array.from(stage.children)) leave(old as HTMLElement, direction);
      const slide = document.createElement("div");
      slide.className = `large-slide ${direction === 0 ? "first" : "enter"}`;
      slide.style.setProperty("--dir", String(direction));
      image.dataset.testid = "large-view-image";
      slide.append(image);
      stage.append(slide);
      // Have the two neighbours ready, so that the next press is instant.
      const now = indexOf(state.path);
      preload(now + 1);
      preload(now - 1);
    };

    const step = (delta: number) => {
      const now = indexOf(state.path);
      if (now < 0) return;
      const next = at(now + delta);
      state.asked = true;
      void show(now + delta, delta);
      state.onGo(next);
    };
    const jump = (wanted: string) => {
      const index = indexOf(wanted);
      if (index >= 0) void show(index, 0);
    };
    const close = () => {
      // A second press while the page closes the large view does nothing.
      if (state.closed) return;
      state.closed = true;
      state.request++;
      state.onClose();
    };
    controls.current = { step, jump, close };

    const onClick = (event: MouseEvent) => {
      // A press on the dark area, not on the picture or on a button.
      if (event.target === spot) close();
    };
    const onKey = (event: KeyboardEvent) => {
      // Alt and an arrow is the Back key of the browser. Leave it alone.
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
      if (event.key !== "Tab") return;
      // Tab stays inside the large view.
      const stops = Array.from(spot.querySelectorAll<HTMLElement>("button, a[href]"));
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      if (!first || !last) return;
      const leaves = event.shiftKey ? active === first || active === spot : active === last;
      if (leaves || !spot.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    // On a touch screen the picture follows the finger. A drag of 60 pixels or more changes
    // the picture. A shorter drag lets the picture return to the middle.
    let touchX: number | null = null;
    let dragged = 0;
    const topSlide = () => stage.lastElementChild as HTMLElement | null;
    const onTouchStart = (event: TouchEvent) => {
      const target = event.target as Element | null;
      if (event.touches.length !== 1 || target?.closest(".large-ctl, .burst")) {
        touchX = null;
        return;
      }
      touchX = event.touches[0].clientX;
      dragged = 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchX === null) return;
      // The large view owns each finger movement, so the page behind it does not move.
      event.preventDefault();
      dragged = event.touches[0].clientX - touchX;
      const slide = topSlide();
      if (!slide) return;
      slide.style.animation = "none";
      slide.style.transition = "none";
      slide.style.translate = `${dragged}px 0`;
    };
    const onTouchEnd = () => {
      if (touchX === null) return;
      touchX = null;
      const slide = topSlide();
      if (Math.abs(dragged) >= 60) {
        step(dragged < 0 ? 1 : -1);
      } else if (dragged !== 0 && slide) {
        slide.style.transition = "translate 160ms cubic-bezier(.2, .8, .2, 1)";
        slide.style.translate = "0 0";
      }
      dragged = 0;
    };

    spot.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    spot.addEventListener("touchstart", onTouchStart, { passive: true });
    spot.addEventListener("touchmove", onTouchMove, { passive: false });
    spot.addEventListener("touchend", onTouchEnd);
    spot.addEventListener("touchcancel", onTouchEnd);

    // A phone browser keeps scrolling the page behind the large view unless the page is pinned.
    const pinnedAt = window.scrollY;
    const body = document.body.style;
    const page = document.documentElement.style;
    Object.assign(body, { position: "fixed", top: `${-pinnedAt}px`, left: "0", right: "0" });
    // Keep the scroll bar on the screen, so the wall behind keeps its width.
    page.overflowY = "scroll";

    spot.focus({ preventScroll: true });
    jump(state.path);

    // This is a layout effect, so the page is free again before the router sets the scroll
    // of the next page.
    return () => {
      state.request++;
      controls.current = null;
      spot.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      spot.removeEventListener("touchstart", onTouchStart);
      spot.removeEventListener("touchmove", onTouchMove);
      spot.removeEventListener("touchend", onTouchEnd);
      spot.removeEventListener("touchcancel", onTouchEnd);
      stage.replaceChildren();
      Object.assign(body, { position: "", top: "", left: "", right: "" });
      page.overflowY = "";
      // "instant", because the page scrolls smoothly by default.
      window.scrollTo({ top: pinnedAt, behavior: "instant" });
      const panel = opener.current;
      if (panel?.isConnected) panel.focus({ preventScroll: true });
    };
  }, [opener]);

  // The address changed and no press here asked for it (for example, the Back button
  // between two drawings). Show the drawing of the address.
  useEffect(() => {
    const state = live.current;
    if (openPath === state.path) {
      state.asked = false;
      return;
    }
    if (!state.asked) controls.current?.jump(openPath);
  }, [openPath]);

  const index = pictures.findIndex((picture) => picturePath(picture) === path);
  const picture = pictures[index] ?? open;

  return (
    <div ref={spotRef} className="large-view" role="dialog" aria-modal="true" aria-label="Picture" tabIndex={-1} data-testid="large-view">
      {/* The slides go here. React gives this element no children, so it leaves them alone. */}
      <div ref={stageRef} className="large-stage" />
      <button type="button" className="large-ctl large-close comic" aria-label="Close" data-testid="large-view-close" onClick={() => controls.current?.close()}>
        X
      </button>
      <button type="button" className="large-ctl large-prev comic" aria-label="Previous picture" data-testid="large-view-prev" onClick={() => controls.current?.step(-1)}>
        &lt;
      </button>
      <button type="button" className="large-ctl large-next comic" aria-label="Next picture" data-testid="large-view-next" onClick={() => controls.current?.step(1)}>
        &gt;
      </button>
      <p className="large-count comic" aria-live="polite" data-testid="large-view-count">
        <b>{index + 1}</b> / {pictures.length}
      </p>
      <Burst picture={picture} />
    </div>
  );
}
