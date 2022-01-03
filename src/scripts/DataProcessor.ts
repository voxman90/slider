import PercentageScale from "./PercentageScale";
import MathModule from "./MathModule";
import { Configuration, direction } from "./Types";
import { LEFT_DIRECTION, RIGHT_DIRECTION } from './Constants';

abstract class DataProcessor {
  protected _mm: MathModule;
  protected _scale: PercentageScale;
  protected _initialState: Array<number>;
  protected _currentState: Array<number>;
  protected _step: number;
  public abstract setMinBorder(val: number): boolean;
  public abstract setMaxBorder(val: number): boolean;
  protected abstract _initConfig(config: Partial<Configuration>): void;

  constructor(mm?: MathModule) {
    this._mm = mm || new MathModule();
    this._scale = new PercentageScale(0, 1, this._mm);
    this._initialState = [];
    this._currentState = [];
    this._step = 1;
  }

  public get min(): number {
    return this._getPosition(this.minBorderIndex);
  }

  public get max(): number {
    return this._getPosition(this.maxBorderIndex);
  }

  public get range(): [min: number, max: number] {
    return [this.min, this.max];
  }

  public get firstPositionIndex(): number {
    return 0;
  }

  public get lastPositionIndex(): number {
    return this._currentState.length - 1;
  }

  public get numberOfPositions(): number {
    return this._currentState.length;
  }

  public get firstPointIndex(): number {
    return 1;
  }

  public get lastPointIndex(): number {
    return this._currentState.length - 2;
  }

  public get numberOfPoints(): number {
    return this._currentState.length - 2;
  }

  public get minBorderIndex(): number {
    return 0;
  }

  public get maxBorderIndex(): number {
    return this._currentState.length - 1;
  }

  public movePointInPercent(pointIndex: number, offsetInPercent: number): boolean {
    const offset = this._scale.convertToValue(offsetInPercent);
    return this.movePoint(pointIndex, offset);
  }

  public movePoint(pointIndex: number, offset: number): boolean {
    if (!this._isValidPointIndex(pointIndex)) {
      return false;
    }

    const [direction, offsetAbs] = this._decomposeOffset(offset);
    const numberOfStepsRounded = Math.round(this._convertToSteps(offsetAbs));
    const isOffsetInsignificant = numberOfStepsRounded === 0;
    if (isOffsetInsignificant) {
      return false;
    }

    const positionIndex = this._getPositionIndexForPoint(pointIndex);
    const targetValue = this._getTargetValue(positionIndex, numberOfStepsRounded, direction);
    this._setPositionUnsafe(positionIndex, targetValue);
    return true;
  }

  public setCurrentStateAsInitial(): void {
    this._initialState = [...this._currentState];
  }

  public resetCurrentStateToInitial(): void {
    this._currentState = [...this._initialState];
  }

  public setPoint(pointIndex: number, pointValue: number): boolean {
    if (!this._isValidPointIndex(pointIndex)) {
      return false;
    }

    const positionIndex = this._getPositionIndexForPoint(pointIndex);
    if (!this._isMatchBorders(positionIndex, pointValue)) {
      return false;
    }

    this._setPositionUnsafe(positionIndex, pointValue);
    return true;
  }

  public getPoint(pointIndex: number): number {
    const positionIndex = this._getPositionIndexForPoint(pointIndex);
    return this._getPosition(positionIndex);
  }

  protected _getPositionIndexForPoint(pointIndex: number): number {
    return this.firstPointIndex + pointIndex;
  }

  protected _getPosition(positionIndex: number): number {
    return this._currentState[positionIndex];
  }

  protected _getTargetValue(positionIndex: number, numberOfSteps: number, direction: direction): number {
    const currentValue = this._getPosition(positionIndex);
    let targetValue = this._shiftValueInSteps(currentValue, numberOfSteps, direction);
    if (this._isMatchBorder(positionIndex, targetValue, direction)) {
      return targetValue;
    }

    const distanceToBorder = this._getDistanceToBorder(positionIndex, direction);
    const distanceToBorderInSteps = Math.floor(this._convertToSteps(distanceToBorder));
    targetValue = this._shiftValueInSteps(currentValue, distanceToBorderInSteps, direction);
    return targetValue;
  }

  protected _getDistanceToLeftBorder(positionIndex: number): number {
    return this._getDistanceToBorder(positionIndex, LEFT_DIRECTION);
  }

  protected _getDistanceToRightBorder(positionIndex: number): number {
    return this._getDistanceToBorder(positionIndex, RIGHT_DIRECTION);
  }

  protected _getDistanceToBorder(positionIndex: number, direction: direction): number {
    const position = this._getPosition(positionIndex);
    const border = this._getBorder(positionIndex, direction);
    const distance = Math.abs(this._mm.sub(position, border));
    return distance;
  }

  protected _getLeftBorder(positionIndex: number): number {
    return this._getBorder(positionIndex, LEFT_DIRECTION);
  }

  protected _getRightBorder(positionIndex: number): number {
    return this._getBorder(positionIndex, RIGHT_DIRECTION);
  }

  protected _getBorder(positionIndex: number, direction: direction): number {
    return this._getPosition(positionIndex + direction);
  }

  protected _shiftValueInSteps(val: number, numberOfSteps: number, direction: direction): number {
    const offset = this._convertFromSteps(numberOfSteps);
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

  protected _convertFromSteps(numberOfSteps: number): number {
    return this._mm.mul(numberOfSteps, this._step);
  }

  protected _setMinBorderUnsafe(minBorderValue: number): void {
    this._setPositionUnsafe(this.minBorderIndex, minBorderValue);
  }

  protected _setMaxBorderUnsafe(maxBorderValue: number): void {
    this._setPositionUnsafe(this.maxBorderIndex, maxBorderValue);
  }

  protected _setPositionUnsafe(positionIndex: number, positionValue: number): void {
    this._currentState[positionIndex] = positionValue;
  }

  protected _forEachPoint(callback: (val: number, index: number, arr: Array<number>) => void): void {
    for (let i = this.firstPointIndex; i <= this.lastPointIndex; i += 1) {
      callback(this._currentState[i], i, this._currentState);
    }
  }

  protected _isMatchRange(positionValue: number): boolean {
    return (
      this._isMatchMinBorder(positionValue)
      && this._isMatchMaxBorder(positionValue)
    );
  }

  protected _isMatchMinBorder(positionValue: number): boolean {
    return this.min <= positionValue;
  }

  protected _isMatchMaxBorder(positionValue: number): boolean {
    return positionValue <= this.max;
  }

  protected _isMatchBorders(positionIndex: number, positionValue: number): boolean {
    return (
      this._isMatchLeftBorder(positionIndex, positionValue)
      && this._isMatchRightBorder(positionIndex, positionValue)
    );
  }

  protected _isMatchLeftBorder(positionIndex: number, positionValue: number): boolean {
    return this._isMatchBorder(positionIndex, positionValue, LEFT_DIRECTION);
  }

  protected _isMatchRightBorder(positionIndex: number, positionValue: number): boolean {
    return this._isMatchBorder(positionIndex, positionValue, RIGHT_DIRECTION);
  }

  protected _isMatchBorder(positionIndex: number, positionValue: number, direction: direction): boolean {
    const border = this._getBorder(positionIndex, direction);
    return direction * this._mm.sub(positionValue, border) <= 0;
  }

  protected _isNonNegative(val: number): boolean {
    return 0 <= val;
  }

  protected _isValidPointIndex(index: unknown): index is number {
    return (
      this._isInteger(index)
      && this._isNonNegative(index)
      && index < this.numberOfPoints
    );
  }

  protected _isValidPositionIndex(index: unknown): index is number {
    return (
      this._isInteger(index)
      && this._isNonNegative(index)
      && index < this.lastPositionIndex
    );
  }

  protected _isInteger(val: unknown): val is number {
    return Number.isInteger(val);
  }

  protected _isFinite(val: unknown): val is number {
    return Number.isFinite(val);
  }
}

export default DataProcessor;
