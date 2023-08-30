import React from "react";
import { LocationFieldStyles } from "./styles";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
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

  useEffect(() => {
    async function fetchDistance() {
      try {
        const response = await axios.get(
          `https://speedydoodle-backend-fcbbc4e86733.herokuapp.com/api/calculate-distance?userLocation=${query}`
        );
        const distance = response.data.distance;
        update("distance", distance);
        update("totalDistance", distance.split(" ")[0] * 2);
      } catch (error) {
        alert(error);
        console.error(error);
      }
    }

    if (selectedLocation) {
      fetchDistance();
    }
  }, [selectedLocation]);

  async function handleChange(e) {
    const value = e.target.value;
    dropdown.current.classList.remove("inactive");
    setQuery(value);
    try {
      const response = await axios.get(
        `https://speedydoodle-backend-fcbbc4e86733.herokuapp.com/api/autocomplete?query=${value}`
      );
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
        {locations.map((location, key) => {
          return <p key={key}>{location.description}</p>;
        })}
      </div>
    </LocationFieldStyles>
  );
};

export default LocationField;
