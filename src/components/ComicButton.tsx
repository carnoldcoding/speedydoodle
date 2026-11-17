import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { InkParts } from "./InkParts";

interface Shared {
  children: ReactNode;
  ghost?: boolean;
  size?: "normal" | "small" | "large";
  className?: string;
  // True makes the button a part of the entrance of its section.
  reveal?: boolean;
}

type LinkProps = Shared & { to: string } & Omit<ComponentProps<typeof Link>, "to" | "children" | "className">;
type ButtonProps = Shared & { to?: undefined } & Omit<ComponentProps<"button">, "children" | "className">;

const SIZES = { normal: "comic", small: "comicSmall", large: "comicLarge" } as const;

// The comic button of the site. With `to` it is a link. Without `to` it is a button.
export function ComicButton(props: LinkProps | ButtonProps) {
  const { children, ghost, size = "normal", className, reveal, ...rest } = props;
  const variant = ghost ? "comicGhost" : "comic";
  const marks = reveal ? { "data-m": "" } : {};
  const inside = (
    <>
      <InkParts />
      <span className="ink-in">{children}</span>
    </>
  );

  if (rest.to !== undefined) {
    const { to, ...linkProps } = rest;
    return (
      <Button asChild variant={variant} size={SIZES[size]} className={className} {...marks}>
        <Link to={to} {...linkProps}>
          {inside}
        </Link>
      </Button>
    );
  }
  const { to: _none, ...buttonProps } = rest;
  return (
    <Button type="button" variant={variant} size={SIZES[size]} className={className} {...marks} {...buttonProps}>
      {inside}
    </Button>
  );
}
