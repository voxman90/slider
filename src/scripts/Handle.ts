import * as $ from 'jquery';
import { HORIZONTAL } from './Constants';
import { orientation } from './Types';
import SliderElement from './SliderElement';

const ELEM_NAME = 'handle';

const className = {
  HANDLE: `slider__${ELEM_NAME}`,
};

const modifier = {
  ACTIVE: `${className.HANDLE}_active`,
  ORIENTATION_HORIZONTAL: `${className.HANDLE}_orientation_horizontal`,
  ORIENTATION_VERTICAL: `${className.HANDLE}_orientation_vertical`,
};

class Handle extends SliderElement {
  protected _index: number;
  protected _elem: JQuery<HTMLElement>;
  protected _orientation: orientation;
  protected _offset: number;

  constructor(index: number = 0, orientation: orientation = HORIZONTAL, handleClass: string = className.HANDLE) {
    super(ELEM_NAME);
    this._index = index;
    this._orientation = orientation;
    this._elem = this._getTemplate(index, handleClass);
    this._offset = 0;
  }

  public setIndex(index: number) {
    this._index = index;
    this._elem.attr('data-item', index);
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
    this._transform(offset);
  }

  public setActive() {
    this._elem.addClass(modifier.ACTIVE);
  }

  public unsetActive() {
    this._elem.removeClass(modifier.ACTIVE);
  }

  protected _getTemplate(index: number, classes: string) {
    const modifiers = (this._orientation === HORIZONTAL)
      ? modifier.ORIENTATION_HORIZONTAL
      : modifier.ORIENTATION_VERTICAL;
    return $('<div>').addClass([classes, modifiers])
      .attr('data-item', index)
      .css('transform', 'translate(0px, 0px)');
  }

  protected _transform(offset: number): void {
    if (this._orientation === HORIZONTAL) {
      this._elem.css('transform', `translate(${offset}%, 0px)`);
    } else {
      this._elem.css('transform', `translate(0px, ${offset}%)`);
    }
  }
}

export default Handle;
