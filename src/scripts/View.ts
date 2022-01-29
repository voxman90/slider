import { HORIZONTAL } from 'common/constants/Constants';
import { Configuration, ModelState, PointState, orientation } from 'common/types/Types';
import Slider from 'components/Slider/Slider';

import Subject from './Subject';

class View extends Subject {
  protected _slider: Slider;

  constructor(config: Partial<Configuration>) {
    super();
    const {
      orientation = HORIZONTAL,
      points = [],
    } = config;
    let numberOfHandles = points.length;
    try {
      this._isNumberOfHandlesValid(numberOfHandles);
      this._slider = this._createSlider(numberOfHandles, orientation);
    } catch (err: unknown) {
      const isExpectedError = typeof err === 'string';
      if (!isExpectedError) {
        throw(err);
      }

      console.warn(`The config is not valid. Error: ${err}.\nThe default config will be applied.`);
      numberOfHandles = 1;
      this._slider = this._createSlider(numberOfHandles, orientation);
    }
  }

  public setSliderState(state: ModelState) {
    this._slider.setState(state);
  }

  public setHandlePositions(points: Array<PointState>) {
    points.forEach((state, index) => {
      this.setHandlePosition(index, state);
    });
  }

  public setHandlePosition(index: number, state: PointState) {
    this._slider.setHandlePosition(index, state);
  }

  public appendSliderTo(target: JQuery<HTMLElement>) {
    this._slider.appendTo(target);
  }

  public handleTrackClick(event: MouseEvent & { data: { notify: Function, base: HTMLElement }}): void {
    const { data: { notify, base }} = event;
    const x = event.clientX;
    const y = event.clientY;
    const rect = base.getBoundingClientRect();
    notify({ target: 'track', event: 'click', data: { x, y, rect }});
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

  protected _notify(data?: object): void {
    this._observers.forEach((observer) => observer.update(this, data));
  }
}

export default View;
