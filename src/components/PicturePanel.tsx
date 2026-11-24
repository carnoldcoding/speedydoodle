import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "cn";

interface PicturePanelProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
  // The tilt of the panel in degrees.
  tilt?: number;
  // A dark fade at the bottom of the picture.
  shade?: boolean;
  // With `to`, the panel is a link.
  to?: string;
  // The name of the link for a screen reader, when the text of the picture does not say
  // where the link goes.
  label?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

// A picture in a comic panel: an ink outline, a red hard shadow, and a small tilt.
// As a part of a section entrance, it arrives as a sketch and takes its colour.
export function PicturePanel({ src, srcSet, sizes, alt, width, height, tilt = -1.5, shade, to, label, className, style, children }: PicturePanelProps) {
  const inside = (
    <>
      <svg className="ink-line size-full" aria-hidden="true">
        <rect width="100%" height="100%" pathLength={1} />
      </svg>
      <span className="ink-fill overflow-hidden">
        <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="size-full object-cover" />
      </span>
      {children}
    </>
  );
  const shared = {
    className: cn("ink-box pic block", shade && "pic-shade", className),
    style: { "--tilt": `${tilt}deg`, ...style } as CSSProperties,
    "data-m": "",
  };
  return to ? (
    <Link to={to} aria-label={label} {...shared}>
      {inside}
    </Link>
  ) : (
    <div {...shared}>{inside}</div>
  );
}
