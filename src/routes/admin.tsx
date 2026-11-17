import { useEffect, useMemo, useState } from "react";
import { AdminProvider } from "@/components/admin/hooks";
import { LoginForm } from "@/components/admin/LoginForm";
import { Panel } from "@/components/admin/Panel";
import { createAdminApi } from "@/lib/admin-api";
import { API_URL } from "@/lib/api";
import "@/styles/quote-form.css";
import "@/styles/admin.css";

export function meta() {
  return [{ title: "Admin | Speedydoodle Studios" }, { name: "robots", content: "noindex, nofollow" }];
}

const COOKIE_LOST = "The login worked, but your browser did not keep it. Allow cookies for speedydoodle.com, then try again.";

// The admin panel. The session is a cookie that scripts cannot read, so the page asks the
// server who is logged in. Nothing about the session is stored in the browser by this page.
export default function Admin() {
  const [session, setSession] = useState<"loading" | "out" | "in">("loading");
  // True when a request found that the session has ended. The panel stays in the page,
  // hidden, so what is typed in it is still there after the next login.
  const [ended, setEnded] = useState(false);
  const [logins, setLogins] = useState(0);

  const api = useMemo(
    () =>
      createAdminApi({
        fetch: (url, init) => fetch(url, init),
        base: API_URL,
        onLoggedOut: () => setEnded(true),
      }),
    [],
  );

  useEffect(() => {
    let live = true;
    api.session().then((result) => {
      if (live) setSession(result.ok ? "in" : "out");
    });
    return () => {
      live = false;
    };
  }, [api]);

  async function login(password: string): Promise<string | null> {
    const result = await api.login(password);
    if (!result.ok) return result.problem;
    // A browser that blocks the cookie accepts the login and then has no session.
    const check = await api.session();
    if (!check.ok) return COOKIE_LOST;
    setEnded(false);
    setLogins((count) => count + 1);
    setSession("in");
    return null;
  }

  const admin = useMemo(() => ({ api, logins }), [api, logins]);

  return (
    <main className="admin-page dots">
      <div className="admin-column">
        {session === "loading" ? (
          <p data-testid="admin-loading" role="status" className="admin-quiet">
            Loading…
          </p>
        ) : null}
        {session === "out" || (session === "in" && ended) ? (
          <LoginForm notice={ended ? "You were logged out. Log in again." : undefined} onLogin={login} />
        ) : null}
        {session === "in" ? (
          <div hidden={ended}>
            <AdminProvider value={admin}>
              <Panel
                onLoggedOut={() => {
                  setEnded(false);
                  setSession("out");
                }}
              />
            </AdminProvider>
          </div>
        ) : null}
      </div>
    </main>
  );
}
