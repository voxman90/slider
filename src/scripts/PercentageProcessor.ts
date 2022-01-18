import MathModule from "./MathModule";

const defaultConf = {
  MIN: 0,
  MAX: 100,
  RATIO: 1,
};

class PercentageProcessor {
  private _mm: MathModule;
  private _min: number;
  private _max: number;
  private _ratio: number;

  constructor(min?: number, max?: number, mm?: MathModule) {
    this._min = defaultConf.MIN;
    this._max = defaultConf.MAX;
    this._ratio = defaultConf.RATIO;
    this._mm = mm || new MathModule();

    this.setBorders(min, max);
  }

  public setMinBorder(min?: number): boolean {
    return this.setBorders(min, this._max);
  }

  public setMaxBorder(max?: number): boolean {
    return this.setBorders(this._min, max);
  }

  public setBorders(min: number = defaultConf.MIN, max: number = defaultConf.MAX): boolean {
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

  public convertOffsetToPercent(referenceVal: number, val: number): number {
    const offset = this._mm.sub(val, referenceVal);
    return this.convertToPercent(offset);
  }

  protected _calculateRatio(): number {
    const rangeLength = this._mm.sub(this._max, this._min);
    return this._mm.div(rangeLength, 100);
  }

  protected _areBordersValid(min: number, max: number): boolean {
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

export default PercentageProcessor;
