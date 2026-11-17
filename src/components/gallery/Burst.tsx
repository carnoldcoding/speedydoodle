import { Link } from "react-router";
import { categoryOf, type Picture } from "@/lib/gallery";
import { quotePath } from "@/lib/site";

// The shape of the burst: 22 points around an oval, far and near in turn.
const POINTS = Array.from({ length: 44 }, (_, i) => {
  const angle = (i / 44) * Math.PI * 2;
  const reach = i % 2 === 0 ? 1 : 0.84;
  return `${(125 + Math.cos(angle) * 123 * reach).toFixed(1)},${(48 + Math.sin(angle) * 46 * reach).toFixed(1)}`;
}).join(" ");

// The quote button of the large view. The quote form opens with the type that matches the picture.
export function Burst({ picture }: { picture: Picture }) {
  const category = categoryOf(picture.category);
  return (
    <Link to={quotePath(category.quoteType)} className="burst" draggable={false} data-testid="burst">
      <svg viewBox="0 0 250 96" preserveAspectRatio="none" aria-hidden="true">
        <polygon className="shade" points={POINTS} />
        <polygon className="shape" points={POINTS} />
      </svg>
      <span>
        <small>{category.burstLine}</small>
        <b>Get a quote</b>
      </span>
    </Link>
  );
}
