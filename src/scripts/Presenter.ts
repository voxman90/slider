import { ModelChanges, PointState, ModelState } from 'common/types/Types';

import Model from './Model';
import View from './View';
import Observer from './Observer';
import Subject from './Subject';

class Presenter extends Observer {
  protected _model: Model | null;
  protected _views: Array<View>;

  constructor() {
    super();
    this._model = null;
    this._views = [];
  }

  public update(subject: Subject, data: object = {}): void {
    if (
      this._isModel(subject)
      && this._model === subject
    ) {
      this._processModelUpdate(subject, data);
    }

    if (this._isView(subject)) {
      this._processViewUpdate(subject, data);
    }
  }

  public attachToModel(model: Model): boolean {
    if (this._model === null) {
      model.attach(this);
      this._model = model;
      return true;
    }

    return false;
  }

  public detachFromModel(model: Model): boolean {
    if (this._model === model) {
      model.detach(this);
      this._model = null;
      return true;
    }

    return false;
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

  protected _processModelUpdate(model: Model, changes: Partial<ModelChanges>) {
    if (changes.scope === 'point') {
      const index = changes.index;
      if (index !== undefined) {
        const handleState = this._getPointState(model, index);
        this._views.forEach((view) => {
          this._updateHandleState(view, index, handleState);
        });
      }
    } else {
      const modelState = this._getModelState(model);
      this._views.forEach((view) => {
        this._updateSliderState(view, modelState);
      });
    }
  }

  protected _updateHandleState(view: View, index: number, state: PointState) {
    view.setHandlePosition(index, state);
  }

  protected _updateSliderState(view: View, state: ModelState) {
    view.setSliderState(state);
  }

  protected _getModelState(model: Model): ModelState {
    return model.getState();
  }

  protected _getPointState(model: Model, index: number): PointState {
    return model.getPointState(index);
  }

  protected _processViewUpdate(view: View, event: unknown) {
    console.log(view, event);
  }

  protected _isModel(subject: Subject): subject is Model {
    return subject instanceof Model;
  }

  protected _isView(subject: Subject): subject is View {
    return subject instanceof View;
  }
}

export default Presenter;
