import * as $ from 'jquery';
import { HORIZONTAL } from './Constants';
import { orientation } from './Types';
import SliderElement from './SliderElement';

const ELEM_NAME = 'track';

const className = {
  TRACK: `slider__${ELEM_NAME}`,
};

const modifier = {
  ORIENTATION_HORIZONTAL: `${className.TRACK}_orientation_horizontal`,
  ORIENTATION_VERTICAL: `${className.TRACK}_orientation_vertical`,
};

class Track extends SliderElement {
  protected _elem: JQuery<HTMLElement>;
  protected _orientation: orientation;

  constructor(orientation: orientation = HORIZONTAL, trackClass: string = className.TRACK) {
    super(ELEM_NAME);
    this._orientation = orientation;
    this._elem = this._getTemplate(trackClass);
  }

  public appendTo(target: JQuery<HTMLElement>): void {
    this._elem.appendTo(target);
  }

  public prependTo(target: JQuery<HTMLElement>): void {
    this._elem.prependTo(target);
  }

  protected _getTemplate(classes: string = className.TRACK) {
    const modifiers = (this._orientation === HORIZONTAL)
      ? modifier.ORIENTATION_HORIZONTAL
      : modifier.ORIENTATION_VERTICAL;
    return $('<div>').addClass([classes, modifiers])
  }
}

export default Track;
