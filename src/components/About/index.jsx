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
    "Mike is an amazing artist with great pricing who is very sociable. Perfect for parties!",
    "Michael's caricatures brought endless laughter to our event; his talent for capturing personalities in a fun and artistic way is truly remarkable.",
    "We commissioned Michael for a caricature portrait, and the result was beyond our expectations – a perfect blend of humor and artistry.",
    "Michael Arnold's caricatures are not just drawings; they're personalized works of art that make memorable gifts and keepsakes.",
    "Our wedding guests were thrilled with Michael's caricatures – a unique and entertaining addition to our special day.",
    "Michael's caricatures are the life of the party! His talent for caricature art is exceptional, and his friendly demeanor adds an extra layer of delight.",
    "Michael Arnold's caricatures capture the essence of each individual in a playful and unique way, making them a hit at any event.",
    "I've had the pleasure of getting a caricature from Michael, and I was blown away by his ability to make me laugh while preserving my likeness.",
    "Michael's caricatures are a fantastic icebreaker for corporate events; his artistic skill and humor create an unforgettable experience.",
    "Michael's caricatures added a touch of creativity to our family reunion; we cherish the caricatures as cherished mementos of our time together.",
    "Michael's caricatures are true works of art that showcase his talent for both drawing and humor – an absolute joy to have at any gathering.",
  ];
  return (
    <AboutSection>
      <div className="about-wrapper">
        <article className="intro">
          <header>
            <h3>About Me</h3>
            <h1>Hi! I'm Mike. I capture life on paper, with a twist.</h1>
          </header>
          <p>
            Speedydoodle Caricature Studios provides fast, fun party caricatures
            for all ocassions including Weddings, Mitzvahs, Birthdays, Company
            Picnics, Corporate Events, Holiiday Parties, Graduations and more.
            Digital Custom Caricatures are also available.
          </p>
          <div className="intro-footer">
            <div className="about-experience">
              <h1>32</h1>
              <h3>Years of Experience</h3>
            </div>
            <Link to="/about">
              <button>learn more</button>
            </Link>
          </div>
        </article>
        <article className="testimonials">
          <h3>Testimonials</h3>
          <h1>See what others have to say!</h1>
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
