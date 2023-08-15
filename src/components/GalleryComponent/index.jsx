import React from "react";
import { GallerySection } from "./styles";

const GalleryComponent = () => {
  const images = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <GallerySection>
      <article>
        <header>
          <ul>
            <li>caricatures</li>
            <li>logos & icons</li>
            <li>illustrations</li>
          </ul>
          {/* Mobile */}
          <select name="filters" id="filters">
            <option value="caricatures">caricatures</option>
            <option value="lni">logos & icons</option>
            <option value="illustrations">illustrations</option>
          </select>
        </header>
      </article>
    </GallerySection>
  );
};

export default GalleryComponent;
