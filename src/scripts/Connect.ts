import * as $ from 'jquery';
import { HORIZONTAL } from './Constants';
import { orientation } from './Types';

const className = {
  CONNECT: 'slider__connect',
};

const modifier = {
  VISIBLE: `${className.CONNECT}_visible`,
  ORIENTATION_HORIZONTAL: `${className.CONNECT}_orientation_horizontal`,
  ORIENTATION_VERTICAL: `${className.CONNECT}_orientation_vertical`,
};

class Connect {
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

  public move(offset: number): void {
    if (this._orientation === HORIZONTAL) {
      this._translateX(offset);
    }

    this._translateY(offset);
  }

  protected _getTemplate(id: number = 0, connectClass: string = className.CONNECT) {
    connectClass += (this._orientation === HORIZONTAL)
      ? (modifier.ORIENTATION_HORIZONTAL)
      : (modifier.ORIENTATION_VERTICAL);
    return $('<div>')
      .addClass(connectClass)
      .attr('data-item', id)
      .css('transform', 'translate(0px, 0px) scale(0, 0)');
  }

  protected _translateX(x: number = 0, scaleX: number = 0): void {
    this._elem.css('transform', `translate(${x}%, 0px) scale(${scaleX}%, 0)`);
  }

  protected _translateY(y: number = 0, scaleY: number = 0): void {
    this._elem.css('transform', `translate(0px, ${y}%) scale(0, ${scaleY}%)`);
  }
}

export default Connect;
