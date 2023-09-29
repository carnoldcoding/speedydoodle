import React from "react";
import { AboutSection } from "./styles";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const About = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 7000 }),
  ]);

  const quotes = [
    '"Would recommend this artist for anyone looking for this service. Mike showed up on time, did all (and more) that was asked, and did a great job with the drawings!! Our guests LOVED his renditions of everyone even having to draw dinosaurs and people in costumes!! Will use again for future events.“ - Bill H.',
    '"All of our guests loved Mike and his caricatures. He was able to draw all the couples at our party in 2 Hours. Everyone went home with a fun drawing. Thanks Mike!"  -  Jodi B.',
    '"Mike was amazing and everyone really enjoyed his talent. He engages with everyone and makes it a memorable experience. The only thing I regret is not having him longer!!" - Christine R.',
    '"Mike from speedydoodle was amazing! He was early, professional and so personable. You could tell he loves what he does and he enjoyed talking to all of the guests. I will definitely be using him again. His drawings made my daughter’s party so fun. Everyone loved him!" - Deana D. ',
    '"Mike was a consummate professional. His work was first class, and he treated our guests to a really fun time. Totally recommend!" - Matthew S.',
    '"Excellent!! He was awesome! Very patient with the kids , and all the pictures came out great!  I recommend 100%" - Dee E.',
    '"Mike is PHENOMENAL. We have had him twice at our station and he always delivers high quality work. He’s quick and very professional (always early and set up before time even starts). Mike is our go to guy and for good reason!" - Ana A.',
  ];
  return (
    <AboutSection>
      <div className="about-wrapper">
        <article className="intro">
          <header>
            <h3>About Speedydoodle</h3>
            <h1>Fast, fun, party caricatures!</h1>
          </header>
          <p>
            Speedydoodle Caricature Studios provides fast, fun party caricatures
            for all ocassions including Weddings, Mitzvahs, Birthdays, Company
            Picnics, Corporate Events, Holiday Parties, Graduations and more.
            Digital Custom Caricatures are also available.
          </p>
          <div className="intro-footer">
            <div className="about-experience">
              <h1>32</h1>
              <h3>Years of Experience</h3>
            </div>
            {/* <Link to="/about">
              <button>learn more</button>
            </Link> */}
          </div>
        </article>
        <article className="testimonials">
          <h3>Testimonials</h3>
          <h1>See what others have to say.</h1>
          <i class="material-icons">format_quote</i>
          <div className="quote-carousel">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {quotes.map((quote, key) => {
                  return (
                    <div className="embla__slide" key={key}>
                      <p>{quote}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </article>
      </div>
    </AboutSection>
  );
};

export default About;
