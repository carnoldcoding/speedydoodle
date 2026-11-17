import { useRef, useState, type ComponentProps, type ReactNode, type Ref } from "react";
import { ComicButton } from "@/components/ComicButton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FAILED } from "@/lib/admin-api";
import type { LoadState } from "./hooks";

// The attributes of a text field, text area, or number field. They tie the control to its
// small text and to its problem. The classes are those of the public quote form.
export function controlProps(id: string, help?: string, problem?: string) {
  const described = [help ? `${id}-help` : "", problem ? `${id}-problem` : ""].filter(Boolean).join(" ");
  return {
    id,
    className: "quote-control",
    "aria-invalid": problem ? (true as const) : undefined,
    "aria-describedby": described || undefined,
  };
}

interface FieldProps {
  id: string;
  label: string;
  help?: string;
  problem?: string;
  problemTestId?: string;
  children: ReactNode;
}

// A question: the label above, the control, and the problem under it as a sentence.
export function Field({ id, label, help, problem, problemTestId, children }: FieldProps) {
  return (
    <div className="quote-field">
      <div className="quote-label-block">
        <Label htmlFor={id} className="quote-label">
          {label}
        </Label>
        {help ? (
          <p id={`${id}-help`} className="quote-help">
            {help}
          </p>
        ) : null}
      </div>
      {children}
      {problem ? (
        <p id={`${id}-problem`} role="alert" data-testid={problemTestId} className="quote-problem">
          {problem}
        </p>
      ) : null}
    </div>
  );
}

// A plain large button. The main button of a screen is a ComicButton.
export function PlainButton({ className = "", danger, ...props }: ComponentProps<"button"> & { danger?: boolean }) {
  return <button type="button" className={`admin-btn ${danger ? "admin-btn-danger" : ""} ${className}`} {...props} />;
}

// A failure that belongs to no field, as one sentence near the button.
export function Failure({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p role="alert" className="admin-failure">
      {text}
    </p>
  );
}

// What happened, as one sentence. The element is always in the page, so a screen reader
// says the sentence when it appears.
export function Status({ text, testId }: { text: string; testId?: string }) {
  return (
    <p role="status" data-testid={testId} className="admin-status">
      {text}
    </p>
  );
}

// What a section shows before its data is there.
export function Loading({ state, retry }: { state: LoadState; retry: () => void }) {
  if (state === "ready") return null;
  if (state === "loading") {
    return (
      <p role="status" className="admin-quiet">
        Loading…
      </p>
    );
  }
  return (
    <div>
      <Failure text={FAILED} />
      <div className="admin-row">
        <PlainButton onClick={retry}>Try again</PlainButton>
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  help?: string;
  problem?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  testId: string;
  problemTestId?: string;
  inputRef?: Ref<HTMLInputElement>;
}

// A password field with a button that shows or hides what is typed.
export function PasswordField({ id, label, help, problem, value, onChange, autoComplete, testId, problemTestId, inputRef }: PasswordFieldProps) {
  const [shown, setShown] = useState(false);
  return (
    <Field id={id} label={label} help={help} problem={problem} problemTestId={problemTestId}>
      <div className="admin-password-row">
        <Input
          ref={inputRef}
          type={shown ? "text" : "password"}
          name={id}
          autoComplete={autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          data-testid={testId}
          {...controlProps(id, help, problem)}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <PlainButton aria-label={`${shown ? "Hide" : "Show"} what is typed in "${label}"`} aria-pressed={shown} onClick={() => setShown(!shown)}>
          {shown ? "Hide" : "Show"}
        </PlainButton>
      </div>
    </Field>
  );
}

interface ConfirmProps {
  open: boolean;
  question: string;
  detail: string;
  yes: string;
  // The text of the "yes" button while its action runs.
  yesBusy?: string;
  no: string;
  busy?: boolean;
  problem?: string;
  onYes: () => void;
  onNo: () => void;
}

// A question before an action that cannot be undone. Escape and a press outside mean "no".
export function Confirm({ open, question, detail, yes, yesBusy, no, busy = false, problem = "", onYes, onNo }: ConfirmProps) {
  const safe = useRef<HTMLButtonElement>(null);
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) onNo();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="admin-dialog"
        // The focus starts on "no", so a press of Enter by mistake removes nothing.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          safe.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle className="admin-dialog-title">{question}</DialogTitle>
          <DialogDescription className="admin-dialog-text">{detail}</DialogDescription>
        </DialogHeader>
        <Failure text={problem} />
        <DialogFooter className="admin-dialog-buttons">
          <ComicButton data-testid="confirm-yes" disabled={busy} onClick={onYes}>
            {busy && yesBusy ? yesBusy : yes}
          </ComicButton>
          <PlainButton ref={safe} data-testid="confirm-no" disabled={busy} onClick={onNo}>
            {no}
          </PlainButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
