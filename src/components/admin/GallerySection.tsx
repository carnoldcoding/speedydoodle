import { useRef, useState, type DragEvent } from "react";
import { ComicButton } from "@/components/ComicButton";
import { Input } from "@/components/ui/input";
import {
  CAPTION_LIMIT,
  CATEGORIES,
  checkPicture,
  FAILED,
  PICTURE_TYPES,
  thumbnail,
  uploadSummary,
  type Category,
  type GalleryItem,
  type Move,
  type Problem,
  type Result,
} from "@/lib/admin-api";
import { useAdmin, useFlash, useKeepFocus, useLoad, useReorder } from "./hooks";
import { Confirm, controlProps, Failure, Field, Loading, PlainButton, Status } from "./parts";

const NAMES: Record<Category, string> = { party: "Party", custom: "Custom", illustrations: "Illustrations", logos: "Logos" };

type Galleries = Record<Category, GalleryItem[]>;

// Why the server did not take a file, as a sentence that names the file.
function uploadProblem(name: string, problem: Problem): string {
  if (problem.kind === "logged-out") return `${name} did not upload, because you were logged out.`;
  if (problem.kind === "field") return `${name} was refused. ${problem.message}`;
  if (problem.status === 413) return `${name} is larger than 25 MB.`;
  return `${name} did not upload. ${problem.message ?? "Check your connection and try again."}`;
}

// The four galleries of the site: upload pictures, write captions, change the order, remove.
export function GallerySection() {
  const { api } = useAdmin();
  const [galleries, setGalleries] = useState<Galleries | null>(null);
  const [category, setCategory] = useState<Category>("party");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [dropping, setDropping] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  // All four galleries load at the start, so each button can show its count.
  const load = useLoad<Galleries>(
    async (admin) => {
      const answers = await Promise.all(CATEGORIES.map((name) => admin.gallery(name)));
      const lists: Partial<Galleries> = {};
      for (const [index, answer] of answers.entries()) {
        if (!answer.ok) return answer;
        lists[CATEGORIES[index]] = answer.data;
      }
      return { ok: true, data: lists as Galleries };
    },
    setGalleries,
  );

  // The files go to the server one after another. One failure does not stop the others.
  async function upload(files: File[]) {
    if (uploading || !galleries || files.length === 0) return;
    const target = category;
    setUploading(true);
    let uploaded = 0;
    const failures: string[] = [];
    let loggedOut = false;
    for (const [index, file] of files.entries()) {
      const refused = checkPicture(file);
      if (refused) {
        failures.push(refused);
        continue;
      }
      if (loggedOut) {
        failures.push(uploadProblem(file.name, { ok: false, kind: "logged-out" }));
        continue;
      }
      setStatus(`Uploading ${index + 1} of ${files.length}…`);
      const result = await api.uploadPicture(target, file);
      if (result.ok) {
        uploaded += 1;
        // The server puts a new picture first in its gallery.
        setGalleries((lists) => (lists ? { ...lists, [target]: [result.data, ...lists[target]] } : lists));
      } else {
        failures.push(uploadProblem(file.name, result));
        loggedOut = result.kind === "logged-out";
      }
    }
    setStatus(uploadSummary(uploaded, failures));
    setUploading(false);
  }

  const hasFiles = (event: DragEvent) => event.dataTransfer.types.includes("Files");

  if (!galleries) {
    return (
      <>
        <h2 className="admin-heading">Gallery</h2>
        <Loading {...load} />
      </>
    );
  }

  return (
    <div
      className={dropping ? "admin-dropping" : undefined}
      onDragOver={(event) => {
        if (!hasFiles(event)) return;
        // Without this, the browser opens a dropped picture in place of the page.
        event.preventDefault();
        setDropping(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropping(false);
      }}
      onDrop={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        setDropping(false);
        void upload(Array.from(event.dataTransfer.files));
      }}
    >
      <h2 className="admin-heading">Gallery</h2>
      <p className="admin-note">Choose a gallery. The first picture is the first one a visitor sees.</p>
      <div className="admin-choices" role="group" aria-label="Which gallery">
        {CATEGORIES.map((name) => (
          <PlainButton key={name} data-testid={`gallery-choice-${name}`} aria-pressed={category === name} onClick={() => setCategory(name)}>
            {NAMES[name]} ({galleries[name].length})
          </PlainButton>
        ))}
      </div>

      <div className="admin-row">
        <ComicButton size="large" disabled={uploading} onClick={() => picker.current?.click()}>
          {uploading ? "Uploading…" : "Upload pictures"}
        </ComicButton>
        {/* The button above opens this file picker. The picker itself is not in view. */}
        <input
          ref={picker}
          type="file"
          accept={PICTURE_TYPES.join(",")}
          multiple
          tabIndex={-1}
          aria-label={`Choose pictures for the ${NAMES[category]} gallery`}
          data-testid="gallery-upload-input"
          className="sr-only"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            // An empty picker lets the same file be chosen a second time.
            event.target.value = "";
            void upload(files);
          }}
        />
      </div>
      <p className="admin-note">JPEG, PNG, WebP, or GIF, up to 25 MB each. You can also drop pictures on this page. New pictures go to the {NAMES[category]} gallery, in first place.</p>
      <Status text={status} testId="gallery-upload-status" />

      <GalleryGrid
        key={category}
        category={category}
        items={galleries[category]}
        update={(change) => setGalleries((lists) => (lists ? { ...lists, [category]: change(lists[category]) } : lists))}
      />
    </div>
  );
}

interface GalleryGridProps {
  category: Category;
  items: GalleryItem[];
  // Change the list. The change gets the newest list, which can hold a picture uploaded a moment ago.
  update: (change: (items: GalleryItem[]) => GalleryItem[]) => void;
}

// The pictures of one gallery, in the order the site shows them.
function GalleryGrid({ category, items, update }: GalleryGridProps) {
  const { api } = useAdmin();
  const grid = useRef<HTMLDivElement>(null);
  const keepFocus = useKeepFocus(grid);
  const order = useReorder({
    items,
    setItems: (list) => update(() => list),
    send: (ids) => api.orderGallery(category, ids),
    reload: () => api.gallery(category),
  });
  const [removing, setRemoving] = useState<GalleryItem | null>(null);
  const [removeBusy, setRemoveBusy] = useState(false);
  const [removeProblem, setRemoveProblem] = useState("");

  function move(id: number, how: Move) {
    // "Move to first" disables itself and "Move earlier", so the focus goes to "Move later".
    if (order.move(id, how)) keepFocus(id, how === "earlier" ? ["earlier", "later"] : how === "later" ? ["later", "earlier"] : ["first", "later"]);
  }

  async function remove() {
    if (!removing) return;
    setRemoveBusy(true);
    setRemoveProblem("");
    const result: Result<void> = await api.removePicture(removing.id);
    setRemoveBusy(false);
    if (result.ok) {
      update((list) => list.filter((item) => item.id !== removing.id));
      setRemoving(null);
    } else if (result.kind === "logged-out") {
      setRemoving(null);
    } else {
      setRemoveProblem(result.kind === "failed" && result.message ? result.message : FAILED);
    }
  }

  return (
    <>
      <Failure text={order.problem} />
      {items.length === 0 ? <p className="admin-quiet">This gallery has no pictures yet.</p> : null}
      <div ref={grid} className="admin-pictures">
        {items.map((item, index) => (
          <PictureCard
            key={item.id}
            item={item}
            first={index === 0}
            last={index === items.length - 1}
            onMove={(how) => move(item.id, how)}
            onRemove={() => {
              setRemoveProblem("");
              setRemoving(item);
            }}
            onChange={(changed) => update((list) => list.map((other) => (other.id === changed.id ? changed : other)))}
          />
        ))}
      </div>
      <Confirm
        open={removing !== null}
        question="Remove this picture from the site?"
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

interface PictureCardProps {
  item: GalleryItem;
  first: boolean;
  last: boolean;
  onMove: (how: Move) => void;
  onRemove: () => void;
  onChange: (item: GalleryItem) => void;
}

function PictureCard({ item, first, last, onMove, onRemove, onChange }: PictureCardProps) {
  const { api } = useAdmin();
  const [caption, setCaption] = useState(item.caption);
  const [problem, setProblem] = useState("");
  const [saved, showSaved] = useFlash();
  const saving = useRef(false);
  const id = `caption-${item.id}`;

  // The caption saves when the field loses the focus, and on Enter.
  async function save() {
    const text = caption.trim();
    if (saving.current || text === item.caption) return;
    saving.current = true;
    setProblem("");
    const result = await api.setCaption(item.id, text);
    saving.current = false;
    if (result.ok) {
      onChange(result.data);
      showSaved("Saved");
    } else if (result.kind === "field") {
      setProblem(result.message);
    } else if (result.kind === "failed") {
      setProblem(FAILED);
    }
  }

  return (
    <article data-testid="gallery-card" data-id={item.id} className="admin-card admin-picture">
      <img src={thumbnail(item.url)} width={item.width} height={item.height} loading="lazy" alt={item.caption || "A picture with no caption"} className="admin-thumb" />
      <Field id={id} label="Caption" problem={problem}>
        <Input
          type="text"
          maxLength={CAPTION_LIMIT}
          enterKeyHint="done"
          data-testid="gallery-caption"
          {...controlProps(id, undefined, problem)}
          value={caption}
          onChange={(event) => {
            setCaption(event.target.value);
            setProblem("");
          }}
          onBlur={save}
          onKeyDown={(event) => {
            if (event.key === "Enter") void save();
          }}
        />
        {caption.length >= CAPTION_LIMIT - 20 ? (
          <p className="admin-counter">
            {caption.length} of {CAPTION_LIMIT} characters
          </p>
        ) : null}
        <Status text={saved} />
      </Field>
      <div className="admin-picture-buttons">
        <PlainButton data-testid="gallery-earlier" data-move="earlier" disabled={first} onClick={() => onMove("earlier")}>
          Move earlier
        </PlainButton>
        <PlainButton data-testid="gallery-later" data-move="later" disabled={last} onClick={() => onMove("later")}>
          Move later
        </PlainButton>
        <PlainButton data-testid="gallery-first" data-move="first" disabled={first} onClick={() => onMove("first")}>
          Move to first
        </PlainButton>
        <PlainButton data-testid="gallery-remove" danger onClick={onRemove}>
          Remove
        </PlainButton>
      </div>
    </article>
  );
}
