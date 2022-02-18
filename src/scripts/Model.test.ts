import { ALPHABET } from 'common/constants/Constants';
import { PointState, primitive, ScaleState } from 'common/types/types';

import Model from './Model';
import Observer from './Observer';

class ObserverMock extends Observer {
  update() {};
}

function getGridValues(grid: Array<PointState>): Array<number> {
  return grid.map((point) => point.value);
}

function getGridPercent(grid: Array<PointState>): Array<number> {
  return grid.map((point) => point.percent);
}

function getPointValues(scaleState: ScaleState): Array<number> {
  return scaleState.points.map((point) => point.value);
}

function getPointPercents(scaleState: ScaleState): Array<number> {
  return scaleState.points.map((point) => point.percent);
}

function getPointViews(scaleState: ScaleState): Array<NonNullable<primitive>> {
  return scaleState.points.map((point) => point.view);
}

function getIntervalValues(scaleState: ScaleState): Array<number> {
  return scaleState.intervals.map((interval) => interval.value);
}

function getIntervalPercents(scaleState: ScaleState): Array<number> {
  return scaleState.intervals.map((interval) => interval.percent);
}

describe("Testing 'Model':\n", () => {
  const values = [0, 5, 10];
  const percents = [0, 50, 100];
  const views = ["0", "5", "10"];
  const intervalValues = [0, 5, 5, 0];
  const intervalPercents = [0, 50, 50, 0];
  const step = 5;
  const min = 0;
  const max = 10;
  const config = {
    type: 'range',
    range: [min, max],
    step,
    values,
  };
  let model = new Model(config);

  beforeEach(() => {
    model = new Model(config);
  });

  it("Testing 'getPointState' method", () => {
    values.forEach((val, i) => {
      const point = model.getPointState(i);
      expect(point.value).toStrictEqual(val);
      expect(point.percent).toStrictEqual(percents[i]);
      expect(point.view).toStrictEqual(views[i]);
    });
  });

  it("Testing 'getIntervalState' method", () => {
    intervalValues.forEach((val, i) => {
      const interval = model.getIntervalState(i);
      expect(interval.value).toStrictEqual(val);
      expect(interval.percent).toStrictEqual(intervalPercents[i]);
    });
  });

  it("Testing 'getScaleState' method", () => {
    const scaleState = model.getScaleState();
    expect(getPointValues(scaleState)).toStrictEqual(values);
    expect(getPointPercents(scaleState)).toStrictEqual(percents);
    expect(getPointViews(scaleState)).toStrictEqual(views);
    expect(getIntervalValues(scaleState)).toStrictEqual(intervalValues);
    expect(getIntervalPercents(scaleState)).toStrictEqual(intervalPercents);
    expect(scaleState.step).toStrictEqual(step);
    expect(scaleState.min.value).toStrictEqual(min);
    expect(scaleState.min.percent).toStrictEqual(0);
    expect(scaleState.max.value).toStrictEqual(max);
    expect(scaleState.max.percent).toStrictEqual(100);
  });

  describe("Testing 'getGrid' methods:\n", () => {
    describe("For range:\n", () => {
      const config = {
        type: 'range',
        range: [0, 1],
        step: 0.5,
        values: [0],
      };
      const model = new Model(config);
  
      [
        { density: -0.1, values: [], percents: [] },
        { density: 0, values: [], percents: [] },
        { density: 0.25, values: [0, 0.25, 0.5, 0.75, 1], percents: [0, 25, 50, 75, 100] },
        { density: 0.5, values: [0, 0.5, 1], percents: [0, 50, 100] },
        { density: 1, values: [0, 1], percents: [0, 100] },
        { density: 1.5, values: [0, 1], percents: [0, 100] },
      ].forEach(({ density, values, percents }) => {
        it(`For density: ${density} should return values: \[${values}\] and percents: \[${percents}\]`, () => {
          const grid = model.getGrid(density);
          expect(getGridValues(grid)).toStrictEqual(values);
          expect(getGridPercent(grid)).toStrictEqual(percents);
        });
      });
  
      [
        { from: 0, to: 0, values: [], percents: [] },
        { from: 0.8, to: 0.2, values: [], percents: [] },
        { from: -1, to: 0, values: [], percents: [] },
        { from: 0.5, to: undefined, values: [0.5, 0.75, 1], percents: [50, 75, 100] },
        { from: undefined, to: 0.5, values: [0, 0.25, 0.5], percents: [0, 25, 50] },
        { from: 0.25, to: 0.75, values: [0.25, 0.5, 0.75], percents: [25, 50, 75] },
      ].forEach(({ from, to, values, percents }) => {
        it(`For density: 0.25, from: ${from}, to: ${to} should return values: \[${values}\] and percents: \[${percents}\]`, () => {
          const density = 0.25;
          const grid = model.getGrid(density, from, to);
          expect(getGridValues(grid)).toStrictEqual(values);
          expect(getGridPercent(grid)).toStrictEqual(percents);
        });
      });
    });
  
    describe("For set:\n", () => {
      const config = {
        type: 'set',
        set: [...ALPHABET],
        min: 0,
        max: ALPHABET.length - 1,
        step: 1,
        values: [0],
      };
      const model = new Model(config);
  
      [
        { density: -1, values: [], percents: [] },
        { density: 0, values: [], percents: [] },
        { density: 0.1, values: [], percents: [] },
        { density: 10, values: [0, 10, 20, 25], percents: [0, 40, 80, 100] },
      ].forEach(({ density, values, percents }) => {
        it(`For density: ${density} should return values: \[${values}\] and percents: \[${percents}\]`, () => {
          const grid = model.getGrid(density);
          expect(getGridValues(grid)).toStrictEqual(values);
          expect(getGridPercent(grid)).toStrictEqual(percents);
        });
      });
  
      [
        { from: 0, to: 0, values: [], percents: [] },
        { from: 20, to: 10, values: [], percents: [] },
        { from: -1, to: 0, values: [], percents: [] },
        { from: 1.1, to: 2, values: [], percents: [] },
        { from: 1, to: 2.1, values: [], percents: [] },
        { from: 20, to: undefined, values: [20, 25], percents: [80, 100] },
        { from: undefined, to: 10, values: [0, 10], percents: [0, 40] },
        { from: 5, to: 20, values: [5, 15, 20], percents: [20, 60, 80] },
      ].forEach(({ from, to, values, percents }) => {
        it(`For density: 10, from: ${from}, to: ${to} should return values: \[${values}\] and percents: \[${percents}\]`, () => {
          const density = 10;
          const grid = model.getGrid(density, from, to);
          expect(getGridValues(grid)).toStrictEqual(values);
          expect(getGridPercent(grid)).toStrictEqual(percents);
        });
      });
    });
  });

  describe("Testing methods changing the state of the scale:\n", () => {
    const observer = new ObserverMock();
    const observerUpdateSpy = jest.spyOn(observer, 'update');

    beforeEach(() => {
      model = new Model(config);
      model.attach(observer);
    });

    it("Testing 'setPoint' method", () => {
      expect(model.setPoint(-1, 0)).toBeFalsy();
      expect(model.setPoint(3, 0)).toBeTruthy();
      expect(model.getPointState(0).value).toStrictEqual(3);
      expect(observerUpdateSpy).toBeCalledTimes(1);
    });

    it("Testing 'setStep' method", () => {
      expect(model.setStep(max - min + 1)).toBeFalsy();
      expect(model.setStep(-1)).toBeFalsy();
      expect(model.setStep(0)).toBeFalsy();
      expect(model.setStep(5)).toBeTruthy();
      expect(model.getScaleState().step).toStrictEqual(5);
      expect(observerUpdateSpy).toBeCalledTimes(1);
    });

    it("Testing 'setPoints' method", () => {
      const incorrectPointValues = [
        [0],
        [0, 5],
        [0, 6, 5],
        [-1, 1, 2],
      ];
      incorrectPointValues.forEach((values) => {
        expect(model.setPoints(values)).toBeFalsy();
      });

      const correctPointValues = [
        [1, 2, 3],
        [1, 2, 3, 4],
      ];
      correctPointValues.forEach((values) => {
        expect(model.setPoints(values)).toBeTruthy();
        const pointValues = getPointValues(model.getScaleState());
        expect(pointValues).toStrictEqual(correctPointValues[0]);
      });
      expect(observerUpdateSpy).toBeCalledTimes(2);
    });

    it("Testing 'setMinBoundary' method", () => {
      const incorrectMinValue = max;
      expect(model.setMinBoundary(incorrectMinValue)).toBeFalsy();
      const correctMinValue = min - 1;
      expect(model.setMinBoundary(correctMinValue)).toBeTruthy();
      expect(model.getScaleState().min.value).toStrictEqual(correctMinValue);
      expect(observerUpdateSpy).toBeCalledTimes(1);
    });

    it("Testing 'setMaxBoundary' method", () => {
      const incorrectMaxValue = min;
      expect(model.setMaxBoundary(incorrectMaxValue)).toBeFalsy();
      const correctMaxValue = max + 1;
      expect(model.setMaxBoundary(correctMaxValue)).toBeTruthy();
      expect(model.getScaleState().max.value).toStrictEqual(correctMaxValue);
      expect(observerUpdateSpy).toBeCalledTimes(1);
    });
  });
});
