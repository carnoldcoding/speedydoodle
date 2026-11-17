import type { ReactNode } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "@fontsource/bangers/400.css";
import "@fontsource-variable/dm-sans";
import type { Route } from "./+types/root";
import "./app.css";
import { ComicButton } from "./components/ComicButton";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { SITE } from "./lib/site";

// The class "js" tells the style sheet that JavaScript runs. Only then does a section wait
// for the scroll before it shows its parts. With no JavaScript, each part shows at once.
const MARK_JAVASCRIPT = "document.documentElement.classList.add('js')";

const GOOGLE_TAG = "AW-759121294";
const GOOGLE_TAG_SETUP = `window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", "${GOOGLE_TAG}");`;

export function Layout({ children }: { children: ReactNode }) {
  return (
    // The script above adds a class to <html> before React starts, so React must not report it.
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={SITE.themeColor} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <script dangerouslySetInnerHTML={{ __html: MARK_JAVASCRIPT }} />
        <Meta />
        <Links />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG}`} />
        <script dangerouslySetInnerHTML={{ __html: GOOGLE_TAG_SETUP }} />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// The page for an address that has no HTML file of its own, while its content loads.
export function HydrateFallback() {
  return <main className="min-h-[60dvh]" aria-busy="true" />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="dots px-page py-24 text-center">
      <p className="kicker">{missing ? "Page not found" : "Something went wrong"}</p>
      <h1 className="title mt-1">{missing ? "We haven't drawn this page" : "This page hit a snag"}</h1>
      <p className="mx-auto mt-4 max-w-[44ch] text-[#dcdcdc]">
        {missing ? "The address may be old or mistyped." : "Try again in a moment."}
      </p>
      <div className="mt-8">
        <ComicButton to="/">Back to the home page</ComicButton>
      </div>
    </main>
  );
}
