import { Configuration, NonBottomValue, primitive } from './Types';
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

  public setMinBorder(minBorder: number): boolean {
    if (
      Number.isInteger(minBorder)
      && 0 <= minBorder
    ) {
      return super.setMinBorder(minBorder);
    }

    return false;
  }

  public setMaxBorder(maxBorder: number): boolean {
    if (
      Number.isInteger(maxBorder)
      && maxBorder <= this.lastIndexOfSet
    ) {
      return super.setMaxBorder(maxBorder);
    }

    return false;
  }

  public setStep(step: number): boolean {
    if (Number.isInteger(step)) {
      return super.setStep(step);
    }

    return false;
  }

  public setPoint(pointIndex: number, pointValue: number): boolean {
    if (Number.isInteger(pointValue)) {
      return super.setPoint(pointIndex, pointValue);
    }

    return false;
  }

  public getPointView(pointIndex: number): NonNullable<primitive> {
    const setItem = this._set[pointIndex];
    if (
      typeof setItem === 'object'
      || typeof setItem === 'function'
    ) {
      return setItem.toString();
    }

    return setItem;
  }

  public getPointsView(): Array<NonNullable<primitive>> {
    const view: Array<NonNullable<primitive>> = []
    this._forEachPoint((_, i) => {
      view.push(this.getPointView(i));
    })
    return view;
  }

  public getMinBorderView(): NonNullable<primitive> {
    return this.getPointView(this.minBorder);
  }

  public getMaxBorderView(): NonNullable<primitive> {
    return this.getPointView(this.maxBorder);
  }

  protected _initConfig(config: Partial<Configuration>) {
    this._isSetValid(config.set);
    this._set = [...config.set];

    const minIndex = config.min || 0;
    const maxIndex = config.max || this.lastIndexOfSet;
    const points = config.points || [minIndex, maxIndex];
    this._initialState = [minIndex, ...points, maxIndex];
    this._isInitialStateValid();

    this._pp.setBorders(minIndex, maxIndex);
    this.resetCurrentStateToInitial();

    this._step = this._isStepValid(config.step) ? config.step : 1;
  }

  protected _isStepValid(step: unknown): step is number {
    if (this._isInteger(step)) {
      return super._isStepValid(step);
    }

    return false;
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
