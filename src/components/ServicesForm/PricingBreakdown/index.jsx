import React from "react";
import { PricingBreakdownStyles } from "./styles";

const PricingBreakdown = ({
  eventTotal,
  distanceTotal,
  gasTotal,
  timeTotal,
  total,
}) => {
  return (
    <PricingBreakdownStyles>
      <header>
        <h1>pricing breakdown</h1>
      </header>
      <article className="breakdowns">
        <article className="breakdown">
          <ion-icon name="car-sport"></ion-icon>
          <div className="variable">
            <span>{distanceTotal}</span>
            <p>miles</p>
          </div>
          <div className="variable">
            <span>$</span>
            <p>{gasTotal}</p>
          </div>
        </article>

        <article className="breakdown">
          <ion-icon name="pencil"></ion-icon>
          <div className="variable">
            <span>{Math.floor(timeTotal * 12)}</span>
            <p>caricatures</p>
          </div>
          <div className="variable">
            <span>{timeTotal}</span>
            <p>hours</p>
          </div>
          <div className="variable">
            <span>$</span>
            <p>{eventTotal}</p>
          </div>
        </article>
      </article>

      <article className="total">
        <h3>total</h3>
        <h1>
          <span>$</span>
          {total}
        </h1>
      </article>
    </PricingBreakdownStyles>
  );
};

export default PricingBreakdown;
