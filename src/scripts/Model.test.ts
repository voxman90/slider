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
  model.attach(observer);

  it("Should return the point value as a percentage", () => {
    expect(model.getPoint(0)).toStrictEqual(10);
    expect(model.getPoint(1)).toStrictEqual(25);
    expect(model.getPoint(2)).toStrictEqual(50);
    expect(model.getPoint(3)).toStrictEqual(100);
  });

  it("Should return the point value", () => {
    expect(model.getPointValue(0)).toStrictEqual(1);
    expect(model.getPointValue(1)).toStrictEqual(2.5);
    expect(model.getPointValue(2)).toStrictEqual(5);
    expect(model.getPointValue(3)).toStrictEqual(10);
  });

  it("Should return the distance from point to borders", () => {
    expect(model.getDistance(0)).toStrictEqual([10, 15]);
    expect(model.getDistance(1)).toStrictEqual([15, 25]);
    expect(model.getDistance(2)).toStrictEqual([25, 50]);
    expect(model.getDistance(3)).toStrictEqual([50, 100]);
  });

  it("Should return an array of all points values in percentage", () => {
    expect(model.getPoints()).toStrictEqual([10, 25, 50, 100]);
  });

  it("Should return an array of all points values", () => {
    expect(model.getPointValues()).toStrictEqual([0, 2.5, 5, 10]);
  });

  it("Should return all distances between points include the min and max border", () => {
    expect(model.getDistances()).toStrictEqual([10, 15, 25, 50, 0]);
  });

  it("Should move a point when new point value match borders", () => {
    expect(model.setPoint(0, 16)).toBeFalsy();
    expect(model.setPoint(0, -1)).toBeFalsy();
    expect(model.setPoint(0, 15)).toBeTruthy();
    expect(model.getPoint(0)).toStrictEqual(15);
    expect(model.setPoint(0, 10)).toBeTruthy();
    expect(model.getPoint(0)).toStrictEqual(10);
    expect(observer.update).toBeCalledTimes(2);
  });

  it("Should set a point value when match borders", () => {
    expect(model.setPointValue(0, 1.6)).toBeFalsy();
    expect(model.setPointValue(0, 1.5)).toBeTruthy();
    expect(model.getPointValue(0)).toStrictEqual(1.5);
    expect(model.setPointValue(0, 1)).toBeTruthy();
    expect(model.getPointValue(0)).toStrictEqual(1);
    expect(observer.update).toBeCalledTimes(2);
  });

  it("Should set a min border", () => {
    expect(model.setMinBorder(1.1)).toBeFalsy();
    expect(model.setMinBorder(1)).toBeTruthy();
    expect(model.getMinBorder()).toStrictEqual(1);
    expect(model.setMinBorder(0)).toBeTruthy();
    expect(model.getMinBorder(0)).toStrictEqual(0);
    expect(observer.update).toBeCalledTimes(2);
  });

  it("Should set a max border", () => {
    expect(model.setMaxBorder(0.9)).toBeFalsy();
    expect(model.setMaxBorder(10)).toBeTruthy();
    expect(model.getMaxBorder(0)).toStrictEqual(2);
    expect(model.getPoints()).toStrictEqual([5, 12.5, 25, 50]);
    expect(model.setMaxBorder(0, 1)).toBeTruthy();
    expect(model.getMaxBorder(0)).toStrictEqual(1);
    expect(observer.update).toBeCalledTimes(2);
  });

  it("Should set a step", () => {
    expect(model.setStep(11)).toBeFalsy();
    expect(model.setStep(10)).toBeTruthy();
    expect(model.getStep()).toStrictEqual(10);
    expect(model.setStep(2)).toBeTruthy();
    expect(model.getStep()).toStrictEqual(2);
    expect(observer.update).toBeCalledTimes(2);
  });

  // it("Should set a range", () => {

  // });

  // it("Should set the state when it is correct", () => {

  // });
});

describe("Testing for set type configuration", () => {

});
