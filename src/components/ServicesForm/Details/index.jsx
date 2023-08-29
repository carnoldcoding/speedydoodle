import React from "react";
import TextArea from "../PageTwo/TextArea";
import { DetailStyles } from "./styles";

const Details = ({ update }) => {
  return (
    <DetailStyles>
      <h1>
        Please provide any additional information that would enhance the clarity
        of your request.
      </h1>
      <TextArea
        update={update}
        label="Additional Details"
        valToChange="additionalInfo"
      />
    </DetailStyles>
  );
};

export default Details;
