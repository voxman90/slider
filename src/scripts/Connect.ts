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
  protected _offset: number;
  protected _size: number;

  constructor(id: number = 0, orientation: orientation = HORIZONTAL, classes: string = className.CONNECT) {
    this._id = id;
    this._elem = this._getTemplate(id, classes);
    this._orientation = orientation;
    this._offset = 0;
    this._size = 0;
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

  public move(offset: number = 0): void {
    this._offset = offset;
    this._transform(offset, this._size);
  }

  public resize(size: number = 0): void {
    this._size = size;
    this._transform(this._offset, size);
  }

  public moveAndResize(offset: number = 0, size: number = 0) {
    this._offset = offset;
    this._size = size;
    this._transform(offset, size);
  }

  public makeVisible() {
    this._elem.addClass(modifier.VISIBLE);
  }

  public makeInvisible() {
    this._elem.removeClass(modifier.VISIBLE);
  }

  protected _getTemplate(id: number, classes: string) {
    classes += (this._orientation === HORIZONTAL)
      ? modifier.ORIENTATION_HORIZONTAL
      : modifier.ORIENTATION_VERTICAL;
    return $('<div>').addClass(classes)
      .attr('data-item', id)
      .css('transform', 'translate(0px, 0px) scale(0, 0)');
  }

  protected _transform(offset: number, size: number): void {
    if (this._orientation === HORIZONTAL) {
      this._elem.css('transform', `translate(${offset}%, 0px) scale(${size}%, 0)`);
    }

    this._elem.css('transform', `translate(0px, ${offset}%) scale(0, ${size}%)`);
  }
}

export default Connect;
