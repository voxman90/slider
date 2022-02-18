import { ALPHABET } from "common/constants/Constants";
import { Config } from "common/types/types";

import ScaleProcessorForRange from "./ScaleProcessorForRange";
import ScaleProcessorForSet from "./ScaleProcessorForSet";
import ScaleProcessorFactory from "./ScaleProcessorFactory";
import Generator from "./Generator";
import MathModule from "./MathModule";

const mm = new MathModule();

const initScaleProcessor = (config: Partial<Config>, extraConfigProperties: object = {}) => {
  return ScaleProcessorFactory(Object.assign({}, config, extraConfigProperties));
}

function isValidPercentageAmount(scale: ScaleProcessorForSet | ScaleProcessorForRange): boolean {
  const { intervals } = scale.getScaleState();
  let percentSum = 0;
  intervals.forEach((interval) => percentSum = mm.add(percentSum, interval.percent));
  return percentSum === 100;
}

function getPointValues(scale: ScaleProcessorForSet | ScaleProcessorForRange): number[] {
  const { points } = scale.getScaleState();
  return points.map((point) => point.value);
}

function testMovePoint(args: Array<[offset: number, index: number, targetValue: number]>, scale: ScaleProcessorForRange | ScaleProcessorForSet): void {
  args.forEach(([offset, index, targetValue]) => {
    expect(scale.movePoint(offset, index)).toBeTruthy();
    expect(scale.getPointState(index).value).toStrictEqual(targetValue);
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
    const scale = initScaleProcessor(config, {});

    afterEach(() => {
      scale.setPoints(config.values);
    });

    it("Should return false for inappropriate index", () => {
      expect(scale.setPoint(20, 3)).toBeFalsy();
      expect(scale.setPoint(10, -1)).toBeFalsy();
    });

    it("Should return true for appropriate index", () => {
      const appropriateIndex = Generator.getRandomInt(0, scale.lastPointIndex);
      const value = scale.getPointState(appropriateIndex).value;
      expect(scale.setPoint(value, appropriateIndex)).toBeTruthy();
    });

    it("Should return false if value don't match point boundaries", () => {
      [
        [-1, 0],
        [11, 0],
        [9, 1],
        [ALPHABET.length, 1],
      ].forEach(([val, i]) => {
        expect(scale.setPoint(val, i)).toBeFalsy;
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
        expect(scale.setPoint(val, i)).toBeTruthy();
        expect(isValidPercentageAmount(scale)).toBeTruthy();
      });
    });

    it("Should return false if value not integer", () => {
      expect(scale.setPoint(1.1, 0)).toBeFalsy();
    });
  });

  describe("Testing the 'movePoint' method:\n", () => {
    const scale = initScaleProcessor(config, {});

    afterEach(() => {
      scale.setPoints(config.values);
    });

    it("Should return false for inappropriate index", () => {
      expect(scale.movePoint(5, -1)).toBeFalsy();
    });

    it("Should return true for appropriate index and change point value", () => {
      testMovePoint([
        [-10, 0, 0],
        [-20, 1, 0],
        [ALPHABET.length - 1, 1, 25],
        [ALPHABET.length - 1, 0, 25],
      ], scale);
    });

    it("Should take negative offset", () => {
      expect(scale.movePoint(-5, 0)).toBeTruthy();
      expect(scale.getPointState(0).value).toStrictEqual(5);
    });

    it("Should take non-integer offset", () => {
      testMovePoint([
        [-5.1, 0, 5],
        [5.1, 0, 10],
        [5.5, 0, 16],
      ], scale);
    });

    it("Should return false if offset is insignificant (less then 0.5 of step value)", () => {
      expect(scale.movePoint(0, 0)).toBeFalsy();
      expect(scale.movePoint(0.4, 0)).toBeFalsy();
      expect(scale.movePoint(0.5, 0)).toBeTruthy();
    });

    it("If offset don't match borders, should return true and shift to the largest correct value", () => {
      const tooLargeOffset = Generator.getRandomInt(ALPHABET.length + 1, ALPHABET.length + 100);
      testMovePoint([
        [tooLargeOffset, 0, 20],
        [tooLargeOffset, 1, 25],
        [-tooLargeOffset, 1, 20],
      ], scale);

      scale.setPoints(config.values);
      scale.setStep(4);
      testMovePoint([
        [tooLargeOffset, 0, 18],
        [tooLargeOffset, 1, 24],
        [-tooLargeOffset, 1, 20],
      ], scale);

      scale.setStep(config.step);
    });
  });

  describe("Testing the 'addPoint' method:\n", () => {
    const values = [5, 10, 15];
    let scale = initScaleProcessor(config, { values });

    afterEach(() => {
      scale = initScaleProcessor(config, { values });
    });

    it("Should return false if index incorrect", () => {
      expect(scale.addPoint(0, -1)).toBeFalsy();
      expect(scale.addPoint(ALPHABET.length - 1, 15)).toBeFalsy();
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
        expect(scale.addPoint(value, index)).toBeFalsy();
      });
    });

    it("Should return true if index correct and value is within borders", () => {
      [
        [0, 0],
        [25, 4],
        [12, 3],
      ].forEach(([value, index]) => {
        expect(scale.addPoint(value, index)).toBeTruthy();
      });
      expect(getPointValues(scale)).toEqual([0, 5, 10, 12, 15, 25]);
      expect(isValidPercentageAmount(scale)).toBeTruthy();
    });
  });

  describe("Testing the 'removePoint' method:\n", () => {
    let scale = initScaleProcessor(config);

    afterEach(() => {
      scale = initScaleProcessor(config);
    });

    it("Should return false if index incorrect", () => {
      expect(scale.removePoint(-1)).toBeFalsy();
      expect(scale.removePoint(2)).toBeFalsy();
    });

    it("Should return true if index correct", () => {
      expect(scale.removePoint(1)).toBeTruthy();
      expect(getPointValues(scale)).toStrictEqual([config.values[0]]);
      expect(isValidPercentageAmount(scale)).toBeTruthy();
    });

    it("Should return false if there is last point", () => {
      expect(scale.removePoint(1)).toBeTruthy();
      expect(scale.removePoint(0)).toBeFalsy();
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
    const scale = initScaleProcessor(config);

    afterEach(() => {
      scale.setPoints(config.values);
    });

    it("Should return false for inappropriate index", () => {
      expect(scale.setPoint(0, 4)).toBeFalsy();
      expect(scale.setPoint(-1, 0)).toBeFalsy();
    });

    it("Should return true for appropriate index", () => {
      const appropriateIndex = Generator.getRandomInt(0, scale.lastPointIndex);
      const appropriateValue = scale.getPointState(appropriateIndex).value;
      expect(scale.setPoint(appropriateValue, appropriateIndex)).toBeTruthy();
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
        expect(scale.setPoint(val, i)).toBeFalsy;
      });
    });

    it("Should return true if value match point borders", () => {
      [
        [0, 0],
        [0.111, 0],
        [0.27, 2],
        [1, 2],
      ].forEach(([val, i]) => {
        expect(scale.setPoint(val, i)).toBeTruthy();
        expect(isValidPercentageAmount(scale)).toBeTruthy();
      });
    });
  });

  describe("Testing the 'movePoint' method", () => {
    const scale = initScaleProcessor(config);

    afterEach(() => {
      scale.setPoints(config.values);
    });

    it("Should return false for inappropriate index", () => {
      expect(scale.movePoint(-0.01, 3)).toBeFalsy();
      expect(scale.movePoint(0.01, -1)).toBeFalsy();
    });

    it("Should return true for appropriate index and change point value", () => {
      testMovePoint([
        [0.01, 0, 0.11],
        [0.05, 1, 0.25],
      ], scale);
    });

    it("Should take negative offset", () => {
      testMovePoint([
        [-0.01, 0, 0.09],
        [-0.05, 1, 0.15],
      ], scale);
    });

    it("Should return false if offset is insignificant (less then 0.5 of step value)", () => {
      expect(scale.movePoint(0.0004, 0)).toBeFalsy();
      expect(scale.movePoint(0.0005, 0)).toBeTruthy();
    });

    it("If the offset don't match borders, should return true and shift to the largest suitable value (in steps)", () => {
      testMovePoint([
        [-1, 1, 0.1],
        [-1, 2, 0.1],
      ], scale);

      scale.setPoints(config.values);
      scale.setStep(0.06);
      testMovePoint([
        [-1, 1, 0.14],
        [-1, 2, 0.18],
      ], scale);

      scale.setStep(config.step);
    });
  });
});
