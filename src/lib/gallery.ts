// The four galleries. The value is the name of the backend route.
export type GalleryCategory = "custom" | "party" | "illustrations" | "logos";

export const GALLERY_CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: "custom", label: "custom caricatures" },
  { value: "party", label: "party caricatures" },
  { value: "illustrations", label: "illustrations" },
  { value: "logos", label: "logos" },
];
