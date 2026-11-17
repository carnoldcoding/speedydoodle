import { useState } from "react";
import { FAILED, quoteCount, quoteDate, quoteKind, quoteMoney, quoteRows, type Quote } from "@/lib/admin-api";
import { useAdmin, useLoad } from "./hooks";
import { Failure, Loading, PlainButton } from "./parts";

// The number of quotes in one request.
const PAGE = 50;

// The quote requests, newest first. A press on a card opens its details in place.
export function QuotesSection() {
  const { api } = useAdmin();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<"new" | "all">("all");
  // Quotes marked as handled while "New" is chosen. They stay in view, so a wrong press can be undone.
  const [justHandled, setJustHandled] = useState<number[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [more, setMore] = useState<"idle" | "busy" | "failed">("idle");

  const load = useLoad(
    (admin) => admin.quotes(PAGE, 0),
    (page) => {
      setQuotes(page.quotes);
      setTotal(page.total);
    },
  );

  async function showMore() {
    setMore("busy");
    const result = await api.quotes(PAGE, quotes.length);
    if (!result.ok) {
      setMore(result.kind === "logged-out" ? "idle" : "failed");
      return;
    }
    // A quote that arrived in the meantime moves the pages, so one can come a second time.
    const known = new Set(quotes.map((quote) => quote.id));
    setQuotes([...quotes, ...result.data.quotes.filter((quote) => !known.has(quote.id))]);
    setTotal(result.data.total);
    setMore("idle");
  }

  function choose(next: "new" | "all") {
    setFilter(next);
    setJustHandled([]);
  }

  function replace(changed: Quote) {
    setQuotes((list) => list.map((quote) => (quote.id === changed.id ? changed : quote)));
    if (changed.handled) setJustHandled((ids) => [...ids, changed.id]);
  }

  if (load.state !== "ready") {
    return (
      <>
        <h2 className="admin-heading">Quotes</h2>
        <Loading {...load} />
      </>
    );
  }

  const fresh = quotes.filter((quote) => !quote.handled).length;
  const shown = filter === "all" ? quotes : quotes.filter((quote) => !quote.handled || justHandled.includes(quote.id));
  // The server counts all quotes. The new ones are counted here, among the loaded quotes.
  const loadedAll = quotes.length >= total;

  return (
    <>
      <h2 className="admin-heading">Quotes</h2>
      <p data-testid="quotes-count" className="admin-note">
        {quoteCount(fresh, total)}
      </p>
      <div className="admin-row" role="group" aria-label="Which quotes to show">
        <PlainButton data-testid="quotes-filter-new" aria-pressed={filter === "new"} onClick={() => choose("new")}>
          New
        </PlainButton>
        <PlainButton data-testid="quotes-filter-all" aria-pressed={filter === "all"} onClick={() => choose("all")}>
          All
        </PlainButton>
      </div>

      {total === 0 ? <p className="admin-quiet">No quotes yet.</p> : null}
      {total > 0 && shown.length === 0 ? <p className="admin-quiet">{loadedAll ? "No new quotes." : "No new quotes among these. Show more to look at older ones."}</p> : null}

      <div className="admin-list">
        {shown.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} open={openId === quote.id} onToggle={() => setOpenId(openId === quote.id ? null : quote.id)} onChange={replace} />
        ))}
      </div>

      {loadedAll ? null : (
        <div className="admin-row">
          <PlainButton disabled={more === "busy"} onClick={showMore}>
            {more === "busy" ? "Loading…" : "Show more"}
          </PlainButton>
        </div>
      )}
      <Failure text={more === "failed" ? FAILED : ""} />
    </>
  );
}

interface QuoteCardProps {
  quote: Quote;
  open: boolean;
  onToggle: () => void;
  onChange: (quote: Quote) => void;
}

function QuoteCard({ quote, open, onToggle, onChange }: QuoteCardProps) {
  const { api } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const name = `${quote.firstName} ${quote.lastName}`.trim();
  const detailsId = `quote-${quote.id}-details`;

  async function toggleHandled() {
    setBusy(true);
    setProblem("");
    const result = await api.setHandled(quote.id, !quote.handled);
    setBusy(false);
    if (result.ok) onChange(result.data);
    else if (result.kind !== "logged-out") setProblem(FAILED);
  }

  return (
    <article data-testid="quote-card" data-handled={quote.handled ? "true" : "false"} className="admin-card">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={detailsId} className="admin-quote-toggle" onClick={onToggle}>
          <span>
            <span className="admin-quote-name">{name || "No name"}</span>
            <span className="admin-quote-line">{quoteKind(quote)}</span>
            <span className="admin-quote-line">{quoteDate(quote.createdAt)}</span>
          </span>
          <span className="admin-quote-side">
            <span className="admin-quote-price">{quoteMoney(quote.price)}</span>
            {quote.handled ? null : <span className="admin-new">New</span>}
          </span>
        </button>
      </h3>

      {open ? (
        <div id={detailsId} className="admin-quote-details">
          <dl className="admin-rows">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${quote.email}`}>{quote.email}</a>
              </dd>
            </div>
            {quote.phone ? (
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${quote.phone.replace(/[^\d+]/g, "")}`}>{quote.phone}</a>
                </dd>
              </div>
            ) : null}
            {quoteRows(quote).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            <div>
              <dt>Price</dt>
              <dd>{quoteMoney(quote.price)}</dd>
            </div>
          </dl>

          {quote.artistEmail === "failed" ? <p className="admin-failure">The email to you failed to send</p> : null}
          {quote.customerEmail === "failed" ? <p className="admin-failure">The confirmation to the customer failed to send</p> : null}

          <div className="admin-row">
            <PlainButton data-testid="quote-toggle-handled" disabled={busy} onClick={toggleHandled}>
              {busy ? "Saving…" : quote.handled ? "Mark as not handled" : "Mark as handled"}
            </PlainButton>
          </div>
          <Failure text={problem} />
        </div>
      ) : null}
    </article>
  );
}
