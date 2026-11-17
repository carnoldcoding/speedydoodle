import { useEffect, useRef, useState, type FormEvent } from "react";
import { ComicButton } from "@/components/ComicButton";
import { PasswordField } from "./parts";

interface LoginFormProps {
  // A sentence above the field, for a person whose session has ended.
  notice?: string;
  // Try the password. The answer is a sentence for a problem, or null for a success.
  onLogin: (password: string) => Promise<string | null>;
}

// The login form: one password, one button. The site has one account, so there is no user name.
export function LoginForm({ notice, onLogin }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (password === "") {
      setProblem("Type your password.");
      field.current?.focus();
      return;
    }
    setBusy(true);
    setProblem("");
    const answer = await onLogin(password);
    // After a success this form is gone, so only a problem changes it.
    if (answer !== null) {
      setBusy(false);
      setProblem(answer);
      field.current?.focus();
    }
  }

  return (
    <form data-testid="login-form" className="admin-narrow" noValidate onSubmit={submit}>
      <h1 className="admin-title">Speedydoodle admin</h1>
      {notice ? (
        <p role="status" className="admin-status">
          {notice}
        </p>
      ) : null}
      <PasswordField
        id="login-password"
        label="Password"
        problem={problem}
        value={password}
        onChange={(value) => {
          setPassword(value);
          setProblem("");
        }}
        autoComplete="current-password"
        testId="login-password"
        problemTestId="login-problem"
        inputRef={field}
      />
      <div className="admin-row">
        <ComicButton type="submit" size="large" data-testid="login-submit" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </ComicButton>
      </div>
    </form>
  );
}
