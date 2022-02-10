import { ALPHABET } from 'common/constants/Constants';
import { Config } from 'common/types/Types';

import DataProcessorForSet from './DataProcessorForSet';
import Generator from './Generator';

const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

describe("Test 'constructor' utility", () => {
  const config = {
    set: [...ALPHABET],
    min: 0,
    max: 25,
    values: [0],
    step: 1,
  };
  const warnMessage = (err: string) => `The configuration is not valid. Error: ${err}.\nThe default configuration will be applied.`;
  const mockConstructor = (config: Partial<Config>, err: string, extraConfigProperties: object = {}) => {
    try {
      new DataProcessorForSet(Object.assign({}, config, extraConfigProperties));
    } finally {
      expect(consoleWarnMock).toHaveBeenCalledWith(warnMessage(err));
    }

    consoleWarnMock.mockReset();
  };

  it("Should warning when config.set is not array", () => {
    const err = "Set is not array";
    mockConstructor(config, err, { set: { length: 1, '0': 0, '1': 1 }});
  });

  it("Should warning when config.set has bottom value", () => {
    const err = "Set has undefined or null-ish values";
    mockConstructor(config, err, { max: 2, set: [1, 2, null] });
  });

  it("Should warning when config.values is contains negative value", () => {
    const err = "Values is contains negative value";
    mockConstructor(config, err, { values: [1, -2, 3] });
  });

  it("Should warning when config.values is contains a decreasing subsequence", () => {
    const err = "Values is contains a decreasing subsequence";
    mockConstructor(config, err, { values: [1, 3, 2] });
  });

  it("Should warning when values is contains a non-integer value", () => {
    const err = "Values is contains non-integer value";
    mockConstructor(config, err, { values: [1, 2, 2.1] });
  });
});

describe("Test the functionality of the methods that set the boundaries", () => {
  const config = {
    set: [...ALPHABET],
    min: 0,
    max: 25,
    values: [10, 20],
    step: 1,
  };
  let dp = new DataProcessorForSet(config);

  afterEach(() => {
    dp = new DataProcessorForSet(config);
  });

  it("Min boundary shouldn't be less than zero", () => {
    expect(dp.setMinBoundary(-1)).toBeFalsy();
  });

  it("Min boundary value should be less than or equal to the first point value", () => {
    let val = Generator.getRandomInt(0, config.values[0]);
    expect(dp.setMinBoundary(val)).toBeTruthy();
    expect(dp.min).toStrictEqual(val);
    val = Generator.getRandomInt(config.values[0], config.max);
    expect(dp.setMinBoundary(val)).toBeFalsy();
  });

  it("Max boundary shouldn't be greater than last index of set", () => {
    expect(dp.setMaxBoundary(config.set.length)).toBeFalsy();
  });

  it("Max boundary should be greater than or equal to the last point index", () => {
    let val = Generator.getRandomInt(0, config.values[1]);
    expect(dp.setMaxBoundary(val)).toBeFalsy();
    val = Generator.getRandomInt(config.values[1], config.set.length - 1);
    expect(dp.setMaxBoundary(val)).toBeTruthy();
    expect(dp.max).toStrictEqual(val);
  });

  it("The min border should be less than the max border", () => {
    dp.removePoint(1);
    expect(dp.setMaxBoundary(config.values[0])).toBeTruthy();
    expect(dp.setMinBoundary(config.values[0])).toBeFalsy();
    expect(dp.setMaxBoundary(config.set.length - 1)).toBeTruthy();
    expect(dp.setMinBoundary(config.values[0])).toBeTruthy();
    expect(dp.setMaxBoundary(config.values[0])).toBeFalsy();
  });
});
