import React from "react";
import { CustomStyles } from "./styles";
import CustomPricingBreakdown from "../CustomPricingBreakdown";
import InputField from "../InputField";
import SelectField from "../SelectField";
import TextArea from "../TextArea";
const Custom = ({ update, data }) => {
  return (
    <CustomStyles>
      {" "}
      <div className="row">
        <TextArea
          valToChange="description"
          update={update}
          label="Caricature Request"
        />
      </div>
      <div className="row">
        <SelectField
          valToChange="background"
          update={update}
          select="background"
          label="background"
          options={[
            { display: "None - $0", value: 0 },
            { display: "Simple - $50", value: 50 },
            { display: "Complex - $75", value: 75 },
          ]}
        />
        <InputField
          jsPattern={/^[0-9]+$/}
          htmlPattern={"^[0-9]+$"}
          label={"Number of People"}
          valToChange="personCount"
          update={update}
        />
      </div>
      <div className="row">
        <SelectField
          valToChange="textOption"
          update={update}
          select="textOption"
          label="Text Display"
          options={[
            { display: "None - $0", value: 0 },
            { display: "Standard - $25", value: 25 },
          ]}
        />
        {data.textOption == 25 && (
          <InputField
            jsPattern={/^[A-Za-z\s.,!?'"()]+$/u}
            htmlPattern={"^[A-Za-zs.,!?&quot;'()]+$"}
            label={"Text Content"}
            valToChange="text"
            update={update}
          />
        )}
      </div>
      <div className="row">
        <CustomPricingBreakdown
          personCount={data.personCount}
          customCost={data.customCost}
          textOption={data.textOption}
        />
      </div>
    </CustomStyles>
  );
};

export default Custom;
