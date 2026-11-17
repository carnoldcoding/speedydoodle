import { QuoteForm } from "@/components/quote/QuoteForm";
import { PRICES } from "@/lib/estimate";
import { pageMeta } from "@/lib/site";
import "@/styles/quote-form.css";
import type { Route } from "./+types/services";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Book Mike for your event | Speedydoodle Studios",
    description: `Live caricatures from $${PRICES.liveHourlyRate} an hour, custom caricatures from $${PRICES.customBase + PRICES.customPeople[1]}. Tell Mike the date and the place. You pay nothing to ask.`,
    path: "/services",
    image: "/share/services.jpg",
    imageAlt: "A caricature of Mike Arnold, with the words: Book Mike for your event.",
  });

export default function Services() {
  return <QuoteForm />;
}
