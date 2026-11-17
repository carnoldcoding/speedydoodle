import type { Ref } from "react";
import { Link } from "react-router";
import { ComicButton } from "@/components/ComicButton";
import { CATEGORIES, categoryOf } from "@/lib/gallery";
import { quotePath } from "@/lib/site";
import { listPath, type ListKey } from "./lists";

interface GalleryBarProps {
  ref?: Ref<HTMLElement>;
  active: ListKey;
  // The number of drawings of each choice. It is absent while the lists load.
  counts?: Record<ListKey, number>;
  onPick: (key: ListKey) => void;
}

const CHOICES: { key: ListKey; label: string }[] = [{ key: "all", label: "All" }, ...CATEGORIES];

// The bar that stays at the top of the screen: the five choices, and the way to a quote.
export function GalleryBar({ ref, active, counts, onPick }: GalleryBarProps) {
  return (
    <nav ref={ref} aria-label="Gallery" className="gallery-bar">
      {CHOICES.map(({ key, label }) => (
        <Link
          key={key}
          to={listPath(key)}
          preventScrollReset
          className="gallery-chip comic"
          aria-current={key === active ? "page" : undefined}
          data-testid={`gallery-chip-${key}`}
          onClick={() => onPick(key)}
        >
          {label}
          {counts ? <small>{counts[key]}</small> : null}
        </Link>
      ))}
      <ComicButton to={quotePath(active === "all" ? undefined : categoryOf(active).quoteType)} size="small" data-testid="gallery-quote">
        Get a quote
      </ComicButton>
    </nav>
  );
}
