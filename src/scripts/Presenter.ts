import Model from './Model';
import View from './View';
import Observer from './Observer';
import Subject from './Subject';
import { HandleState, ModelChanges, SliderState } from './Types';

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

  public attachModel(model: Model): boolean {
    if (this._model === null) {
      model.attach(this);
      this._model = model;
      return true;
    }

    return false;
  }

  public detachModel(model: Model): boolean {
    if (this._model === model) {
      model.detach(this);
      this._model = null;
      return true;
    }

    return false;
  }

  public attachView(view: View): boolean {
    const isViewAlreadyAttached = this._views.indexOf(view) !== -1;
    if (isViewAlreadyAttached) {
      return false;
    }

    this._views.push(view);
    view.attach(this);
    return true;
  }

  public detachView(view: View): void {
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
        this._views.forEach((view) => {
          const handleState = this._getPointState(model, index);
          this._updateHandle(view, index, handleState);
        });
      }
    } else {
      this._views.forEach((view) => {
        const modelState = this._getModelState(model);
        this._updateSlider(view, modelState);
      });
    }
  }

  protected _updateHandle(view: View, index: number, handleState: HandleState) {
    view.setHandleState(index, handleState);
  }

  protected _updateSlider(view: View, sliderState: SliderState) {
    view.setSliderState(sliderState);
  }

  protected _getModelState(model: Model) {
    return {
      scale: model.getPointScale(),
      values: model.getPointsView(),
      distances: model.getDistancesOnScale(),
      min: model.getMinBorderView(),
      max: model.getMaxBorderView(),
      step: model.getStep(),
    };
  }

  protected _getPointPosition(model: Model, index: number) {
    const offset = model.getPointLocationOnScale(index);
    const [leftIndent, rightIndent] = model.getDistanceToBordersOnScale(index);
    return {
      offset,
      leftIndent,
      rightIndent,
    }
  }

  protected _getPointState(model: Model, index: number) {
    const offset = model.getPointLocationOnScale(index);
    const [leftIndent, rightIndent] = model.getDistanceToBordersOnScale(index);
    const view = model.getPointView(index);
    return {
      offset,
      leftIndent,
      rightIndent,
      view,
    };
  }

  protected _processViewUpdate(view: View, event: unknown) {}

  protected _isModel(subject: Subject): subject is Model {
    return subject instanceof Model;
  }

  protected _isView(subject: Subject): subject is View {
    return subject instanceof View;
  }
}

export default Presenter;
