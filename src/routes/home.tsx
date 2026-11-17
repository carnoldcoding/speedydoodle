import custom520 from "@/assets/web/custom-520.webp";
import custom1040 from "@/assets/web/custom-1040.webp";
import live520 from "@/assets/web/live-520.webp";
import logos520 from "@/assets/web/logos-520.webp";
import splash560 from "@/assets/web/splash-560.webp";
import splash1120 from "@/assets/web/splash-1120.webp";
import { ComicButton } from "@/components/ComicButton";
import { InkParts } from "@/components/InkParts";
import { PicturePanel } from "@/components/PicturePanel";
import { delay, Reveal } from "@/components/Reveal";
import { Title } from "@/components/Title";
import { ContentProvider, useContent } from "@/components/ContentContext";
import { fetchContent } from "@/lib/content";
import { customFrom, dollars, type Prices } from "@/lib/estimate";
import { CATEGORIES, describePicture, fetchGallery, picturePath, sized, type QuoteType } from "@/lib/gallery";
import { pageMeta, quotePath, SITE } from "@/lib/site";
import type { Route } from "./+types/home";

const TITLE = "Speedydoodle Studios | Party caricatures by Mike Arnold";
const DESCRIPTION =
  "Here at Speedydoodle Studios, we draw fast, fun caricatures at weddings, birthdays, and company parties across South Jersey, Philadelphia, and Delaware. Get a quote in two minutes.";

// What a search engine reads to know that this is a local business.
const business = (prices: Prices) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/share/home.jpg`,
  description: DESCRIPTION,
  founder: { "@type": "Person", name: SITE.artist },
  priceRange: `From ${dollars(prices.liveHourlyRate)} an hour`,
  // The business goes to the customer, so it gives its region and no street address.
  address: { "@type": "PostalAddress", addressRegion: "NJ", addressCountry: "US" },
  areaServed: SITE.areas.map((name) => ({ "@type": "AdministrativeArea", name })),
  sameAs: [SITE.facebook, SITE.linkedin],
  makesOffer: [
    { "@type": "Offer", name: "Live caricatures at an event", price: prices.liveHourlyRate, priceCurrency: "USD", description: "For each hour, plus travel" },
    { "@type": "Offer", name: "Custom caricature from photos", price: customFrom(prices), priceCurrency: "USD", description: "Starting price" },
    { "@type": "Offer", name: "Logo design", price: prices.logoHourlyRate, priceCurrency: "USD", description: "For each hour" },
    { "@type": "Offer", name: "Illustration", price: prices.illustration, priceCurrency: "USD" },
  ],
});

export const meta: Route.MetaFunction = ({ loaderData }) => {
  return [
    ...pageMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/",
      image: "/share/home.jpg",
      imageAlt: "A caricature of Mike Arnold at an easel, with the words: Caricatures for your party. We draw your guests on the spot.",
    }),
    ...(loaderData ? [{ "script:ld+json": business(loaderData.content.prices) }] : []),
  ];
};

// Read when the site is built: the first drawing of each kind of work, and the content
// that the artist can change. The page reads the content again in the browser.
export async function loader() {
  const [gallery, content] = await Promise.all([fetchGallery(), fetchContent()]);
  return { picks: CATEGORIES.map(({ key }) => gallery[key][0]).filter(Boolean), content };
}

// The three kinds of work, as the three panels of the second section.
const work = (prices: Prices): { type: QuoteType; gallery: string; title: string; line: string; price: React.ReactNode; image: string; imageSet?: string; width: number; height: number; alt: string; tilt: number }[] => [
  {
    type: "live",
    gallery: "/gallery/party",
    title: "Live events",
    line: `Mike comes to your event and draws your guests on the spot, about ${prices.facesPerHour} faces an hour.`,
    price: (
      <>
        <Price>{dollars(prices.liveHourlyRate)}</Price> an hour, plus travel
      </>
    ),
    image: live520,
    width: 305,
    height: 455,
    alt: "A guest holds up the caricature Mike drew at a party",
    tilt: -1.5,
  },
  {
    type: "custom",
    gallery: "/gallery/custom",
    title: "Custom caricatures",
    line: "Send us a few photos, and we'll turn them into a one-of-a-kind gift.",
    price: (
      <>
        From <Price>{dollars(customFrom(prices))}</Price>
      </>
    ),
    image: custom520,
    imageSet: `${custom520} 520w, ${custom1040} 589w`,
    width: 589,
    height: 229,
    alt: "A custom caricature of a couple in sports jerseys",
    tilt: 1.2,
  },
  {
    type: "lni",
    gallery: "/gallery/logos",
    title: "Logos and illustrations",
    line: "Got a brand, a book, or a product? We draw for those too.",
    price: (
      <>
        Logos <Price>{dollars(prices.logoHourlyRate)}</Price> an hour · Illustrations <Price>{dollars(prices.illustration)}</Price>
      </>
    ),
    image: logos520,
    width: 286,
    height: 209,
    alt: "A cartoon logo that Mike drew for a restaurant",
    tilt: -1,
  },
];

function Price({ children }: { children: React.ReactNode }) {
  return <b className="comic text-[30px] leading-none tracking-[1px] text-flame">{children}</b>;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <ContentProvider built={loaderData.content}>
      <HomePage picks={loaderData.picks} />
    </ContentProvider>
  );
}

function HomePage({ picks }: { picks: Route.ComponentProps["loaderData"]["picks"] }) {
  const { prices, yearsOfExperience, testimonials } = useContent();
  return (
    <main>
      {/* 1. Hero. It is on the first screen, so its entrance runs at page load. */}
      <Reveal mode="load" dots className="overflow-hidden px-page pt-[clamp(48px,8vw,96px)]">
        <div className="mx-auto grid max-w-content items-end gap-8 md:grid-cols-[1.05fr_1fr]">
          <div className="self-center pb-3 md:pb-[clamp(48px,8vw,96px)]">
            <h1 aria-label={`Caricature artist in ${SITE.areas.join(", ")}. ${SITE.name}`}>
              <span className="kicker mb-2 block" data-m style={delay(0)}>
                Caricature artist <span aria-hidden="true">•</span> {SITE.areas.join(" • ")}
              </span>
              <Title as="span" big text="Speedydoodle Studios" underline="Studios" className="block" style={delay(1)} />
            </h1>
            <p className="mt-[18px] max-w-[44ch] text-[clamp(16px,1.6vw,19px)] text-[#dcdcdc]" data-m style={delay(3)}>
              Here at Speedydoodle Studios, we turn weddings, birthdays, and company parties into something your guests take home.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <ComicButton to={quotePath()} reveal style={delay(4)}>
                Get a quote
              </ComicButton>
              <ComicButton to="/gallery" ghost reveal style={delay(5)}>
                See our work
              </ComicButton>
            </div>
          </div>
          <img
            src={splash560}
            srcSet={`${splash560} 560w, ${splash1120} 931w`}
            sizes="(max-width: 767px) 440px, 560px"
            width={931}
            height={570}
            alt="A caricature of Mike Arnold at an easel, with drawings of party guests behind"
            fetchPriority="high"
            className="hero-art block w-full max-w-[440px] justify-self-center md:max-w-[560px] md:justify-self-end"
            data-m
            style={delay(2)}
          />
        </div>
      </Reveal>

      {/* 2. What we offer. */}
      <Reveal dots className="bg-card px-page py-[clamp(48px,8vw,96px)]">
        <div className="mx-auto max-w-content">
          <div className="text-center">
            <p className="kicker" data-m>
              Take a look around
            </p>
            <Title text="What we offer" underline="offer" />
          </div>
          <div className="mt-[52px] grid gap-14 md:grid-cols-3 md:gap-10">
            {work(prices).map((work) => (
              <article key={work.type} className="pic-group">
                <PicturePanel src={work.image} srcSet={work.imageSet} sizes="(max-width: 767px) 92vw, 340px" alt={work.alt} width={work.width} height={work.height} tilt={work.tilt} shade className="h-[230px]" />
                <h3 className="comic mt-[26px] text-[34px] leading-none" data-m>
                  {work.title}
                </h3>
                <p className="mt-[10px] text-[#d6d6d6]" data-m>
                  {work.line}
                </p>
                <p className="mt-3 font-bold" data-m>
                  {work.price}
                </p>
                <div className="mt-7 flex flex-wrap gap-4">
                  <ComicButton to={quotePath(work.type)} size="small" reveal>
                    Get a quote
                  </ComicButton>
                  <ComicButton to={work.gallery} size="small" ghost reveal aria-label={`See our work: ${work.title}`}>
                    See the work
                  </ComicButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 3. The work. */}
      <Reveal dots className="px-page py-[clamp(48px,8vw,96px)]">
        <div className="mx-auto max-w-content">
          <div className="text-center">
            <p className="kicker" data-m>
              Every piece drawn by hand
            </p>
            <Title text="Our work" underline="work" />
          </div>
          <div className="mt-[52px] grid grid-cols-2 gap-[26px] md:grid-cols-4 md:gap-[34px]">
            {picks.map((picture, index) => (
              <PicturePanel
                key={picture.slug}
                to={picturePath(picture)}
                src={sized(picture.url, 520)}
                srcSet={`${sized(picture.url, 320)} 320w, ${sized(picture.url, 520)} 520w`}
                sizes="(max-width: 767px) 44vw, 250px"
                alt={describePicture(picture)}
                width={picture.width}
                height={picture.height}
                tilt={[-2, 1.5, -1, 2][index % 4]}
                className="aspect-[4/5]"
              />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <ComicButton to="/gallery" reveal>
              See the full gallery
            </ComicButton>
          </div>
        </div>
      </Reveal>

      {/* 4. Proof. */}
      <Reveal dots className="bg-card px-page py-[clamp(48px,8vw,96px)]">
        <div className="mx-auto grid max-w-content items-center gap-14 md:grid-cols-[0.8fr_1.6fr]">
          <div className="text-center">
            <p className="comic circled px-3 text-[clamp(96px,14vw,150px)] leading-none text-flame" data-m>
              {yearsOfExperience}
              <svg className="pen-circle" viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">
                <path pathLength={1} d="M52 6 C 22 4, 5 18, 6 36 C 7 56, 30 66, 56 64 C 82 62, 97 48, 94 30 C 91 12, 68 3, 40 9" />
              </svg>
            </p>
            <p className="comic mt-[10px] text-[30px]" data-m>
              Years of drawing faces
            </p>
          </div>
          <div className="grid gap-[34px]">
            {/* The first three customer quotes, in the order the artist gave them. */}
            {testimonials.slice(0, 3).map((quote, index) => (
              <figure key={quote.name} className={`ink-box bubble max-w-[520px] ${index === 1 ? "bubble-right md:justify-self-end" : ""}`} data-m>
                <InkParts radius={22} />
                <div className="ink-in px-[22px] py-[18px]">
                  <blockquote>"{quote.text}"</blockquote>
                  <figcaption className="mt-2 font-bold">{quote.name}</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 5. Close. */}
      <Reveal dots className="px-page py-[clamp(48px,8vw,96px)] text-center">
        <Title text="Let's draw your party" underline="party" />
        <p className="mx-auto mt-[18px] max-w-[44ch] text-[clamp(16px,1.6vw,19px)] text-[#dcdcdc]" data-m>
          Tell us the date and the place, and we'll get back to you within 24 hours.
        </p>
        <div className="mt-7 flex justify-center">
          <ComicButton to={quotePath()} reveal>
            Get a quote
          </ComicButton>
        </div>
      </Reveal>
    </main>
  );
}
