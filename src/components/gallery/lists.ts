import type { CategoryKey } from "@/lib/gallery";

// A choice of the gallery bar: the four kinds of work, or all of them mixed.
export type ListKey = "all" | CategoryKey;

export const listPath = (key: ListKey) => (key === "all" ? "/gallery" : `/gallery/${key}`);

// What a press on a panel puts in the navigation state: the wall that the drawing was opened from.
export interface OpenedFrom {
  from: ListKey;
}
