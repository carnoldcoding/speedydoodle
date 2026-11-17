import type { Config } from "@react-router/dev/config";
import { CATEGORIES, fetchGallery, picturePath } from "./src/lib/gallery";

export default {
  appDirectory: "src",
  // No server runs for this site. The build writes each page to an HTML file.
  ssr: false,
  // The pages to write: each fixed page, each gallery choice, and each drawing.
  async prerender() {
    const gallery = await fetchGallery();
    return [
      "/",
      "/services",
      "/gallery",
      ...CATEGORIES.map(({ key }) => `/gallery/${key}`),
      ...CATEGORIES.flatMap(({ key }) => gallery[key].map(picturePath)),
    ];
  },
} satisfies Config;
