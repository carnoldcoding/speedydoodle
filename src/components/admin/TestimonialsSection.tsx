import { useEffect, useRef, useState, type FormEvent } from "react";
import { ComicButton } from "@/components/ComicButton";
import { InkParts } from "@/components/InkParts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FAILED, type Move, type Result, type Testimonial } from "@/lib/admin-api";
import { useAdmin, useKeepFocus, useLoad, useReorder } from "./hooks";
import { Confirm, controlProps, Failure, Field, Loading, PlainButton } from "./parts";

const TEXT_LIMIT = 600;
const NAME_LIMIT = 80;

// What customers said. The home page shows the first three.
export function TestimonialsSection({ onUnsaved }: { onUnsaved: (unsaved: boolean) => void }) {
  const { api } = useAdmin();
  const [items, setItems] = useState<Testimonial[]>([]);
  // The open form: a new testimonial, or the id of the one that is edited.
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [removing, setRemoving] = useState<Testimonial | null>(null);
  const [removeBusy, setRemoveBusy] = useState(false);
  const [removeProblem, setRemoveProblem] = useState("");
  const list = useRef<HTMLUListElement>(null);
  const keepFocus = useKeepFocus(list);

  const load = useLoad((admin) => admin.testimonials(), setItems);
  const order = useReorder({ items, setItems, send: (ids) => api.orderTestimonials(ids), reload: () => api.testimonials() });

  useEffect(() => () => onUnsaved(false), [onUnsaved]);

  function close() {
    setEditing(null);
    onUnsaved(false);
  }

  function move(id: number, how: Move) {
    if (order.move(id, how)) keepFocus(id, how === "earlier" ? ["earlier", "later"] : ["later", "earlier"]);
  }

  async function remove() {
    if (!removing) return;
    setRemoveBusy(true);
    setRemoveProblem("");
    const result = await api.removeTestimonial(removing.id);
    setRemoveBusy(false);
    if (result.ok) {
      setItems((current) => current.filter((item) => item.id !== removing.id));
      setRemoving(null);
    } else if (result.kind === "logged-out") {
      setRemoving(null);
    } else {
      setRemoveProblem(FAILED);
    }
  }

  if (load.state !== "ready") {
    return (
      <>
        <h2 className="admin-heading">Testimonials</h2>
        <Loading {...load} />
      </>
    );
  }

  return (
    <>
      <h2 className="admin-heading">Testimonials</h2>
      <p className="admin-note">The home page shows the first three.</p>

      {editing === "new" ? (
        <TestimonialForm
          title="Add a testimonial"
          start={{ text: "", name: "" }}
          send={(words) => api.addTestimonial(words)}
          onSaved={(added) => {
            // The server puts a new testimonial last.
            setItems((current) => [...current, added]);
            close();
          }}
          onCancel={close}
          onUnsaved={onUnsaved}
        />
      ) : (
        <div className="admin-row">
          <ComicButton size="large" data-testid="testimonial-add" disabled={editing !== null} onClick={() => setEditing("new")}>
            Add a testimonial
          </ComicButton>
        </div>
      )}

      <Failure text={order.problem} />
      {items.length === 0 ? <p className="admin-quiet">No testimonials yet.</p> : null}

      <ul ref={list} className="admin-testimonials">
        {items.map((item, index) => (
          <li key={item.id} data-testid="testimonial-card" data-id={item.id} className="admin-testimonial">
            {editing === item.id ? (
              <TestimonialForm
                title="Edit this testimonial"
                start={item}
                send={(words) => api.editTestimonial(item.id, words)}
                onSaved={(edited) => {
                  setItems((current) => current.map((other) => (other.id === edited.id ? edited : other)));
                  close();
                }}
                onCancel={close}
                onUnsaved={onUnsaved}
              />
            ) : (
              <>
                <figure className="ink-box bubble">
                  <InkParts radius={22} />
                  <div className="ink-in px-[22px] py-[18px]">
                    <blockquote>"{item.text}"</blockquote>
                    <figcaption className="mt-2 font-bold">{item.name}</figcaption>
                  </div>
                </figure>
                <div className="admin-row">
                  <PlainButton data-testid="testimonial-edit" disabled={editing !== null} onClick={() => setEditing(item.id)}>
                    Edit
                  </PlainButton>
                  <PlainButton data-testid="testimonial-earlier" data-move="earlier" disabled={index === 0} onClick={() => move(item.id, "earlier")}>
                    Move earlier
                  </PlainButton>
                  <PlainButton data-testid="testimonial-later" data-move="later" disabled={index === items.length - 1} onClick={() => move(item.id, "later")}>
                    Move later
                  </PlainButton>
                  <PlainButton
                    data-testid="testimonial-remove"
                    danger
                    onClick={() => {
                      setRemoveProblem("");
                      setRemoving(item);
                    }}
                  >
                    Remove
                  </PlainButton>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <Confirm
        open={removing !== null}
        question="Remove this testimonial from the site?"
        detail="This cannot be undone."
        yes="Remove it"
        yesBusy="Removing…"
        no="Keep it"
        busy={removeBusy}
        problem={removeProblem}
        onYes={remove}
        onNo={() => setRemoving(null)}
      />
    </>
  );
}

interface Words {
  text: string;
  name: string;
}

interface TestimonialFormProps {
  title: string;
  start: Words;
  send: (words: Words) => Promise<Result<Testimonial>>;
  onSaved: (testimonial: Testimonial) => void;
  onCancel: () => void;
  onUnsaved: (unsaved: boolean) => void;
}

// The small form for a new testimonial, and for a change to one.
function TestimonialForm({ title, start, send, onSaved, onCancel, onUnsaved }: TestimonialFormProps) {
  const [text, setText] = useState(start.text);
  const [name, setName] = useState(start.name);
  const [problems, setProblems] = useState<Partial<Words>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const first = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    first.current?.focus();
  }, []);

  const unsaved = text !== start.text || name !== start.name;
  useEffect(() => {
    onUnsaved(unsaved);
  }, [unsaved, onUnsaved]);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const found: Partial<Words> = {};
    if (text.trim() === "") found.text = "Type the customer's words.";
    if (name.trim() === "") found.name = "Type the customer's name.";
    setProblems(found);
    setFailure("");
    if (found.text || found.name) {
      document.getElementById(found.text ? "testimonial-text" : "testimonial-name")?.focus();
      return;
    }
    setBusy(true);
    const result = await send({ text: text.trim(), name: name.trim() });
    setBusy(false);
    if (result.ok) onSaved(result.data);
    else if (result.kind === "field" && (result.field === "text" || result.field === "name")) setProblems({ [result.field]: result.message });
    else if (result.kind !== "logged-out") setFailure(FAILED);
  }

  return (
    <form className="admin-card admin-form" noValidate onSubmit={save}>
      <h3 className="admin-subheading">{title}</h3>
      <Field id="testimonial-text" label="The customer's words" help={`${TEXT_LIMIT} characters at most.`} problem={problems.text} problemTestId="problem-text">
        <Textarea
          ref={first}
          maxLength={TEXT_LIMIT}
          data-testid="testimonial-text"
          {...controlProps("testimonial-text", "help", problems.text)}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setProblems({ ...problems, text: undefined });
          }}
        />
        {text.length >= TEXT_LIMIT - 60 ? (
          <p className="admin-counter">
            {text.length} of {TEXT_LIMIT} characters
          </p>
        ) : null}
      </Field>
      <Field id="testimonial-name" label="The name, as it should show" help='For example, "Christine R."' problem={problems.name} problemTestId="problem-name">
        <Input
          type="text"
          maxLength={NAME_LIMIT}
          autoComplete="off"
          data-testid="testimonial-name"
          {...controlProps("testimonial-name", "help", problems.name)}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setProblems({ ...problems, name: undefined });
          }}
        />
      </Field>
      <div className="admin-row">
        <ComicButton type="submit" data-testid="testimonial-save" disabled={busy}>
          {busy ? "Saving…" : "Save testimonial"}
        </ComicButton>
        <PlainButton disabled={busy} onClick={onCancel}>
          Cancel
        </PlainButton>
      </div>
      <Failure text={failure} />
    </form>
  );
}
