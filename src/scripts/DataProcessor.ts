import PercentageProcessor from "./PercentageProcessor";
import MathModule from "./MathModule";
import { Configuration, direction, primitive } from "./Types";
import { LEFT_DIRECTION, RIGHT_DIRECTION } from './Constants';

abstract class DataProcessor {
  protected _mm: MathModule;
  protected _pp: PercentageProcessor;
  protected _initialState: Array<number>;
  protected _currentState: Array<number>;
  protected _step: number;
  protected abstract _initConfig(config: Partial<Configuration>): void;

  constructor(mm?: MathModule) {
    this._mm = mm || new MathModule();
    this._pp = new PercentageProcessor(0, 100, this._mm);
    this._initialState = [0, 0, 100];
    this._currentState = [0, 0, 100];
    this._step = 1;
  }

  public get minBorder(): number {
    return this._getPosition(this.minBorderIndex);
  }

  public get maxBorder(): number {
    return this._getPosition(this.maxBorderIndex);
  }

  public get range(): [minBorder: number, maxBorder: number] {
    return [this.minBorder, this.maxBorder];
  }

  public get firstPositionIndex(): number {
    return 0;
  }

  public get lastPositionIndex(): number {
    return this._currentState.length - 1;
  }

  public get numberOfPositions(): number {
    return this.lastPositionIndex - this.firstPositionIndex + 1;
  }

  public get firstPointIndex(): number {
    return 1;
  }

  public get lastPointIndex(): number {
    return this._currentState.length - 2;
  }

  public get numberOfPoints(): number {
    return this.lastPointIndex - this.firstPointIndex + 1;
  }

  public get minBorderIndex(): number {
    return 0;
  }

  public get maxBorderIndex(): number {
    return this._currentState.length - 1;
  }

  public setMinBorder(minBorder: number): boolean {
    const maxStepSize = this.maxBorder - minBorder;
    if (
      minBorder < this.maxBorder
      && this._step <= maxStepSize
      && this._isMatchRightBorder(this.minBorderIndex, minBorder)
    ) {
      this._setMinBorderUnsafe(minBorder);
      this._pp.setBorders(minBorder, this.maxBorder);
      return true;
    }

    return false;
  }

  public setMaxBorder(maxBorder: number): boolean {
    const maxStepSize = maxBorder - this.minBorder;
    if (
      this.minBorder < maxBorder
      && this._step <= maxStepSize
      && this._isMatchLeftBorder(this.maxBorderIndex, maxBorder)
    ) {
      this._setMaxBorderUnsafe(maxBorder);
      this._pp.setBorders(this.minBorder, maxBorder);
      return true;
    }

    return false;
  }

  public setStep(step: number): boolean {
    const maxStepSize = this.maxBorder - this.minBorder;
    if (0 < step && step <= maxStepSize) {
      this._step = step;
      return true;
    }

    return false;
  }

  public setPoint(pointIndex: number, pointValue: number): boolean {
    if (
      this._isValidPointIndex(pointIndex)
      && this._isPointMatchBorders(pointIndex, pointValue)
    ) {
      this._setPointUnsafe(pointIndex, pointValue);
      return true;
    }

    return false;
  }

  public setPoints(points: Array<number>): boolean {
    if (points.length < this.numberOfPoints) {
      return false;
    }

    const currentState = [...this._currentState];
    this._forEachPoint((_, i) => this._setPointUnsafe(i, this.maxBorder));
    const isValidPoints = this._everyPoint((_, i) => {
      return this.setPoint(i, points[i])
    });
    if (isValidPoints) {
      return true;
    }

    this._currentState = [...currentState];
    return false;
  }

  public prependPoint(pointValue: number): boolean {
    return this.addPoint(0, pointValue);
  }

  public appendPoint(pointValue: number): boolean {
    return this.addPoint(this.numberOfPoints, pointValue);
  }

  public addPoint(pointIndex: number, pointValue: number): boolean {
    const currentState = [...this._currentState];
    const isValidInsertPosition = (
      this._isValidPointIndex(pointIndex)
      || pointIndex === this.numberOfPoints
    );
    if (!isValidInsertPosition) {
      return false;
    }

    const positionIndex = this._getPositionIndexForPoint(pointIndex);
    this._currentState.splice(positionIndex, 0, pointValue);
    if (this._isMatchBorders(positionIndex, pointValue)) {
      return true;
    }

    this._currentState = [...currentState];
    return false;
  }

  public removePoint(pointIndex: number): boolean {
    if (
      this.numberOfPoints !== 1
      && this._isValidPointIndex(pointIndex)
    ) {
      const positionIndex = this._getPositionIndexForPoint(pointIndex);
      this._currentState.splice(positionIndex, 1);
      return true;
    }

    return false;
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

    const targetValue = this._getTargetValue(pointIndex, numberOfStepsRounded, direction);
    this._setPointUnsafe(pointIndex, targetValue);
    return true;
  }

  public movePointInPercent(pointIndex: number, offsetInPercent: number): boolean {
    const offset = this._pp.convertToValue(offsetInPercent);
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
    return this._pp.reflectOnScale(pointValue);
  }

  public getPointScale(): Array<number> {
    const scale: Array<number> = [];
    this._forEachPoint((pointValue) => {
      scale.push(this._pp.reflectOnScale(pointValue));
    })
    return scale;
  }

  public getPointView(pointIndex: number): NonNullable<primitive> {
    return this.getPointValue(pointIndex);
  }

  public getPointsView(): Array<NonNullable<primitive>> {
    return this.getPointValues();
  }

  public getMinBorderView(): NonNullable<primitive> {
    return this.minBorder;
  }

  public getMaxBorderView(): NonNullable<primitive> {
    return this.maxBorder;
  }

  public getDistanceToBorders(pointIndex: number): Array<number> {
    const positionIndex = this._getPositionIndexForPoint(pointIndex);
    return [
      this._getDistanceToLeftBorder(positionIndex),
      this._getDistanceToRightBorder(positionIndex)
    ];
  }

  public getDistanceToBordersOnScale(pointIndex: number): Array<number> {
    return this.getDistanceToBorders(pointIndex).map((val) => this._pp.convertToPercent(val));
  }

  public getDistances(): Array<number> {
    const distances = [];
    this._forEachPoint((_, pointIndex) => {
      const positionIndex = this._getPositionIndexForPoint(pointIndex);
      distances.push(this._getDistanceToLeftBorder(positionIndex));
    })
    distances.push(this._getDistanceToRightBorder(this.lastPointIndex));
    return distances;
  }

  public getDistancesOnScale(): Array<number> {
    const distances = this.getDistances();
    return distances.map(this._pp.convertToPercent);
  }

  protected _setPositionUnsafe(positionIndex: number, positionValue: number): void {
    this._currentState[positionIndex] = positionValue;
  }

  protected _setMinBorderUnsafe(minBorderValue: number): void {
    this._setPositionUnsafe(this.minBorderIndex, minBorderValue);
  }

  protected _setMaxBorderUnsafe(maxBorderValue: number): void {
    this._setPositionUnsafe(this.maxBorderIndex, maxBorderValue);
  }

  protected _setPointUnsafe(pointIndex: number, pointValue: number): void {
    const positionIndex = this._getPositionIndexForPoint(pointIndex);
    return this._setPositionUnsafe(positionIndex, pointValue);
  }

  protected _getPositionIndexForPoint(pointIndex: number): number {
    return this.firstPointIndex + pointIndex;
  }

  protected _getPosition(positionIndex: number): number {
    return this._currentState[positionIndex];
  }

  protected _getTargetValue(pointIndex: number, numberOfSteps: number, direction: direction): number {
    const positionIndex = this._getPositionIndexForPoint(pointIndex);
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

  protected _everyPoint(condition: (pointValue: number, pointIndex: number, currentState: Array<number>) => boolean): boolean {
    for (let i = 0; i < this.numberOfPoints; i += 1) {
      const positionIndex = this._getPositionIndexForPoint(i);
      if (!condition(this._currentState[positionIndex], i, this._currentState)) {
        return false;
      }
    }

    return true;
  }

  protected _forEachPoint(callback: (pointValue: number, pointIndex: number, currentState: Array<number>) => void): void {
    for (let pointIndex = 0; pointIndex < this.numberOfPoints; pointIndex += 1) {
      const positionIndex = this._getPositionIndexForPoint(pointIndex );
      callback(this._currentState[positionIndex], pointIndex, this._currentState);
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

  protected _isPointMatchBorders(pointIndex: number, pointValue: number): boolean {
    const positionIndex = this._getPositionIndexForPoint(pointIndex);
    return this._isMatchBorders(positionIndex, pointValue);
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
