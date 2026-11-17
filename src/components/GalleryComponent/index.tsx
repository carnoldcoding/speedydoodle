import { useEffect, useState } from "react";
import { cn } from "cn";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Eye,
  LayoutGrid,
  List,
  Search,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { API_URL } from "@/lib/api";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/lib/gallery";

type ViewMode = "grid" | "list" | "carousel";

type GalleryImage = { url: string };

// The images of one category. The category tells which request they came from.
type LoadedImages = { category: GalleryCategory; urls: string[] };

type GalleryComponentProps = {
  galleryChoice?: GalleryCategory;
};

const VIEW_MODES: { mode: ViewMode; title: string; Icon: LucideIcon }[] = [
  { mode: "grid", title: "Grid view", Icon: LayoutGrid },
  { mode: "list", title: "List view", Icon: List },
  { mode: "carousel", title: "Carousel view", Icon: ArrowLeftRight },
];

const CARD_HOVER =
  "hover:cursor-pointer hover:border-primary hover:shadow-[0_5px_8px_rgba(180,36,1,0.4)]";

// Makes a name from the file name: no extension, spaces for hyphens, each word capitalised.
function formatImageName(url: string): string {
  const filename = (url.split("/").pop() ?? "").split(".")[0];
  return filename
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function isGalleryCategory(value: string): value is GalleryCategory {
  return GALLERY_CATEGORIES.some((category) => category.value === value);
}

export default function GalleryComponent({ galleryChoice = "custom" }: GalleryComponentProps) {
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>(galleryChoice);
  const [loaded, setLoaded] = useState<LoadedImages | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [zoomOpen, setZoomOpen] = useState(false);
  // The address stays set while the dialog closes, so the image does not break during the fade.
  const [zoomSrc, setZoomSrc] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    let ignore = false;
    fetch(`${API_URL}/api/${activeFilter}`)
      .then((response) => response.json())
      .then((images: GalleryImage[]) => {
        if (ignore) return;
        setLoaded({ category: activeFilter, urls: images.map((image) => image.url) });
      });
    return () => {
      ignore = true;
    };
  }, [activeFilter]);

  // Images of a different category are not shown. The loading state shows until the new ones arrive.
  const urls = loaded?.category === activeFilter ? loaded.urls : null;

  const zoom = (src: string) => {
    setZoomSrc(src);
    setZoomOpen(true);
  };

  const renderGalleryContent = () => {
    if (urls === null) {
      return (
        <div
          role="status"
          className="relative mx-auto my-[50px] flex size-[100px] items-center justify-center rounded-full text-white before:absolute before:top-0 before:left-0 before:size-full before:animate-spin before:rounded-full before:bg-[linear-gradient(to_right,transparent_10%,red)] before:content-[''] after:absolute after:inset-1 after:flex after:items-center after:justify-center after:rounded-full after:bg-surface after:content-['loading']"
        />
      );
    }

    if (viewMode === "carousel" && isMobile) {
      return (
        <div className="relative mb-[50px]">
          <Carousel opts={{ loop: true }}>
            <CarouselContent className="relative ml-0 h-[90dvw] w-[90dvw]">
              {urls.map((url, index) => (
                <CarouselItem className="pl-0" key={`${url}-${index}`}>
                  <img
                    alt="mobile-gallery-card"
                    className="size-full max-w-none object-contain"
                    src={url}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <aside className="relative left-1/2 mt-5 flex w-full -translate-x-1/2 items-center justify-center gap-8 p-[10px] tracking-[1px] text-white uppercase backdrop-blur-[3px]">
            <ArrowLeft className="size-6 text-primary" />
            <h1 className="text-[2em] font-bold">swipe</h1>
            <ArrowRight className="size-6 text-primary" />
          </aside>
        </div>
      );
    }

    if (viewMode === "list") {
      return (
        <div className="mx-auto flex max-w-[800px] flex-col gap-4">
          {urls.map((url, index) => (
            <div
              className={cn(
                "group relative flex h-auto w-full items-center gap-6 overflow-hidden rounded-[5px] border border-white bg-[#111] p-4 text-white transition-all duration-200 ease-[ease] hover:translate-x-[5px]",
                CARD_HOVER,
              )}
              data-testid="gallery-image"
              key={`${url}-${index}`}
              onClick={() => zoom(url)}
            >
              <div className="size-20 shrink-0 overflow-hidden rounded-[8px] bg-surface">
                <img alt="thumbnail" className="size-full object-cover" src={url} />
              </div>
              <div className="flex-1 text-left text-[1.1rem] capitalize">
                {formatImageName(url)}
              </div>
              <Eye className="size-6 text-white transition-all duration-200 ease-[ease] group-hover:text-primary" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 mobile:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] mobile:gap-4">
        {urls.map((url, index) => (
          <div
            className={cn(
              "group relative h-[250px] w-full overflow-hidden rounded-[5px] border border-white bg-[#111] text-center text-white transition-all duration-200 ease-[ease] after:pointer-events-none after:absolute after:top-0 after:left-0 after:size-full after:bg-black/40 after:opacity-0 after:transition-all after:duration-200 after:ease-[ease] after:content-[''] hover:-translate-y-[5px] hover:after:opacity-100",
              CARD_HOVER,
            )}
            data-testid="gallery-image"
            key={`${url}-${index}`}
            onClick={() => zoom(url)}
          >
            <img alt="gallery-card" className="size-full object-cover" src={url} />
            <Search className="pointer-events-none absolute top-[10px] right-[10px] z-1 size-8 translate-x-[50px] transition-all duration-200 ease-[ease] group-hover:translate-x-0" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="flex justify-center bg-surface">
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        {/* The content covers the screen. Its 20% black on the 50% overlay gives the old 60%. */}
        <DialogContent
          className="inset-0 flex h-dvh w-dvw max-w-none translate-x-0 translate-y-0 items-center justify-center gap-0 rounded-none border-0 bg-black/20 p-0 shadow-none backdrop-blur-[3px] data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 sm:max-w-none"
          onClick={() => setZoomOpen(false)}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Gallery image</DialogTitle>
          <DialogDescription className="sr-only">
            Click the image or press Escape to close it.
          </DialogDescription>
          <img
            alt="modal"
            className="block h-auto max-h-[90%] w-auto max-w-[90%] cursor-pointer object-contain"
            data-testid="gallery-zoom"
            src={zoomSrc}
          />
        </DialogContent>
      </Dialog>

      <article className="relative w-full max-w-[1250px] p-8 mobile:p-4">
        <header className="sticky top-[100px] z-2 flex flex-wrap items-center justify-between gap-8 bg-surface p-[25px] mobile:relative mobile:top-0">
          <div className="min-w-[200px] flex-1">
            <ul className="flex list-none flex-wrap justify-center gap-8 uppercase mobile:hidden">
              {GALLERY_CATEGORIES.map(({ value, label }) => (
                <li key={value}>
                  <Button
                    className={cn(
                      "relative h-auto cursor-pointer rounded-none p-0 text-base font-normal text-white uppercase after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-all after:duration-200 after:ease-[ease] after:content-[''] hover:no-underline",
                      value === activeFilter && "after:scale-x-100",
                    )}
                    data-testid={`gallery-filter-${value}`}
                    onClick={() => {
                      setActiveFilter(value);
                      window.scrollTo(0, 0);
                    }}
                    variant="link"
                  >
                    {label}
                  </Button>
                </li>
              ))}
            </ul>

            <Select
              onValueChange={(value) => {
                if (isGalleryCategory(value)) setActiveFilter(value);
              }}
              value={activeFilter}
            >
              <SelectTrigger
                aria-label="Gallery category"
                className="hidden w-full max-w-[250px] rounded-none border-white bg-background py-0 pr-3 pl-[10px] text-xs font-light text-white uppercase shadow-none active:border-primary data-[size=default]:h-[45px] data-[state=open]:border-primary mobile:flex dark:bg-background dark:hover:bg-background"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none bg-background">
                {GALLERY_CATEGORIES.map(({ value, label }) => (
                  <SelectItem
                    className="rounded-none text-xs font-light uppercase"
                    key={value}
                    value={value}
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="absolute right-[25px] flex gap-2 mobile:static">
            {VIEW_MODES.map(({ mode, title, Icon }) => {
              // The carousel is a small-screen view only.
              if (mode === "carousel" && !isMobile) return null;
              return (
                <Button
                  aria-label={title}
                  className={cn(
                    "h-[45px] min-w-[45px] cursor-pointer rounded-none border border-white p-3 text-white duration-200 ease-[ease]",
                    viewMode === mode
                      ? "border-primary bg-primary hover:bg-primary"
                      : "bg-background hover:bg-accent",
                  )}
                  data-testid={`gallery-view-${mode}`}
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={title}
                >
                  <Icon className="size-6" />
                </Button>
              );
            })}
          </div>
        </header>

        <div className="mt-[50px]">{renderGalleryContent()}</div>
      </article>
    </section>
  );
}
