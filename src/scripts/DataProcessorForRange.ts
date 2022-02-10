import { Config } from "common/types/Types";

import DataProcessor from './DataProcessor';

type keysForConfig = 'min' | 'max' | 'step' | 'values';
type ConfigForRange = Pick<Config, keysForConfig> & { range?: [number, number] };

const defaultConfig: ConfigForRange = {
  min: 0,
  max: 100,
  step: 1,
  values: [50],
};

class DataProcessorForRange extends DataProcessor<keysForConfig> {
  constructor (config: Partial<Config>) {
    super();
    this._init(config, defaultConfig);
  }

  public setMinBoundary(min: number): boolean {
    if (Number.isFinite(min)) {
      return super.setMinBoundary(min);
    }

    return false;
  }

  public setMaxBoundary(max: number): boolean {
    if (Number.isFinite(max)) {
      return super.setMaxBoundary(max);
    }

    return false;
  }

  public setStep(step: number): boolean {
    if (Number.isFinite(step)) {
      return super.setStep(step);
    }

    return false;
  }

  protected _setState(config: ConfigForRange): void {
    let {
      values,
      min,
      max,
      step,
      range,
    } = config;

    if (range !== undefined) {
      [min, max] = range;
    }

    this._pp.setBoundaries(min, max);
    this._minBoundary.value = min;
    this._maxBoundary.value = max;
    this._points = this.createPoints(values);
    this._intervals = this.createIntervals([this._minBoundary, ...this._points, this._maxBoundary]);
    this._step = step;
  }

  protected _isValidConfig(config: Partial<Config>): asserts config is ConfigForRange {
    const {
      values,
      min,
      max,
      step,
      range,
    } = config;

    if (values === undefined) {
      throw "Values is undefined";
    }

    if (
      range === undefined
      && (min === undefined || max === undefined)
    ) {
      throw "Range and min or max is undefined";
    }

    if (range !== undefined) {
      this._isValidRange(range);
      const [minBoundary, maxBoundary] = range;
      this._isValidPointValues([minBoundary, ...values, maxBoundary]);
      this._isValidStep(step, minBoundary, maxBoundary);
    }

    if (min !== undefined && max !== undefined) {
      this._isValidPointValues([min, ...values, max]);
      this._isValidStep(step, min, max);
    }
  }

  protected _isValidStep(step: unknown, min: number, max: number): asserts step is number {
    if (!this._isFinite(step)) {
      throw "Step is not finite number";
    }

    return super._isValidStep(step, min, max);
  }

  private _isValidRange(range: unknown): asserts range is [number, number] {
    if (!Array.isArray(range)) {
      throw "Range is not array";
    }

    const isPair = range.length === 2;
    const hasNumericValues = (
      typeof range[0] === 'number'
      && typeof range[1] === 'number'
    );
    if (!isPair || !hasNumericValues) {
      throw "Range is not pair of numbers";
    }

    const isDecreasingSequence = range[0] > range[1];
    if (isDecreasingSequence) {
      throw "Range is decreasing number sequence";
    }
  }

  protected _isValidPointValues(values: unknown): void {
    if (!Array.isArray(values)) {
      throw "Values is not array";
    }

    if (!this._isNonDecreasingSequence(values)) {
      throw "Values is contains a decreasing subsequence";
    }
  }
}

export default DataProcessorForRange;
