import DataProcessorFactory from "./DataProcessorFactory";
import Generator from "./Generator";
import { ALPHABET } from "./Constants";
import { Configuration } from "./Types";

const initDataProcessor = (config: Partial<Configuration>, extraConfigProperties: object = {}) => {
  return DataProcessorFactory(Object.assign(config, extraConfigProperties));
}

describe("Testing set type configuration", () => {
  const config: Partial<Configuration> = {
    type: 'set',
    set: [...ALPHABET],
  };

  describe("Testing the 'setPoint' method", () => {
    const points = [5, 10, 15, 20];
    const dp = initDataProcessor(config, { points });

    it("should return false for inappropriate index", () => {
      expect(dp.setPoint(4, 20)).toBeFalsy();
      expect(dp.setPoint(-1, 5)).toBeFalsy();
    });

    it("should return true for appropriate index", () => {
      const numberOfPoints = dp.numberOfPoints;
      const lastPointIndex = numberOfPoints - 1;
      const appropriateIndex = Generator.getRandomInt(0, lastPointIndex);
      const pointValue = dp.getPointValue(appropriateIndex);
      expect(dp.setPoint(appropriateIndex, pointValue)).toBeTruthy();
      dp.resetCurrentStateToInitial();
    });

    it("should return false if value don't match point borders", () => {
      expect(dp.setPoint(0, -1)).toBeFalsy();
      expect(dp.setPoint(0, 11)).toBeFalsy();
      expect(dp.setPoint(1, 4)).toBeFalsy();
      expect(dp.setPoint(1, 16)).toBeFalsy();
      expect(dp.setPoint(3, 14)).toBeFalsy();
      expect(dp.setPoint(3, 26)).toBeFalsy();
    });

    it("should return true if value match point borders", () => {
      expect(dp.setPoint(0, 5)).toBeTruthy();
      expect(dp.setPoint(0, 2)).toBeTruthy();
      expect(dp.setPoint(0, 0)).toBeTruthy();
      expect(dp.setPoint(1, 0)).toBeTruthy();
      expect(dp.setPoint(1, 15)).toBeTruthy();
      expect(dp.setPoint(3, 16)).toBeTruthy();
      expect(dp.setPoint(3, 25)).toBeTruthy();
      dp.resetCurrentStateToInitial();
    });

    it("should return false if value not integer", () => {
      expect(dp.setPoint(0, 1.1)).toBeFalsy();
    });
  });

  describe("Testing the 'movePoint' method", () => {
    const points = [10, 20];
    const dp = initDataProcessor(config, { points });

    it("should return false for inappropriate index", () => {
      expect(dp.movePoint(2, 1)).toBeFalsy();
      expect(dp.movePoint(-1, 2)).toBeFalsy();
    });

    it("should return true for appropriate index and change point value", () => {
      expect(dp.movePoint(0, 1)).toBeTruthy();
      expect(dp.getPointValue(0)).toStrictEqual(11);
      expect(dp.movePoint(1, 5)).toBeTruthy();
      expect(dp.getPointValue(1)).toStrictEqual(25);
      dp.resetCurrentStateToInitial();
    });

    it("should take negative offset", () => {
      expect(dp.movePoint(0, -5)).toBeTruthy();
      expect(dp.getPointValue(0)).toStrictEqual(5);
      dp.resetCurrentStateToInitial();
    });

    it("should take not integer offset", () => {
      expect(dp.movePoint(0, -5.1)).toBeTruthy();
      expect(dp.getPointValue(0)).toStrictEqual(5);
      expect(dp.movePoint(1, 3.6)).toBeTruthy();
      expect(dp.getPointValue(1)).toStrictEqual(24);
      dp.resetCurrentStateToInitial();
    });

    it("should return false if offset is insignificant (less then 0.5 of step value)", () => {
      expect(dp.movePoint(0, 0.4)).toBeFalsy();
      expect(dp.movePoint(0, 0.5)).toBeTruthy();
      dp.resetCurrentStateToInitial();
    });

    it("if the offset don't match borders, should return true and shift to the largest suitable value (in steps)", () => {
      const tooLargeOffset = Generator.getRandomInt(ALPHABET.length + 1, ALPHABET.length + 100);
      expect(dp.movePoint(0, tooLargeOffset)).toBeTruthy();
      expect(dp.getPointValue(0)).toStrictEqual(20);
      expect(dp.movePoint(1, tooLargeOffset)).toBeTruthy();
      expect(dp.getPointValue(1)).toStrictEqual(25);
      expect(dp.movePoint(1, -tooLargeOffset)).toBeTruthy();
      expect(dp.getPointValue(1)).toStrictEqual(20);
      dp.resetCurrentStateToInitial();

      const dpWithLargeStep = initDataProcessor(config, { step: 4, points });
      expect(dpWithLargeStep.movePoint(0, tooLargeOffset)).toBeTruthy();
      expect(dpWithLargeStep.getPointValue(0)).toStrictEqual(18);
      expect(dpWithLargeStep.movePoint(1, tooLargeOffset)).toBeTruthy();
      expect(dpWithLargeStep.getPointValue(1)).toStrictEqual(24);
    });
  });
});

describe("Testing range type configuration", () => {
  const config: Partial<Configuration> = {
    type: 'range',
  };

  describe("Testing the 'setPoint' method", () => {
    const range = [-1, 1];
    const points = [0.1, 0.2, 0.3];
    const step = 0.1;
    const dp = initDataProcessor(config, { points, range, step });

    it("should return false for inappropriate index", () => {
      expect(dp.setPoint(4, 0)).toBeFalsy();
      expect(dp.setPoint(-1, 0)).toBeFalsy();
    });

    it("should return true for appropriate index", () => {
      const numberOfPoints = dp.numberOfPoints;
      const lastPointIndex = numberOfPoints - 1;
      const appropriateIndex = Generator.getRandomInt(0, lastPointIndex);
      const pointValue = dp.getPointValue(appropriateIndex);
      expect(dp.setPoint(appropriateIndex, pointValue)).toBeTruthy();
      dp.resetCurrentStateToInitial();
    });

    it("should return false if value don't match point borders", () => {
      expect(dp.setPoint(0, -1.01)).toBeFalsy();
      expect(dp.setPoint(1, 0.09)).toBeFalsy();
      expect(dp.setPoint(1, 0.31)).toBeFalsy();
      expect(dp.setPoint(2, 1.01)).toBeFalsy();
    });

    it("should return true if value match point borders", () => {
      expect(dp.setPoint(0, -1)).toBeTruthy();
      expect(dp.setPoint(0, 0.2)).toBeTruthy();
      expect(dp.setPoint(2, 0.2)).toBeTruthy();
      expect(dp.setPoint(2, 1)).toBeTruthy();
      dp.resetCurrentStateToInitial();
    });
  });

  describe("Testing the 'movePoint' method", () => {
    const points = [0, 0.5];
    const range = [0, 1];
    const step = 0.1;
    const dp = initDataProcessor(config, { points, range, step });

    it("should return false for inappropriate index", () => {
      expect(dp.movePoint(2, 0)).toBeFalsy();
      expect(dp.movePoint(-1, 0)).toBeFalsy();
    });

    it("should return true for appropriate index and change point value", () => {
      expect(dp.movePoint(0, 0.5)).toBeTruthy();
      expect(dp.getPointValue(0)).toStrictEqual(0.5);
      expect(dp.movePoint(1, 0.5)).toBeTruthy();
      expect(dp.getPointValue(1)).toStrictEqual(1);
      dp.resetCurrentStateToInitial();
    });

    it("should take negative offset", () => {
      expect(dp.movePoint(1, -0.3)).toBeTruthy();
      expect(dp.getPointValue(1)).toStrictEqual(0.2);
      dp.resetCurrentStateToInitial();
    });

    it("should return false if offset is insignificant (less then 0.5 of step value)", () => {
      expect(dp.movePoint(0, 0.04)).toBeFalsy();
      expect(dp.movePoint(0, 0.05)).toBeTruthy();
      dp.resetCurrentStateToInitial();
    });

    it("if the offset don't match borders, should return true and shift to the largest suitable value (in steps)", () => {
      expect(dp.movePoint(1, 1)).toBeTruthy();
      expect(dp.getPointValue(1)).toStrictEqual(1);
      dp.resetCurrentStateToInitial();

      const dpWithLargeStep = initDataProcessor(config, { step: 0.4, points, range });
      expect(dpWithLargeStep.movePoint(1, 100)).toBeTruthy();
      expect(dpWithLargeStep.getPointValue(1)).toStrictEqual(0.9);
    });
  });
});
