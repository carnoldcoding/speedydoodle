import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useLocation, useNavigate } from "react-router";
import { GalleryBar } from "@/components/gallery/GalleryBar";
import { LargeView } from "@/components/gallery/LargeView";
import { listPath, type ListKey, type OpenedFrom } from "@/components/gallery/lists";
import { Wall } from "@/components/gallery/Wall";
import { delay, Reveal } from "@/components/Reveal";
import { Title } from "@/components/Title";
import { CATEGORIES, categoryOf, describePicture, fetchGallery, isCategoryKey, mixed, picturePath, sized, type CategoryKey, type Gallery, type Picture } from "@/lib/gallery";
import { pageMeta } from "@/lib/site";
import "@/styles/gallery.css";
import type { Route } from "./+types/gallery";

const SHARE = { image: "/share/gallery.jpg", imageAlt: "Three of Mike's drawings, with the words: See Mike's work." };

// The title and the description of each choice of the bar.
const PAGES: Record<CategoryKey, { label: string; description: string }> = {
  party: {
    label: "Party caricatures",
    description: "Caricatures Mike drew on the spot at weddings, birthdays, and company parties across South Jersey, Philadelphia, and Delaware.",
  },
  custom: {
    label: "Custom caricatures",
    description: "Custom caricatures Mike drew from photos. One-of-a-kind gifts, every one drawn by hand.",
  },
  illustrations: {
    label: "Illustrations",
    description: "Illustrations Mike drew for books, brands, and products. Every one drawn by hand.",
  },
  logos: {
    label: "Logos",
    description: "Cartoon logos Mike drew for businesses and brands. Every one drawn by hand.",
  },
};

const findPicture = (gallery: Gallery | null | undefined, category: CategoryKey | undefined, slug: string | undefined) =>
  gallery && category && slug ? gallery[category].find((picture) => picture.slug === slug) : undefined;

export function meta({ params, loaderData }: Route.MetaArgs) {
  const category = isCategoryKey(params.category) ? params.category : undefined;
  const picture = findPicture(loaderData, category, params.slug);

  if (picture) {
    return pageMeta({
      title: `${describePicture(picture).replace(" by Mike Arnold", "")} | Speedydoodle Studios`,
      description: `${categoryOf(picture.category).noun} by Mike Arnold, drawn by hand. Want one like this? Get a quote in two minutes.`,
      path: picturePath(picture),
      // The picture of a shared link to a drawing is that drawing.
      image: sized(picture.url, 1200),
      imageWidth: 1200,
      imageHeight: Math.round((1200 * picture.height) / picture.width),
      imageAlt: describePicture(picture),
    });
  }
  if (category) {
    return pageMeta({
      title: `${PAGES[category].label} | Mike's work | Speedydoodle Studios`,
      description: PAGES[category].description,
      path: listPath(category),
      ...SHARE,
    });
  }
  return pageMeta({
    title: "Mike's work | Speedydoodle Studios",
    description: "Party caricatures, custom gifts, logos, and illustrations. Every one drawn by hand.",
    path: "/gallery",
    ...SHARE,
  });
}

// The build asks the backend for the four lists one time, not one time for each page.
let atBuild: Promise<Gallery> | undefined;

export async function loader() {
  atBuild ??= fetchGallery();
  return atBuild;
}

// The newest lists that the browser has read in this visit to the site.
let latest: Gallery | undefined;

// A drawing that is newer than the last build has no data file. Then the browser reads the lists.
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs): Promise<Gallery | null> {
  try {
    return await serverLoader();
  } catch {
    try {
      latest = await fetchGallery();
      return latest;
    } catch {
      // The page shows a message, and tries one more time.
      return null;
    }
  }
}

// The lists are the same for each address of the gallery. A press on a chip, a panel, or
// "next" must not read a data file again.
export function shouldRevalidate() {
  return false;
}

// The drawings of a gallery as one text, to see if a new list is different.
const signature = (gallery: Gallery) =>
  CATEGORIES.map(({ key }) => gallery[key].map((picture) => `${picture.slug} ${picture.url} ${picture.width} ${picture.height}`).join("\n")).join("\n\n");

const openedFrom = (state: unknown): ListKey | undefined => {
  const from = (state as Partial<OpenedFrom> | null)?.from;
  return from === "all" || isCategoryKey(from) ? from : undefined;
};

// False on the server and while the built HTML takes its handlers. True after that.
const subscribeToNothing = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );

export default function GalleryPage({ loaderData, params }: Route.ComponentProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const [fresh, setFresh] = useState(latest);
  const [failed, setFailed] = useState(false);
  const gallery = fresh ?? loaderData;

  // U13: read the lists again in the background. Show them only if the drawings changed.
  useEffect(() => {
    let gone = false;
    fetchGallery()
      .then((next) => {
        latest = next;
        if (gone) return;
        setFailed(false);
        setFresh((now) => {
          const shown = now ?? loaderData;
          return shown && signature(shown) === signature(next) ? now : next;
        });
      })
      .catch(() => {
        if (!gone) setFailed(true);
      });
    return () => {
      gone = true;
    };
    // One time for each visit to the page. The lists of the build do not change.
  }, []);

  const category = isCategoryKey(params.category) ? params.category : undefined;
  const open = findPicture(gallery, category, params.slug);
  // The navigation state is not in the built HTML, so it is read after the page has its handlers.
  const from = hydrated ? openedFrom(location.state) : undefined;
  // A drawing opened from "All" keeps the wall of "All" behind it.
  const listKey: ListKey = open && from === "all" ? "all" : (category ?? "all");

  const pictures = useMemo<Picture[]>(() => (!gallery ? [] : listKey === "all" ? mixed(gallery) : gallery[listKey]), [gallery, listKey]);
  const counts = useMemo(() => {
    if (!gallery) return undefined;
    const each = Object.fromEntries(CATEGORIES.map(({ key }) => [key, gallery[key].length])) as Record<CategoryKey, number>;
    return { ...each, all: CATEGORIES.reduce((sum, { key }) => sum + each[key], 0) };
  }, [gallery]);

  // A press on a chip moves the page so that the bar is at the top, as in the study.
  const bar = useRef<HTMLElement>(null);
  const wallTop = useRef<HTMLDivElement>(null);
  const chipPressed = useRef(false);
  useEffect(() => {
    if (!chipPressed.current || !bar.current || !wallTop.current) return;
    chipPressed.current = false;
    // The bar sticks under the navigation. Its `top` in the style sheet is that height.
    const stuckAt = parseFloat(getComputedStyle(bar.current).top) || 0;
    window.scrollTo({ top: wallTop.current.getBoundingClientRect().top + window.scrollY - stuckAt });
  }, [listKey]);

  // The panel that opened the large view. The focus returns to it.
  const opener = useRef<HTMLElement | null>(null);

  const go = (picture: Picture) => {
    // "replace", so the Back button leaves the large view in one press.
    navigate(picturePath(picture), { replace: true, preventScrollReset: true, state: location.state });
  };
  const close = () => {
    // A panel put this address on top of the address of its wall. Go back to that one.
    if (from) navigate(-1);
    // The address was opened directly. Its wall takes its place.
    else navigate(listPath(listKey), { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <main className="dots">
        <Reveal mode="load" className="px-4 pb-2 pt-[clamp(36px,6vw,72px)] text-center">
          <p className="kicker" data-m style={delay(0)}>
            All drawn by Mike
          </p>
          <Title as="h1" big text="The Gallery" style={delay(1)} />
        </Reveal>
        <div ref={wallTop} />
        <GalleryBar
          ref={bar}
          active={listKey}
          counts={counts}
          onPick={(key) => {
            chipPressed.current = key !== listKey;
          }}
        />
        {gallery ? (
          <Wall key={listKey} listKey={listKey} pictures={pictures} onOpen={(panel) => (opener.current = panel)} />
        ) : (
          <p className="gallery-loading comic" role="status">
            {failed ? "The pictures did not load. Check the connection and reload." : "Mike is sharpening the pencils…"}
          </p>
        )}
      </main>
      {/* The large view needs JavaScript, so it is not in the built HTML. */}
      {hydrated && open ? <LargeView pictures={pictures} open={open} opener={opener} onGo={go} onClose={close} /> : null}
    </>
  );
}
