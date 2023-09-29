import React from "react";
import Spotlight from "../components/Spotlight";
import About from "../components/About";
import HomeMenu from "../components/HomeMenu";
import GetQuote from "../components/GetQuote";
import { useEffect } from "react";
const Homepage = ({ setGalleryChoice }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <Spotlight />
      <About />
      <HomeMenu setGalleryChoice={setGalleryChoice} />
      <GetQuote />
    </>
  );
};

export default Homepage;
