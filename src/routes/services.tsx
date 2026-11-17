import { ContentProvider } from "@/components/ContentContext";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { fetchContent } from "@/lib/content";
import { customFrom, dollars } from "@/lib/estimate";
import { pageMeta } from "@/lib/site";
import "@/styles/quote-form.css";
import type { Route } from "./+types/services";

// The prices of the moment the site is built. The form reads them again in the browser.
export async function loader() {
  return fetchContent();
}

export const meta: Route.MetaFunction = ({ loaderData }) =>
  pageMeta({
    title: "Book a caricature artist | Speedydoodle Studios",
    description: loaderData
      ? `Live caricatures from ${dollars(loaderData.prices.liveHourlyRate)} an hour, custom caricatures from ${dollars(customFrom(loaderData.prices))}. Tell us the date and the place. You pay nothing to ask.`
      : "Live caricatures, custom caricatures, logos, and illustrations. Tell us the date and the place. You pay nothing to ask.",
    path: "/services",
    image: "/share/services.jpg",
    imageAlt: "A caricature of Mike Arnold, with the words: Book us for your event.",
  });

export default function Services({ loaderData }: Route.ComponentProps) {
  return (
    <ContentProvider built={loaderData}>
      <QuoteForm />
    </ContentProvider>
  );
}
