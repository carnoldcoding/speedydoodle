import React from "react";
import ServicesHeader from "../components/ServicesHeader";
import ServicesForm from "../components/ServicesForm";
import { useEffect } from "react";

const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <ServicesHeader />
      <ServicesForm />
    </>
  );
};

export default Services;
