import React from "react";
import { ConfirmationStyles } from "./styles";

const Confirmation = ({ data }) => {
  const formattedList = [
    {
      label: "name",
      data: `${data.firstName} ${data.lastName}`,
    },
    {
      label: "email",
      data: `${data.email}`,
    },
    { label: "address", data: data.location },
    {
      label: "type",
      data: `${
        data.type == "lni"
          ? "Illustrations and Logos"
          : data.type == "custom"
          ? "Custom Caricatures"
          : (data.type = "live" ? "Event" : "")
      }`,
    },
    { label: "event", data: data.event },
    { label: "details", data: data.additionalInfo },

    {
      label: "description",
      data: data.description,
    },
    {
      label: "Number of People",
      data: data.personCount,
    },
    {
      label: "background",
      data: `${
        data.background == 75
          ? "Complex"
          : data.background == 50
          ? "Simple"
          : ""
      }`,
    },
    {
      label: "text content",
      data: data.textContent,
    },
    { label: "additional details", data: data.extraDetails },
    {
      label: "Date",
      data: `${data.date} | ${data.startTime.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })} - ${data.endTime.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`,
    },
    { label: "Headcount", data: data.headcount },

    {
      label: "price",
      data: `${
        data.type == "lni"
          ? `$${data.otherPrice}`
          : data.type == "custom"
          ? `$${data.customCost}`
          : (data.type = "live" ? `$${data.totalCost}` : "")
      }`,
    },
  ];
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
        {formattedList.map((item) => {
          if (
            item.data !== null &&
            item.data !== undefined &&
            item.data != ""
          ) {
            return (
              <div className="item">
                <span>{item.label}</span>
                <p>{item.data}</p>
              </div>
            );
          }
        })}
      </article>
    </ConfirmationStyles>
  );
};

export default Confirmation;
