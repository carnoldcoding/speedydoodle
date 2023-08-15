import React from "react";
import { AboutSection } from "./styles";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const About = () => {
  const quotes = [
    "Mike is an amazing artist with great pricing who is very sociable. Perfect for parties!",
    "quote2",
    "quote3",
    "quote4",
  ];
  useEffect(() => {
    //after the element finishes sliding out of frame, remove it from the DOM, and then
    //add it back to the start
  }, []);
  return (
    <AboutSection>
      <div className="about-wrapper">
        <article className="intro">
          <header>
            <h3>About Me</h3>
            <h1>Hi! I'm Mike. I capture life on paper, with a twist.</h1>
          </header>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit neque
            nemo aliquid cupiditate possimus. At commodi dicta ipsam ab ad
            provident officiis molestias ut dolor cupiditate, minus veniam eos?
            Laudantium.
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
            {quotes.map((quote) => (
              <p>{quote}</p>
            ))}
          </div>
        </article>
      </div>
    </AboutSection>
  );
};

export default About;
