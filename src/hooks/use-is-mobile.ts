import { useEffect, useState } from "react";

// The width at which the layout changes. It equals the `mobile:` variant in index.css.
export const MOBILE_MAX_WIDTH = 920;

// True while the window is 920px wide or less.
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_MAX_WIDTH);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
