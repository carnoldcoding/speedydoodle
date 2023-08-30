import React from "react";
import { FooterSection } from "./styles";

const Footer = () => {
  return (
    <FooterSection>
      <h2>
        Speedydoodle <span>Studios</span>
      </h2>
      <aside>
        <a href="mailto:mike@speedydoodle.com" target="_blank" rel="noreferrer">
          <ion-icon name="mail"></ion-icon>
        </a>
        <a
          href="https://www.facebook.com/speedydoodle"
          target="_blank"
          rel="noreferrer"
        >
          <ion-icon name="logo-facebook"></ion-icon>
        </a>
        <a
          href="https://www.linkedin.com/in/michael-arnold-57a984a3"
          target="_blank"
          rel="noreferrer"
        >
          <ion-icon name="logo-linkedin"></ion-icon>
        </a>
      </aside>
    </FooterSection>
  );
};

export default Footer;
