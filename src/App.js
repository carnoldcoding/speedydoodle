import Homepage from "./pages/Homepage";
import Nav from "./components/Nav";
import Theme from "./Theme";
import React from "react";
import "./GlobalStyles.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Theme>
        <Nav />
        <Routes>
          <Route exact path="/homepage" component={<Homepage />} />
        </Routes>
      </Theme>
    </Router>
  );
}
