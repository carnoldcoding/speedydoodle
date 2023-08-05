import { Link } from "react-router-dom";
import { MobileNavbar } from "./styles";
import { useState } from "react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(true);

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
            <Link to="/homepage">about</Link>
          </li>
          <li>
            <Link to="/homepage">gallery</Link>
          </li>
          <li>
            <Link to="/homepage">services</Link>
          </li>
        </ul>
      )}
    </MobileNavbar>
  );
};

export default MobileNav;
