import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GetQuote = () => {
  return (
    <section className="h-[300px] bg-surface p-page">
      <article className="flex h-full flex-col items-center justify-center gap-8">
        <header className="text-center capitalize">
          <h3 className="text-site-sm font-bold text-primary">contact us</h3>
          <h1 className="text-[clamp(1.7rem,3vw,2.4rem)] font-bold text-white">let's work together!</h1>
        </header>
        <Button
          asChild
          className="h-auto rounded-none px-5 py-[10px] text-[clamp(1rem,3vw,1.3rem)] font-bold text-white uppercase hover:bg-[#901d01]"
        >
          <Link to="/services">get quote</Link>
        </Button>
      </article>
    </section>
  );
};

export default GetQuote;
