import * as $ from 'jquery';
import { HORIZONTAL } from './Constants';
import { orientation } from './Types';

const className = {
  CONNECT: 'slider__connect',
};

const Modifier = {
  VISIBLE: 'slider__connect_visible',
};

class Handle {
  protected _id: number;
  protected _elem: JQuery<HTMLElement>;
  protected _orientation: orientation;

  constructor(id: number = 0, orientation: orientation = HORIZONTAL, connectClass: string = className.CONNECT) {
    this._id = id;
    this._elem = this._getTemplate(id, connectClass);
    this._orientation = orientation;
  }

  public setId(id: number) {
    this._id = id;
    this._elem.attr('data-item', id);
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

  protected _getTemplate(id: number = 0, connectClass: string = className.CONNECT) {
    const elem = $('<div>');
    elem.attr('data-item', id);
    elem.addClass(connectClass);
    elem.css('transform', 'translate(0px, 0px) scale(0, 0)');
    return elem;
  }

  protected _translateX(x: number = 0, scaleX: number = 0): void {
    this._elem.css('transform', `translate(${x}%, 0px) scale(${scaleX}%, 0)`);
  }

  protected _translateY(y: number = 0, scaleY: number = 0): void {
    this._elem.css('transform', `translate(0px, ${y}%) scale(0, ${scaleY}%)`);
  }
}

export default Handle;
