import React, { useState, useRef } from "react";
import { LocationFieldStyles } from "./styles";
import axios from "axios";

const LocationField = ({ update, valToChange, initialValue }) => {
  const [query, setQuery] = useState(initialValue || "");
  const [locations, setLocations] = useState([]);
  const [isValid, setIsValid] = useState(!!initialValue);
  const dropdown = useRef();

  async function handleClick(e) {
    const text = e.target.textContent;
    setQuery(text);
    dropdown.current.classList.add("inactive");
    update(valToChange, text);
    setIsValid(true);

    try {
      const response = await axios.get(
        `https://api.speedydoodle.com/api/calculate-distance?userLocation=${text}`
      );
      const distance = response.data.distance;
      update("distance", distance);
      update("totalDistance", distance.split(" ")[0] * 2);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleChange(e) {
    const value = e.target.value;
    dropdown.current.classList.remove("inactive");
    setQuery(value);
    setIsValid(false);
    try {
      const response = await axios.get(
        `https://api.speedydoodle.com/api/autocomplete?query=${value}`
      );
      setLocations(response.data.suggestions);
    } catch (error) {
      console.error(error);
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
    </LocationFieldStyles>
  );
};

export default LocationField;
