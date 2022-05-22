import { clamp, round } from 'lodash';

type UnitsType = 'B' | 'KB' | 'MB' | 'GB';

/**
 * Helper function to return number of bytes from CS unit like 1MB
 * @param count
 * @param unit
 */
export const inCSUnits = (count: number, unit: UnitsType) => {
  switch (unit) {
    case 'B':
      return count;
    case 'KB':
      return count * 1024;
    case 'MB':
      return count * 1024 * 1024;
    case 'GB':
      return count * 1024 * 1024 * 1024;
  }
};

/**
 * Calculates throughput from time that took count bytes to transfer
 * @param count number ob bytes transferred
 * @param timeDelta time that these bytes took to transfer
 */
export const throughput = (count: number, timeDelta: number) => {
  const perSecond = 1000 / timeDelta;
  const bytesPerSecond = count * perSecond;

  return (bytesPerSecond * 8) / (1024 * 1024);
};
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
