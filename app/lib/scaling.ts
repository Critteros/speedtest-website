import { clamp, round } from 'lodash';

export const createLogScale = (minVal: number, maxVal: number) => {
  const minLog = Math.log10(minVal + 1);
  const maxLog = Math.log10(maxVal + 1);
  const range = maxLog - minLog;

  return (value: number) => {
    const valueInRange = clamp(value, minLog, maxVal);
    return round(((Math.log10(valueInRange + 1) - minLog) / range) * 100) / 100;
  };
};
