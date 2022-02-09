import PercentageProcessor from "./PercentageProcessor";
import MathModule from "./MathModule";

const defaultConfig = {
  MIN: 0,
  MAX: 100,
  RATIO: 1,
};

class PercentageProcessorFixed extends PercentageProcessor {
  private _min: number;
  private _max: number;
  private _ratio: number;

  constructor (config: { mm: MathModule, min?: number, max?: number }) {
    const {
      mm,
      min,
      max,
    } = config;
    super(mm);
    this._min = defaultConfig.MIN;
    this._max = defaultConfig.MAX;
    this._ratio = defaultConfig.RATIO;
    this.setBoundaries(min, max);
  }

  public setMinBoundary(min: number): boolean {
    return this.setBoundaries(min, this._max);
  }

  public setMaxBoundary(max: number): boolean {
    return this.setBoundaries(this._min, max);
  }

  public setBoundaries(min?: number, max?: number): boolean {
    const boundaries = [min, max];
    if (this._areBoundariesValid(boundaries)) {
      [this._min, this._max] = boundaries;
      this._ratio = this._calculateRatio();
      return true;
    }

    console.warn('A min or max is not valid');
    return false;
  }

  public convertToPercent(val: number): number {
    return this._mm.div(val, this._ratio);
  }

  public convertToValue(percent: number): number {
    return this._mm.mul(percent, this._ratio);
  }

  public shift(val: number, offsetInPercent: number) {
    const offset = this.convertToValue(offsetInPercent);
    return this._mm.add(val, offset);
  }

  public reflectOnScale(val: number): number {
    return this.convertOffsetToPercent(this._min, val);
  }

  public convertOffsetToPercent(oldValue: number, newValue: number): number {
    const offset = this._mm.sub(newValue, oldValue);
    return this.convertToPercent(offset);
  }

  private _calculateRatio(): number {
    return super.calculateRatio(this._min, this._max);
  }

  private _areBoundariesValid(boundaries: unknown[]): boundaries is number[] {
    const [min, max] = boundaries;
    if (
      this._isFinite(min)
      && this._isFinite(max)
      && min < max
    ) {
      return true;
    }

    return false;
  }

  private _isFinite(val: unknown): val is number {
    return Number.isFinite(val);
  }
}

export default PercentageProcessorFixed;
