import TextArea from "../PageTwo/TextArea";
import type { UpdateQuoteForm } from "../types";

const Details = ({ update }: { update: UpdateQuoteForm }) => {
  return (
    <article className="mt-5 flex w-full flex-col gap-[50px] bg-surface p-[50px] shadow-[0px_5px_8px_rgba(0,0,0,0.25)] max-[400px]:px-[15px] max-[400px]:py-[30px]">
      <h1 className="text-[clamp(1.25rem,3vw,2rem)] font-light">
        Please provide any additional information that would enhance the clarity
        of your request.
      </h1>
      <TextArea
        update={update}
        label="Additional Details"
        valToChange="additionalInfo"
      />
    </article>
  );
};

export default Details;
