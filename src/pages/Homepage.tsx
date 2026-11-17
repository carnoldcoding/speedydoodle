import { useEffect } from "react";
import About from "@/components/About";
import GetQuote from "@/components/GetQuote";
import HomeMenu from "@/components/HomeMenu";
import Spotlight from "@/components/Spotlight";
import type { GalleryCategory } from "@/lib/gallery";

interface HomepageProps {
  setGalleryChoice: (category: GalleryCategory) => void;
}

const Homepage = ({ setGalleryChoice }: HomepageProps) => {
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
