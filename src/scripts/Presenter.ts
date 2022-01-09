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
    if (this._isModel(subject)) {
      this._processModelUpdate(subject, data);
    }

    if (this._isView(subject)) {
      this._processViewUpdate(subject, data);
    }
  }

  public _processModelUpdate(model: Model, changes: object) {}

  public _processViewUpdate(view: View, event: object) {}

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

  protected _isModel(subject: Subject): subject is Model {
    return subject instanceof Model;
  }

  protected _isView(subject: Subject): subject is View {
    return subject instanceof View;
  }
}

export default Presenter;
