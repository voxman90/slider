import MathModule from "./MathModule";

class PercentageScale {
  public min: number;
  private _mm: MathModule;
  private _ratio: number;

  constructor(min: number, max: number, mm?: MathModule) {
    this._mm = mm || new MathModule();
    this.min = 0;
    this._ratio = 1;
    this.setRatio(min, max);
  }

  get max() {
    return this.shift(this.min, 100);
  }

  public setRatio(min: number, max: number): boolean {
    if (min >= max) {
      return false;
    }

    this.min = min;
    this._ratio = this._calculateRatio(min, max);
    return true;
  }

  public convertToPercent(val: number): number {
    return this._mm.div(val, this._ratio);
  }

  public convertToValue(percent: number): number {
    return this._mm.mul(percent, this._ratio);
  }

  public shift(point: number, offsetInPercent: number) {
    const offset = this.convertToValue(offsetInPercent);
    return this._mm.add(point, offset);
  }

  public reflectOnScale(point: number): number {
    return this.convertOffsetToPercent(this.min, point);
  }

  public convertOffsetToPercent(referencePoint: number, point: number): number {
    const offset = this._mm.sub(point, referencePoint);
    return this.convertToPercent(offset);
  }

  private _calculateRatio(min: number, max: number): number {
    const range = this._mm.sub(max, min);
    return this._mm.div(range, 100);
  }
}

export default PercentageScale;
