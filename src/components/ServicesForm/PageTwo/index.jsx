import React from "react";
import { PageTwoStyles } from "./styles";
import Live from "./Live";
import InputField from "./InputField";
import Custom from "./Custom";
import LogoIllustration from "./LogoIllustration";
const PageTwo = ({ data, type, update }) => {
  function renderSwitch(type) {
    switch (type) {
      default:
        return "its not working";
      case "live":
        return <Live update={update} data={data} />;
      case "custom":
        return <Custom update={update} data={data} />;
      case "lni":
        return <LogoIllustration update={update} data={data} />;
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
            valToChange="firstName"
            update={update}
          />
          <InputField
            jsPattern={/^[A-Za-z]+$/}
            htmlPattern={"[A-Za-z]+"}
            label={"Last Name"}
            valToChange="lastName"
            update={update}
          />
        </div>
        <div className="row">
          <InputField
            jsPattern={/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/}
            htmlPattern={"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}"}
            label={"Email"}
            valToChange="email"
            update={update}
          />
        </div>
        {renderSwitch(type)}
      </div>
    </PageTwoStyles>
  );
};

export default PageTwo;
