import React, { useState } from "react";
import { SelectFieldStyles } from "./styles";

const SelectField = ({ valToChange, update, select, label, options }) => {
  const [isValid, setIsValid] = useState(false);

  return (
    <SelectFieldStyles>
      <select
        name={select}
        id={select}
        onChange={(e) => {
          update(valToChange, e.target.value);
          setIsValid(true);
        }}
        required
      >
        <option value="" disabled selected hidden></option>
        {options.map(({ display, value }) => (
          <option key={value} value={value}>{display}</option>
        ))}
      </select>
      <label htmlFor={select}>{label}</label>
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
    </SelectFieldStyles>
  );
};

export default SelectField;
