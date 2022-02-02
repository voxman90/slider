import * as $ from "jquery";

import { HORIZONTAL } from "common/constants/Constants";
import { Configuration, ModelState, PointState, orientation, EventWithData } from "common/types/Types";
import Slider from "components/Slider/Slider";

import Subject from "./Subject";
import { elemName as sliderElemName } from "components/Slider/Constants";

class View extends Subject {
  public slider: Slider;

  constructor(config: Partial<Configuration>) {
    super();
    const {
      orientation = HORIZONTAL,
      points = [],
    } = config;
    let numberOfHandles = points.length;
    try {
      this._isNumberOfHandlesValid(numberOfHandles);
      this.slider = this._createSlider(numberOfHandles, orientation);
      this.attachEventListeners();
    } catch (err: unknown) {
      const isExpectedError = typeof err === 'string';
      if (!isExpectedError) {
        throw(err);
      }

      console.warn(`The config is not valid. Error: ${err}.\nThe default config will be applied.`);
      numberOfHandles = 1;
      this.slider = this._createSlider(numberOfHandles, orientation);
      this.attachEventListeners();
    }
  }

  public setSliderState(state: ModelState) {
    this.slider.setState(state);
  }

  public setHandlePositions(points: Array<PointState>) {
    points.forEach((state, index) => {
      this.setHandlePosition(index, state);
    });
  }

  public setHandlePosition(index: number, state: PointState) {
    this.slider.setHandlePosition(index, state);
  }

  public appendSliderTo(target: JQuery<HTMLElement>) {
    this.slider.appendTo(target);
  }

  public attachEventListeners() {
    this.slider.base.attachEventListener({
      $target: this.slider.base.$elem,
      eventName: 'click',
      handler: this.handleBaseClick,
      data: {
        view: this,
      },
    });

    this.slider.handles.forEach((handle, index) => {
      handle.attachEventListener({
        $target: handle.$elem,
        eventName: 'mousedown',
        handler: this.handleHandleMousedown,
        data: {
          view: this,
          index,
        },
      });
    });

    this.slider.attachEventListener({
      $target: $(document),
      eventName: 'mousemove',
      handler: this.handleDocumentMousemove,
      data: {
        view: this,
      },
    });

    this.slider.attachEventListener({
      $target: $(document),
      eventName: 'mouseup',
      handler: this.handleDocumentMouseup,
      data: {
        view: this,
      },
    });
  }

  public handleHandleMousedown(event: EventWithData<{ view: View }>): void {
    const { data: { view }} = event;
    view.notify({
      type: ['handle', 'mousedown'],
      event,
    });
  }

  public handleDocumentMousemove(event: EventWithData<{ view: View }>): void {
    const { data: { view }} = event;
    const activeHandleIndex = view.slider.activeHandleIndex;
    if (activeHandleIndex !== null) {
      view.notify({
        type: ['slider', 'mousemove'],
        event,
      });
    }
  }

  public handleDocumentMouseup(event: EventWithData<{ view: View }>): void {
    const { data: { view }} = event;
    const activeHandleIndex = view.slider.activeHandleIndex;
    if (activeHandleIndex !== null) {
      view.notify({
        type: ['slider', 'mouseup'],
        event,
      });
    }
  }

  public handleBaseClick(event: EventWithData<{ view: View }>): void {
    const {
      target,
      data: { view },
    } = event;
    const baseClassName = view.slider.getElementClassName(sliderElemName.BASE);
    const trackClassName = view.slider.getElementClassName(sliderElemName.TRACK);
    const connectClassName = view.slider.getElementClassName(sliderElemName.CONNECT);
    if (
      target instanceof HTMLElement
      && (
        $(target).hasClass(baseClassName)
        || $(target).hasClass(trackClassName)
        || $(target).hasClass(connectClassName)
      )
    ) {
      view.notify({
        type: ['base', 'click'],
        event,
      });
    }
  }

  private _createSlider(numberOfHandles: number, orientation: orientation): Slider {
    return new Slider({ numberOfHandles, orientation });
  }

  private _isNumberOfHandlesValid(numberOfHandles: number | undefined): asserts numberOfHandles is number {
    if (numberOfHandles === undefined) {
      throw 'number of points is undefined';
    }

    if (numberOfHandles === 0) {
      throw 'number of handles is zero';
    }
  }

  public notify(data?: object): void {
    this._observers.forEach((observer) => observer.update(this, data));
  }
}

export default View;
