import Model from './Model';
import Generator from './Generator';
import { Configuration } from './Types';
import Observer from './Observer';

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

});
