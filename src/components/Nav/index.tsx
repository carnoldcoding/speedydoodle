import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.png";

const LINKS = [
  { to: "/homepage", label: "home" },
  { to: "/gallery", label: "gallery" },
  { to: "/services", label: "services" },
];

const Nav = () => {
  return (
    <nav className="fixed top-0 left-0 z-[999] flex min-h-[100px] w-full items-center justify-between bg-nav px-page">
      <Link
        to="/homepage"
        aria-label="Speedydoodle Studios home"
        className="h-20 w-[300px] bg-contain bg-no-repeat"
        style={{ backgroundImage: `url(${logoImage})` }}
      />
      <ul className="flex gap-10">
        {LINKS.map(({ to, label }) => (
          <li key={to} className="text-[clamp(0.9rem,2vw,1.2rem)]">
            <Link
              to={to}
              className="font-light text-white uppercase transition-colors duration-200 hover:text-primary"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
