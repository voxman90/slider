import { Configuration, direction, orientation } from './Types';
import Subject from './Subject';
import Handle from './Handle';
import { HORIZONTAL, LTR } from './Constants';

const className = {
  BASE: 'slider__base',
};

const modifier = {
  BASE_VERTICAL: 'slider__base_vertical',
};

class View extends Subject {
  protected _direction: direction;
  protected _orientation: orientation;
  protected _handles: Array<Handle>;
  protected _connects: Array<Handle>;

  constructor(config: Partial<Configuration>) {
    super();
    this._connects = [];
    this._handles = [];
    this._direction = LTR;
    this._orientation = HORIZONTAL;
  }

  protected _createBase(baseClass: string = className.BASE) {
    if (this._orientation !== HORIZONTAL) {
      baseClass += modifier.BASE_VERTICAL;
    }
    const base = $('div');
    base.addClass(baseClass);
    return base;
  }

  protected _notify(data?: object): void {
    this._observers.forEach((observer) => observer.update(this, data));
  }
}

export default View;
