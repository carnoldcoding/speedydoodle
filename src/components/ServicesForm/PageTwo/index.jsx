import React from "react";
import { PageTwoStyles } from "./styles";
import Live from "./Live";
const PageTwo = ({ data, type, update }) => {
  function renderSwitch(type) {
    switch (type) {
      default:
        return "its not working";
      case "live":
        return <Live {...data} update={update} />;
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

    if (e.target.value.match(pattern) && e.target.value !== "") {
      valid.style.display = "block";
      invalid.style.display = "none";
    } else {
      invalid.style.display = "block";
      valid.style.display = "none";
    }
  }
  return (
    <PageTwoStyles>
      <div className="form-wrapper">
        <div className="row">
          <div className="form-input">
            <input
              onKeyUp={(e) => {
                validate(e, /^[A-Za-z]+$/);
              }}
              onChange={(e) => {
                update({ firstName: e.target.value });
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
          <div className="form-input">
            <input
              onKeyUp={(e) => {
                validate(e, /^[A-Za-z]+$/);
              }}
              onChange={(e) => {
                update({ lastName: e.target.value });
              }}
              type="text"
              placeholder=" "
              required
              pattern="[A-Za-z]+"
            />
            <label htmlFor="">Last Name</label>
            <ion-icon id="valid" name="checkmark-circle-outline"></ion-icon>
            <ion-icon id="invalid" name="close-circle-outline"></ion-icon>
          </div>
        </div>
        <div className="row">
          <div className="form-input">
            <input
              onKeyUp={(e) => {
                validate(e, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
              }}
              onChange={(e) => {
                update({ email: e.target.value });
              }}
              type="text"
              placeholder=" "
              required
              pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}"
            />
            <label htmlFor="">Email</label>
            <ion-icon id="valid" name="checkmark-circle-outline"></ion-icon>
            <ion-icon id="invalid" name="close-circle-outline"></ion-icon>
          </div>
        </div>
        {renderSwitch(type)}
      </div>
    </PageTwoStyles>
  );
};

export default PageTwo;
