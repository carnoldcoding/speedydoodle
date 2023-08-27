import React from "react";
import { LocationFieldStyles } from "./styles";
import { useState } from "react";
import axios from "axios";
const LocationField = () => {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([]);

  function handleClick(e) {}

  async function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    try {
      const response = await axios.get(`/api/autocomplete?query=${value}`);
      const suggestions = response.data.suggestions;
      setLocations(suggestions);
      console.log(locations);
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
      <div className={locations.length > 0 ? "dropdown" : "dropdown inactive"}>
        {locations.map((location) => {
          return <p>{location.description}</p>;
        })}
      </div>
    </LocationFieldStyles>
  );
};

export default LocationField;
