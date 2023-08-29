import React from "react";
import { ConfirmationStyles } from "./styles";

const Confirmation = ({ data }) => {
  return (
    <ConfirmationStyles>
      <header>
        <h1>thank you!</h1>
        <h2>for your order</h2>
        <h3>expect a response within the next week</h3>
      </header>
      <div className="line"></div>
      <article>
        <h1>order summary</h1>
      </article>
    </ConfirmationStyles>
  );
};

export default Confirmation;
