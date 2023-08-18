import React from "react";
import Spotlight from "../components/Spotlight";
import About from "../components/About";
import HomeMenu from "../components/HomeMenu";
import GetQuote from "../components/GetQuote";

const Homepage = () => {
  return (
    <>
      <Spotlight />
      <About />
      <HomeMenu />
      <GetQuote />
    </>
  );
};

export default Homepage;
