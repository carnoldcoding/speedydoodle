import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/api";
import { controlProps, Field } from "./fields";

const TYPING_PAUSE_MS = 300;
const MIN_QUERY_LENGTH = 3;
const HELP = "Start typing the address or the name of the place, then choose it from the list.";

// What the form knows about the address: the text the visitor chose from the list,
// the distance to it, and whether the lookup of the distance failed.
export interface Place {
  chosen: string | null;
  miles: number | null;
  failed: boolean;
}

export const NO_PLACE: Place = { chosen: null, miles: null, failed: false };

// Read `{ suggestions: [{ description }] }` from an answer of the server.
function readSuggestions(data: unknown): string[] {
  if (typeof data !== "object" || data === null || !("suggestions" in data) || !Array.isArray(data.suggestions)) return [];
  return data.suggestions.flatMap((item: unknown) =>
    typeof item === "object" && item !== null && "description" in item && typeof item.description === "string" ? [item.description] : [],
  );
}

interface LocationFieldProps {
  value: string;
  place: Place;
  problem?: string;
  onType: (text: string) => void;
  onChoose: (text: string) => void;
}

// The address of the event. The server suggests places while the visitor types.
export function LocationField({ value, place, problem, onType, onChoose }: LocationFieldProps) {
  const input = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // The list opens only after the visitor types, not when the step opens with an address in it.
  const [typed, setTyped] = useState(false);

  // Ask for suggestions only after the visitor stops typing, and only for a text that is long
  // enough to give a useful result. A place that came from the list needs no new suggestions.
  useEffect(() => {
    const query = value.trim();
    if (!typed || query.length < MIN_QUERY_LENGTH || value === place.chosen) {
      setSuggestions([]);
      return;
    }
    const request = new AbortController();
    const timer = setTimeout(async () => {
      let found: string[] = [];
      try {
        const response = await fetch(`${API_URL}/api/autocomplete?query=${encodeURIComponent(query)}`, { signal: request.signal });
        // Any failure, a rate limit also, shows no list. The visitor can still type the address.
        if (response.ok) found = readSuggestions(await response.json());
      } catch {
        found = [];
      }
      // An answer for an older text is ignored.
      if (!request.signal.aborted) setSuggestions(found);
    }, TYPING_PAUSE_MS);
    return () => {
      clearTimeout(timer);
      request.abort();
    };
  }, [value, typed, place.chosen]);

  const failure = place.failed ? "location-distance" : undefined;
  const control = controlProps("location", HELP, problem);

  return (
    <Field name="location" label="Where is the event?" help={HELP} problem={problem}>
      <Input
        {...control}
        ref={input}
        type="text"
        // The suggestions of the browser would cover the list of places.
        autoComplete="off"
        maxLength={200}
        value={value}
        aria-describedby={[control["aria-describedby"], failure].filter(Boolean).join(" ")}
        onChange={(event) => {
          setTyped(true);
          onType(event.target.value);
        }}
      />
      {suggestions.length > 0 ? (
        <ul className="quote-suggestions" aria-label="Places that match">
          {suggestions.map((description) => (
            <li key={description}>
              <Button
                type="button"
                variant="ghost"
                data-testid="location-suggestion"
                className="quote-suggestion"
                onClick={() => {
                  setSuggestions([]);
                  onChoose(description);
                  // The button goes away, so the focus returns to the field.
                  input.current?.focus();
                }}
              >
                {description}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      {place.failed ? (
        <p id="location-distance" role="alert" data-testid="distance-problem" className="quote-problem">
          Mike can't work out the travel cost for that address. Try a different one.
        </p>
      ) : null}
    </Field>
  );
}
