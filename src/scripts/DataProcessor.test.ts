import { ALPHABET } from "common/constants/Constants";
import { Config } from "common/types/Types";

import DataProcessorForRange from "./DataProcessorForRange";
import DataProcessorForSet from "./DataProcessorForSet";
import DataProcessorFactory from "./DataProcessorFactory";
import Generator from "./Generator";
import MathModule from "./MathModule";

const mm = new MathModule();

const initDataProcessor = (config: Partial<Config>, extraConfigProperties: object = {}) => {
  return DataProcessorFactory(Object.assign({}, config, extraConfigProperties));
}

function isValidPercentageAmount(dp: DataProcessorForSet | DataProcessorForRange): boolean {
  const { intervals } = dp.getScaleState();
  let percentSum = 0;
  intervals.forEach((interval) => percentSum = mm.add(percentSum, interval.percent));
  return percentSum === 100;
}

function getPointValues(dp: DataProcessorForSet | DataProcessorForRange): number[] {
  const { points } = dp.getScaleState();
  return points.map((point) => point.value);
}

function testMovePoint(args: Array<[offset: number, index: number, targetValue: number]>, dp: DataProcessorForRange | DataProcessorForSet): void {
  args.forEach(([offset, index, targetValue]) => {
    expect(dp.movePoint(offset, index)).toBeTruthy();
    expect(dp.getPointState(index).value).toStrictEqual(targetValue);
  });
}

describe("Testing set type configuration:\n", () => {
  const config = {
    type: "set",
    set: [...ALPHABET],
    values: [10, 20],
    min: 0,
    max: ALPHABET.length - 1,
    step: 1,
  };

  describe("Testing the 'setPoint' method:\n", () => {
    const dp = initDataProcessor(config, {});

    afterEach(() => {
      dp.setPoints(config.values);
    });

    it("Should return false for inappropriate index", () => {
      expect(dp.setPoint(20, 3)).toBeFalsy();
      expect(dp.setPoint(10, -1)).toBeFalsy();
    });

    it("Should return true for appropriate index", () => {
      const appropriateIndex = Generator.getRandomInt(0, dp.lastPointIndex);
      const value = dp.getPointState(appropriateIndex).value;
      expect(dp.setPoint(value, appropriateIndex)).toBeTruthy();
    });

    it("Should return false if value don't match point boundaries", () => {
      [
        [-1, 0],
        [11, 0],
        [9, 1],
        [ALPHABET.length, 1],
      ].forEach(([val, i]) => {
        expect(dp.setPoint(val, i)).toBeFalsy;
      });
    });

    it("Should return true if value match point boundaries", () => {
      [
        [20, 0],
        [10, 0],
        [0, 0],
        [ALPHABET.length - 1, 1],
        [15, 1],
        [0, 1],
      ].forEach(([val, i]) => {
        expect(dp.setPoint(val, i)).toBeTruthy();
        expect(isValidPercentageAmount(dp)).toBeTruthy();
      });
    });

    it("Should return false if value not integer", () => {
      expect(dp.setPoint(1.1, 0)).toBeFalsy();
    });
  });

  describe("Testing the 'movePoint' method:\n", () => {
    const dp = initDataProcessor(config, {});

    afterEach(() => {
      dp.setPoints(config.values);
    });

    it("Should return false for inappropriate index", () => {
      expect(dp.movePoint(5, -1)).toBeFalsy();
    });

    it("Should return true for appropriate index and change point value", () => {
      testMovePoint([
        [-10, 0, 0],
        [-20, 1, 0],
        [ALPHABET.length - 1, 1, 25],
        [ALPHABET.length - 1, 0, 25],
      ], dp);
    });

    it("Should take negative offset", () => {
      expect(dp.movePoint(-5, 0)).toBeTruthy();
      expect(dp.getPointState(0).value).toStrictEqual(5);
    });

    it("Should take non-integer offset", () => {
      testMovePoint([
        [-5.1, 0, 5],
        [5.1, 0, 10],
        [5.5, 0, 16],
      ], dp);
    });

    it("Should return false if offset is insignificant (less then 0.5 of step value)", () => {
      expect(dp.movePoint(0, 0)).toBeFalsy();
      expect(dp.movePoint(0.4, 0)).toBeFalsy();
      expect(dp.movePoint(0.5, 0)).toBeTruthy();
    });

    it("If offset don't match borders, should return true and shift to the largest correct value", () => {
      const tooLargeOffset = Generator.getRandomInt(ALPHABET.length + 1, ALPHABET.length + 100);
      testMovePoint([
        [tooLargeOffset, 0, 20],
        [tooLargeOffset, 1, 25],
        [-tooLargeOffset, 1, 20],
      ], dp);

      dp.setPoints(config.values);
      dp.setStep(4);
      testMovePoint([
        [tooLargeOffset, 0, 18],
        [tooLargeOffset, 1, 24],
        [-tooLargeOffset, 1, 20],
      ], dp);

      dp.setStep(config.step);
    });
  });

  describe("Testing the 'addPoint' method:\n", () => {
    const values = [5, 10, 15];
    let dp = initDataProcessor(config, { values });

    afterEach(() => {
      dp = initDataProcessor(config, { values });
    });

    it("Should return false if index incorrect", () => {
      expect(dp.addPoint(0, -1)).toBeFalsy();
      expect(dp.addPoint(ALPHABET.length - 1, 15)).toBeFalsy();
    });

    it("Should return false if value isn't within the borders", () => {
      [
        [-1, 0],
        [6, 0],
        [4, 1],
        [11, 1],
        [9, 2],
        [16, 2],
        [14, 3],
        [26, 3],
      ].forEach(([value, index]) => {
        expect(dp.addPoint(value, index)).toBeFalsy();
      });
    });

    it("Should return true if index correct and value is within borders", () => {
      [
        [0, 0],
        [25, 4],
        [12, 3],
      ].forEach(([value, index]) => {
        expect(dp.addPoint(value, index)).toBeTruthy();
      });
      expect(getPointValues(dp)).toEqual([0, 5, 10, 12, 15, 25]);
      expect(isValidPercentageAmount(dp)).toBeTruthy();
    });
  });

  describe("Testing the 'removePoint' method:\n", () => {
    let dp = initDataProcessor(config);

    afterEach(() => {
      dp = initDataProcessor(config);
    });

    it("Should return false if index incorrect", () => {
      expect(dp.removePoint(-1)).toBeFalsy();
      expect(dp.removePoint(2)).toBeFalsy();
    });

    it("Should return true if index correct", () => {
      expect(dp.removePoint(1)).toBeTruthy();
      expect(getPointValues(dp)).toStrictEqual([config.values[0]]);
      expect(isValidPercentageAmount(dp)).toBeTruthy();
    });

    it("Should return false if there is last point", () => {
      expect(dp.removePoint(1)).toBeTruthy();
      expect(dp.removePoint(0)).toBeFalsy();
    });
  });
});

describe("Testing range type configuration:\n", () => {
  const config = {
    type: "range",
    values: [0.1, 0.2, 0.3],
    min: 0,
    max: 1,
    step: 0.001,
  };

  describe("Testing the 'setPoint' method:\n", () => {
    const dp = initDataProcessor(config);

    afterEach(() => {
      dp.setPoints(config.values);
    });

    it("Should return false for inappropriate index", () => {
      expect(dp.setPoint(0, 4)).toBeFalsy();
      expect(dp.setPoint(-1, 0)).toBeFalsy();
    });

    it("Should return true for appropriate index", () => {
      const appropriateIndex = Generator.getRandomInt(0, dp.lastPointIndex);
      const appropriateValue = dp.getPointState(appropriateIndex).value;
      expect(dp.setPoint(appropriateValue, appropriateIndex)).toBeTruthy();
    });

    it("Should return false if value don't match point borders", () => {
      [
        [-0.01, 0],
        [0.21, 0],
        [0.09, 1],
        [0.31, 1],
        [0.19, 2],
        [1.01, 2],
      ].forEach(([val, i]) => {
        expect(dp.setPoint(val, i)).toBeFalsy;
      });
    });

    it("Should return true if value match point borders", () => {
      [
        [0, 0],
        [0.111, 0],
        [0.27, 2],
        [1, 2],
      ].forEach(([val, i]) => {
        expect(dp.setPoint(val, i)).toBeTruthy();
        expect(isValidPercentageAmount(dp)).toBeTruthy();
      });
    });
  });

  describe("Testing the 'movePoint' method", () => {
    const dp = initDataProcessor(config);

    afterEach(() => {
      dp.setPoints(config.values);
    });

    it("Should return false for inappropriate index", () => {
      expect(dp.movePoint(-0.01, 3)).toBeFalsy();
      expect(dp.movePoint(0.01, -1)).toBeFalsy();
    });

    it("Should return true for appropriate index and change point value", () => {
      testMovePoint([
        [0.01, 0, 0.11],
        [0.05, 1, 0.25],
      ], dp);
    });

    it("Should take negative offset", () => {
      testMovePoint([
        [-0.01, 0, 0.09],
        [-0.05, 1, 0.15],
      ], dp);
    });

    it("Should return false if offset is insignificant (less then 0.5 of step value)", () => {
      expect(dp.movePoint(0.0004, 0)).toBeFalsy();
      expect(dp.movePoint(0.0005, 0)).toBeTruthy();
    });

    it("If the offset don't match borders, should return true and shift to the largest suitable value (in steps)", () => {
      testMovePoint([
        [-1, 1, 0.1],
        [-1, 2, 0.1],
      ], dp);

      dp.setPoints(config.values);
      dp.setStep(0.06);
      testMovePoint([
        [-1, 1, 0.14],
        [-1, 2, 0.18],
      ], dp);

      dp.setStep(config.step);
    });
  });
});
