import { ModelChanges, PointState, IntervalState, ScaleState, ViewChanges, PointStatePlusIndents } from 'common/types/types';

import Model from './Model';
import View from './View';
import Observer from './Observer';
import Subject from './Subject';

class Presenter extends Observer {
  protected _model: Model;
  protected _views: Array<View>;

  constructor(model: Model) {
    super();
    this._model = model;
    this._views = [];
  }

  public update(subject: Subject, data: ModelChanges | ViewChanges<unknown>): void {
    if (
      this._isModel(subject)
      && this._model === subject
      && this._isModelChanges(data)
    ) {
      this._processModelUpdate(subject, data);
    }

    if (
      this._isView(subject)
      && this._isViewChanges(data)
    ) {
      this._processViewUpdate(subject, data);
    }
  }

  public attachToModel(model: Model): void {
    this._model.detach(this);
    this._model = model;
    model.attach(this);
  }

  public attachToView(view: View): boolean {
    const isViewAlreadyAttached = this._views.indexOf(view) !== -1;
    if (isViewAlreadyAttached) {
      return false;
    }

    this._views.push(view);
    view.attach(this);
    return true;
  }

  public detachFromView(view: View): void {
    const index = this._views.indexOf(view);
    const isViewAttached = index !== -1;
    if (isViewAttached) {
      this._views.splice(index, 1);
    }

    view.detach(this);
  }

  protected _processModelUpdate(model: Model, changes: ModelChanges): void {
    if (changes.scope === 'point') {
      const index = changes.index || 0;
      const pointStatePlusIndents = this._getPointStatePlusIndents(model, index);
      this._views.forEach((view) => {
        this._updatePointState(view, pointStatePlusIndents, index);
      });
    } else {
      const modelState = this._getScaleState(model);
      this._views.forEach((view) => {
        this._updateScaleState(view, modelState);
      });
    }
  }

  protected _updatePointState(view: View, state: PointStatePlusIndents, index: number) {
    view.setPointState(state, index);
  }

  protected _updateScaleState(view: View, state: ScaleState) {
    view.setScaleState(state);
  }

  protected _getScaleState(model: Model): ScaleState {
    return model.getScaleState();
  }

  protected _getPointState(model: Model, index: number): PointState {
    return model.getPointState(index);
  }

  protected _getPointStatePlusIndents(model: Model, index: number): PointStatePlusIndents {
    return {
      leftIndent: this._getIntervalState(model, index),
      point: this._getPointState(model, index),
      rightIndent: this._getIntervalState(model, index + 1),
    }
  }

  protected _getIntervalState(model: Model, index: number): IntervalState {
    return model.getIntervalState(index);
  }

  protected _processViewUpdate<T>(view: View, data: ViewChanges<T>): void {
    console.log(data);
  }

  protected _viewPointUpdate(view: View): void {

  }

  protected _viewScaleUpdate(view: View): void {
    
  }

  protected _viewGridUpdate(view: View): void {

  }

  protected _isModel(subject: Subject): subject is Model {
    return subject instanceof Model;
  }

  protected _isModelChanges(data: ModelChanges | ViewChanges<unknown>): data is ModelChanges {
    return data.hasOwnProperty('scope');
  }
  
  protected _isViewChanges(data: ModelChanges | ViewChanges<unknown>): data is ViewChanges<unknown> {
    return data.hasOwnProperty('event');
  }

  protected _isView(subject: Subject): subject is View {
    return subject instanceof View;
  }
}

export default Presenter;
