import Subject from './Subject';
import DataProcessor from './DataProcessor';
import DataProcessorFactory from './DataProcessorFactory';
import { Configuration, ModelState, PointState, primitive } from './Types';

class Model extends Subject {
  private _dp: DataProcessor;

  constructor (config: Partial<Configuration>) {
    super();
    this._dp = DataProcessorFactory(config);
  }

  public notifyAll(): void {
    this._notify({ scope: 'all' });
  }

  public setPointValue(index: number, val: number): boolean {
    const isValueSet = this._dp.setPoint(index, val);
    if (isValueSet) {
      this._notifyAboutPointChanges(index);
      return true;
    }

    return false;
  }

  public setPoints(points: Array<number>): boolean {
    const isPointsSet = this._dp.setPoints(points);
    if (isPointsSet) {
      this.notifyAll();
      return true;
    }

    return false;
  }

  public setStep(step: number): boolean {
    const isStepSet = this._dp.setStep(step);
    if (isStepSet) {
      this.notifyAll();
      return true;
    }

    return false;
  }

  public setMinBorder(minBorder: number): boolean {
    const isMinBorderSet = this._dp.setMinBorder(minBorder);
    if (isMinBorderSet) {
      this.notifyAll();
      return true;
    }

    return false;
  }

  public setMaxBorder(maxBorder: number): boolean {
    const isMaxBorderSet = this._dp.setMaxBorder(maxBorder);
    if (isMaxBorderSet) {
      this.notifyAll();
      return true;
    }

    return false;
  }

  public getState(): ModelState {
    return {
      points: this.getPoints(),
      min: this.getMinBorderView(),
      max: this.getMaxBorderView(),
      step: this.getStep(),
    };
  }

  public getPoints(): Array<PointState> {
    const points = [];
    for(let i = 0; i < this._dp.lastPointIndex; i += 1) {
      points.push(this.getPointState(i));
    }
    return points;
  }

  public getPointState(index: number): PointState {
    const offset = this.getPointLocationOnScale(index);
    const [leftIndent, rightIndent] = this.getDistanceToBordersOnScale(index);
    const view = this.getPointView(index);
    return {
      offset,
      leftIndent,
      rightIndent,
      view,
    };
  }

  public getPointValue(index: number): number {
    return this._dp.getPointValue(index);
  }

  public getPointValues() {
    return this._dp.getPointValues();
  }

  public getDistanceToBorders(index: number): Array<number> {
    return this._dp.getDistanceToBorders(index);
  }

  public getDistanceToBordersOnScale(index: number): Array<number> {
    return this._dp.getDistanceToBordersOnScale(index);
  }

  public getDistances() {
    return this._dp.getDistances();
  }

  public getDistancesOnScale() {
    return this._dp.getDistancesOnScale();
  }

  public getPointLocationOnScale(index: number): number {
    return this._dp.getPointLocationOnScale(index);
  }

  public getPointScale() {
    return this._dp.getPointScale();
  }

  public getPointView(index: number): NonNullable<primitive> {
    return this._dp.getPointView(index);
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
    this.notifyAll();
  }

  protected _notifyAboutPointChanges(index: number) {
    const changes = { scope: 'point', index };
    this._notify(changes);
  }

  protected _notify(changes: object) {
    this._observers.forEach((observer) => {
      observer.update(this, changes);
    });
  }
}

export default Model;
