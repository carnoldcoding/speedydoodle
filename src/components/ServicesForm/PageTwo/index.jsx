import React from "react";

const PageTwo = ({ type }) => {
  return <div>{type == "live" ? "its alive" : "its dead"}</div>;
};

export default PageTwo;
