import { useState, type ReactElement } from "react";

export function useMultiStepForm(steps: ReactElement[]) {
  const [current, setCurrent] = useState(0);

  function next() {
    setCurrent(current === steps.length - 1 ? current : current + 1);
  }

  function back() {
    setCurrent(current === 0 ? current : current - 1);
  }

  function goTo(index: number) {
    setCurrent(index);
  }

  return {
    current,
    steps,
    next,
    back,
    goTo,
    isFirstStep: current === 0,
    isLastStep: current === steps.length - 1,
    step: steps[current],
  };
}
