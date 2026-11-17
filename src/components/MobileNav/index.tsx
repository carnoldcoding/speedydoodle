import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LINKS = [
  { to: "/homepage", label: "home" },
  { to: "/gallery", label: "gallery" },
  { to: "/services", label: "services" },
];

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((open) => !open);

  return (
    <nav className="fixed top-0 left-0 z-[999] h-[60px] w-full bg-nav">
      <Button
        type="button"
        variant="ghost"
        onClick={toggle}
        aria-label={isOpen ? "Close the menu" : "Open the menu"}
        aria-expanded={isOpen}
        data-testid="mobile-menu-toggle"
        className="absolute top-[10px] right-[10px] size-[2.4rem] rounded-none p-0 text-white hover:bg-transparent hover:text-white dark:hover:bg-transparent [&_svg:not([class*='size-'])]:size-[2.4rem]"
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {isOpen && (
        // A click on any part of the open menu closes it.
        <ul
          onClick={toggle}
          className="flex min-h-dvh w-full flex-col items-center justify-center gap-8 bg-nav uppercase"
        >
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className="text-site-lg font-light text-white active:text-primary">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default MobileNav;
