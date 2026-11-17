import type { QuoteFormData, UpdateQuoteForm } from "../../types";
import CustomPricingBreakdown from "../CustomPricingBreakdown";
import { ROW } from "../fieldStyles";
import InputField from "../InputField";
import SelectField from "../SelectField";
import TextArea from "../TextArea";

interface CustomProps {
  update: UpdateQuoteForm;
  data: QuoteFormData;
}

const Custom = ({ update, data }: CustomProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div className={ROW}>
        <TextArea
          valToChange="description"
          update={update}
          label="Caricature Request"
        />
      </div>
      <div className={ROW}>
        <SelectField
          valToChange="background"
          update={update}
          label="background"
          options={[
            { display: "None - $0", value: 0 },
            { display: "Simple - $50", value: 50 },
            { display: "Complex - $75", value: 75 },
          ]}
        />
        <InputField
          jsPattern={/^([1-9]|[1-4][0-9]|50)$/}
          htmlPattern={"([1-9]|[1-4][0-9]|50)"}
          title="Enter a number from 1 to 50."
          label={"Number of People"}
          valToChange="personCount"
          update={update}
        />
      </div>
      <div className={ROW}>
        <SelectField
          valToChange="textOption"
          update={update}
          label="Text Display"
          options={[
            { display: "None - $0", value: 0 },
            { display: "Standard - $25", value: 25 },
          ]}
        />
        {Number(data.textOption) === 25 && (
          <InputField
            jsPattern={/^[A-Za-z\s.,!?'"()]+$/u}
            htmlPattern={"^[A-Za-zs.,!?&quot;'()]+$"}
            label={"Text Content"}
            valToChange="textContent"
            update={update}
          />
        )}
      </div>
      <div className={ROW}>
        <CustomPricingBreakdown
          personCount={data.personCount}
          customCost={data.customCost}
          textOption={data.textOption}
          background={data.background}
        />
      </div>
    </div>
  );
};

export default Custom;
