import { Config, ScaleState, PointState, IntervalState, primitive } from 'common/types/Types';

import Subject from './Subject';
import ScaleProcessorFactory from './ScaleProcessorFactory';
import ScaleProcessorForRange from './ScaleProcessorForRange';
import ScaleProcessorForSet from './ScaleProcessorForSet';

class Model extends Subject {
  private _scale: ScaleProcessorForRange | ScaleProcessorForSet;

  constructor (config: Partial<Config>) {
    super();
    this._scale = ScaleProcessorFactory(config);
  }

  public notifyScopePoint(index: number) {
    this.notify({ scope: 'point', index });
  }

  public notifyScopeAll(): void {
    this.notify({ scope: 'all' });
  }

  public notify(changes: object) {
    this._observers.forEach((observer) => {
      observer.update(this, changes);
    });
  }

  public setPoints(values: Array<number>): boolean {
    if (this._scale.setPoints(values)) {
      this.notifyScopeAll();
      return true;
    }

    return false;
  }

  public setPoint(val: number, index: number): boolean {
    if (this._scale.setPoint(val, index)) {
      this.notifyScopePoint(index);
      return true;
    }

    return false;
  }

  public setStep(val: number): boolean {
    if (this._scale.setStep(val)) {
      this.notifyScopeAll();
      return true;
    }

    return false;
  }

  public setMinBoundary(val: number): boolean {
    if (this._scale.setMinBoundary(val)) {
      this.notifyScopeAll();
      return true;
    }

    return false;
  }

  public setMaxBoundary(val: number): boolean {
    if (this._scale.setMaxBoundary(val)) {
      this.notifyScopeAll();
      return true;
    }

    return false;
  }

  public getScaleState(): ScaleState {
    return this._scale.getScaleState();
  }

  public getIntervalState(index: number): IntervalState {
    return this._scale.getIntervalState(index);
  }

  public getPointState(index: number): PointState {
    return this._scale.getPointState(index);
  }

  public getGrid(density: number, from?: number, to?: number): Array<PointState> {
    return this._scale.getGrid(density, from, to);
  }
}

export default Model;
