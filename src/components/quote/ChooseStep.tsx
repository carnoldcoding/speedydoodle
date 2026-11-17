import type { ReactNode } from "react";
import custom520 from "@/assets/web/custom-520.webp";
import live520 from "@/assets/web/live-520.webp";
import logos520 from "@/assets/web/logos-520.webp";
import { usePrices } from "@/components/ContentContext";
import { customFrom, dollars, type Prices } from "@/lib/estimate";
import type { QuoteType } from "@/lib/gallery";

interface Choice {
  type: QuoteType;
  title: string;
  line: string;
  price: ReactNode;
  image: string;
  width: number;
  height: number;
  alt: string;
}

// Each price is one piece of text, so the built HTML holds "$150" with nothing inside it.
const choices = (prices: Prices): Choice[] => [
  {
    type: "live",
    title: "Live caricatures",
    line: "Mike comes to your event and draws your guests.",
    price: (
      <>
        <strong>{dollars(prices.liveHourlyRate)}</strong> an hour, plus travel
      </>
    ),
    image: live520,
    width: 305,
    height: 455,
    alt: "A guest holds up the caricature Mike drew at a party",
  },
  {
    type: "custom",
    title: "A custom caricature",
    line: "Send us photos, and we'll draw the gift.",
    price: (
      <>
        From <strong>{dollars(customFrom(prices))}</strong>
      </>
    ),
    image: custom520,
    width: 520,
    height: 202,
    alt: "A custom caricature of a couple in sports jerseys",
  },
  {
    type: "lni",
    title: "A logo or an illustration",
    line: "Art for your brand, your book, or your product.",
    price: (
      <>
        Logo <strong>{dollars(prices.logoHourlyRate)}</strong> an hour · Illustration <strong>{dollars(prices.illustration)}</strong>
      </>
    ),
    image: logos520,
    width: 286,
    height: 209,
    alt: "A cartoon logo that Mike drew for a restaurant",
  },
];

// Step 1: the three kinds of work, as three large cards.
export function ChooseStep({ onChoose }: { onChoose: (type: QuoteType) => void }) {
  const prices = usePrices();
  return (
    <div className="quote-choices">
      {choices(prices).map((choice) => (
        <button key={choice.type} type="button" className="quote-choice" data-testid={`choice-${choice.type}`} onClick={() => onChoose(choice.type)}>
          <span className="quote-choice-pic">
            <img src={choice.image} alt={choice.alt} width={choice.width} height={choice.height} decoding="async" />
          </span>
          <span>
            <b>{choice.title}</b>
            <span className="quote-choice-line">{choice.line}</span>
            <em>{choice.price}</em>
          </span>
        </button>
      ))}
    </div>
  );
}
