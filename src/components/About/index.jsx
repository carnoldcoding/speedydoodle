import React from "react";
import { AboutSection } from "./styles";

const About = () => {
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
            <button>learn more</button>
          </div>
        </article>
        <article className="testimonials"></article>
      </div>
    </AboutSection>
  );
};

export default About;
