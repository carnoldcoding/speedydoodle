import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useBlocker, useSearchParams } from "react-router";
import { FAILED } from "@/lib/admin-api";
import { GallerySection } from "./GallerySection";
import { useAdmin } from "./hooks";
import { Confirm, Failure, PlainButton } from "./parts";
import { PasswordSection } from "./PasswordSection";
import { PricesSection } from "./PricesSection";
import { QuotesSection } from "./QuotesSection";
import { TestimonialsSection } from "./TestimonialsSection";

// Quotes is first, because it is the section that is opened most.
const TABS = [
  { id: "quotes", label: "Quotes" },
  { id: "gallery", label: "Gallery" },
  { id: "prices", label: "Prices" },
  { id: "testimonials", label: "Testimonials" },
  { id: "password", label: "Password" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const isTab = (value: string | null): value is TabId => TABS.some((tab) => tab.id === value);

// The panel of a logged-in person: the header, the five tabs, and the open section.
export function Panel({ onLoggedOut }: { onLoggedOut: () => void }) {
  const { api } = useAdmin();
  const [tab, setTab] = useState<TabId>("quotes");
  const [, setSearchParams] = useSearchParams();
  const buttons = useRef(new Map<TabId, HTMLButtonElement>());

  // True while the open section holds text that is not saved.
  const [unsaved, setUnsaved] = useState(false);
  // What the person asked for while there was unsaved text. It waits for the answer.
  const [waiting, setWaiting] = useState<(() => void) | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutProblem, setLogoutProblem] = useState("");

  // The address holds the open tab, so a reload opens the same section.
  useEffect(() => {
    const fromAddress = new URLSearchParams(window.location.search).get("tab");
    if (isTab(fromAddress)) setTab(fromAddress);
  }, []);

  // The browser asks before it closes or reloads a page with unsaved text.
  useEffect(() => {
    if (!unsaved) return;
    const ask = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Older browsers ask only when this is set.
      event.returnValue = true;
    };
    window.addEventListener("beforeunload", ask);
    return () => window.removeEventListener("beforeunload", ask);
  }, [unsaved]);

  // A link to another page of the site asks first too. A change of tab stays on this page.
  const blocker = useBlocker(useCallback(({ currentLocation, nextLocation }) => unsaved && currentLocation.pathname !== nextLocation.pathname, [unsaved]));

  function orAskFirst(action: () => void) {
    if (unsaved) setWaiting(() => action);
    else action();
  }

  function open(next: TabId) {
    if (next === tab) return;
    orAskFirst(() => {
      setUnsaved(false);
      setTab(next);
      setSearchParams({ tab: next }, { replace: true, preventScrollReset: true });
    });
  }

  function logout() {
    orAskFirst(async () => {
      setLoggingOut(true);
      setLogoutProblem("");
      const result = await api.logout();
      setLoggingOut(false);
      // A session that has ended already is a logout too.
      if (result.ok || result.kind === "logged-out") {
        setUnsaved(false);
        onLoggedOut();
      } else {
        setLogoutProblem(FAILED);
      }
    });
  }

  // The arrow keys move between the tabs, as in each tab list.
  function onKeyDown(event: KeyboardEvent) {
    const at = TABS.findIndex((item) => item.id === tab);
    const moves: Record<string, number | undefined> = { ArrowRight: at + 1, ArrowDown: at + 1, ArrowLeft: at - 1, ArrowUp: at - 1, Home: 0, End: TABS.length - 1 };
    const to = moves[event.key];
    if (to === undefined) return;
    event.preventDefault();
    const next = TABS[(to + TABS.length) % TABS.length].id;
    buttons.current.get(next)?.focus();
    open(next);
  }

  const leaving = blocker.state === "blocked";

  return (
    <div data-testid="admin-panel">
      <header className="admin-head">
        <h1 className="admin-title">Speedydoodle admin</h1>
        <div className="admin-head-actions">
          <Link to="/" className="admin-link">
            View the site
          </Link>
          <PlainButton data-testid="logout" disabled={loggingOut} onClick={logout}>
            {loggingOut ? "Logging out…" : "Log out"}
          </PlainButton>
        </div>
      </header>
      <Failure text={logoutProblem} />

      <div role="tablist" aria-label="Sections of the admin panel" className="admin-tabs" onKeyDown={onKeyDown}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            ref={(element) => {
              if (element) buttons.current.set(id, element);
              else buttons.current.delete(id);
            }}
            type="button"
            role="tab"
            id={`tab-${id}`}
            data-testid={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={tab === id ? `section-${id}` : undefined}
            // Tab reaches the open tab only. The arrow keys reach the others.
            tabIndex={tab === id ? 0 : -1}
            className="admin-tab"
            onClick={() => open(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* The key makes each section start new, with its small entrance, when it opens. */}
      <section key={tab} role="tabpanel" id={`section-${tab}`} aria-labelledby={`tab-${tab}`} className="admin-section pop-in">
        {tab === "quotes" ? <QuotesSection /> : null}
        {tab === "gallery" ? <GallerySection /> : null}
        {tab === "prices" ? <PricesSection onUnsaved={setUnsaved} /> : null}
        {tab === "testimonials" ? <TestimonialsSection onUnsaved={setUnsaved} /> : null}
        {tab === "password" ? <PasswordSection /> : null}
      </section>

      <Confirm
        open={waiting !== null || leaving}
        question="Leave without saving?"
        detail="You have changes that are not saved. If you leave now, they are lost."
        yes="Leave without saving"
        no="Stay here"
        onYes={() => {
          if (leaving) blocker.proceed();
          waiting?.();
          setWaiting(null);
        }}
        onNo={() => {
          if (leaving) blocker.reset();
          setWaiting(null);
        }}
      />
    </div>
  );
}
