import { LEFT_DIRECTION, RIGHT_DIRECTION } from "common/constants/Constants";
import { Config, direction, Point, Interval, primitive } from "common/types/Types";

import PercentageProcessorFixed from "./PercentageProcessorFixed";
import MathModule from "./MathModule";

abstract class DataProcessor<K extends keyof Config> {
  protected _mm: MathModule;
  protected _pp: PercentageProcessorFixed;
  protected _minBoundary: Point;
  protected _maxBoundary: Point;
  protected _points: Array<Point>;
  protected _intervals: Array<Interval>;
  protected _step: number;
  protected abstract _isValidConfig(config: Partial<Config>): asserts config is Pick<Config, K>;
  protected abstract _setState(config: Pick<Config, K>): void;

  constructor(mm?: MathModule) {
    this._mm = mm || new MathModule();
    this._pp = new PercentageProcessorFixed({ mm: this._mm });
    this._minBoundary = this.createPoint(0, 0);
    this._maxBoundary = this.createPoint(1, 100);
    this._points = [];
    this._intervals = [];
    this._step = 1;
  }

  public get min(): number {
    return this._minBoundary.value;
  }

  public get max(): number {
    return this._maxBoundary.value;
  }

  public get length(): number {
    return this._mm.sub(this.max, this.min);
  }

  public get numberOfPoints(): number {
    return this._points.length;
  }

  public get firstPointIndex(): number {
    return 0;
  }

  public get lastPointIndex(): number {
    return this._points.length - 1;
  }

  public createIntervals(points: Array<Point>): Array<Interval> {
    const intervals: Array<Interval> = [];
    this._forEachPair(points, (from, to) => {
      intervals.push(this.createInterval(from, to));
    });
    return intervals;
  }

  public createInterval(from: Point, to: Point): Interval {
    const value = this._getDistanceBetweenPoints(from, to);
    const percent = this._pp.convertToPercent(value);
    return {
      from,
      to,
      value,
      percent,
    };
  }

  public createPoints(values: Array<number>): Array<Point> {
    const points: Array<Point> = [];
    values.forEach((value) => {
      points.push(this.createPoint(value));
    });
    return points;
  }

  public createPoint(value: number, percent?: number): Point {
    return {
      value,
      percent: (percent === undefined) ? this._pp.reflectOnScale(value) : percent,
      view: this.getView(value),
    };
  }

  public setMinBoundary(min: number): boolean {
    const maxStepSize = this._mm.sub(this.max, min);
    const firstPointValue = this._getPoint(0).value;
    const isMatchRightBoundary = this._mm.sub(firstPointValue, min) > 0;
    if (
      min < this.max
      && this._step <= maxStepSize
      && isMatchRightBoundary
    ) {
      this._setMinBoundaryUnsafe(min);
      this._pp.setBoundaries(min, this.max);
      return true;
    }

    return false;
  }

  public getView(val: number): NonNullable<primitive> {
    return `${val}`;
  }

  public setMaxBoundary(max: number): boolean {
    const maxStepSize = this._mm.sub(max, this.min);
    const lastPointValue = this._getPoint(this.lastPointIndex).value;
    const isMatchLeftBoundary = this._mm.sub(max, lastPointValue) > 0;
    if (
      this.min < max
      && this._step <= maxStepSize
      && isMatchLeftBoundary
    ) {
      this._setMaxBoundaryUnsafe(max);
      this._pp.setBoundaries(this.min, max);
      return true;
    }

    return false;
  }

  public setStep(step: number): boolean {
    const maxStepSize = this._mm.sub(this.max, this.min);
    if (0 < step && step <= maxStepSize) {
      this._step = step;
      return true;
    }

    return false;
  }

  public setPoint(val: number, index: number): boolean {
    if (this._isValidPointIndex(index)) {
      if (this._isMatchBoundaries(val, index)) {
        this._setPointUnsafe(val, index);
        return true;
      }
    }

    return false;
  }

  public movePoint(offset: number, index: number): boolean {
    const [direction, offsetAbs] = this._decomposeOffset(offset);
    const stepsRounded = Math.round(this._convertToSteps(offsetAbs));
    const isOffsetInsignificant = stepsRounded === 0;
    if (isOffsetInsignificant) {
      return false;
    }

    const targetValue = this._getTargetValue(stepsRounded, direction, index);
    this._setPointUnsafe(targetValue, index);
    return true;
  }

  public movePointInPercent(index: number, offsetInPercent: number): boolean {
    const offset = this._pp.convertToValue(offsetInPercent);
    return this.movePoint(index, offset);
  }

  public setPoints(values: Array<number>): boolean {
    if (values.length < this.numberOfPoints) {
      return false;
    }

    try {
      this._isValidPointValues([this.min, ...values, this.max])
      values.forEach((val, i) => this._setPointUnsafe(val, i));
      return true;
    } catch {
      return false;
    }
  }

  public prependPoint(val: number): boolean {
    return this.addPoint(val, 0);
  }

  public appendPoint(val: number): boolean {
    return this.addPoint(val, this.numberOfPoints);
  }

  public addPoint(val: number, index: number): boolean {
    const isValidInsertPosition = (
      0 <= index
      && index <= this.numberOfPoints
    );
    if (!isValidInsertPosition) {
      return false;
    }

    if (!this._isMatchBoundaries(val, index)) {
      return false;
    }

    const point = this.createPoint(val);
    this._points.splice(index, 0, point);
    const leftBoundary = this._getLeftBoundary(index);
    this._setIntervalUnsafe(leftBoundary, point, index);
    const rightBoundary = this._getRightBoundary(index);
    const interval = this.createInterval(point, rightBoundary);
    this._intervals.splice(index, 0, interval);
    return true;
  }

  public removePoint(index: number): boolean {
    if (
      this.numberOfPoints !== 1
      && this._isValidPointIndex(index)
    ) {
      const leftBoundary = this._getLeftBoundary(index);
      const rightBoundary = this._getRightBoundary(index);
      this._setIntervalUnsafe(leftBoundary, rightBoundary, index);
      this._points.splice(index, 1);
      this._intervals.splice(index + 1, 1);
      return true;
    }

    return false;
  }

  public getGrid(density: number, from?: number, to?: number): Array<Point> {
    const fromGridValue = (from !== undefined) ? from : this.min;
    const toGridValue = (to !== undefined) ? to : this.max;
    if (
      !this._isValidGridFromAndTo(fromGridValue, toGridValue)
      || !this._isValidGridDensity(density, fromGridValue, toGridValue)
    ) {
      return [];
    }

    const grid = [];
    let val = fromGridValue;
    while (val < toGridValue) {
      grid.push(this.createPoint(val));
      val = this._mm.add(val, density);
    }
    grid.push(this.createPoint(toGridValue));
    return grid;
  }

  public getStep(): number {
    return this._step;
  }

  protected _getPointValue(index: number): number {
    return this._getPoint(index).value;
  }

  protected _getTargetValue(steps: number, direction: direction, index: number): number {
    const currentValue = this._getPointValue(index);
    let targetValue = this._shiftValueInSteps(currentValue, steps, direction);
    if (this._isMatchBoundary(targetValue, index, direction)) {
      return targetValue;
    }

    const distanceToBoundary = this._getDistanceToBoundary(index, direction);
    const distanceToBoundaryInSteps = Math.floor(this._convertToSteps(distanceToBoundary));
    targetValue = this._shiftValueInSteps(currentValue, distanceToBoundaryInSteps, direction);
    return targetValue;
  }

  protected _setMinBoundaryUnsafe(val: number): void {
    this._minBoundary.value = val;
    const rightBoundary = this._getPoint(0);
    this._setIntervalUnsafe(this._minBoundary, rightBoundary, 0);
  }

  protected _setMaxBoundaryUnsafe(val: number): void {
    this._maxBoundary.value = val;
    const leftBoundary = this._getPoint(this.lastPointIndex);
    this._setIntervalUnsafe(leftBoundary, this._maxBoundary, this.lastPointIndex);
  }

  protected _setPointUnsafe(val: number, index: number): void {
    const point = this._points[index];
    point.value = val;
    point.percent = this._pp.reflectOnScale(val);
    const leftBoundary = this._getLeftBoundary(index);
    this._setIntervalUnsafe(leftBoundary, point, index);
    const rightBoundary = this._getRightBoundary(index);
    this._setIntervalUnsafe(point, rightBoundary, index);
  }

  protected _setIntervalUnsafe(from: Point, to: Point, index: number): void {
    const interval = this._getInterval(index);
    interval.from = from;
    interval.to = to;
    const value = this._getDistanceBetweenPoints(from, to);
    interval.value = value;
    interval.percent = this._pp.convertToPercent(value);
  }

  protected _getInterval(index: number): Interval {
    return this._intervals[index];
  }

  protected _getDistanceToLeftBoundary(index: number): number {
    return this._getDistanceToBoundary(index, LEFT_DIRECTION);
  }

  protected _getDistanceToRightBoundary(index: number): number {
    return this._getDistanceToBoundary(index, RIGHT_DIRECTION);
  }

  protected _getDistanceToBoundary(index: number, direction: direction): number {
    const point = this._getPoint(index);
    const boundary = this._getBoundary(index, direction);
    return this._getDistanceBetweenPoints(point, boundary);
  }

  protected _getLeftBoundary(index: number): Point {
    return this._getBoundary(index, LEFT_DIRECTION);
  }

  protected _getRightBoundary(index: number): Point {
    return this._getBoundary(index, RIGHT_DIRECTION);
  }

  protected _getBoundary(index: number, direction: direction): Point {
    if (
      index === 0
      && direction === LEFT_DIRECTION
    ) {
      return this._minBoundary;
    }

    if (
      index === this.lastPointIndex
      && direction === RIGHT_DIRECTION
    ) {
      return this._maxBoundary;
    }

    return this._getPoint(index + direction);
  }

  protected _getPoint(index: number): Point {
    return this._points[index];
  }

  protected _getDistanceBetweenPoints(x: Point, y: Point): number {
    return Math.abs(this._mm.sub(y.value, x.value));
  }

  protected _shiftValueInSteps(val: number, steps: number, direction: direction): number {
    const offset = this._convertFromSteps(steps);
    return this._shiftValue(val, offset, direction);
  }

  protected _shiftValue(val: number, offset: number, direction: direction): number {
    return this._mm.add(val, direction * offset);
  }

  protected _decomposeOffset(offset: number): [direction, number] {
    const offsetSign = (Math.sign(offset) === 1) ? 1 : -1;
    const offsetAbs = offsetSign * offset;
    return [offsetSign, offsetAbs];
  }

  protected _convertToSteps(val: number): number {
    return this._mm.div(val, this._step);
  }

  protected _convertFromSteps(steps: number): number {
    return this._mm.mul(steps, this._step);
  }

  protected _everyPoint(condition: (point: Point, i: number, points: Array<Point>) => boolean): boolean {
    for (let i = 0; i < this.numberOfPoints; i += 1) {
      if (!condition(this._points[i], i, this._points)) {
        return false;
      }
    }

    return true;
  }

  protected _forEachPoint(callback: (point: Point, i: number, points: Array<Point>) => void): void {
    for (let i = 0; i < this.numberOfPoints; i += 1) {
      callback(this._points[i], i, this._points);
    }
  }

  protected _forEachPair<T>(arr: Array<T>, callback: (cur: T, next: T, pairNumber: number) => void) {
    for (let i = 0; i < arr.length - 1; i += 1) {
      callback(arr[i], arr[i + 1], i + 1);
    }
  }

  protected _everyPair<T>(arr: Array<T>, condition: (cur: T, next: T, pairNumber: number) => boolean): boolean {
    for (let i = 0; i < arr.length - 1; i += 1) {
      if (!condition(arr[i], arr[i + 1], i + 1)) {
        return false;
      }
    }

    return true;
  }

  protected _isNonDecreasingSequence(sequence: Array<number>): boolean {
    return this._everyPair(sequence, (x, y) => x <= y);
  }

  protected _isMatchRange(val: number): boolean {
    return (
      this._isMatchMinBoundary(val)
      && this._isMatchMaxBoundary(val)
    );
  }

  protected _isMatchMinBoundary(val: number): boolean {
    return this.min <= val;
  }

  protected _isMatchMaxBoundary(val: number): boolean {
    return val <= this.max;
  }

  protected _isMatchBoundaries(val: number, index: number): boolean {
    return (
      this._isMatchLeftBoundary(val, index)
      && this._isMatchRightBoundary(val, index)
    );
  }

  protected _isMatchLeftBoundary(val: number, index: number): boolean {
    return this._isMatchBoundary(val, index, LEFT_DIRECTION);
  }

  protected _isMatchRightBoundary(val: number, index: number): boolean {
    return this._isMatchBoundary(val, index, RIGHT_DIRECTION);
  }

  protected _isMatchBoundary(val: number, index: number, direction: direction): boolean {
    const boundary = this._getBoundary(index, direction);
    return direction * this._mm.sub(val, boundary.value) <= 0;
  }

  protected _isValidPointIndex(index: number): boolean {
    return (
      0 <= index
      && index < this.numberOfPoints
    );
  }

  protected _isValidGridDensity(density: number, from: number, to: number): boolean {
    if (0 < density) {
      return true;
    }

    return false;
  }

  protected _isValidGridFromAndTo(from: number, to: number): boolean {
    if (
      this.min <= from
      && from < to
      && to <= this.max
    ) {
      return true;
    }

    return false;
  }

  protected _isValidStep(step: number, min: number, max: number): void {
    const maxStepSize = this._mm.sub(max, min);
    if (
      step < 0
      || maxStepSize < step
    ) {
      throw "Step is not valid";
    }
  }

  protected _isValidPointValues(values: unknown): void {
    if (!Array.isArray(values)) {
      throw "Values is not array";
    }

    const hasOnlyIntegers = values.every((val) => Number.isInteger(val));
    if (!hasOnlyIntegers) {
      throw "Values is contains non-integer value";
    }

    const hasNegativeValue = values.some((val) => val < 0);
    if (hasNegativeValue) {
      throw "Values is contains negative value";
    }

    if (!this._isNonDecreasingSequence(values)) {
      throw "Values is contains a decreasing subsequence";
    }
  }

  protected _init(config: Partial<Config>, defaultConfig: Pick<Config, K>): void {
    try {
      this._isValidConfig(config);
      this._setState(config);
    } catch (err: unknown) {
      const isExpectedError = typeof err === 'string';
      if (!isExpectedError) {
        throw(err);
      }

      console.warn(`The configuration is not valid. Error: ${err}.\nThe default configuration will be applied.`);
      this._setState(defaultConfig);
    }
  }

  protected _isInteger(val: unknown): val is number {
    return Number.isInteger(val);
  }

  protected _isFinite(val: unknown): val is number {
    return Number.isFinite(val);
  }
}

export default DataProcessor;
