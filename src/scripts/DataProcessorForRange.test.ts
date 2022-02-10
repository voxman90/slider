import { Config } from 'common/types/Types';

import DataProcessorForRange from './DataProcessorForRange';
import Generator from './Generator';

const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

describe("Test 'constructor' utility", () => {
  const config = {
    min: 0,
    max: 1,
    range: [0, 1],
    values: [0.5],
    step: 0.1,
  };
  const warnMessage = (err: string) => `The configuration is not valid. Error: ${err}.\nThe default configuration will be applied.`;
  const mockConstructor = (config: Partial<Config>, err: string, extraConfigProperties: object = {}) => {
    try {
      new DataProcessorForRange(Object.assign({}, config, extraConfigProperties));
    } finally {
      expect(consoleWarnMock).toHaveBeenCalledWith(warnMessage(err));
    }

    consoleWarnMock.mockReset();
  };

  it("Should warning when range and min or max is undefined", () => {
    const err = "Range and min or max is undefined";
    mockConstructor(config, err, { range: undefined, min: undefined });
    mockConstructor(config, err, { range: undefined, max: undefined });
  });

  it("Should warning when config.range is not array", () => {
    const err = "Range is not array";
    mockConstructor(config, err, { range: {} });
  });

  it("Should warning when config.range is not pair of numbers", () => {
    const err = "Range is not pair of numbers";
    mockConstructor(config, err, { range: [1, '2'] });
  });

  it("Should warning when config.range is decreasing number sequence", () => {
    const err = "Range is decreasing number sequence";
    mockConstructor(config, err, { range: [2, 1] });
  });

  it("Should warning when initial state is contains a decreasing subsequence", () => {
    const err = "Values is contains a decreasing subsequence";
    mockConstructor(config, err, { values: [0.4, 0.3, 0.5] });
  });
});

describe("Test the functionality of the methods that set the boundaries", () => {
  const config = {
    min: 0,
    max: 100,
    values: [25, 75],
    step: 1,
  };
  let dp = new DataProcessorForRange(config);

  afterEach(() => {
    dp = new DataProcessorForRange(config);
  });

  it("Min boundary should be finite", () => {
    expect(dp.setMinBoundary(-Infinity)).toBeFalsy();
    expect(dp.setMinBoundary(Infinity)).toBeFalsy();
    expect(dp.setMinBoundary(NaN)).toBeFalsy();
  });

  it("Min boundary should be less than or equal to the first point val", () => {
    let val = Generator.getRandomNumber(-1e7, config.values[0]);
    expect(dp.setMinBoundary(val)).toBeTruthy();
    expect(dp.min).toStrictEqual(val);
    val = Generator.getRandomNumber(config.values[0] + 1e-7, 1e7);
    expect(dp.setMinBoundary(val)).toBeFalsy();
  });

  it("Min boundary should be less than max boundary", () => {
    dp.removePoint(1);
    const firstPointValue = config.values[0];
    expect(dp.setMaxBoundary(firstPointValue)).toBeTruthy();
    expect(dp.setMinBoundary(firstPointValue)).toBeFalsy();
    expect(dp.setMaxBoundary(firstPointValue + 1)).toBeTruthy();
    expect(dp.setMinBoundary(firstPointValue)).toBeTruthy();
    expect(dp.setMaxBoundary(firstPointValue)).toBeFalsy();
  });

  it("Max boundary should be finite", () => {
    expect(dp.setMaxBoundary(-Infinity)).toBeFalsy();
    expect(dp.setMaxBoundary(Infinity)).toBeFalsy();
    expect(dp.setMaxBoundary(NaN)).toBeFalsy();
  });

  it("The max boundary should be greater than or equal to the last point val", () => {
    let val = Generator.getRandomNumber(config.values[1], 1e7);
    expect(dp.setMaxBoundary(val)).toBeTruthy();
    expect(dp.max).toStrictEqual(val);
    val = Generator.getRandomNumber(-1e7, config.values[1] - 1e-7);
    expect(dp.setMaxBoundary(val)).toBeFalsy();
  });
});
