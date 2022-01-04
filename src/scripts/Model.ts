import Subject from './Subject';
import DataProcessor from './DataProcessor';
import DataProcessorFactory from './DataProcessorFactory';
import { Configuration } from './Types';

class Model extends Subject {
  private _dp: DataProcessor;

  constructor (config: Partial<Configuration>) {
    super();
    this._dp = DataProcessorFactory(config);
  }

  public getPointValue(pointIndex: number): number {
    return this._dp.getPointValue(pointIndex);
  }

  public getPointValues() {
    return this._dp.getPointValues();
  }

  public getDistanceToBorders(pointIndex: number): [number, number] {
    return this._dp.getDistanceToBorders(pointIndex);
  }

  public getDistances() {
    return this._dp.getDistances();
  }

  public getPointLocationOnScale(pointIndex: number): number {
    return this._dp.getPointLocationOnScale(pointIndex);
  }

  public getPointScale() {
    return this._dp.getPointScale();
  }

  public getMinBorder() {
    return this._dp.minBorder;
  }

  public getMaxBorder() {
    return this._dp.maxBorder;
  }

  public getStep() {
    return this._dp.getStep();
  }

  public setPointValue(pointIndex: number, pointValue: number): boolean {
    const isValueSet = this._dp.setPoint(pointIndex, pointValue);
    if (isValueSet) {
      this._notify();
      return true;
    }

    return false;
  }

  public setStep(step: number): boolean {
    const isStepSet = this._dp.setStep(step);
    if (isStepSet) {
      this._notify();
      return true;
    }

    return false;
  }

  public setMinBorder(minBorder: number): boolean {
    const isMinBorderSet = this._dp.setMinBorder(minBorder);
    if (isMinBorderSet) {
      this._notify();
      return true;
    }

    return false;
  }

  public setMaxBorder(maxBorder: number): boolean {
    const isMaxBorderSet = this._dp.setMaxBorder(maxBorder);
    if (isMaxBorderSet) {
      this._notify();
      return true;
    }

    return false;
  }

  protected _notify() {
    this._observers.forEach((observer) => {
      observer.update(this);
    });
  }
}

export default Model;
