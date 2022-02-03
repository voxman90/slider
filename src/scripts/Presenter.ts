import { ModelChanges, PointState, ModelState, EventWithData, ViewChanges } from 'common/types/Types';

import Model from './Model';
import View from './View';
import Observer from './Observer';
import Subject from './Subject';
import PercentageProcessor from './PercentageProcessor';
import MathModule from './MathModule';

interface viewHandlerMatrix {
  [EventTarget: string]: {
    [EventType: string]: <T>(view: View, event: EventWithData<T>) => void;
  }
}

class Presenter extends Observer {
  protected _model: Model;
  protected _views: Array<View>;
  protected _mm: MathModule;
  protected _pp: PercentageProcessor;

  constructor(model: Model) {
    super();
    this._mm = new MathModule();
    this._pp = new PercentageProcessor(this._mm);
    this._model = model;
    this._views = [];
  }

  public update(subject: Subject, data: ModelChanges | ViewChanges<any>): void {
    if (
      this._isModel(subject)
      && this._model === subject
    ) {
      this._processModelUpdate(subject, data as ModelChanges);
    }

    if (this._isView(subject)) {
      this._processViewUpdate(subject, data as ViewChanges<any>);
    }
  }

  public attachToModel(model: Model): void {
    this._model.detach(this);
    model.attach(this);
    this._model = model;
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

  protected _processModelUpdate(model: Model, changes: ModelChanges) {
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

  protected _processViewUpdate<T>(view: View, data: ViewChanges<T>): void {
    const viewHandlerMatrix: viewHandlerMatrix = {
      'base': {
        'click': this._processViewSliderBaseClick,
      },
      'handle': {
        'mousedown': this._processViewSliderHandleMousedown,
      },
      'window': {
        'mousemove': this._processViewSliderWindowMousemove,
        'mouseup': this._processViewSliderWindowMouseup,
      },
    };
    const {
      type: [eventTarget, eventType],
      event,
    } = data;
    viewHandlerMatrix[eventTarget][eventType]?.call(this, view, event);
  }

  protected _getSliderBaseRelativePosition(view: View, event: EventWithData<any>): any {
    const $base = view.slider.base.$elem;
    const baseRect = this._getBoundClientRect($base);
    if (baseRect === null) {
      return null;
    }

    const { x: basePageX, y: basePageY } = baseRect;
    const { pageX, pageY } = event;
    console.log($base.offset(), baseRect, pageX, pageY)
  }

  private _getRelativeCoordinatesPercentage(baseWidth: number, baseHeight: number, left: number, top: number) {
    this._pp.reflectOnScale
    return {
      offsetX: 1,
      offsetY: 1,
    };
  }

  private _getRelativePointCoordinates(pointClientX: number, pointClientY: number, basePageX: number, basePageY: number) {
    return {
      left: this._mm.sub(pointClientX, basePageX),
      top: this._mm.sub(pointClientY, basePageY),
    };
  }

  protected _getBoundClientRect($elem: JQuery<HTMLElement>): DOMRect | null {
    const elem = $elem.get(0);
    if (elem === undefined) {
      return null;
    }

    return elem.getBoundingClientRect();
  }

  protected _processViewSliderBaseClick<T>(view: View, event: EventWithData<T>): void {
    this._getSliderBaseRelativePosition(view, event)
  }

  protected _processViewSliderHandleMousedown<T>(view: View, event: EventWithData<T>): void {
    console.log(event)
  }

  protected _processViewSliderWindowMousemove<T>(view: View, event: EventWithData<T>): void {
    console.log(event)
  }

  protected _processViewSliderWindowMouseup<T>(view: View, event: EventWithData<T>): void {
    console.log(event)
  }

  protected _isModel(subject: Subject): subject is Model {
    return subject instanceof Model;
  }

  protected _isView(subject: Subject): subject is View {
    return subject instanceof View;
  }
}

export default Presenter;
