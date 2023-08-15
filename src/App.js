import Homepage from "./pages/Homepage";
import Nav from "./components/Nav";
import MobileNav from "./components/MobileNav";
import Theme from "./Theme";
import Footer from "./components/Footer";
import React from "react";
import { useEffect, useState } from "react";
import "./GlobalStyles.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 920);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 920);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <Router>
      <Theme>
        {isMobile ? <MobileNav /> : <Nav />}
        <Routes>
          <Route exact path="/homepage" element={<Homepage />} />
        </Routes>
        <Footer />
      </Theme>
    </Router>
  );
}
