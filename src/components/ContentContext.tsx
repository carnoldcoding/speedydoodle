import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchContent, type Content } from "@/lib/content";
import type { Prices } from "@/lib/estimate";

const ContentContext = createContext<Content | null>(null);

// Give a page its content. It starts with the content from the time the site was built,
// then reads the content again from the server, so a change in the admin panel shows at once.
export function ContentProvider({ built, children }: { built: Content; children: ReactNode }) {
  const [content, setContent] = useState(built);

  useEffect(() => {
    let current = true;
    fetchContent()
      .then((fresh) => {
        if (current) setContent(fresh);
      })
      // With no answer, the page keeps the content from the build.
      .catch(() => {});
    return () => {
      current = false;
    };
  }, []);

  return <ContentContext value={content}>{children}</ContentContext>;
}

export function useContent(): Content {
  const content = useContext(ContentContext);
  if (!content) throw new Error("This part of the page needs a ContentProvider above it.");
  return content;
}

export const usePrices = (): Prices => useContent().prices;
