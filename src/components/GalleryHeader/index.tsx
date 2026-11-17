const GalleryHeading = () => {
  return (
    <header className="flex flex-col items-center justify-center p-page">
      <h1 className="text-[clamp(4rem,10vw,10rem)] font-bold text-white uppercase">gallery</h1>
      <h3 className="text-[clamp(1rem,3vw,1.4rem)] font-normal text-primary uppercase">
        a collection of previous work
      </h3>
    </header>
  );
};

export default GalleryHeading;
