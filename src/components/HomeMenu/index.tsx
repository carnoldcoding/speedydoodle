import type { MouseEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import books from "@/assets/book.jpg";
import gifts from "@/assets/gifts.png";
import illustrations from "@/assets/illustrations.png";
import logos from "@/assets/logos.png";
import parties from "@/assets/parties.png";
import { Button } from "@/components/ui/button";
import type { GalleryCategory } from "@/lib/gallery";
import { cn } from "cn";

interface HomeMenuProps {
  setGalleryChoice: (category: GalleryCategory) => void;
}

// One tile: a picture with a dark layer over it. The layer gets lighter on hover.
const TILE_CLASS = cn(
  "relative flex min-h-[225px] flex-col bg-cover p-[25px]",
  "after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:bg-black/50 after:backdrop-grayscale-[50%] after:transition-all after:duration-200 after:content-['']",
  "hover:after:bg-black/40 hover:after:backdrop-grayscale-[10%] hover:after:backdrop-opacity-0",
  "mobile:items-center mobile:justify-center"
);

const EXPLORE_CLASS =
  "z-[2] mt-[10px] h-[35px] w-[105px] rounded-none border-2 border-white bg-transparent text-site-xs font-bold tracking-[1.25px] text-white uppercase shadow-none transition-all duration-200 hover:-translate-y-[2.5px] hover:bg-transparent hover:text-white hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)] dark:border-white dark:bg-transparent dark:hover:bg-transparent";

interface TileProps {
  image: string;
  kicker: string;
  title: string;
  className: string;
  children: ReactNode;
}

const Tile = ({ image, kicker, title, className, children }: TileProps) => (
  <div className={cn(TILE_CLASS, className)} style={{ backgroundImage: `url(${image})` }}>
    <h3 className="z-[2] text-site-sm font-light text-white uppercase">{kicker}</h3>
    <h1 className="z-[2] text-site-lg font-bold text-white capitalize">{title}</h1>
    {children}
  </div>
);

const HomeMenu = ({ setGalleryChoice }: HomeMenuProps) => {
  const navigate = useNavigate();

  // Set the gallery first, then go to the gallery page.
  const openGallery = (category: GalleryCategory) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setGalleryChoice(category);
    navigate("/gallery");
  };

  const galleryButton = (category: GalleryCategory) => (
    <Button asChild variant="outline" className={EXPLORE_CLASS}>
      <Link to="/gallery" onClick={openGallery(category)} data-testid={`home-explore-${category}`}>
        explore
      </Link>
    </Button>
  );

  return (
    <section className="flex p-page">
      {/* On a small screen the tiles are one column, in the opposite order. */}
      <article className="grid w-full grid-cols-[repeat(6,minmax(125px,165px))] justify-center gap-6 mobile:flex mobile:flex-col-reverse">
        <Tile
          image={illustrations}
          kicker="humorous"
          title="illustrations"
          className="col-[3/5] row-[1] items-start justify-end"
        >
          {galleryButton("illustrations")}
        </Tile>
        <Tile
          image={logos}
          kicker="for your brand"
          title="logos"
          className="col-[5/7] row-[1] items-start justify-end"
        >
          {galleryButton("logos")}
        </Tile>
        <Tile image={gifts} kicker="custom caricature" title="gifts" className="col-[3/6] row-[2] justify-start">
          {galleryButton("custom")}
        </Tile>
        <Tile image={books} kicker="For Kids" title="Books" className="col-[6/7] row-[2] justify-start bg-center">
          <Button asChild variant="outline" className={EXPLORE_CLASS}>
            <a href="https://speedydoodlestudios.com/" target="_blank" rel="noopener noreferrer">
              explore
            </a>
          </Button>
        </Tile>
        <Tile
          image={parties}
          kicker="party"
          title="caricatures"
          className="col-[1/3] row-[1/3] items-center justify-center bg-center mobile:bg-bottom"
        >
          {galleryButton("party")}
        </Tile>
      </article>
    </section>
  );
};

export default HomeMenu;
