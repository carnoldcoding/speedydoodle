import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import logo240 from "@/assets/web/logo-240.webp";
import logo480 from "@/assets/web/logo-480.webp";
import { SITE } from "@/lib/site";

// The order here is the order in the HTML, which a screen reader and the Tab key use. The
// phone layout shows Gallery, Home, Services: `phone` gives each link its place and, for
// each link but the first one on the screen, a thin line in logo yellow at its left.
const LINE = "max-md:before:mr-4 max-md:before:h-[22px] max-md:before:w-[3px] max-md:before:bg-logo-yellow max-md:before:content-['']";
const LINKS = [
  { to: "/", label: "Home", end: true, phone: `max-md:order-2 ${LINE}` },
  { to: "/gallery", label: "Gallery", end: false, phone: "max-md:order-1" },
  { to: "/services", label: "Services", end: false, phone: `max-md:order-3 ${LINE}` },
];

// The bar at the top of each page. It stays on the screen while the page scrolls.
// The wide layout has the logo at the left and the links at the right. The phone layout
// (below 768 pixels) has no logo and the three links in one centered row.
export function Nav() {
  // The link of the current page gets its colour only after the page has started in the
  // browser. An address with no HTML file of its own, such as /admin, gets the HTML of a
  // fallback page, and that HTML would mark the wrong link.
  const [started, setStarted] = useState(false);
  useEffect(() => setStarted(true), []);

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 flex items-center justify-center border-b-[3px] border-white bg-nav px-page py-[10px] md:justify-between"
    >
      <Link to="/" aria-label={`${SITE.name}, home`} className="max-md:hidden">
        <img
          src={logo240}
          srcSet={`${logo240} 1x, ${logo480} 2x`}
          width={240}
          height={87}
          alt={SITE.name}
          className="h-14 w-auto"
        />
      </Link>
      <ul className="flex items-center gap-4 md:gap-[clamp(16px,3vw,36px)]">
        {LINKS.map(({ to, label, end, phone }) => (
          <li key={to} className={`max-md:flex max-md:items-center ${phone}`}>
            <NavLink
              to={to}
              end={end}
              // In the phone layout, the area that reacts to a press is 44 pixels high.
              className={({ isActive }) =>
                `comic text-[22px] transition-colors duration-100 hover:text-flame max-md:flex max-md:min-h-11 max-md:items-center ${started && isActive ? "text-flame" : "text-white"}`
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
