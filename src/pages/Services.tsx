import { useEffect } from "react";
import ServicesForm from "@/components/ServicesForm";
import ServicesHeader from "@/components/ServicesHeader";

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
