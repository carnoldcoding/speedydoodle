import type { QuoteFormData, UpdateQuoteForm } from "../types";
import Custom from "./Custom";
import { ROW } from "./fieldStyles";
import InputField from "./InputField";
import Live from "./Live";
import LogoIllustration from "./LogoIllustration";

interface PageTwoProps {
  data: QuoteFormData;
  update: UpdateQuoteForm;
}

const PageTwo = ({ data, update }: PageTwoProps) => {
  function renderSwitch(type: QuoteFormData["type"]) {
    switch (type) {
      default:
        return "its not working";
      case "live":
        return <Live update={update} data={data} />;
      case "custom":
        return <Custom update={update} data={data} />;
      case "lni":
        return <LogoIllustration update={update} data={data} />;
    }
  }
  return (
    <article className="mt-5 flex w-full flex-col items-center justify-center bg-surface px-[15px] py-[50px] shadow-[0px_5px_8px_rgba(0,0,0,0.25)]">
      <div className="flex w-[90%] flex-col gap-[clamp(1.5rem,3vw,2rem)]">
        <div className={ROW}>
          <InputField
            jsPattern={/^[A-Za-z]+$/}
            htmlPattern={"[A-Za-z]+"}
            label={"First Name"}
            valToChange="firstName"
            update={update}
            defaultValue={data.firstName}
          />
          <InputField
            jsPattern={/^[A-Za-z]+$/}
            htmlPattern={"[A-Za-z]+"}
            label={"Last Name"}
            valToChange="lastName"
            update={update}
            defaultValue={data.lastName}
          />
        </div>
        <div className={ROW}>
          <InputField
            jsPattern={/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/}
            htmlPattern={"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}"}
            label={"Email"}
            valToChange="email"
            update={update}
            defaultValue={data.email}
          />
        </div>
        {renderSwitch(data.type)}
      </div>
    </article>
  );
};

export default PageTwo;
