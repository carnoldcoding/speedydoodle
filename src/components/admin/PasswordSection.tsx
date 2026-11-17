import { useState, type FormEvent } from "react";
import { ComicButton } from "@/components/ComicButton";
import { FAILED } from "@/lib/admin-api";
import { useAdmin } from "./hooks";
import { Failure, PasswordField, Status } from "./parts";

type FieldName = "current" | "new" | "again";

const IDS: Record<FieldName, string> = { current: "password-current", new: "password-new", again: "password-again" };

// Change the password of the one account of the site.
export function PasswordSection() {
  const { api } = useAdmin();
  const [values, setValues] = useState<Record<FieldName, string>>({ current: "", new: "", again: "" });
  const [problems, setProblems] = useState<Partial<Record<FieldName, string>>>({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [failure, setFailure] = useState("");

  function set(name: FieldName, value: string) {
    setValues({ ...values, [name]: value });
    setProblems({ ...problems, [name]: undefined });
    setStatus("");
  }

  function show(found: Partial<Record<FieldName, string>>) {
    setProblems(found);
    const first = (["current", "new", "again"] as const).find((name) => found[name]);
    if (first) document.getElementById(IDS[first])?.focus();
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setStatus("");
    setFailure("");
    const found: Partial<Record<FieldName, string>> = {};
    if (values.current === "") found.current = "Type your current password.";
    if (values.new.length < 15) found.new = "Use 15 characters or more.";
    else if (values.new.length > 128) found.new = "Use 128 characters or fewer.";
    // The two new fields must match before anything is sent.
    if (values.again !== values.new) found.again = "The two new passwords are not the same.";
    if (found.current || found.new || found.again) {
      show(found);
      return;
    }
    setBusy(true);
    const result = await api.changePassword(values.current, values.new);
    setBusy(false);
    if (result.ok) {
      setValues({ current: "", new: "", again: "" });
      setProblems({});
      setStatus("Your password is changed.");
    } else if (result.kind === "field") {
      show(result.field === "currentPassword" ? { current: result.message } : { new: result.message });
    } else if (result.kind === "failed") {
      setFailure(FAILED);
    }
  }

  return (
    <form className="admin-narrow" noValidate onSubmit={submit}>
      <h2 className="admin-heading">Password</h2>
      {/* A password manager stores the new password under this name. It is not in view. */}
      <input type="text" name="username" autoComplete="username" value="admin" readOnly hidden />
      <PasswordField
        id={IDS.current}
        label="Your current password"
        problem={problems.current}
        value={values.current}
        onChange={(value) => set("current", value)}
        autoComplete="current-password"
        testId="password-current"
        problemTestId="problem-current"
      />
      <PasswordField
        id={IDS.new}
        label="Your new password"
        help="15 characters or more. A few words in a row work well."
        problem={problems.new}
        value={values.new}
        onChange={(value) => set("new", value)}
        autoComplete="new-password"
        testId="password-new"
        problemTestId="problem-new"
      />
      <PasswordField
        id={IDS.again}
        label="Your new password again"
        problem={problems.again}
        value={values.again}
        onChange={(value) => set("again", value)}
        autoComplete="new-password"
        testId="password-again"
        problemTestId="problem-again"
      />
      <div className="admin-row">
        <ComicButton type="submit" size="large" data-testid="password-submit" disabled={busy}>
          {busy ? "Saving…" : "Change password"}
        </ComicButton>
      </div>
      <Status text={status} testId="password-status" />
      <Failure text={failure} />
    </form>
  );
}
