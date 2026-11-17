import React, { useState } from "react";
import { InputFieldStyles } from "./styles";

// `title` is the text the browser shows when the value does not match the pattern.
const InputField = ({ jsPattern, htmlPattern, label, valToChange, update, defaultValue, title }) => {
  const [isValid, setIsValid] = useState(() =>
    defaultValue ? jsPattern.test(defaultValue) : false
  );

  return (
    <InputFieldStyles>
      <input
        onChange={(e) => {
          const valid = jsPattern.test(e.target.value) && e.target.value !== "";
          setIsValid(valid);
          update(valToChange, e.target.value);
        }}
        type="text"
        placeholder=" "
        required
        pattern={htmlPattern}
        title={title}
        defaultValue={defaultValue || ""}
      />
      <label htmlFor="">{label}</label>
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
    </InputFieldStyles>
  );
};

export default InputField;
