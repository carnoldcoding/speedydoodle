import { useEffect, useId, useState, type ChangeEvent } from "react";
import axios from "axios";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/api";
import type { UpdateQuoteForm } from "../../types";
import {
  FIELD_BOX,
  FIELD_BOX_FILLED_OR_FOCUSED,
  FIELD_HEIGHT,
  FIELD_LABEL,
  FIELD_LABEL_RAISED_BY_PEER,
  FIELD_WRAPPER,
} from "../fieldStyles";
import ValidityIcon from "../ValidityIcon";

const TYPING_PAUSE_MS = 300;
const MIN_QUERY_LENGTH = 3;

interface Suggestion {
  description: string;
}

interface LocationFieldProps {
  update: UpdateQuoteForm;
  valToChange: "location";
  initialValue: string;
}

const LocationField = ({
  update,
  valToChange,
  initialValue,
}: LocationFieldProps) => {
  const id = useId();
  const [query, setQuery] = useState(initialValue || "");
  const [locations, setLocations] = useState<Suggestion[]>([]);
  const [isValid, setIsValid] = useState(!!initialValue);
  const [distanceFailed, setDistanceFailed] = useState(false);

  async function handleSelect(text: string) {
    setQuery(text);
    setLocations([]);
    update(valToChange, text);
    setIsValid(true);
    setDistanceFailed(false);

    // The distance is for the price estimate on this page. The server
    // calculates the final price again when the quote is sent.
    try {
      const response = await axios.get<{ distance: string }>(
        `${API_URL}/api/calculate-distance`,
        { params: { userLocation: text } }
      );
      const distance = response.data.distance;
      update("distance", distance);
      update(
        "totalDistance",
        Number(distance.replace(/,/g, "").split(" ")[0]) * 2
      );
    } catch (error) {
      console.error(error);
      // Without a distance there is no travel cost. Remove the travel cost
      // of an earlier address, and tell the visitor.
      update("distance", 0);
      update("totalDistance", 0);
      update("gasCost", 0);
      setIsValid(false);
      setDistanceFailed(true);
    }
  }

  // Ask for suggestions only after the visitor stops typing, and only for a
  // query that is long enough to give a useful result. A location that the
  // visitor selected from the list needs no new suggestions.
  useEffect(() => {
    const value = query.trim();
    if (isValid || value.length < MIN_QUERY_LENGTH) {
      setLocations([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const response = await axios.get<{ suggestions: Suggestion[] }>(
          `${API_URL}/api/autocomplete`,
          { params: { query: value } }
        );
        if (!cancelled) setLocations(response.data.suggestions);
      } catch (error) {
        console.error(error);
      }
    }, TYPING_PAUSE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, isValid]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setIsValid(false);
    setDistanceFailed(false);
  }

  return (
    <article className={FIELD_WRAPPER}>
      <Input
        id={id}
        name="location"
        type="text"
        value={query}
        onChange={handleChange}
        placeholder=" "
        required
        className={cn(
          "peer relative z-0",
          FIELD_BOX,
          FIELD_HEIGHT,
          FIELD_BOX_FILLED_OR_FOCUSED
        )}
      />
      {/* The label rests at the middle of the input, not of the article: the
          article grows when the list or the error message shows. */}
      <Label
        htmlFor={id}
        className={cn(
          FIELD_LABEL,
          "top-[clamp(20px,4vw,25px)]",
          FIELD_LABEL_RAISED_BY_PEER
        )}
      >
        Location
      </Label>
      <ValidityIcon valid={isValid} className="top-[clamp(20px,4vw,25px)]" />
      {locations.length > 0 && (
        <div className="relative z-[1] mt-[-7px] rounded-b-[10px] border-2 border-white border-t-[grey] bg-surface py-[5px] text-[clamp(0.9rem,3vw,1.2rem)] [border-top-style:dashed]">
          {locations.map((location, key) => (
            <Button
              key={key}
              type="button"
              variant="ghost"
              data-testid="location-suggestion"
              onClick={() => handleSelect(location.description)}
              className="block h-auto w-full cursor-pointer rounded-none p-[10px] text-left text-[length:inherit] leading-[normal] font-normal whitespace-normal hover:bg-[#111] hover:text-primary dark:hover:bg-[#111]"
            >
              {location.description}
            </Button>
          ))}
        </div>
      )}
      {distanceFailed && (
        <p
          data-testid="distance-error"
          role="alert"
          className="mt-2 text-site-xs leading-[1.4] text-destructive"
        >
          We could not calculate the travel cost for this address. Choose a
          different address.
        </p>
      )}
    </article>
  );
};

export default LocationField;
