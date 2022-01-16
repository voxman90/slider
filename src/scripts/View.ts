import { Configuration, direction, HandleState, orientation, SliderState } from './Types';
import Subject from './Subject';
import Track from './Track';
import Handle from './Handle';
import Connect from './Connect';
import { HORIZONTAL } from './Constants';

const className = {
  SLIDER: 'slider',
  TRACK: 'slider__track',
};

// TODO: Move to Constants
const defaultConfig = {
  points: [0.5],
};

class View extends Subject {
  protected _orientation: orientation;
  protected _slider: JQuery<HTMLElement>;
  protected _track?: Track;
  protected _handles: Array<Handle>;
  protected _connects: Array<Connect>;

  constructor(config: Partial<Configuration>) {
    super();
    this._slider = $('<div>');
    this._connects = [];
    this._handles = [];
    this._orientation = HORIZONTAL;

    try {
      this._init(config);
    } catch (err: unknown) {
      const isExpectedError = typeof err === 'string';
      if (!isExpectedError) {
        throw(err);
      }

      console.warn(`The config is not valid. Error: ${err}.\nThe default config will be applied.`);
      this._init(defaultConfig);
    }
  }

  public get numberOfHandles() {
    return this._handles.length;
  }

  public setSliderState(sliderState: SliderState) {
    const { scale, distances, values, min, max, step } = sliderState;
  }

  public setHandleState(index: number, handleState: HandleState) {
    const { offset, leftIndent, rightIndent } = handleState;
    const handle = this._handles[index];
  }

  public appendSliderTo(target: JQuery<HTMLElement>) {
    this._slider.appendTo(target);
  }

  protected _init(config: Partial<Configuration>) {
    const {
      orientation = HORIZONTAL,
      points,
    } = config;

    const numberOfHandles = points && points.length;
    this._isNumberOfHandlesValid(numberOfHandles);

    this._slider = this._createSlider(numberOfHandles, orientation);
  }

  private _isNumberOfHandlesValid(numberOfHandles: number | undefined): asserts numberOfHandles is number {
    if (numberOfHandles === undefined) {
      throw 'number of points is undefined';
    }

    if (numberOfHandles === 0) {
      throw 'number of handles is zero';
    }
  }

  protected _createSlider(numberOfHandles: number, orientation: orientation): JQuery<HTMLElement> {
    const slider = $('<div>').addClass(className.SLIDER);
    this._track = this._createTrack(orientation);
    this._handles = this._createHandles(numberOfHandles, orientation);
    this._connects = this._createConnects(numberOfHandles, orientation);
    this._track.appendTo(slider);
    this._handles.forEach((handle) => handle.appendTo(slider));
    this._connects.forEach((connect) => connect.appendTo(slider));
    return slider;
  }

  protected _createHandles(numberOfHandles: number, orientation: orientation, className?: string): Array<Handle> {
    const handles = [];
    for (let id = 0; id < numberOfHandles; id += 1) {
      const handle = new Handle(id, orientation, className);
      handles.push(handle);
    }
    return handles;
  }

  protected _createHandle(id: number, orientation: orientation, className?: string): Handle {
    return new Handle(id, orientation, className);
  }

  protected _createConnects(numberOfHandles: number, orientation: orientation, className?: string): Array<Connect> {
    const numberOfConnects = numberOfHandles + 1;
    const connects = [];
    for (let id = 0; id < numberOfConnects; id += 1) {
      const connect = new Connect(id, orientation, className);
      connects.push(connect);
    }
    return connects;
  }

  protected _createConnect(id: number, orientation: orientation, className?: string): Connect {
    return new Connect(id, orientation, className);
  }

  protected _createTrack(orientation: orientation, className?: string) {
    return new Track(orientation, className);
  }

  protected _notify(data?: object): void {
    this._observers.forEach((observer) => observer.update(this, data));
  }
}

export default View;
