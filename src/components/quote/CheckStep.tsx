import { ComicButton } from "@/components/ComicButton";
import { Textarea } from "@/components/ui/textarea";
import type { QuoteType } from "@/lib/gallery";
import { longDate, timeLabel, type Problems, type QuoteAnswers } from "@/lib/quote";
import { controlProps, Field } from "./fields";

const NOTES_HELP = "You can leave this empty.";
const BACKGROUND_NAMES = { "": "", none: "No background", simple: "Simple", complex: "Detailed" };

// The answers as rows of a list: what was asked, and what the visitor said.
function summaryRows(type: QuoteType, answers: QuoteAnswers): [string, string][] {
  const rows: [string, string][] = [
    ["Name", `${answers.firstName.trim()} ${answers.lastName.trim()}`],
    ["Email", answers.email.trim()],
  ];
  if (answers.phone.trim()) rows.push(["Phone", answers.phone.trim()]);
  if (type === "live") {
    rows.push(
      ["You chose", "Live caricatures"],
      ["Event", answers.event.trim()],
      ["Guests", answers.headcount.trim()],
      ["Where", answers.location.trim()],
      ["When", `${longDate(answers.date)}, ${timeLabel(answers.startTime)} to ${timeLabel(answers.endTime)}`],
    );
  }
  if (type === "custom") {
    rows.push(
      ["You chose", "A custom caricature"],
      ["People in the drawing", String(answers.people)],
      ["Background", BACKGROUND_NAMES[answers.background]],
      ["Words", answers.words === "yes" ? answers.textContent.trim() : "No words"],
      ["The drawing", answers.description.trim()],
    );
  }
  if (type === "lni") {
    rows.push(["You chose", answers.selection === "logo" ? "A logo" : "An illustration"], ["What you need", answers.lniDescription.trim()]);
  }
  return rows;
}

interface CheckStepProps {
  type: QuoteType;
  answers: QuoteAnswers;
  problems: Problems;
  estimate: string;
  sending: boolean;
  // A problem that belongs to no field: a rate limit, or a request that did not go through.
  sendProblem: string | null;
  onNotes: (text: string) => void;
  onBack: () => void;
  onSend: () => void;
}

// Step 3: the visitor looks the answers over, adds a note, and sends the request.
export function CheckStep({ type, answers, problems, estimate, sending, sendProblem, onNotes, onBack, onSend }: CheckStepProps) {
  return (
    <>
      <dl className="quote-summary">
        {summaryRows(type, answers).map(([term, text]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{text}</dd>
          </div>
        ))}
        <div className="total">
          <dt>Your estimate</dt>
          <dd>{estimate}</dd>
        </div>
      </dl>
      <Field name="notes" label="Anything else Mike should know?" help={NOTES_HELP} problem={problems.notes}>
        <Textarea maxLength={2000} {...controlProps("notes", NOTES_HELP, problems.notes)} value={answers.notes} onChange={(event) => onNotes(event.target.value)} />
      </Field>
      <p className="quote-promise">
        <b>You pay nothing now.</b> Mike reads every request personally, and you'll hear back within 24 hours.
      </p>
      {sendProblem ? (
        <p role="alert" data-testid="send-problem" className="quote-problem">
          {sendProblem}
        </p>
      ) : null}
      <div className="quote-actions">
        <ComicButton ghost size="large" data-testid="form-back" disabled={sending} onClick={onBack}>
          Back
        </ComicButton>
        <ComicButton size="large" data-testid="form-send" disabled={sending} onClick={onSend}>
          {sending ? "Sending…" : "Send my request"}
        </ComicButton>
      </div>
    </>
  );
}
