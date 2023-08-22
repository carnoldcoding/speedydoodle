import React from "react";
import { InputFieldStyles } from "./styles";

const InputField = ({ jsPattern, htmlPattern, label, update }) => {
  function validate(e, pattern) {
    const valid = Array.from(e.target.parentElement.children).filter(
      (child) => child.id === "valid"
    )[0];
    const invalid = Array.from(e.target.parentElement.children).filter(
      (child) => child.id === "invalid"
    )[0];

    if (e.target.value.match(pattern) && e.target.value !== "") {
      valid.style.display = "block";
      invalid.style.display = "none";
    } else {
      invalid.style.display = "block";
      valid.style.display = "none";
    }
  }

  return (
    <InputFieldStyles>
      <input
        onKeyUp={(e) => {
          validate(e, jsPattern);
        }}
        onChange={(e) => {
          update({ firstName: e.target.value });
        }}
        type="text"
        placeholder=" "
        required
        pattern={htmlPattern}
      />
      <label htmlFor="">{label}</label>
      <ion-icon id="valid" name="checkmark-circle-outline"></ion-icon>
      <ion-icon id="invalid" name="close-circle-outline"></ion-icon>
    </InputFieldStyles>
  );
};

export default InputField;
