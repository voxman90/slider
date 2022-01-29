import { ALPHABET } from 'common/constants/Constants';
import { Configuration } from 'common/types/Types';

import Generator from './Generator';
import DataProcessorForSet from './DataProcessorForSet';

const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

describe("Test 'constructor' utility", () => {
  const warnMessage = (err: string) => `The config is not valid. Error: ${err}.\nThe default config will be applied.`;
  const mockTheConstructor = (config: Partial<Configuration>, err: string) => {
    try {
      new DataProcessorForSet(config);
    } finally {
      expect(consoleWarnMock).toHaveBeenCalledWith(warnMessage(err));
    }

    consoleWarnMock.mockReset();
  };

  it("Check warning when config.set is undefined", () => {
    const err = 'config.set is undefined';
    const config = {};

    mockTheConstructor(config, err);
  });

  it("Check warning when config.set is not array", () => {
    const err = 'config.set is not array';
    const config: unknown = {
      set: {
        length: 1,
        '0': 0,
        '1': 1,
      },
    };

    mockTheConstructor(config as Configuration, err);
  });

  it("Check warning when config.set has bottom value", () => {
    const err = 'config.set has undefined or null-ish values';
    const config: unknown = {
      set: [1, 2, null],
    };

    mockTheConstructor(config as Configuration, err);
  });

  it("Check warning when 'points', 'min' or 'max' is contains negative value", () => {
    const err = 'Initial state is contains negative value';
    const config = {
      set: [...ALPHABET],
      points: [1, 2, 3],
      min: -1,
      max: 4,
    };

    mockTheConstructor(config, err);
  });

  it("Check warning when initial state is contains a decreasing subsequence", () => {
    const err = 'Initial state is contains a decreasing subsequence';
    const config = {
      set: [...ALPHABET],
      points: [1, 3, 2],
      min: 0,
      max: 5,
    };

    mockTheConstructor(config, err);
  });

  it("Check warning when initial state is contains a non-integer value", () => {
    const err = 'Initial state is contains non-integer value';
    const config = {
      set: [...ALPHABET],
      points: [1, 2, 2.1],
    };

    mockTheConstructor(config, err);
  });

  it("Checks that the constructor works without warnings if config is set only by a valid 'set'", () => {
    const config = {
      set: [...ALPHABET],
    };

    try {
      new DataProcessorForSet(config);
    } finally {
      expect(consoleWarnMock).not.toHaveBeenCalled();
    }

    consoleWarnMock.mockRestore();
  });
});

describe("Test the functionality of the methods that set the min or max border", () => {
  const dataProcessorInitializer = (points: Array<number>, min: number, max: number) => {
    const config = {
      set: [...ALPHABET],
      points,
      min,
      max,
    };
    return new DataProcessorForSet(config);
  };

  it("The min border cannot be less than zero", () => {
    const dp = dataProcessorInitializer([15], 0, 25);
    expect(dp.setMinBorder(-1)).toBeFalsy();
    expect(dp.minBorder).toStrictEqual(0);
  });

  it("The min border must be less or equal than the first point index", () => {
    const dp = dataProcessorInitializer([15], 0, 25);
    const index = Generator.getRandomInt(0, 15);
    expect(dp.setMinBorder(index)).toBeTruthy();
    expect(dp.minBorder).toStrictEqual(index);
  });

  it("The min border cannot be greater than the first point index", () => {
    const dp = dataProcessorInitializer([15], 0, 25);
    const index = Generator.getRandomInt(16, 25);
    expect(dp.setMinBorder(index)).toBeFalsy();
    expect(dp.minBorder).toStrictEqual(0);
  });

  it("The max border cannot be less than the last point index", () => {
    const dp = dataProcessorInitializer([15, 20], 0, 25);
    const index = Generator.getRandomInt(0, 19);
    expect(dp.setMaxBorder(index)).toBeFalsy();
    expect(dp.maxBorder).toStrictEqual(25);
  });

  it("The max border must be greater or equal than the last point index", () => {
    const dp = dataProcessorInitializer([15, 20], 0, 25);
    const index = Generator.getRandomInt(20, 25);
    expect(dp.setMaxBorder(index)).toBeTruthy();
    expect(dp.maxBorder).toStrictEqual(index);
  });

  it("The min border must be less than the max border", () => {
    const dp = dataProcessorInitializer([15], 0, 25);
    expect(dp.setMaxBorder(15)).toBeTruthy();
    expect(dp.setMinBorder(15)).toBeFalsy();
  });

  it("The max border must be greater than the min border", () => {
    const dp = dataProcessorInitializer([15], 0, 25);
    expect(dp.setMinBorder(15)).toBeTruthy();
    expect(dp.setMaxBorder(15)).toBeFalsy();
  });
});
