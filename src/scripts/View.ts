import * as $ from "jquery";

import { HORIZONTAL } from "common/constants/Constants";
import { Config, ScaleState, PointStatePlusIndents, PointState, orientation, EventWithData, IntervalState } from "common/types/Types";
import { elemName as sliderElemName } from "components/Slider/Constants";
import Slider from "components/Slider/Slider";

import Subject from "./Subject";
import MathModule from "./MathModule";
import PercentageProcessor from "./PercentageProcessor";

class View extends Subject {
  public slider: Slider;
  protected _mm: MathModule;
  protected _pp: PercentageProcessor;

  constructor(config: Partial<Config>) {
    super();
    this._mm = new MathModule();
    this._pp = new PercentageProcessor(this._mm);
    const {
      orientation = HORIZONTAL,
      values = [],
    } = config;
    let numberOfHandles = values.length;
    try {
      this._isNumberOfHandlesValid(numberOfHandles);
      this.slider = this._createSlider(numberOfHandles, orientation);
      this._attachEventListeners();
    } catch (err: unknown) {
      const isExpectedError = typeof err === 'string';
      if (!isExpectedError) {
        throw(err);
      }

      console.warn(`The config is not valid. Error: ${err}.\nThe default config will be applied.`);
      numberOfHandles = 1;
      this.slider = this._createSlider(numberOfHandles, orientation);
      this._attachEventListeners();
    }
  }

  public setScaleState(state: ScaleState): void {
    this.slider.setState(state);
  }

  public setPointState(state: PointStatePlusIndents, index: number): void {
    this.slider.setHandlePosition(state, index);
  }

  public appendSliderTo(target: JQuery<HTMLElement>): void {
    this.slider.appendTo(target);
  }

  public notify(data?: object): void {
    this._observers.forEach((observer) => observer.update(this, data));
  }

  protected _attachEventListeners(): void {
    [
      {
        component: this.slider.base,
        config: {
          $target: this.slider.base.$elem,
          eventName: 'click',
          handler: this.handleBaseClick,
          data: {
            view: this,
          },
        },
      },
      {
        component: this.slider,
        config: {
          $target: $(document),
          eventName: 'mousemove',
          handler: this.handleDocumentMousemove,
          data: {
            view: this,
          }, 
        },
      },
      {
        component: this.slider,
        config: {
          $target: $(document),
          eventName: 'mouseup',
          handler: this.handleDocumentMouseup,
          data: {
            view: this,
          },
        },
      },
    ].forEach(({ component, config }) => {
      component.attachEventListener(config);
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
  }

  public handleHandleMousedown(event: EventWithData<{ view: View }>): void {
    const { data: { view }} = event;
    console.log(event)
  }

  public handleDocumentMousemove(event: EventWithData<{ view: View }>): void {
    const { data: { view }} = event;
    const activeHandleIndex = view.slider.activeHandleIndex;
    if (activeHandleIndex !== null) {
      console.log(event)
    }
  }

  public handleDocumentMouseup(event: EventWithData<{ view: View }>): void {
    const { data: { view }} = event;
    const activeHandleIndex = view.slider.activeHandleIndex;
    if (activeHandleIndex !== null) {
      console.log(event)
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
      console.log(event);
    }
  }

  protected _getRelativeToSliderBasePercent(view: View, event: MouseEvent): number | null {
    const base = view.slider.base.$elem.get(0);
    if (base === undefined) {
      return null;
    }

    return this._getRelativePercent(event, base, this.slider.orientation);
  }

  protected _getRelativePercent(event: MouseEvent, elem: HTMLElement, orientation: orientation): number {
    const rect = elem.getBoundingClientRect();
    if (orientation === HORIZONTAL) {
      const offset = this._mm.sub(event.clientX, rect.left);
      return this._pp.reflectOnScale(offset, 0, rect.width);
    }

    const offset = this._mm.sub(event.clientY, rect.top);
    return this._pp.reflectOnScale(offset, 0, rect.height);
  }

  protected _getRelativeOffset(event: MouseEvent, rect: DOMRect): number {
    if (this.slider.orientation === HORIZONTAL) {
      return this._getRelativeOffsetForAxisX(event, rect);
    }

    return this._getRelativeOffsetForAxisY(event, rect);
  }

  protected _getRelativeCoordinates(event: MouseEvent, rect: DOMRect): { offsetX: number, offsetY: number } {
    return {
      offsetX: this._getRelativeOffsetForAxisX(event, rect),
      offsetY: this._getRelativeOffsetForAxisY(event, rect),
    }
  }

  protected _getRelativeOffsetForAxisX(event: MouseEvent, rect: DOMRect): number {
    return this._mm.sub(event.clientX, rect.left);
  }

  protected _getRelativeOffsetForAxisY(event: MouseEvent, rect: DOMRect): number {
    return this._mm.sub(event.clientY, rect.top);
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
}

export default View;
