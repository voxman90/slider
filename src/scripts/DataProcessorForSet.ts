import { Configuration, NonBottomValue } from './Types';
import { ALPHABET } from './Constants';
import DataProcessor from './DataProcessor';

const defaultConfig: Partial<Configuration> = {
  set: [...ALPHABET],
};

class DataProcessorForSet extends DataProcessor {
  protected _set: Array<NonBottomValue>;

  constructor (config: Partial<Configuration> = {}) {
    super();
    this._set = [];

    try {
      this._initConfig(config);
    } catch (err: unknown) {
      const isExpectedError = typeof err === 'string';
      if (!isExpectedError) {
        throw(err);
      }

      console.warn(`The config is not valid. Error: ${err}.\nThe default config will be applied.`);
      this._initConfig(defaultConfig);
    }
  }

  public get lastIndexOfSet(): number {
    return this._set.length - 1;
  }

  public get sizeOfSet(): number {
    return this._set.length;
  }

  public get firstPointIndex(): number {
    return 2;
  }

  public get lastPointIndex(): number {
    return this._currentState.length - 3;
  }

  public get numberOfPoints(): number {
    return this._currentState.length - 4;
  }

  public get minBorderIndex(): number {
    return 1;
  }

  public get maxBorderIndex(): number {
    return this._currentState.length - 2;
  }

  public setMinBorder(minIndex: number): boolean {
    const isLessThenMaxBorder = minIndex < this.max;
    const isLessThenOrEqualToFirstPoint = this._isMatchRightBorder(this.minBorderIndex, minIndex);
    if (
      Number.isInteger(minIndex)
      && this._isNonNegative(minIndex)
      && isLessThenMaxBorder
      && isLessThenOrEqualToFirstPoint
    ) {
      this._setMinBorderUnsafe(minIndex);
      return true;
    }

    return false;
  }

  public setMaxBorder(maxIndex: number): boolean {
    const isGreaterThenMinBorder = this.min < maxIndex;
    const isGreaterThenOrEqualToLastPoint = this._isMatchLeftBorder(this.maxBorderIndex, maxIndex);
    const isLessThenOrEqualToLastIndexOfSet = maxIndex <= this.lastIndexOfSet;
    if (
      Number.isInteger(maxIndex)
      && isGreaterThenMinBorder
      && isGreaterThenOrEqualToLastPoint
      && isLessThenOrEqualToLastIndexOfSet
    ) {
      this._setMaxBorderUnsafe(maxIndex);
      return true;
    }

    return false;
  }

  public setPoint(pointIndex: number, pointValue: number): boolean {
    if (!this._isInteger(pointValue)) {
      return false;
    }

    return super.setPoint(pointIndex, pointValue);
  }

  protected _initConfig(config: Partial<Configuration>) {
    this._isSetValid(config.set);
    this._set = [...config.set];

    const minIndex = config.min || 0;
    const maxIndex = config.max || this.lastIndexOfSet;
    const points = config.points || [minIndex, maxIndex];
    this._initialState = [0, minIndex, ...points, maxIndex, this.lastIndexOfSet];
    this._isInitialStateValid();

    this._scale.setRatio(minIndex, maxIndex);
    this.resetCurrentStateToInitial();

    this._step = this._isStepValid(config.step) ? config.step : 1;
  }

  private _isStepValid(step: unknown): step is number {
    if (!this._isInteger(step)) {
      return false;
    }

    const lengthOfGivenSubset = this.max - this.min;
    return (
      0 < step
      && step <= lengthOfGivenSubset
    );
  }

  private _isSetValid(set: unknown): asserts set is Array<NonBottomValue> {
    if (set === undefined) {
      throw 'config.set is undefined';
    }

    if (!Array.isArray(set)) {
      throw 'config.set is not array';
    }

    const hasBottomValue = set.some((val) => val == null);
    if (hasBottomValue) {
      throw 'config.set has undefined or null-ish values';
    }
  }

  private _isInitialStateValid(): void {
    const initialState = this._initialState;
    const length = initialState.length;

    const hasOnlyIntegers = initialState.every((val) => Number.isInteger(val));
    if (!hasOnlyIntegers) {
      throw 'Initial state is contains non-integer value';
    }

    const hasNegativeValue = initialState.some((val) => val < 0);
    if (hasNegativeValue) {
      throw 'Initial state is contains negative value';
    }

    for (let i = 0; i < length - 1; i += 1) {
      const hasDecreasingSubsequence = initialState[i + 1] < initialState[i];
      if (hasDecreasingSubsequence) {
        throw `Initial state is contains a decreasing subsequence`;
      }
    }
  }
}

export default DataProcessorForSet;
