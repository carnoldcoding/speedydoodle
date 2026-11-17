import { Link, NavLink } from "react-router";
import logo240 from "@/assets/web/logo-240.webp";
import logo480 from "@/assets/web/logo-480.webp";
import { SITE } from "@/lib/site";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/gallery", label: "Gallery", end: false },
  { to: "/services", label: "Services", end: false },
];

// The bar at the top of each page. It stays on the screen while the page scrolls.
export function Nav() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 flex items-center justify-between border-b-[3px] border-white bg-nav px-page py-[10px]"
    >
      <Link to="/" aria-label={`${SITE.name}, home`}>
        <img
          src={logo240}
          srcSet={`${logo240} 1x, ${logo480} 2x`}
          width={240}
          height={87}
          alt={SITE.name}
          className="h-11 w-auto sm:h-14"
        />
      </Link>
      <ul className="flex items-center gap-[clamp(16px,3vw,36px)]">
        {LINKS.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `comic text-[19px] transition-colors duration-100 hover:text-flame sm:text-[22px] ${isActive ? "text-flame" : "text-white"}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
