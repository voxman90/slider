import * as $ from 'jquery';
import { HORIZONTAL } from './Constants';
import { orientation } from './Types';

const className = {
  HANDLE: 'slider__handle',
};

const modifier = {
  ACTIVE: `${className.HANDLE}_active`,
  ORIENTATION_HORIZONTAL: `${className.HANDLE}_orientation_horizontal`,
  ORIENTATION_VERTICAL: `${className.HANDLE}_orientation_vertical`,
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

  protected _getTemplate(id: number = 0, handleClass: string = className.HANDLE) {
    handleClass += (this._orientation === HORIZONTAL)
    ? modifier.ORIENTATION_HORIZONTAL
    : modifier.ORIENTATION_VERTICAL;
    return $('<div>')
      .addClass(handleClass)
      .attr('data-item', id)
      .css('transform', 'translate(0px, 0px)');
  }

  protected _translateX(x: number = 0): void {
    this._elem.css('transform', `translate(${x}%, 0px)`);
  }

  protected _translateY(y: number = 0): void {
    this._elem.css('transform', `translate(0px, ${y}%)`);
  }
}

export default Handle;
