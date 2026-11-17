import React from "react";
import { LocationFieldStyles } from "./styles";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = "https://api.speedydoodle.com";
const TYPING_PAUSE_MS = 300;
const MIN_QUERY_LENGTH = 3;

const LocationField = ({ update, valToChange }) => {
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const dropdown = useRef();

  async function handleClick(e) {
    setQuery(e.target.textContent);
    setSelectedLocation(e.target.textContent);
    dropdown.current.classList.add("inactive");
    update(valToChange, e.target.textContent);
  }

  // The distance is for the price estimate on this page. The server
  // calculates the final price again when the quote is sent.
  useEffect(() => {
    async function fetchDistance() {
      try {
        const response = await axios.get(`${API_URL}/api/calculate-distance`, {
          params: { userLocation: selectedLocation },
        });
        const distance = response.data.distance;
        update("distance", distance);
        update("totalDistance", distance.replace(/,/g, "").split(" ")[0] * 2);
      } catch (error) {
        console.error(error);
      }
    }

    if (selectedLocation) {
      fetchDistance();
    }
  }, [selectedLocation]);

  // Ask for suggestions only after the visitor stops typing, and only for a
  // query that is long enough to give a useful result.
  useEffect(() => {
    const value = query.trim();
    if (value.length < MIN_QUERY_LENGTH || value === selectedLocation) {
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
  }, [query, selectedLocation]);

  function handleChange(e) {
    dropdown.current.classList.remove("inactive");
    setQuery(e.target.value);
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
      <div
        onClick={handleClick}
        ref={dropdown}
        className={locations.length > 0 ? "dropdown" : "dropdown inactive"}
      >
        {locations.map((location, key) => {
          return <p key={key}>{location.description}</p>;
        })}
      </div>
    </LocationFieldStyles>
  );
};

export default LocationField;
