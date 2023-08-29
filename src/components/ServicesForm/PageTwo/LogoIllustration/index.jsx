import React from "react";
import { LogoIllustrationStyles } from "./styles";
const LogoIllustration = ({ update, data }) => {
  function handleClick(e) {
    update("otherSelection", e.target.value);
  }
  return (
    <LogoIllustrationStyles>
      <article className="logo">
        <input
          onChange={(e) => {
            handleClick(e);
          }}
          type="radio"
          value="logo"
          required
          name="other"
        ></input>

        <div className="lni-wrapper">
          <header>
            <h2>logo</h2>
            <h3>perfect for brands</h3>
            <h1>
              ${data.other[1].price}
              <span>/hr</span>
            </h1>
          </header>
          <div className="line"></div>
          <div className="information">
            <ul>
              <li>
                <ion-icon name="arrow-forward-outline"></ion-icon>25% Deposit to
                begin
              </li>
              <li>
                <ion-icon name="arrow-forward-outline"></ion-icon>25% Deposit on
                approval
              </li>
              <li>
                <ion-icon name="arrow-forward-outline"></ion-icon>50% due for
                file transfer
              </li>
            </ul>
          </div>
        </div>
      </article>

      <article className="logo">
        <input
          onChange={(e) => {
            handleClick(e);
          }}
          type="radio"
          value="illustration"
          required
          name="other"
        ></input>

        <div className="lni-wrapper">
          <header>
            <h2>illustration</h2>
            <h3>pictures with purpose</h3>
            <h1>${data.other[0].price}</h1>
          </header>
          <div className="line"></div>
          <div className="information">
            <ul>
              <li>
                <ion-icon name="arrow-forward-outline"></ion-icon>25% Deposit to
                begin
              </li>
              <li>
                <ion-icon name="arrow-forward-outline"></ion-icon>25% Deposit on
                approval
              </li>
              <li>
                <ion-icon name="arrow-forward-outline"></ion-icon>50% due for
                file transfer
              </li>
            </ul>
          </div>
        </div>
      </article>
    </LogoIllustrationStyles>
  );
};

export default LogoIllustration;
