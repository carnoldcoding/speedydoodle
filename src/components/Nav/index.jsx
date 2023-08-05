import { Link } from "react-router-dom";
import { Navbar } from "./NavStyles";

const Nav = () => {
  return (
    <>
      <Navbar>
        <div className="logo"></div>
        <ul>
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
      </Navbar>
    </>
  );
};

export default Nav;
