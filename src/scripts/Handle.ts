import * as $ from 'jquery';
import { HORIZONTAL } from './Constants';
import { orientation } from './Types';

const className = {
  HANDLE: 'slider__handle',
};

const Modifier = {
  ACTIVE: 'slider__handle_active',
};

class Handle {
  protected _id: number;
  protected _elem: JQuery<HTMLElement>;
  protected _orientation: orientation;

  constructor(id: number = 0, orientation: orientation = HORIZONTAL, handleClass: string = className.HANDLE) {
    this._id = id;
    this._elem = this._getTemplate(id, handleClass);
    this._orientation = orientation;
  }

  public appendTo(target: JQuery<HTMLElement>) {
    this._elem.appendTo(target);
  }

  public prependTo(target: JQuery<HTMLElement>) {
    this._elem.prependTo(target);
  }

  public remove() {
    this._elem.remove();
  }

  public moveHandle(offset: number): void {
    if (this._orientation === HORIZONTAL) {
      this._translateX(offset);
    }

    this._translateY(offset);
  }

  protected _getTemplate(id: number = 0, handleClass: string = className.HANDLE) {
    const elem = $('<div>');
    elem.attr('data-item', id);
    elem.addClass(handleClass);
    elem.css('transform', 'translate(0px, 0px)');
    return elem;
  }

  protected _translateX(x: number = 0): void {
    this._elem.css('transform', `translate(${x}%, 0px)`);
  }

  protected _translateY(y: number = 0): void {
    this._elem.css('transform', `translate(0px, ${y}%)`);
  }
}

export default Handle;
