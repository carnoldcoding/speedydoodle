import { useState } from "react";
export function useMultiStepForm(steps) {
  const [current, setCurrent] = useState(0);

  function next() {
    current === steps.length - 1
      ? setCurrent(current)
      : setCurrent(current + 1);
  }

  function back() {
    current === 0 ? setCurrent(current) : setCurrent(current - 1);
  }

  function goTo(index) {
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
