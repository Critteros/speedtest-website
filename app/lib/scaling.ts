import { clamp, round } from 'lodash';

/**
 * This function return callback that will remap value given value to range 0..1 in logarithmic scale
 * @param minVal min value that will be ever passed to callback
 * @param maxVal max value that will be ever passed to callback
 */
export const createLogScale = (minVal: number, maxVal: number) => {
  const minLog = Math.log10(minVal + 1);
  const maxLog = Math.log10(maxVal + 1);
  const range = maxLog - minLog;

  return (value: number) => {
    const valueInRange = clamp(value, minLog, maxVal);
    return round(((Math.log10(valueInRange + 1) - minLog) / range) * 100) / 100;
  };
};
