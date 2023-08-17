import React from "react";
import GalleryHeading from "../components/GalleryHeader";
import GalleryComponent from "../components/GalleryComponent";
import { useEffect, useState } from "react";

const Gallery = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((parsedData) => setData(parsedData));
  }, []);

  return (
    <>
      {console.log(data)}
      <GalleryHeading />
      <GalleryComponent />
    </>
  );
};

export default Gallery;
