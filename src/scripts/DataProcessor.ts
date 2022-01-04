import PercentageScale from "./PercentageScale";
import MathModule from "./MathModule";
import { Configuration, direction, primitive } from "./Types";
import { LEFT_DIRECTION, RIGHT_DIRECTION } from './Constants';

abstract class DataProcessor {
  protected _mm: MathModule;
  protected _scale: PercentageScale;
  protected _initialState: Array<number>;
  protected _currentState: Array<number>;
  protected _step: number;
  protected abstract _initConfig(config: Partial<Configuration>): void;

  constructor(mm?: MathModule) {
    this._mm = mm || new MathModule();
    this._scale = new PercentageScale(0, 1, this._mm);
    this._initialState = [];
    this._currentState = [];
    this._step = 1;
  }

  public get minBorder(): number {
    return this._getPosition(this.minBorderIndex);
  }

  public get maxBorder(): number {
    return this._getPosition(this.maxBorderIndex);
  }

  public get range(): [min: number, max: number] {
    return [this.minBorder, this.maxBorder];
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

  public setMinBorder(minBorder: number): boolean {
    if (
      minBorder < this.maxBorder
      && this._isMatchRightBorder(this.minBorderIndex, minBorder)
    ) {
      this._setMinBorderUnsafe(minBorder);
      this._scale.min = minBorder;
      this._scale.setRatio(minBorder, this.maxBorder);
      return true;
    }

    return false;
  }

  public setMaxBorder(maxBorder: number): boolean {
    if (
      this.minBorder < maxBorder
      && this._isMatchLeftBorder(this.maxBorderIndex, maxBorder)
    ) {
      this._setMaxBorderUnsafe(maxBorder);
      this._scale.setRatio(this.minBorder, maxBorder);
      return true;
    }

    return false;
  }

  public setStep(step: number): boolean {
    const maxStepSize = this.maxBorder - this.minBorder;
    if (
      step <= 0
      || step > maxStepSize
    ) {
      return false;
    }

    this._step = step;
    return true;
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

  public movePointInPercent(pointIndex: number, offsetInPercent: number): boolean {
    const offset = this._scale.convertToValue(offsetInPercent);
    return this.movePoint(pointIndex, offset);
  }

  public setCurrentStateAsInitial(): void {
    this._initialState = [...this._currentState];
  }

  public resetCurrentStateToInitial(): void {
    this._currentState = [...this._initialState];
  }

  public getStep(): number {
    return this._step;
  }

  public getPointValue(pointIndex: number): number {
    const positionIndex = this._getPositionIndexForPoint(pointIndex);
    return this._getPosition(positionIndex);
  }

  public getPointValues(): Array<number> {
    return this._currentState.slice(this.firstPointIndex, this.lastPointIndex + 1);
  }

  public getPointLocationOnScale(pointIndex: number) {
    const pointValue = this.getPointValue(pointIndex);
    return this._scale.reflectOnScale(pointValue);
  }

  public getPointScale(): Array<number> {
    const scale: Array<number> = [];
    this._forEachPoint((pointValue) => {
      scale.push(this._scale.reflectOnScale(pointValue));
    })
    return scale;
  }

  public getPointView(pointIndex: number): NonNullable<primitive> {
    return this.getPointValue(pointIndex);
  }

  public getPointsView(): Array<NonNullable<primitive>> {
    return this.getPointValues();
  }

  public getDistanceToBorders(pointIndex: number): [number, number] {
    const positionIndex = this._getPositionIndexForPoint(pointIndex);
    return [
      this._getDistanceToLeftBorder(positionIndex),
      this._getDistanceToRightBorder(positionIndex)
    ];
  }

  public getDistances(): Array<number> {
    const distances = [];
    this._forEachPoint((_, pointIndex) => {
      distances.push(this._getDistanceToLeftBorder(pointIndex));
    })
    distances.push(this._getDistanceToRightBorder(this.lastPointIndex));
    return distances;
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

  protected _isStepValid(step: number): boolean {
    const lengthOfRange = this.maxBorder - this.minBorder;
    return (
      0 < step
      && step <= lengthOfRange
    );
  }

  protected _isMatchRange(positionValue: number): boolean {
    return (
      this._isMatchMinBorder(positionValue)
      && this._isMatchMaxBorder(positionValue)
    );
  }

  protected _isMatchMinBorder(positionValue: number): boolean {
    return this.minBorder <= positionValue;
  }

  protected _isMatchMaxBorder(positionValue: number): boolean {
    return positionValue <= this.maxBorder;
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

  protected _isValidPointIndex(index: unknown): index is number {
    return (
      this._isInteger(index)
      && 0 <= index
      && index < this.numberOfPoints
    );
  }

  protected _isValidPositionIndex(index: unknown): index is number {
    return (
      this._isInteger(index)
      && 0 <= index
      && index <= this.lastPositionIndex
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
