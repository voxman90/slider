import Subject from './Subject';
import DataProcessor from './DataProcessor';
import DataProcessorFactory from './DataProcessorFactory';
import { Configuration, primitive } from './Types';

class Model extends Subject {
  private _dp: DataProcessor;

  constructor (config: Partial<Configuration>) {
    super();
    this._dp = DataProcessorFactory(config);
  }

  public setPointValue(pointIndex: number, pointValue: number): boolean {
    const isValueSet = this._dp.setPoint(pointIndex, pointValue);
    if (isValueSet) {
      const changes = { scope: 'point', index: pointIndex };
      this._notify(changes);
      return true;
    }

    return false;
  }

  public setPoints(points: Array<number>): boolean {
    const isPointsSet = this._dp.setPoints(points);
    if (isPointsSet) {
      const changes = { scope: 'all' };
      this._notify(changes);
      return true;
    }

    return false;
  }

  public setStep(step: number): boolean {
    const isStepSet = this._dp.setStep(step);
    if (isStepSet) {
      const changes = { scope: 'all' };
      this._notify(changes);
      return true;
    }

    return false;
  }

  public setMinBorder(minBorder: number): boolean {
    const isMinBorderSet = this._dp.setMinBorder(minBorder);
    if (isMinBorderSet) {
      const changes = { scope: 'all' };
      this._notify(changes);
      return true;
    }

    return false;
  }

  public setMaxBorder(maxBorder: number): boolean {
    const isMaxBorderSet = this._dp.setMaxBorder(maxBorder);
    if (isMaxBorderSet) {
      const changes = { scope: 'all' };
      this._notify(changes);
      return true;
    }

    return false;
  }

  public getPointValue(pointIndex: number): number {
    return this._dp.getPointValue(pointIndex);
  }

  public getPointValues() {
    return this._dp.getPointValues();
  }

  public getDistanceToBorders(pointIndex: number): Array<number> {
    return this._dp.getDistanceToBorders(pointIndex);
  }

  public getDistanceToBordersOnScale(pointIndex: number): Array<number> {
    return this._dp.getDistanceToBordersOnScale(pointIndex);
  }

  public getDistances() {
    return this._dp.getDistances();
  }

  public getDistancesOnScale() {
    return this._dp.getDistancesOnScale();
  }

  public getPointLocationOnScale(pointIndex: number): number {
    return this._dp.getPointLocationOnScale(pointIndex);
  }

  public getPointScale() {
    return this._dp.getPointScale();
  }

  public getPointView(pointIndex: number): NonNullable<primitive> {
    return this._dp.getPointView(pointIndex);
  }

  public getPointsView(): Array<NonNullable<primitive>> {
    return this._dp.getPointsView();
  }

  public getMinBorder() {
    return this._dp.minBorder;
  }

  public getMaxBorder() {
    return this._dp.maxBorder;
  }

  public getMinBorderView() {
    return this._dp.getMinBorderView();
  }

  public getMaxBorderView() {
    return this._dp.getMaxBorderView();
  }

  public getStep() {
    return this._dp.getStep();
  }

  public resetStateToInitial() {
    this._dp.resetCurrentStateToInitial();
    const changes = { scope: 'all' };
    this._notify(changes);
  }

  protected _notify(changes: object) {
    this._observers.forEach((observer) => {
      observer.update(this, changes);
    });
  }
}

export default Model;
