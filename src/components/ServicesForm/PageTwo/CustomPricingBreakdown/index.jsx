import React from "react";
import { CustomPricingBreakdownStyles, Icon } from "./styles";

const CustomPricingBreakdown = ({
  personCount,
  personCountCost,
  textOption,
  background,
  customCost,
}) => {
  return (
    <CustomPricingBreakdownStyles>
      <header>
        <h1>pricing breakdown</h1>
      </header>
      <article className="breakdowns">
        <article className="breakdown">
          <Icon percent="100%">
            <ion-icon name="pencil"></ion-icon>
          </Icon>
          <div className="variable">
            <span>$150</span>
            <p>Base</p>
          </div>
          <div className="variable">
            <span>{personCount}</span>
            <p>{personCount == 1 ? "Person" : "People"}</p>
          </div>
          <div className="variable">
            <span>{textOption == 25 ? "With" : "No"}</span>
            <p>Text</p>
          </div>
          <div className="variable">
            <span>
              {background == 50
                ? "Simple"
                : background == 75
                ? "Complex"
                : "No"}
            </span>
            <p>Background</p>
          </div>
        </article>
      </article>

      <article className="total">
        <h3>total</h3>
        <h1>
          <span>$</span>
          {customCost}
        </h1>
      </article>
    </CustomPricingBreakdownStyles>
  );
};

export default CustomPricingBreakdown;
