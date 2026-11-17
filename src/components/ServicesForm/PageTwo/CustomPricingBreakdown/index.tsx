import { Pencil } from "lucide-react";
import {
  BreakdownGroup,
  BreakdownIcon,
  BreakdownPanel,
  BreakdownRow,
} from "../../PricingBreakdown/Panel";

interface CustomPricingBreakdownProps {
  personCount: number | string;
  textOption: string;
  background: string;
  customCost: number;
}

const CustomPricingBreakdown = ({
  personCount,
  textOption,
  background,
  customCost,
}: CustomPricingBreakdownProps) => {
  return (
    <BreakdownPanel total={customCost}>
      <BreakdownGroup>
        <BreakdownIcon percent="100%">
          <Pencil aria-hidden />
        </BreakdownIcon>
        <BreakdownRow value="$150" label="Base" />
        <BreakdownRow
          value={personCount}
          label={Number(personCount) === 1 ? "Person" : "People"}
        />
        <BreakdownRow
          value={Number(textOption) === 25 ? "With" : "No"}
          label="Text"
        />
        <BreakdownRow
          value={
            Number(background) === 50
              ? "Simple"
              : Number(background) === 75
                ? "Complex"
                : "No"
          }
          label="Background"
        />
      </BreakdownGroup>
    </BreakdownPanel>
  );
};

export default CustomPricingBreakdown;
