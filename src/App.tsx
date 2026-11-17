import { useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import Nav from "@/components/Nav";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { GalleryCategory } from "@/lib/gallery";
import About from "@/pages/About";
import Gallery from "@/pages/Gallery";
import Homepage from "@/pages/Homepage";
import Services from "@/pages/Services";

export default function App() {
  // The home page sets the gallery that the gallery page opens first.
  const [galleryChoice, setGalleryChoice] = useState<GalleryCategory>("party");
  const isMobile = useIsMobile();

  return (
    <Router>
      {isMobile ? <MobileNav /> : <Nav />}
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        <Route path="/homepage" element={<Homepage setGalleryChoice={setGalleryChoice} />} />
        <Route path="/gallery" element={<Gallery galleryChoice={galleryChoice} />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
      </Routes>
      <Footer />
    </Router>
  );
}
