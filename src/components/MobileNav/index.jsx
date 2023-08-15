import { Link } from "react-router-dom";
import { MobileNavbar } from "./styles";
import { useState } from "react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <MobileNavbar>
      <ion-icon
        onClick={toggle}
        name={isOpen ? "close-outline" : "menu-outline"}
      ></ion-icon>

      {isOpen && (
        <ul onClick={toggle}>
          <li>
            <Link to="/homepage">home</Link>
          </li>
          <li>
            <Link to="/about">about</Link>
          </li>
          <li>
            <Link to="/gallery">gallery</Link>
          </li>
          <li>
            <Link to="/services">services</Link>
          </li>
        </ul>
      )}
    </MobileNavbar>
  );
};

export default MobileNav;
