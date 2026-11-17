import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";
import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

// What customers said. Each one is a slide in the carousel.
const QUOTES = [
    '"Would recommend this artist for anyone looking for this service. Mike showed up on time, did all (and more) that was asked, and did a great job with the drawings!! Our guests LOVED his renditions of everyone even having to draw dinosaurs and people in costumes!! Will use again for future events.“ - Bill H.',
    '"All of our guests loved Mike and his caricatures. He was able to draw all the couples at our party in 2 Hours. Everyone went home with a fun drawing. Thanks Mike!"  -  Jodi B.',
    '"Mike was amazing and everyone really enjoyed his talent. He engages with everyone and makes it a memorable experience. The only thing I regret is not having him longer!!" - Christine R.',
    '"Mike from speedydoodle was amazing! He was early, professional and so personable. You could tell he loves what he does and he enjoyed talking to all of the guests. I will definitely be using him again. His drawings made my daughter’s party so fun. Everyone loved him!" - Deana D. ',
    '"Mike was a consummate professional. His work was first class, and he treated our guests to a really fun time. Totally recommend!" - Matthew S.',
    '"Excellent!! He was awesome! Very patient with the kids , and all the pictures came out great!  I recommend 100%" - Dee E.',
    '"Mike is PHENOMENAL. We have had him twice at our station and he always delivers high quality work. He’s quick and very professional (always early and set up before time even starts). Mike is our go to guy and for good reason!" - Ana A.',
];

const HEADING_CLASS = "text-[clamp(1.7rem,3vw,2.4rem)] font-bold text-white";

const About = () => {
  // The carousel moves to the next quote each 7 seconds.
  const autoplay = useRef(Autoplay({ delay: 7000 }));

  return (
    <section className="flex justify-center bg-surface p-page">
      <div className="flex max-w-content min-w-0 gap-12 mobile:flex-col">
        <article className="mt-[25px] flex basis-1/2 flex-col gap-4 mobile:basis-auto">
          <header className="relative">
            <h3 className="absolute -top-[25px] text-[1.17em] font-bold text-primary after:absolute after:top-1/2 after:ml-[10px] after:h-[2px] after:w-10 after:-translate-y-1/2 after:bg-primary after:content-['']">
              About Speedydoodle
            </h3>
            <h1 className={`${HEADING_CLASS} capitalize`}>Fast, fun, party caricatures!</h1>
          </header>
          <p className="leading-6 text-white">
            Speedydoodle Caricature Studios provides fast, fun party caricatures
            for all ocassions including Weddings, Mitzvahs, Birthdays, Company
            Picnics, Corporate Events, Holiday Parties, Graduations and more.
            Digital Custom Caricatures are also available.
          </p>
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex items-center gap-[10px]">
              <h1 className="text-site-xl font-bold text-primary">32</h1>
              <h3 className="max-w-[100px] text-site-sm font-bold text-white">Years of Experience</h3>
            </div>
          </div>
        </article>

        <article className="relative mt-[25px] basis-1/2 mobile:basis-auto">
          <h3 className="absolute -top-[25px] right-0 text-[1.17em] font-bold text-primary before:absolute before:top-1/2 before:-left-[60px] before:ml-[10px] before:h-[2px] before:w-10 before:-translate-y-1/2 before:bg-primary before:content-['']">
            Testimonials
          </h3>
          <h1 className={HEADING_CLASS}>See what others have to say.</h1>
          <Quote className="my-3 size-12 -scale-x-100 fill-primary text-primary" aria-hidden="true" />
          {/* The visitor does not drag this carousel. It moves by itself. */}
          <Carousel
            opts={{ loop: true }}
            plugins={[autoplay.current]}
            className="pointer-events-none max-w-[500px] mobile:max-w-[370px]"
            data-testid="testimonials"
          >
            <CarouselContent className="ml-0">
              {QUOTES.map((quote) => (
                <CarouselItem key={quote} className="pl-[30px]">
                  <p className="leading-6 text-white italic">{quote}</p>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </article>
      </div>
    </section>
  );
};

export default About;
