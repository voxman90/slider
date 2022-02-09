import { ALPHABET } from 'common/constants/Constants';
import { Config, NonBottomValue, primitive } from 'common/types/Types';

import DataProcessor from './DataProcessor';

type keysForConfig = 'min' | 'max' | 'step' | 'values' | 'set';
type ConfigForSet = Pick<Config, keysForConfig>;

const defaultConfig: ConfigForSet = {
  min: 0,
  max: 25,
  step: 1,
  values: [0],
  set: [...ALPHABET],
};

class DataProcessorForSet extends DataProcessor<keysForConfig> {
  private _set: Array<NonBottomValue>;

  constructor (config: Partial<Config>) {
    super();
    this._set = [];
    this._init(config, defaultConfig);
  }

  public get lastIndexOfSet(): number {
    return this._set.length - 1;
  }

  public setMinBoundary(min: number): boolean {
    if (
      Number.isInteger(min)
      && 0 <= min
    ) {
      return super.setMinBoundary(min);
    }

    return false;
  }

  public setMaxBoundary(max: number): boolean {
    if (
      Number.isInteger(max)
      && max <= this.lastIndexOfSet
    ) {
      return super.setMaxBoundary(max);
    }

    return false;
  }

  public getView(index: number): NonNullable<primitive> {
    const item = this._set[index];
    if (
      typeof item === 'object'
      || typeof item === 'function'
    ) {
      return item.toString();
    }

    return item;
  }

  public setStep(step: number): boolean {
    if (Number.isInteger(step)) {
      return super.setStep(step);
    }

    return false;
  }

  public setPoint(val: number, index: number): boolean {
    if (Number.isInteger(val)) {
      return super.setPoint(val, index);
    }

    return false;
  }

  protected _isValidGridDensity(density: number, from: number, to: number): boolean {
    if (Number.isInteger(density)) {
      return super._isValidGridDensity(density, from, to);
    }

    return false;
  }

  protected _isValidGridFromAndTo(from: number, to: number): boolean {
    if (
      Number.isInteger(from)
      && Number.isInteger(to)
    ) {
      return super._isValidGridFromAndTo(from, to);
    }

    return false;
  }

  protected _setState(config: ConfigForSet): void {
    const {
      set,
      values,
      min,
      max,
      step,
    } = config;

    this._pp.setBoundaries(min, max);
    this._points = this.createPoints([min, ...values, max]);
    this._intervals = this.createIntervals(this._points);
    this._set = [...set]; // TODO: Need deep clone or enough shallow copy?
    this._step = step;
  }

  protected _isValidConfig(config: Partial<Config>): asserts config is ConfigForSet {
    const {
      set,
      values,
      min,
      max,
      step,
    } = config;

    if (values === undefined) {
      throw "Values is undefined";
    }

    if (min === undefined) {
      throw "Min is undefined";
    }

    if (max === undefined) {
      throw "Max is undefined";
    }

    this._isValidSet(set);
    this._isValidPointValues([min, ...values, max]);
    this._isValidStep(step, min, max);
  }

  protected _isValidStep(step: unknown, min: number, max: number): asserts step is number {
    if (!this._isInteger(step)) {
      throw "Step is non-integer";
    }

    return super._isValidStep(step, min, max);
  }

  protected _isValidSet(set: unknown): asserts set is Array<NonBottomValue> {
    if (!Array.isArray(set)) {
      throw "Set is not array";
    }

    const hasBottomValue = set.some((val) => val == null);
    if (hasBottomValue) {
      throw "Set has undefined or null-ish values";
    }
  }

  protected _isValidPointValues(values: Array<unknown>): asserts values is Array<number> {
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
}

export default DataProcessorForSet;
