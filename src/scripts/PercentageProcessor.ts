import Cache from "scripts/Cache";

import MathModule from "./MathModule";

const ratioCacheCapacity = 256;

class PercentageProcessor {
  protected _mm: MathModule;
  protected _cacheForRatio: Cache<[number, number], number>;

  constructor(mm?: MathModule) {
    this._mm = mm || new MathModule();
    this._cacheForRatio = new Cache(ratioCacheCapacity);
  }

  public convertToPercent(val: number, min: number, max: number): number {
    const ratio = this.calculateRatio(min, max);
    return this._mm.div(val, ratio);
  }

  public convertToValue(percent: number, min: number, max: number): number {
    const ratio = this.calculateRatio(min, max);
    return this._mm.mul(percent, ratio);
  }

  public reflectOnScale(val: number, min: number, max: number): number {
    return this.convertOffsetToPercent(min, val, min, max);
  }

  public convertOffsetToPercent(oldValue: number, newValue: number, min: number, max: number): number {
    const offset = this._mm.sub(newValue, oldValue);
    return this.convertToPercent(offset, min, max);
  }

  public calculateRatio(min: number, max: number): number {
    let ratio = this._cacheForRatio.get([min, max]);
    if (ratio === null) {
      const rangeLength = this._mm.sub(max, min);
      ratio = this._mm.div(rangeLength, 100);
      this._cacheForRatio.set([min, max], ratio);
    }

    return ratio;
  }
}

export default PercentageProcessor;
