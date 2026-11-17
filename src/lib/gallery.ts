import { API_URL } from "./api";

// The four kinds of work. `key` is the name in the address and the name of the backend route.
export type CategoryKey = "party" | "custom" | "illustrations" | "logos";
// The three types of the quote form.
export type QuoteType = "live" | "custom" | "lni";

export interface Category {
  key: CategoryKey;
  label: string;
  // One piece of this kind of work, for the text description of a picture.
  noun: string;
  // The quote type that a "Get a quote" button for this work opens.
  quoteType: QuoteType;
  // The small line of the burst in the large view.
  burstLine: string;
}

export const CATEGORIES: Category[] = [
  { key: "party", label: "Party", noun: "Party caricature", quoteType: "live", burstLine: "Want this at your event?" },
  { key: "custom", label: "Custom", noun: "Custom caricature", quoteType: "custom", burstLine: "Want one of your own?" },
  { key: "illustrations", label: "Illustrations", noun: "Illustration", quoteType: "lni", burstLine: "Need art like this?" },
  { key: "logos", label: "Logos", noun: "Logo", quoteType: "lni", burstLine: "Need a logo like this?" },
];

export const isCategoryKey = (value: string | undefined): value is CategoryKey =>
  CATEGORIES.some((category) => category.key === value);

export const categoryOf = (key: CategoryKey) => CATEGORIES.find((category) => category.key === key)!;

export interface Picture {
  category: CategoryKey;
  // The name of the drawing in its address: /gallery/<category>/<slug>.
  slug: string;
  // The address of the picture file, with no size.
  url: string;
  width: number;
  height: number;
}

export type Gallery = Record<CategoryKey, Picture[]>;

// The file name of a picture address, with no folder, no query, and no file type.
const fileName = (url: string) => decodeURIComponent(url.split("?")[0].split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");

// "05-Party_Caricatures.jpg" becomes "05-party-caricatures".
export function slugFromUrl(url: string): string {
  return fileName(url)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Turn the answer of the backend into pictures. Two files with the same name get two addresses.
export function toPictures(category: CategoryKey, items: { url: string; width?: number; height?: number }[]): Picture[] {
  const used = new Map<string, number>();
  return items.map((item) => {
    const base = slugFromUrl(item.url) || "drawing";
    const count = (used.get(base) ?? 0) + 1;
    used.set(base, count);
    return {
      category,
      slug: count === 1 ? base : `${base}-${count}`,
      url: item.url.split("?")[0],
      width: item.width || 4,
      height: item.height || 5,
    };
  });
}

// The address of a picture at a width in pixels. The picture host makes the size.
export const sized = (url: string, width: number) => `${url.split("?")[0]}?tr=w-${width}`;

// The text description of a picture, until real captions exist.
export function describePicture(picture: Picture): string {
  const words = fileName(picture.url).replace(/[-_]+/g, " ").trim();
  return `${categoryOf(picture.category).noun} by Mike Arnold: ${words}`;
}

export const picturePath = (picture: Picture) => `/gallery/${picture.category}/${picture.slug}`;

// Read the four lists from the backend. This runs at build time and again in the browser.
export async function fetchGallery(): Promise<Gallery> {
  const lists = await Promise.all(
    CATEGORIES.map(async ({ key }) => {
      const response = await fetch(`${API_URL}/api/${key}`);
      if (!response.ok) throw new Error(`The ${key} gallery did not load (status ${response.status})`);
      return [key, toPictures(key, await response.json())] as const;
    })
  );
  return Object.fromEntries(lists) as Gallery;
}

// One list with the four kinds mixed, so that "All" is not four blocks.
export function mixed(gallery: Gallery): Picture[] {
  const lists = CATEGORIES.map(({ key }) => gallery[key]);
  const longest = Math.max(...lists.map((list) => list.length));
  const result: Picture[] = [];
  for (let index = 0; index < longest; index++) for (const list of lists) if (list[index]) result.push(list[index]);
  return result;
}
