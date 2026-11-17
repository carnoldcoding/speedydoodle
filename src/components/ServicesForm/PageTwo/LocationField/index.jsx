import React, { useState, useRef, useEffect } from "react";
import { LocationFieldStyles } from "./styles";
import axios from "axios";

const API_URL = "https://api.speedydoodle.com";
const TYPING_PAUSE_MS = 300;
const MIN_QUERY_LENGTH = 3;

const LocationField = ({ update, valToChange, initialValue }) => {
  const [query, setQuery] = useState(initialValue || "");
  const [locations, setLocations] = useState([]);
  const [isValid, setIsValid] = useState(!!initialValue);
  const [distanceFailed, setDistanceFailed] = useState(false);
  const dropdown = useRef();

  async function handleClick(e) {
    const text = e.target.textContent;
    setQuery(text);
    dropdown.current.classList.add("inactive");
    update(valToChange, text);
    setIsValid(true);
    setDistanceFailed(false);

    // The distance is for the price estimate on this page. The server
    // calculates the final price again when the quote is sent.
    try {
      const response = await axios.get(`${API_URL}/api/calculate-distance`, {
        params: { userLocation: text },
      });
      const distance = response.data.distance;
      update("distance", distance);
      update("totalDistance", distance.replace(/,/g, "").split(" ")[0] * 2);
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
        const response = await axios.get(`${API_URL}/api/autocomplete`, {
          params: { query: value },
        });
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

  function handleChange(e) {
    dropdown.current.classList.remove("inactive");
    setQuery(e.target.value);
    setIsValid(false);
    setDistanceFailed(false);
  }

  return (
    <LocationFieldStyles>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder=" "
        required
      />
      <label htmlFor="">Location</label>
      <ion-icon
        id="valid"
        name="checkmark-circle-outline"
        style={{ display: isValid ? "block" : "none" }}
      ></ion-icon>
      <ion-icon
        id="invalid"
        name="close-circle-outline"
        style={{ display: isValid ? "none" : "block" }}
      ></ion-icon>
      <div
        onClick={handleClick}
        ref={dropdown}
        className={locations.length > 0 ? "dropdown" : "dropdown inactive"}
      >
        {locations.map((location, key) => (
          <p key={key}>{location.description}</p>
        ))}
      </div>
      {distanceFailed && (
        <p className="distance-error" role="alert">
          We could not calculate the travel cost for this address. Choose a
          different address.
        </p>
      )}
    </LocationFieldStyles>
  );
};

export default LocationField;
