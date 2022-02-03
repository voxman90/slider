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

  constructor (config: Partial<{ mm: MathModule, min: number, max: number }> = {}) {
    const {
      mm,
      min,
      max,
    } = config;
    super(mm);
    this._min = defaultConfig.MIN;
    this._max = defaultConfig.MAX;
    this._ratio = defaultConfig.RATIO;
    this.setBorders(min, max);
  }

  public setMinBorder(min: number): boolean {
    return this.setBorders(min, this._max);
  }

  public setMaxBorder(max: number): boolean {
    return this.setBorders(this._min, max);
  }

  public setBorders(min: number = defaultConfig.MIN, max: number = defaultConfig.MAX): boolean {
    if (this._areBordersValid(min, max)) {
      this._min = min;
      this._max = max;
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

  private _areBordersValid(min: number, max: number): boolean {
    if (
      Number.isFinite(min)
      && Number.isFinite(max)
      && min < max
    ) {
      return true;
    }

    return false;
  }
}

export default PercentageProcessorFixed;
