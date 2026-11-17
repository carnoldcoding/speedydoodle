import { useEffect, useState, type FormEvent } from "react";
import { ComicButton } from "@/components/ComicButton";
import { Input } from "@/components/ui/input";
import { changedPrices, FAILED, type Setting } from "@/lib/admin-api";
import { useAdmin, useLoad } from "./hooks";
import { controlProps, Failure, Field, Loading, Status } from "./parts";

const fieldId = (key: string) => `price-${key}`;

// The settings in groups, in the order the server sent them.
function inGroups(settings: Setting[]): [string, Setting[]][] {
  const groups = new Map<string, Setting[]>();
  for (const setting of settings) groups.set(setting.group, [...(groups.get(setting.group) ?? []), setting]);
  return [...groups];
}

// The prices and numbers of the site. The server sends the list of fields and their labels.
export function PricesSection({ onUnsaved }: { onUnsaved: (unsaved: boolean) => void }) {
  const { api } = useAdmin();
  const [settings, setSettings] = useState<Setting[]>([]);
  // What is typed in each field that was changed. A field that is not here shows its stored value.
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [problems, setProblems] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [failure, setFailure] = useState("");
  // The field to scroll to, after the page shows its problem.
  const [goTo, setGoTo] = useState<string | null>(null);

  const load = useLoad((admin) => admin.settings(), setSettings);

  const changes = changedPrices(settings, typed);
  const unsaved = Object.keys(changes.values).length + Object.keys(changes.problems).length > 0;

  useEffect(() => {
    onUnsaved(unsaved);
  }, [unsaved, onUnsaved]);
  useEffect(() => () => onUnsaved(false), [onUnsaved]);

  useEffect(() => {
    if (goTo === null) return;
    const field = document.getElementById(fieldId(goTo));
    // The middle of the screen is clear of the bar at the top and of the save bar at the bottom.
    field?.scrollIntoView({ block: "center" });
    field?.focus({ preventScroll: true });
    setGoTo(null);
  }, [goTo]);

  function showProblems(found: Record<string, string>) {
    setProblems(found);
    const first = settings.find((setting) => found[setting.key]);
    if (first) setGoTo(first.key);
    // A problem with a setting that has no field cannot show under a field.
    else setFailure(FAILED);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setStatus("");
    setFailure("");
    if (Object.keys(changes.problems).length > 0) {
      showProblems(changes.problems);
      return;
    }
    if (Object.keys(changes.values).length === 0) {
      setStatus("Nothing has changed, so there is nothing to save.");
      return;
    }
    setSaving(true);
    const result = await api.saveSettings(changes.values);
    setSaving(false);
    if (result.ok) {
      setSettings(result.data);
      setTyped({});
      setProblems({});
      setStatus("Saved. The site shows the new prices within a few minutes.");
    } else if (result.kind === "field") {
      showProblems({ [result.field]: result.message });
    } else if (result.kind === "failed") {
      setFailure(FAILED);
    }
  }

  if (load.state !== "ready") {
    return (
      <>
        <h2 className="admin-heading">Prices</h2>
        <Loading {...load} />
      </>
    );
  }

  return (
    <form className="admin-prices" noValidate onSubmit={save}>
      <h2 className="admin-heading">Prices</h2>
      <p className="admin-note">The quote form and the pages of the site use these numbers.</p>

      {inGroups(settings).map(([group, list]) => (
        <section key={group}>
          <h3 className="admin-subheading">{group}</h3>
          {list.map(({ key, label, value }) => (
            <Field key={key} id={fieldId(key)} label={label} problem={problems[key]} problemTestId={`problem-${key}`}>
              <Input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                name={key}
                data-testid={`price-field-${key}`}
                {...controlProps(fieldId(key), undefined, problems[key])}
                value={typed[key] ?? String(value)}
                onChange={(event) => {
                  setTyped({ ...typed, [key]: event.target.value });
                  setProblems(({ [key]: _gone, ...rest }) => rest);
                  setStatus("");
                }}
              />
            </Field>
          ))}
        </section>
      ))}

      <div className={`admin-savebar ${unsaved ? "is-dirty" : ""}`}>
        {unsaved ? <p className="admin-savebar-text">You have unsaved changes</p> : null}
        <ComicButton type="submit" size="large" data-testid="prices-save" disabled={saving}>
          {saving ? "Saving…" : "Save prices"}
        </ComicButton>
        <Status text={status} testId="prices-status" />
        <Failure text={failure} />
      </div>
    </form>
  );
}
