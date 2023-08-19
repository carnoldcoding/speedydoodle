import React from "react";
import { GetQuoteSection } from "./styles.js";
import { Link } from "react-router-dom";

const GetQuote = () => {
  return (
    <GetQuoteSection>
      <article>
        <header>
          <h3>why wait?</h3>
          <h1>let's work together!</h1>
        </header>
        <Link to="/services">
          <button>get quote</button>
        </Link>
      </article>
    </GetQuoteSection>
  );
};

export default GetQuote;
