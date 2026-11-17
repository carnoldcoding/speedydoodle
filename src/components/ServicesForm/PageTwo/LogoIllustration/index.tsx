import { ArrowRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type {
  OtherSelection,
  QuoteFormData,
  UpdateQuoteForm,
} from "../../types";

const TERMS = [
  "25% Deposit to begin",
  "25% Deposit on approval",
  "50% due for file transfer",
];

const HEADING = "text-[clamp(1.7rem,3vw,2.4rem)] font-bold uppercase";
const TAGLINE =
  "mb-5 text-[clamp(0.9rem,2vw,1.2rem)] font-normal text-primary uppercase";
const PRICE =
  "relative text-[clamp(3.5rem,9vw,5rem)] font-bold uppercase before:absolute before:top-[-12px] before:left-0 before:text-[1rem] before:font-light before:content-['FROM']";

interface LogoIllustrationProps {
  update: UpdateQuoteForm;
  data: QuoteFormData;
}

const LogoIllustration = ({ update, data }: LogoIllustrationProps) => {
  function handleChange(value: string) {
    if (value !== "logo" && value !== "illustration") return;
    update("otherSelection", value);
    if (value !== "logo") {
      update("otherPrice", 500);
    } else {
      update("otherPrice", "75/hr");
    }
  }

  const cards: {
    value: OtherSelection;
    tagline: string;
    price: number;
    hourly: boolean;
  }[] = [
    {
      value: "logo",
      tagline: "perfect for brands",
      price: data.other[1].price,
      hourly: true,
    },
    {
      value: "illustration",
      tagline: "pictures with purpose",
      price: data.other[0].price,
      hourly: false,
    },
  ];

  return (
    // The group has no initial value. As before, the visitor selects the card
    // again after a return to this step.
    <RadioGroup
      name="other"
      required
      onValueChange={handleChange}
      className="flex items-center gap-8 max-[822px]:flex-wrap"
    >
      {cards.map(({ value, tagline, price, hourly }) => (
        <article
          key={value}
          className="relative flex h-[400px] w-full cursor-pointer flex-col items-center"
        >
          {/* The radio item is invisible and covers the card. The card after
              it shows the selection with its border. */}
          <RadioGroupItem
            value={value}
            aria-label={value}
            data-testid={`other-${value}`}
            className="peer absolute top-0 left-0 z-[2] aspect-auto size-full cursor-pointer rounded-none border-0 bg-transparent shadow-none dark:bg-transparent [&_svg]:hidden"
          />
          <div className="size-full cursor-pointer rounded-[10px] border-2 border-[grey] p-5 transition-all duration-200 peer-data-[state=checked]:border-white">
            <header className="flex flex-col items-center text-center">
              <h2 className={HEADING}>{value}</h2>
              <h3 className={TAGLINE}>{tagline}</h3>
              <h1 className={PRICE}>
                ${price}
                {hourly && (
                  <span className="text-site-md lowercase">/hr</span>
                )}
              </h1>
            </header>
            <div className="h-[2px] w-full bg-white"></div>
            <div className="w-full">
              <ul className="list-none p-[10px]">
                {TERMS.map((term) => (
                  <li
                    key={term}
                    className="flex items-center gap-4 py-[7.5px] text-[1.1rem]"
                  >
                    <ArrowRight
                      aria-hidden
                      className="size-6 shrink-0 text-primary"
                    />
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </RadioGroup>
  );
};

export default LogoIllustration;
