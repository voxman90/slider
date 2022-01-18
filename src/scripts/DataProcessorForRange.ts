import { Configuration } from "./Types";
import DataProcessor from './DataProcessor';

const defaultConfig: Partial<Configuration> = {
  range: [0, 1],
};

class DataProcessorForRange extends DataProcessor {
  constructor (config: Partial<Configuration> = {}) {
    super();

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

  public setMinBorder(minBorder: number): boolean {
    if (Number.isFinite(minBorder)) {
      return super.setMinBorder(minBorder);
    }

    return false;
  }

  public setMaxBorder(maxBorder: number): boolean {
    if (Number.isFinite(maxBorder)) {
      return super.setMaxBorder(maxBorder);
    }

    return false;
  }

  public setStep(step: number): boolean {
    if (Number.isFinite(step)) {
      return super.setStep(step);
    }

    return false;
  }

  public setPointWithShift(pointIndex: number, pointValue: number): boolean {
    if (!this._isValidPointIndex(pointIndex)) {
      return false;
    }

    if (!this._isMatchRange(pointValue)) {
      return false;
    }

    const positionIndex = this._getPositionIndexForPoint(pointIndex);
    this._setPositionUnsafe(positionIndex, pointValue);

    const shift = (checkedPointValue: number, checkedPointIndex: number) => {
      const isShiftedPosition = (checkedPointValue - pointValue) * (checkedPointIndex - pointIndex) < 0;
      if (isShiftedPosition) {
        this._setPositionUnsafe(checkedPointIndex, pointValue);
      }
    };

    this._forEachPoint(shift);

    return true;
  }

  protected _initConfig(config: Partial<Configuration>) {
    const isMinAndMaxSet = config.min !== undefined && config.max !== undefined;
    const range = (isMinAndMaxSet) ? [config.min, config.max] : config.range;
    this._isRangeValid(range);
    const [min, max] = range;

    const points = config.points || [min, max];
    this._initialState = [min, ...points, max];
    this._isInitialStateValid();

    this._pp.setBorders(min, max);
    this.resetCurrentStateToInitial();

    this._step = this._isStepValid(config.step) ? config.step : this._mm.sub(this.maxBorder, this.minBorder);
  }

  protected _isStepValid(step: unknown): step is number {
    if (this._isFinite(step)) {
      return super._isStepValid(step);
    }

    return false;
  }

  private _isRangeValid(range: unknown): asserts range is [number, number] {
    if (range === undefined) {
      throw 'config.range is undefined';
    }

    if (!Array.isArray(range)) {
      throw 'config.range is not array';
    }

    const isPair = range.length === 2;
    const hasNumericValues = typeof range[0] === 'number' && typeof range[1] === 'number';
    if (!isPair || !hasNumericValues) {
      throw 'config.range is not pair of numbers';
    }

    const isDecreasingSequence = range[0] > range[1];
    if (isDecreasingSequence) {
      throw 'config.range is decreasing number sequence';
    }
  }

  private _isInitialStateValid(): void {
    const initialState = this._initialState;
    const length = initialState.length;
    for (let i = 0; i < length - 1; i += 1) {
      const isDecreasingSubsequence = initialState[i + 1] < initialState[i];
      if (isDecreasingSubsequence) {
        throw `Initial state is contains a decreasing subsequence`;
      }
    }
  }
}

export default DataProcessorForRange;
