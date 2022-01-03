import { Configuration } from './Types';
import DataProcessorForRange from './DataProcessorForRange';
import Generator from './Generator';

const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

describe("Test 'constructor' utility", () => {
  const warnMessage = (err: string) => `The config is not valid. Error: ${err}.\nThe default config will be applied.`;
  const mockTheConstructor = (config: Partial<Configuration>, err: string) => {
    try {
      new DataProcessorForRange(config);
    } finally {
      expect(consoleWarnMock).toHaveBeenCalledWith(warnMessage(err));
    }

    consoleWarnMock.mockReset();
  };

  it("Check warning when config.range is undefined", () => {
    const err = 'config.range is undefined';
    const config = {};

    mockTheConstructor(config, err);
  });

  it("Check warning when config.range is not array", () => {
    const err = 'config.range is not array';
    const config: unknown = {
      range: {
        length: 1,
        '0': 0,
        '1': 1,
      },
    };

    mockTheConstructor(config as Configuration, err);
  });

  it("Check warning when config.range is not pair of numbers", () => {
    const err = 'config.range is not pair of numbers';
    const config: unknown = {
      range: [0, true],
    };

    mockTheConstructor(config as Configuration, err);
  });

  it("Check warning when config.range is decreasing number sequence", () => {
    const err = 'config.range is decreasing number sequence';
    const config: unknown = {
      range: [2, -1],
    };

    mockTheConstructor(config as Configuration, err);
  });

  it("Check warning when initial state is contains a decreasing subsequence", () => {
    const err = 'Initial state is contains a decreasing subsequence';
    const config = {
      points: [-10, 30, 0],
      min: -100,
      max: 100,
    };

    mockTheConstructor(config, err);
  });

  it("Checks that the constructor works without warnings if config is set only by a valid 'range'", () => {
    const config: Partial<Configuration> = {
      range: [-100, 100],
    };

    try {
      new DataProcessorForRange(config);
    } finally {
      expect(consoleWarnMock).not.toHaveBeenCalled();
    }

    consoleWarnMock.mockRestore();
  });
});

describe("Test the functionality of the methods that set the min or max border", () => {
  const dataProcessorInitializer = () => {
    const config: Partial<Configuration> = {
      range: [-100, 100],
      points: [50],
      step: 10,
    };
    return new DataProcessorForRange(config);
  };
  const dp = dataProcessorInitializer();

  it("The min border must be finite", () => {
    expect(dp.setMaxBorder(-Infinity)).toBeFalsy();
    expect(dp.setMaxBorder(Infinity)).toBeFalsy();
    expect(dp.setMaxBorder(NaN)).toBeFalsy();
    expect(dp.min).toStrictEqual(-100);
  });

  it("The min border must be less or equal than the first point", () => {
    const val = Generator.getRandomNumber(-100, 50);
    expect(dp.setMinBorder(val)).toBeTruthy();
    expect(dp.min).toStrictEqual(val);
    dp.resetCurrentStateToInitial();
  });

  it("The min border must be less than max border", () => {
    expect(dp.setPoint(0, 100)).toBeTruthy();
    expect(dp.setMinBorder(100)).toBeFalsy();
    dp.resetCurrentStateToInitial();
  });

  it("The min border can't be greater than the first point", () => {
    const val = Generator.getRandomNumber(50, 99);
    expect(dp.setMinBorder(val)).toBeFalsy();
    expect(dp.min).toStrictEqual(-100);
  });

  it("The max border must be finite", () => {
    expect(dp.setMaxBorder(-Infinity)).toBeFalsy();
    expect(dp.setMaxBorder(Infinity)).toBeFalsy();
    expect(dp.setMaxBorder(NaN)).toBeFalsy();
    expect(dp.max).toStrictEqual(100);
  });

  it("The max border can't be less than the last point", () => {
    const val = Generator.getRandomNumber(-150, 49);
    expect(dp.setMaxBorder(val)).toBeFalsy();
    expect(dp.max).toStrictEqual(100);
  });

  it("The max border must be greater or equal than the last point", () => {
    const val = Generator.getRandomNumber(50, 100);
    expect(dp.setMaxBorder(val)).toBeTruthy();
    expect(dp.max).toStrictEqual(val);
    dp.resetCurrentStateToInitial();
  });

  it("The max border must be greater than the min border", () => {
    expect(dp.setPoint(0, -100)).toBeTruthy();
    expect(dp.setMaxBorder(-100)).toBeFalsy();
    dp.resetCurrentStateToInitial();
  });
});
