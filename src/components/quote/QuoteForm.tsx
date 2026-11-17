import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ComicButton } from "@/components/ComicButton";
import { InkParts } from "@/components/InkParts";
import { API_URL } from "@/lib/api";
import type { QuoteType } from "@/lib/gallery";
import {
  buildRequestBody,
  EMPTY_ANSWERS,
  estimateFor,
  fieldFromServer,
  findProblems,
  firstProblem,
  isQuoteType,
  readTravelCost,
  serverProblem,
  type FieldKey,
  type Problems,
  type QuoteAnswers,
} from "@/lib/quote";
import { quotePath } from "@/lib/site";
import { AnswerStep, type SetAnswer } from "./AnswerStep";
import { CheckStep } from "./CheckStep";
import { ChooseStep } from "./ChooseStep";
import { usePrices } from "@/components/ContentContext";
import { fieldId } from "./fields";
import { NO_PLACE, type Place } from "./LocationField";

// 4 is the thank-you screen.
type Step = 1 | 2 | 3 | 4;

const HEAD: Record<Step, { where: string; title: string; sub: string }> = {
  1: { where: "Step 1 of 3", title: "What can we draw for you?", sub: "Pick one. You can always go back." },
  2: { where: "Step 2 of 3", title: "Tell us about it", sub: "We need each of these to give you a price." },
  3: { where: "Step 3 of 3", title: "Look it over, then send it", sub: "Want to change something? Press Back." },
  4: { where: "Done", title: "Thank you!", sub: "" },
};

const TOO_MANY = "That's a lot of requests in a short time. Give it a minute, then try again.";
const NOT_SENT = "That didn't go through. Check your connection and try again in a minute.";
const NOT_ACCEPTED = "One of your answers didn't go through. Press Back, check each one, then try again.";

// The local day as "YYYY-MM-DD", the form of a date input.
function localToday() {
  const now = new Date();
  const two = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}`;
}

// Read the travel cost from an answer of the distance route.
async function readTravel(response: Response): Promise<number | null> {
  if (!response.ok) return null;
  return readTravelCost(await response.json());
}

// Read the name of the field that the server did not accept.
async function readField(response: Response): Promise<unknown> {
  const data: unknown = await response.json().catch(() => null);
  return typeof data === "object" && data !== null && "field" in data ? data.field : null;
}

// The quote form: choose, answer, check and send, and then a thank-you screen.
export function QuoteForm() {
  const prices = usePrices();
  // The pre-rendered page is step 1 for each address, so the first render is always step 1.
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<QuoteType | null>(null);
  const [answers, setAnswers] = useState<QuoteAnswers>(EMPTY_ANSWERS);
  const [problems, setProblems] = useState<Problems>({});
  const [place, setPlace] = useState<Place>(NO_PLACE);
  const [today, setToday] = useState("");
  const [sending, setSending] = useState(false);
  const [sendProblem, setSendProblem] = useState<string | null>(null);
  // Where the focus goes after the next render: the title of the step, or a field with a problem.
  const [focus, setFocus] = useState<{ target: "title" | FieldKey } | null>(null);

  const title = useRef<HTMLHeadingElement>(null);
  // The address text of this moment, to ignore a distance that arrives for an older text.
  const locationNow = useRef("");
  // True from the press of "Send" to the answer. A state value is too late for a fast second press.
  const busy = useRef(false);

  const { search } = useLocation();
  const navigate = useNavigate();

  // ?type= in the address chooses the type and opens step 2. This runs before the browser
  // paints, so a visitor with such a link does not see step 1 first.
  useLayoutEffect(() => {
    const asked = new URLSearchParams(search).get("type");
    if (isQuoteType(asked)) {
      setType(asked);
      setStep((now) => (now === 1 ? 2 : now));
    } else {
      setStep(1);
    }
  }, [search]);

  useEffect(() => setToday(localToday()), []);

  useEffect(() => {
    if (!focus) return;
    if (focus.target === "title") {
      window.scrollTo({ top: 0, behavior: "instant" });
      title.current?.focus({ preventScroll: true });
      return;
    }
    const field = document.getElementById(fieldId(focus.target));
    if (!field) return;
    // A group of choices has no focus of its own. Its first button gets it.
    const control = field.matches("input, select, textarea") ? field : field.querySelector<HTMLElement>("button:not(:disabled)");
    field.scrollIntoView({ block: "center" });
    control?.focus({ preventScroll: true });
  }, [focus]);

  function go(next: Step, target: "title" | FieldKey = "title") {
    setStep(next);
    setFocus({ target });
  }

  const set: SetAnswer = (key, value) => {
    setAnswers((now) => ({ ...now, [key]: value }));
    // The sentence under a field goes away when the visitor changes the answer.
    setProblems((now) => {
      if (now[key] === undefined) return now;
      const rest = { ...now };
      delete rest[key];
      return rest;
    });
  };

  function choose(next: QuoteType) {
    setType(next);
    setProblems({});
    setSendProblem(null);
    go(2);
    void navigate(quotePath(next), { replace: true, preventScrollReset: true });
  }

  function backToChoices() {
    go(1);
    void navigate(quotePath(), { replace: true, preventScrollReset: true });
  }

  function typeLocation(text: string) {
    locationNow.current = text;
    set("location", text);
    // The distance and its message belong to the old text.
    setPlace(NO_PLACE);
  }

  // The distance is for the estimate on this page. The server calculates the price again.
  async function chooseLocation(text: string) {
    locationNow.current = text;
    set("location", text);
    setPlace({ chosen: text, travelCost: null, failed: false });
    let travelCost: number | null = null;
    try {
      travelCost = await readTravel(await fetch(`${API_URL}/api/calculate-distance?userLocation=${encodeURIComponent(text)}`));
    } catch {
      travelCost = null;
    }
    if (locationNow.current !== text) return;
    setPlace({ chosen: text, travelCost, failed: travelCost === null });
  }

  function next() {
    if (!type) return;
    const found = findProblems(type, answers);
    const first = firstProblem(found);
    // A problem with the notes belongs to step 3.
    if (first && first !== "notes") {
      setProblems(found);
      setFocus({ target: first });
      return;
    }
    setProblems(found);
    setSendProblem(null);
    go(3);
  }

  async function send() {
    if (!type || busy.current) return;
    const found = findProblems(type, answers);
    const first = firstProblem(found);
    if (first) {
      setProblems(found);
      go(first === "notes" ? 3 : 2, first);
      return;
    }

    busy.current = true;
    setSending(true);
    setSendProblem(null);
    try {
      const response = await fetch(`${API_URL}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRequestBody(type, answers)),
      });
      if (response.status === 201) {
        // The request is sent. A second request starts with an empty form.
        setAnswers(EMPTY_ANSWERS);
        setPlace(NO_PLACE);
        locationNow.current = "";
        go(4);
      } else if (response.status === 400) {
        const key = fieldFromServer(type, await readField(response));
        if (key) {
          setProblems({ [key]: serverProblem(key) });
          go(key === "notes" ? 3 : 2, key);
        } else {
          setSendProblem(NOT_ACCEPTED);
        }
      } else {
        setSendProblem(response.status === 429 ? TOO_MANY : NOT_SENT);
      }
    } catch {
      setSendProblem(NOT_SENT);
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  const head = HEAD[step];
  const showEstimate = type !== null && (step === 2 || step === 3);
  const estimate = type ? estimateFor(type, answers, place.travelCost, prices) : null;

  return (
    <main className="dots quote-page">
      <div className="quote-column">
        <p id="quote-where" className="kicker text-[20px]">
          {head.where}
        </p>
        <h1 ref={title} tabIndex={-1} aria-describedby="quote-where" data-testid="step-title" className="title quote-title mt-0.5">
          {head.title}
        </h1>
        {head.sub ? <p className="quote-sub">{head.sub}</p> : null}
        {step === 4 ? null : (
          <div className="quote-steps" aria-hidden="true">
            {[1, 2, 3].map((part) => (
              <i key={part} className={part <= step ? "on" : undefined} />
            ))}
          </div>
        )}

        {/* The key makes each screen a new element, so its small pop runs each time. */}
        <div key={step} className="pop-in">
          {step === 1 ? <ChooseStep onChoose={choose} /> : null}
          {step === 2 && type ? (
            <AnswerStep
              type={type}
              answers={answers}
              problems={problems}
              place={place}
              today={today}
              set={set}
              onTypeLocation={typeLocation}
              onChooseLocation={chooseLocation}
              onBack={backToChoices}
              onNext={next}
            />
          ) : null}
          {step === 3 && type && estimate ? (
            <CheckStep
              type={type}
              answers={answers}
              problems={problems}
              estimate={estimate.text}
              sending={sending}
              sendProblem={sendProblem}
              onNotes={(text) => set("notes", text)}
              onBack={() => go(2)}
              onSend={send}
            />
          ) : null}
          {step === 4 ? (
            <div data-testid="thanks">
              <div className="ink-box bubble quote-thanks">
                <InkParts radius={22} />
                <p className="ink-in px-6 py-5">
                  <b>Got it!</b> Your request is on its way to Mike. Look for an email from us in a few minutes, and a reply within 24 hours.
                </p>
              </div>
              <div className="quote-actions mt-11">
                <ComicButton to="/" size="large">
                  Back to the home page
                </ComicButton>
              </div>
            </div>
          ) : null}
        </div>

        {showEstimate && estimate ? (
          <div className="quote-estimate" data-testid="estimate" role="status">
            <span>Your estimate</span>
            <b data-testid="estimate-amount">{estimate.text}</b>
            {estimate.note ? <small>{estimate.note}</small> : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
