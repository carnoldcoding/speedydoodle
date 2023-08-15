import React from "react";
import { FooterSection } from "./styles";

const Footer = () => {
  return (
    <FooterSection>
      <h2>
        Speedydoodle <span>Studios</span>
      </h2>
      <aside>
        <ion-icon name="mail"></ion-icon>
        <ion-icon name="logo-facebook"></ion-icon>
        <ion-icon name="logo-linkedin"></ion-icon>
      </aside>
    </FooterSection>
  );
};

export default Footer;
