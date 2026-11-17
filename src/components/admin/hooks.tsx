import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { moveItem, type AdminApi, type Move, type Result } from "@/lib/admin-api";

interface Admin {
  api: AdminApi;
  // The number of logins of this visit. A section that could not load tries again when it changes.
  logins: number;
}

const AdminContext = createContext<Admin | null>(null);
export const AdminProvider = AdminContext.Provider;

export function useAdmin(): Admin {
  const admin = useContext(AdminContext);
  if (!admin) throw new Error("This part belongs inside the admin panel.");
  return admin;
}

export type LoadState = "loading" | "ready" | "failed";

// Get the data of a section when the section opens. `retry` asks again after a failure.
export function useLoad<Data>(get: (api: AdminApi) => Promise<Result<Data>>, use: (data: Data) => void) {
  const { api, logins } = useAdmin();
  const [state, setState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);
  const done = useRef(false);
  const work = useRef({ get, use });
  useEffect(() => {
    work.current = { get, use };
  });

  useEffect(() => {
    if (done.current) return;
    let live = true;
    setState("loading");
    work.current.get(api).then((result) => {
      if (!live) return;
      if (result.ok) {
        done.current = true;
        work.current.use(result.data);
        setState("ready");
      } else if (result.kind !== "logged-out") {
        setState("failed");
      }
      // After "logged out", the section waits. The next login starts this effect again.
    });
    return () => {
      live = false;
    };
  }, [api, logins, attempt]);

  return { state, retry: () => setAttempt((count) => count + 1) };
}

// A short message that goes away by itself, such as "Saved".
export function useFlash(milliseconds = 2500): [string, (text: string) => void] {
  const [text, setText] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = (next: string) => {
    clearTimeout(timer.current);
    setText(next);
    if (next) timer.current = setTimeout(() => setText(""), milliseconds);
  };
  return [text, show];
}

// A browser can drop the keyboard focus when a card moves in the page. After a move, this
// puts the focus back on the pressed button of the moved card. A button at the end of the
// list is disabled, so the next button in `buttons` gets the focus instead.
export function useKeepFocus(list: RefObject<HTMLElement | null>) {
  const wanted = useRef<{ id: number; buttons: Move[] } | null>(null);
  useLayoutEffect(() => {
    const want = wanted.current;
    if (!want) return;
    wanted.current = null;
    const card = list.current?.querySelector(`[data-id="${want.id}"]`);
    for (const name of want.buttons) {
      const button = card?.querySelector<HTMLButtonElement>(`button[data-move="${name}"]:not(:disabled)`);
      if (button) {
        button.focus();
        return;
      }
    }
  });
  return (id: number, buttons: Move[]) => {
    wanted.current = { id, buttons };
  };
}

export const ORDER_FAILED = "That didn't work, so the order is as it was. Check your connection and try again.";

interface Reorder<Item> {
  items: Item[];
  setItems: (items: Item[]) => void;
  // Store the new order. `ids` holds every item.
  send: (ids: number[]) => Promise<Result<Item[]>>;
  // Read the list again from the server.
  reload: () => Promise<Result<Item[]>>;
}

// Move an item of a list. The page shows the new order at once, and the server gets the
// orders one after another. When the server refuses one, the list goes back to what the
// server holds, and `problem` is a sentence to show.
export function useReorder<Item extends { id: number }>({ items, setItems, send, reload }: Reorder<Item>) {
  const [problem, setProblem] = useState("");
  const queue = useRef<Promise<void>>(Promise.resolve());
  // A failure makes the orders that wait behind it out of date. They are not sent.
  const failures = useRef(0);

  function move(id: number, how: Move): boolean {
    const before = items;
    const next = moveItem(before, id, how);
    if (next === before) return false;
    setItems(next);
    setProblem("");
    const sentAfter = failures.current;
    queue.current = queue.current.then(async () => {
      if (sentAfter !== failures.current) return;
      const result = await send(next.map((item) => item.id));
      if (result.ok) return;
      failures.current += 1;
      const stored = result.kind === "logged-out" ? result : await reload();
      setItems(stored.ok ? stored.data : before);
      setProblem(ORDER_FAILED);
    });
    return true;
  }

  return { move, problem };
}
