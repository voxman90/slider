import Model from './Model';
import { Configuration } from './Types';
import Observer from './Observer';
import { ALPHABET } from './Constants';

class ObserverMock extends Observer {
  update() {};
}

describe("Testing 'Model' for range type configuration:\n", () => {
  const points: Array<number> = [1, 2.5, 5, 10];
  const config: Partial<Configuration> = {
    type: 'range',
    range: [0, 10],
    step: 2,
    points,
  };
  const model = new Model(config);
  const observer = new ObserverMock();
  const observerUpdateSpy = jest.spyOn(observer, 'update');
  model.attach(observer);

  it("The 'getPointValue' method should return the point value", () => {
    points.forEach((val, i) => {
      expect(model.getPointValue(i)).toStrictEqual(val);
    });
  });

  it("The 'getPointValues' method should return an array of all point values", () => {
    expect(model.getPointValues()).toStrictEqual(points);
  });

  const pointScale = [10, 25, 50, 100];
  it("The 'getPointLocationOnScale' method should return the point value as a percentage", () => {
    points.forEach((_, i) => {
      expect(model.getPointLocationOnScale(i)).toStrictEqual(pointScale[i]);
    });
  });

  it("The 'getPointScale' method should return an array of all points values as a percentage", () => {
    expect(model.getPointScale()).toStrictEqual(pointScale);
  });

  const distances = [1, 1.5, 2.5, 5, 0];
  it("The 'getDistanceToBorders' method should return the distance from point to borders", () => {
    points.forEach((_, i) => {
      expect(model.getDistanceToBorders(i)).toStrictEqual(distances.slice(i, i + 2));
    });
  });

  it("The 'getDistances' method should return all distances between points (include min and max)", () => {
    expect(model.getDistances()).toStrictEqual(distances);
  });

  describe("Testing the 'setPoint' method:\n", () => {
    it("Should return false when point value isn't within the borders", () => {
      expect(model.setPointValue(0, -1)).toBeFalsy();
      expect(model.setPointValue(0, 3)).toBeFalsy();
      expect(model.setPointValue(3, 4)).toBeFalsy();
      expect(model.setPointValue(3, 11)).toBeFalsy();
    });

    it("Should set point and return true when point value is within the borders", () => {
      expect(model.setPointValue(0, 2)).toBeTruthy();
      expect(model.getPointValue(0)).toStrictEqual(2);
      expect(observerUpdateSpy).toBeCalledTimes(1);
      model.resetStateToInitial();
    });
  });

  describe("Testing the 'setPoints' method:\n", () => {
    const incorrectPointValues = [
      [1, 2, 3],
      [1, 9, 8, 10],
      [-1, 0, 5, 10],
      [0, 5, 10, 15],
    ];
    it("Should set correct point values", () => {
      incorrectPointValues.forEach((points) => {
        expect(model.setPoints(points)).toBeFalsy();
      });
      model.resetStateToInitial();
    });

    const correctPointValues = [
      [1, 2, 3, 4],
      [1, 2, 3, 4, 5],
    ];
    it("Should set correct point values and return true", () => {
      correctPointValues.forEach((points) => {
        expect(model.setPoints(points)).toBeTruthy();
      });
      expect(observerUpdateSpy).toBeCalledTimes(2);
      model.resetStateToInitial();
    });
  });

  describe("Testing the 'setMinBorder' method:\n", () => {
    it("Should return false when value not finite", () => {
      expect(model.setMinBorder(-Infinity)).toBeFalsy();
      expect(model.setMinBorder(NaN)).toBeFalsy();
    });

    it("Should return false when value greater than the first point value", () => {
      expect(model.setMinBorder(2.6)).toBeFalsy();
    });

    it("Should return false when value equal to maxBorder value", () => {
      model.setPointValue(2, 10);
      model.setPointValue(1, 10);
      model.setPointValue(0, 10);
      expect(model.setMinBorder(10)).toBeFalsy();
      model.resetStateToInitial();
    });

    it("Should set min border and return true when value is within the borders", () => {
      expect(model.setMinBorder(1)).toBeTruthy();
      expect(model.getMinBorder()).toStrictEqual(1);
      expect(observerUpdateSpy).toBeCalledTimes(1);
      model.resetStateToInitial();
    });
  });

  describe("Testing the 'setMaxBorder' method:\n", () => {
    it("Should return false when value not finite", () => {
      expect(model.setMaxBorder(Infinity)).toBeFalsy();
      expect(model.setMaxBorder(NaN)).toBeFalsy();
    });

    it("Should return false when value equal to minBorder value", () => {
      model.setPointValue(0, 0);
      model.setPointValue(1, 0);
      model.setPointValue(2, 0);
      model.setPointValue(3, 0);
      expect(model.setMaxBorder(0)).toBeFalsy();
      model.resetStateToInitial();
    });

    it("Should set max border and return true when value is within the borders", () => {
      expect(model.setMaxBorder(15)).toBeTruthy();
      expect(model.getMaxBorder()).toStrictEqual(15);
      expect(observerUpdateSpy).toBeCalledTimes(1);
      model.resetStateToInitial();
    });
  });

  describe("Testing the 'setStep' method:\n", () => {
    it("Should return false when value greater than the range length", () => {
      const rangeLength = 10;
      expect(model.setStep(rangeLength + 0.001)).toBeFalsy();
    });

    it("Should return false when value is zero", () => {
      expect(model.setStep(0)).toBeFalsy();
    });

    it("Should return false when value is negative", () => {
      expect(model.setStep(-1)).toBeFalsy();
    });

    it("Should set step and return true when value is within the borders", () => {
      expect(model.setStep(5)).toBeTruthy();
      expect(model.getStep()).toStrictEqual(5);
      expect(observerUpdateSpy).toBeCalledTimes(1);
      model.resetStateToInitial();
    });
  });
});

describe("Testing 'Model' for set type configuration:\n", () => {
  const points = [5, 10, 15];
  const config: Partial<Configuration> = {
    type: 'set',
    set: [...ALPHABET],
    step: 1,
    points,
  };
  const model = new Model(config);
  const observer = new ObserverMock();
  const observerUpdateSpy = jest.spyOn(observer, 'update');
  model.attach(observer);

  it("The 'getPointValue' method should return the point value", () => {
    points.forEach((val, i) => {
      expect(model.getPointValue(i)).toStrictEqual(val);
    });
  });

  it("The 'getPointValues' method should return an array of all point values", () => {
    expect(model.getPointValues()).toStrictEqual(points);
  });

  const pointScale = [20, 40, 60];
  it("The 'getPointLocationOnScale' method should return the point value as a percentage", () => {
    points.forEach((_, i) => {
      expect(model.getPointLocationOnScale(i)).toStrictEqual(pointScale[i]);
    });
  });

  it("The 'getPointScale' method should return an array of all point values as a percentage", () => {
    expect(model.getPointScale()).toStrictEqual(pointScale);
  });

  const distances = [5, 5, 5, 10];
  it("The 'getDistanceToBorders' method should return the distance from point to borders", () => {
    points.forEach((_, i) => {
      expect(model.getDistanceToBorders(i)).toStrictEqual(distances.slice(i, i + 2));
    });
  });

  it("The 'getDistances' method should return all distances between points (include min and max)", () => {
    expect(model.getDistances()).toStrictEqual(distances);
  });

  describe("Testing the 'setPoint' method:\n", () => {
    it("Should return false when point value isn't within the borders", () => {
      expect(model.setPointValue(0, -1)).toBeFalsy();
      expect(model.setPointValue(0, 11)).toBeFalsy();
      expect(model.setPointValue(2, 26)).toBeFalsy();
      expect(model.setPointValue(2, 9)).toBeFalsy();
    });

    it("Should set point and return true when point value is within the borders", () => {
      expect(model.setPointValue(0, 6)).toBeTruthy();
      expect(model.getPointValue(0)).toStrictEqual(6);
      expect(observerUpdateSpy).toBeCalledTimes(1);
      model.resetStateToInitial();
    });

    model.resetStateToInitial();
  });

  describe("Testing the 'setMinBorder' method:\n", () => {
    it("Should return false when value less than the first set index", () => {
      expect(model.setMinBorder(-1)).toBeFalsy();
    });

    it("Should return false when value greater than the first point value", () => {
      expect(model.setMinBorder(6)).toBeFalsy();
    });

    it("Should return false when value equal to maxBorder value", () => {
      model.setPointValue(2, 25);
      model.setPointValue(1, 25);
      model.setPointValue(0, 25);
      expect(model.setMinBorder(25)).toBeFalsy();
      model.resetStateToInitial();
    });

    it("Should set minBorder and return true when value is within the borders", () => {
      expect(model.setMinBorder(5)).toBeTruthy();
      expect(model.getMinBorder()).toStrictEqual(5);
      expect(observerUpdateSpy).toBeCalledTimes(1);
      model.resetStateToInitial();
    });
  });

  describe("Testing the 'setMaxBorder' method:\n", () => {
    it("Should return false when value greater than the last set index", () => {
      expect(model.setMaxBorder(26)).toBeFalsy();
    });

    it("Should return false when value less than the last point value", () => {
      expect(model.setMaxBorder(14)).toBeFalsy();
    });

    it("Should return false when value equal to minBorder value", () => {
      model.setPointValue(0, 0);
      model.setPointValue(1, 0);
      model.setPointValue(2, 0);
      expect(model.setMaxBorder(0)).toBeFalsy();
      model.resetStateToInitial();
    });

    it("Should set minBorder and return true when value is within the borders", () => {
      expect(model.setMaxBorder(20)).toBeTruthy();
      expect(model.getMaxBorder()).toStrictEqual(20);
      expect(observerUpdateSpy).toBeCalledTimes(1);
      model.resetStateToInitial();
    });
  });

  describe("Testing the 'setStep' method:\n", () => {
    it("Should return false when value greater than the number of elements in the set", () => {
      expect(model.setStep(ALPHABET.length)).toBeFalsy();
    });

    it("Should return false when value is zero", () => {
      expect(model.setStep(0)).toBeFalsy();
    });

    it("Should return false when value is negative", () => {
      expect(model.setStep(-1)).toBeFalsy();
    });

    it("Should return false when value not integer", () => {
      expect(model.setStep(1.1)).toBeFalsy();
    });

    it("Should set step and return true when value is within the borders", () => {
      expect(model.setStep(20)).toBeTruthy();
      expect(model.getStep()).toStrictEqual(20);
      expect(observerUpdateSpy).toBeCalledTimes(1);
      model.resetStateToInitial();
    });
  });
});

describe("Testing methods for working with a grid:\n", () => {
  describe("for range:\n", () => {
    const config: Partial<Configuration> = {
      type: 'range',
      range: [0, 1],
      step: 0.1,
      points: [0],
    };
    const model = new Model(config);

    it("if (density <= 0) then 'getPositionGrid' return []", () => {
      const density = -0.1;
      expect(model.getPositionGrid(density)).toStrictEqual([]);
    });

    it("if (density <= 0) then 'getPercentageGrid' return []", () => {
      const density = -0.1;
      expect(model.getPercentageGrid(density)).toStrictEqual([]);
    });

    it("if (density <= 0) then 'getValueGrid' return []", () => {
      const density = -0.1;
      expect(model.getValueGrid(density)).toStrictEqual([]);
    });

    it("Test the 'getValueGrid' and 'getPositionGrid' method", () => {
      [
        { density: 0.5, expectedGrid: [0, 0.5, 1] },
        { density: 0.8, expectedGrid: [0, 0.8, 1] },
        { density: 1 , expectedGrid: [0, 1] },
      ].forEach(({ density, expectedGrid }) => {
        expect(model.getPositionGrid(density)).toStrictEqual(expectedGrid);
        expect(model.getValueGrid(density)).toStrictEqual(expectedGrid);
      });
    });

    it("Test the 'getPercentageGrid' method", () => {
      [
        { density: 0.5, expectedGrid: [0, 50, 100] },
        { density: 0.8, expectedGrid: [0, 80, 100] },
        { density: 1, expectedGrid: [0, 100] },
      ].forEach(({ density, expectedGrid }) => {
        expect(model.getPercentageGrid(density)).toStrictEqual(expectedGrid);
      });
    });
  });

  describe("for set:\n", () => {
    const config: Partial<Configuration> = {
      type: 'set',
      set: [...ALPHABET],
      min: 0,
      max: 25,
      step: 1,
      points: [0],
    };
    const model = new Model(config);

    it("if (density <= 0) OR (density not integer) then 'getPositionGrid' return []", () => {
      [-1, 0, 0.1].forEach((density) => {
        expect(model.getPositionGrid(density)).toStrictEqual([]);
      });
    });

    it("if (density <= 0) OR (density not integer) then 'getPercentageGrid' return []", () => {
      [-1, 0, 0.1].forEach((density) => {
        expect(model.getPercentageGrid(density)).toStrictEqual([]);
      });
    });

    it("if (density <= 0) OR (density not integer) then 'getValueGrid' return []", () => {
      [-1, 0, 0.1].forEach((density) => {
        expect(model.getValueGrid(density)).toStrictEqual([]);
      });
    });

    it("Test the 'getPositionGrid' method", () => {
      [
        { density: 1, expectedGrid: Array(26).fill(null).map((_, i) => i) },
        { density: 10, expectedGrid: [0, 10, 20, 25] },
        { density: 30, expectedGrid: [0, 25] },
      ].forEach(({ density, expectedGrid }) => {
        expect(model.getPositionGrid(density)).toStrictEqual(expectedGrid);
      });
    });

    it("Test the 'getValueGrid' method", () => {
      [
        { density: 1,  expectedGrid: [...ALPHABET] },
        { density: 10, expectedGrid: [ALPHABET[0], ALPHABET[10], ALPHABET[20], ALPHABET[25]] },
        { density: 30, expectedGrid: [ALPHABET[0], ALPHABET[25]] },
      ].forEach(({ density, expectedGrid }) => {
        expect(model.getValueGrid(density)).toStrictEqual(expectedGrid);
      });
    });

    it("Test the 'getPercentageGrid' method", () => {
      [
        { density: 13, expectedGrid: [0, 50, 100] },
        { density: 30, expectedGrid: [0, 100] },
      ].forEach(({ density, expectedGrid }) => {
        expect(model.getPercentageGrid(density)).toStrictEqual(expectedGrid);
      });
    });
  });
});
