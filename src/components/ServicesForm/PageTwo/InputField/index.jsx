import React, { useState } from "react";
import { InputFieldStyles } from "./styles";

const InputField = ({ jsPattern, htmlPattern, label, valToChange, update, defaultValue }) => {
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
