import splash from "@/assets/splash.png";

const Spotlight = () => {
  return (
    <section className="relative flex h-[400px] items-end justify-center gap-8 overflow-hidden mobile:flex-col-reverse mobile:items-center mobile:justify-start">
      <img alt="Michael Arnold" src={splash} className="h-auto w-[clamp(400px,45vw,550px)] max-w-none" />
      <article className="flex flex-col items-center self-center">
        <h1 className="text-[clamp(2rem,3vw,3.05rem)] font-bold text-white uppercase">speedydoodle</h1>
        <h2 className="w-full bg-primary px-[10px] text-center text-[clamp(0.9rem,1.3vw,1.2rem)] font-bold tracking-[10px] text-white uppercase">
          studios
        </h2>
        <p className="mt-[5px] text-white">South Jersey &bull; Philadelphia &bull; Delaware</p>
      </article>
    </section>
  );
};

export default Spotlight;
