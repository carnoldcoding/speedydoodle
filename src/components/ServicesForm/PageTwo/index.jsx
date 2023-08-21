import React from "react";
import { PageTwoStyles } from "./styles";
const PageTwo = ({ type }) => {
  function renderSwitch(type) {
    switch (type) {
      case "live":
        return "its alive";
      case "custom":
        return "customized";
      case "logos":
        return "its a logo";
      case "illustrations":
        return "im an artist";
    }
  }

  function validate(e, pattern) {
    const valid = Array.from(e.target.parentElement.children).filter(
      (child) => child.id === "valid"
    )[0];
    const invalid = Array.from(e.target.parentElement.children).filter(
      (child) => child.id === "invalid"
    )[0];

    if (e.target.value.match(pattern) && e.target.value != "") {
      valid.style.display = "block";
      invalid.style.display = "none";
    } else {
      invalid.style.display = "block";
      valid.style.display = "none";
    }
  }
  return (
    <PageTwoStyles>
      <div className="form-input">
        <input
          onKeyUp={(e) => {
            validate(e, /^([^0-9]*)$/);
          }}
          type="text"
          placeholder=" "
          required
          pattern="[A-Za-z]+"
        />
        <label htmlFor="">First Name</label>
        <ion-icon id="valid" name="checkmark-circle-outline"></ion-icon>
        <ion-icon id="invalid" name="close-circle-outline"></ion-icon>
      </div>
      {renderSwitch(type)}
    </PageTwoStyles>
  );
};

export default PageTwo;
