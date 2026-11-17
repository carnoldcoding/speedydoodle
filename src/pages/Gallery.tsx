import { useEffect } from "react";
import GalleryComponent from "@/components/GalleryComponent";
import GalleryHeading from "@/components/GalleryHeader";
import type { GalleryCategory } from "@/lib/gallery";

interface GalleryProps {
  galleryChoice: GalleryCategory;
}

const Gallery = ({ galleryChoice }: GalleryProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <>
      <GalleryHeading />
      <GalleryComponent galleryChoice={galleryChoice} />
    </>
  );
};

export default Gallery;
