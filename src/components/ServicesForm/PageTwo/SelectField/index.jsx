import React from "react";
import { SelectFieldStyles } from "./styles";

const SelectField = ({ valToChange, update, select, label, options }) => {
  return (
    <SelectFieldStyles>
      <select
        name={select}
        id={select}
        onChange={(e) => {
          update(valToChange, e.target.value);
        }}
        required
      >
        <option value="" disabled selected hidden></option>
        {options.map((option) => {
          return <option value={option}>{option}</option>;
        })}
      </select>
      <label htmlFor={select}>{label}</label>
      <ion-icon name="chevron-down-circle-outline"></ion-icon>
    </SelectFieldStyles>
  );
};

export default SelectField;
