import Model from './Model';
import Generator from './Generator';
import { Configuration } from './Types';
import Observer from './Observer';
import { ALPHABET } from './Constants';

class ObserverMock extends Observer {
  update() {};
}

describe("Testing for range type configuration", () => {
  const config: Partial<Configuration> = {
    type: 'range',
    range: [0, 10],
    points: [1, 2.5, 5, 10],
    step: 2,
  };
  const model = new Model(config);
  const observer = new ObserverMock();
  const observerUpdateSpy = jest.spyOn(observer, 'update');
  model.attach(observer);

  it("Should return the point value as a percentage", () => {
    expect(model.getPointLocationOnScale(0)).toStrictEqual(10);
    expect(model.getPointLocationOnScale(1)).toStrictEqual(25);
    expect(model.getPointLocationOnScale(2)).toStrictEqual(50);
    expect(model.getPointLocationOnScale(3)).toStrictEqual(100);
  });

  it("Should return the point value", () => {
    expect(model.getPointValue(0)).toStrictEqual(1);
    expect(model.getPointValue(1)).toStrictEqual(2.5);
    expect(model.getPointValue(2)).toStrictEqual(5);
    expect(model.getPointValue(3)).toStrictEqual(10);
  });

  it("Should return the distance from point to borders", () => {
    expect(model.getDistanceToBorders(0)).toStrictEqual([1, 1.5]);
    expect(model.getDistanceToBorders(1)).toStrictEqual([1.5, 2.5]);
    expect(model.getDistanceToBorders(2)).toStrictEqual([2.5, 5]);
    expect(model.getDistanceToBorders(3)).toStrictEqual([5, 0]);
  });

  it("Should return an array of all points values in percentage", () => {
    expect(model.getPointScale()).toStrictEqual([10, 25, 50, 100]);
  });

  it("Should return an array of all points values", () => {
    expect(model.getPointValues()).toStrictEqual([1, 2.5, 5, 10]);
  });

  it("Should return all distances between points include the min and max border", () => {
    expect(model.getDistances()).toStrictEqual([1, 1.5, 2.5, 5, 0]);
  });

  it("Should set a point when new point value match borders", () => {
    expect(model.setPointValue(0, 2.6)).toBeFalsy();
    expect(model.setPointValue(0, -1)).toBeFalsy();
    expect(model.setPointValue(0, 1.5)).toBeTruthy();
    expect(model.getPointValue(0)).toStrictEqual(1.5);
    expect(model.setPointValue(0, 1)).toBeTruthy();
    expect(model.getPointValue(0)).toStrictEqual(1);
    expect(observerUpdateSpy).toBeCalledTimes(2);
  });

  it("Should set a min border", () => {
    expect(model.setMinBorder(1.1)).toBeFalsy();
    expect(model.setMinBorder(1)).toBeTruthy();
    expect(model.getMinBorder()).toStrictEqual(1);
    expect(model.setMinBorder(0)).toBeTruthy();
    expect(model.getMinBorder()).toStrictEqual(0);
    expect(observerUpdateSpy).toBeCalledTimes(2);
  });

  it("Should set a max border", () => {
    expect(model.setMaxBorder(0.9)).toBeFalsy();
    expect(model.setMaxBorder(20)).toBeTruthy();
    expect(model.getMaxBorder()).toStrictEqual(20);
    expect(model.getPointScale()).toStrictEqual([5, 12.5, 25, 50]);
    expect(model.setMaxBorder(10)).toBeTruthy();
    expect(model.getMaxBorder()).toStrictEqual(10);
    expect(observerUpdateSpy).toBeCalledTimes(2);
  });

  it("Should set a step", () => {
    expect(model.setStep(11)).toBeFalsy();
    expect(model.setStep(10)).toBeTruthy();
    expect(model.getStep()).toStrictEqual(10);
    expect(model.setStep(1)).toBeTruthy();
    expect(model.getStep()).toStrictEqual(1);
    expect(observerUpdateSpy).toBeCalledTimes(2);
  });
});

describe("Testing for set type configuration", () => {
  const config: Partial<Configuration> = {
    type: 'set',
    set: [...ALPHABET],
    points: [5, 10, 15],
    step: 1,
  };
  const model = new Model(config);
  const observer = new ObserverMock();
  const observerUpdateSpy = jest.spyOn(observer, 'update');
  model.attach(observer);

  it("Should return the point value", () => {
    expect(model.getPointValue(0)).toStrictEqual(5);
    expect(model.getPointValue(1)).toStrictEqual(10);
    expect(model.getPointValue(2)).toStrictEqual(15);
  });

  it("Should return an array of all point values", () => {
    expect(model.getPointValues()).toStrictEqual([5, 10, 15]);
  });

  it("Should return the point value as a percentage", () => {
    expect(model.getPointLocationOnScale(0)).toStrictEqual(20);
    expect(model.getPointLocationOnScale(1)).toStrictEqual(40);
    expect(model.getPointLocationOnScale(2)).toStrictEqual(60);
  });

  it("Should return an array of all point values as a percentage", () => {
    expect(model.getPointScale()).toStrictEqual([20, 40, 60]);
  });

  it("Should return the distance from point to borders", () => {
    expect(model.getDistanceToBorders(0)).toStrictEqual([5, 5]);
    expect(model.getDistanceToBorders(1)).toStrictEqual([5, 5]);
    expect(model.getDistanceToBorders(2)).toStrictEqual([5, 10]);
  });

  describe("Testing the 'setPoint' method", () => {
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

  describe("Testing the 'setMinBorder' method", () => {
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

  describe("Testing the 'setMaxBorder' method", () => {
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

  describe("Testing the 'setStep' method", () => {
    it("Should return false when value greater than the number of elements in the set", () => {
      expect(model.setStep(ALPHABET.length)).toBeFalsy();
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
