import { Car, Pencil } from "lucide-react";
import {
  BreakdownGroup,
  BreakdownIcon,
  BreakdownPanel,
  BreakdownRow,
} from "./Panel";

interface PricingBreakdownProps {
  eventTotal: number;
  distanceTotal: number;
  gasTotal: number;
  timeTotal: number;
  total: number;
}

const PricingBreakdown = ({
  eventTotal,
  distanceTotal,
  gasTotal,
  timeTotal,
  total,
}: PricingBreakdownProps) => {
  return (
    <BreakdownPanel total={total}>
      <BreakdownGroup>
        <BreakdownIcon
          percent={total ? `${Math.floor((gasTotal / total) * 100)}%` : "0%"}
        >
          <Car aria-hidden />
        </BreakdownIcon>
        <BreakdownRow value={distanceTotal} label="miles" />
        <BreakdownRow value="$" label={Number(gasTotal).toFixed(2)} />
      </BreakdownGroup>

      <BreakdownGroup>
        <BreakdownIcon
          percent={total ? `${Math.floor((eventTotal / total) * 100)}%` : "0%"}
        >
          <Pencil aria-hidden />
        </BreakdownIcon>
        <BreakdownRow value={Math.floor(timeTotal * 12)} label="caricatures" />
        <BreakdownRow value={timeTotal} label="hours" />
        <BreakdownRow value="$" label={Number(eventTotal).toFixed(2)} />
      </BreakdownGroup>
    </BreakdownPanel>
  );
};

export default PricingBreakdown;
