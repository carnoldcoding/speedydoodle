import React from "react";
import { TextAreaStyles } from "./styles";

const TextArea = ({ label, valToChange, update }) => {
  function validate(e) {
    const valid = Array.from(e.target.parentElement.children).filter(
      (child) => child.id === "valid"
    )[0];
    const invalid = Array.from(e.target.parentElement.children).filter(
      (child) => child.id === "invalid"
    )[0];

    if (e.target.value !== "") {
      valid.style.display = "block";
      invalid.style.display = "none";
    } else {
      invalid.style.display = "block";
      valid.style.display = "none";
    }
  }

  return (
    <TextAreaStyles>
      <textarea
        onChange={(e) => {
          validate(e);
        }}
        onKeyUp={(e) => {
          update(valToChange, e.target.value);
        }}
        placeholder=" "
        required
      />
      <label htmlFor="">{label}</label>
      <ion-icon id="valid" name="checkmark-circle-outline"></ion-icon>
      <ion-icon id="invalid" name="close-circle-outline"></ion-icon>
    </TextAreaStyles>
  );
};

export default TextArea;
