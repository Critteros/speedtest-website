import { createLogScale, inCSUnits, throughput } from './utils';

describe('utils', () => {
  it('inCSUnits', () => {
    expect(inCSUnits(1, 'B')).toEqual(1);
    expect(inCSUnits(7, 'KB')).toEqual(7 * 1024);
    expect(inCSUnits(30, 'MB')).toEqual(30 * 1024 * 1024);
    expect(inCSUnits(1, 'GB')).toEqual(1024 * 1024 * 1024);
  });

  it('throughput', () => {
    expect(throughput(inCSUnits(1, 'MB'), 1)).toEqual(1000 * 8);
    expect(throughput(inCSUnits(1, 'MB'), 100)).toEqual(10 * 8);
  });

  it('createLogScale', () => {
    const min = 0,
      max = 1000;
    const callback = createLogScale(min, max);
    expect(callback(-20)).toEqual(0);
    expect(callback(121212)).toEqual(1);
  });
});
