import React from "react";
import { LocationFieldStyles } from "./styles";
import { useState, useRef } from "react";
import axios from "axios";
const LocationField = ({ update, valToChange }) => {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const dropdown = useRef();

  function handleClick(e) {
    setQuery(e.target.textContent);
    dropdown.current.classList.add("inactive");
    console.log(e.target.textContent);
    update(valToChange, e.target.textContent);
  }

  async function handleChange(e) {
    const value = e.target.value;
    dropdown.current.classList.remove("inactive");
    setQuery(value);
    try {
      const response = await axios.get(`/api/autocomplete?query=${value}`);
      const suggestions = response.data.suggestions;
      setLocations(suggestions);
    } catch (error) {
      alert(error);
      console.log(error);
    }
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
        {locations.map((location) => {
          return <p>{location.description}</p>;
        })}
      </div>
    </LocationFieldStyles>
  );
};

export default LocationField;
