import React from "react";
import { PageTwoStyles } from "./styles";
import Live from "./Live";
import InputField from "./InputField";
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
  return (
    <PageTwoStyles>
      <div className="form-wrapper">
        <div className="row">
          <InputField
            jsPattern={/^[A-Za-z]+$/}
            htmlPattern={"[A-Za-z]+"}
            label={"First Name"}
            update={update}
          />
          <InputField
            jsPattern={/^[A-Za-z]+$/}
            htmlPattern={"[A-Za-z]+"}
            label={"Last Name"}
            update={update}
          />
        </div>
        <div className="row">
          <InputField
            jsPattern={/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/}
            htmlPattern={"[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}"}
            label={"Email"}
            update={update}
          />
        </div>
        {renderSwitch(type)}
      </div>
    </PageTwoStyles>
  );
};

export default PageTwo;
