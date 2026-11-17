import type { QuoteType } from "./gallery";

// Facts about the business that more than one page uses.
export const SITE = {
  url: "https://speedydoodle.com",
  name: "Speedydoodle Studios",
  artist: "Mike Arnold",
  areas: ["South Jersey", "Philadelphia", "Delaware"],
  email: "mike@speedydoodle.com",
  facebook: "https://www.facebook.com/speedydoodle",
  linkedin: "https://www.linkedin.com/in/michael-arnold-57a984a3",
  books: "https://speedydoodlestudios.com/",
  themeColor: "#b42401",
} as const;

// The address of the quote form. With a type, the form opens with that type chosen.
export const quotePath = (type?: QuoteType) => (type ? `/services?type=${type}` : "/services");

interface PageMeta {
  title: string;
  description: string;
  // The path of the page, for example "/gallery".
  path: string;
  // The picture a messaging app shows for a shared link. A full address, or a path on this site.
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
}

// The tags in the head of a page: for search engines, and for the preview of a shared link.
export function pageMeta({ title, description, path, image, imageAlt, imageWidth = 1200, imageHeight = 630 }: PageMeta) {
  const address = SITE.url + (path === "/" ? "/" : path);
  const picture = image.startsWith("http") ? image : SITE.url + image;
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: address },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: address },
    { property: "og:image", content: picture },
    { property: "og:image:width", content: String(imageWidth) },
    { property: "og:image:height", content: String(imageHeight) },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
