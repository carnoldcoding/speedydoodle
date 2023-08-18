import { Link } from "react-router-dom";
import { Navbar } from "./styles";

const Nav = () => {
  return (
    <Navbar>
      <Link to="/homepage" className="logo"></Link>
      <ul>
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
    </Navbar>
  );
};

export default Nav;
