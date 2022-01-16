import * as $ from 'jquery';
import { HORIZONTAL } from './Constants';
import { orientation } from './Types';

const className = {
  TRACK: 'slider__track',
};

const modifier = {
  ORIENTATION_HORIZONTAL: `${className.TRACK}_orientation_horizontal`,
  ORIENTATION_VERTICAL: `${className.TRACK}_orientation_vertical`,
};

class Track {
  protected _elem: JQuery<HTMLElement>;
  protected _orientation: orientation;

  constructor(orientation: orientation = HORIZONTAL, trackClass: string = className.TRACK) {
    this._orientation = orientation;
    this._elem = this._getTemplate(trackClass);
  }

  public appendTo(target: JQuery<HTMLElement>): void {
    this._elem.appendTo(target);
  }

  public prependTo(target: JQuery<HTMLElement>): void {
    this._elem.prependTo(target);
  }

  protected _getTemplate(trackClass: string = className.TRACK) {
    trackClass += (this._orientation === HORIZONTAL)
      ? modifier.ORIENTATION_HORIZONTAL
      : modifier.ORIENTATION_VERTICAL;
    return $('<div>').addClass(trackClass);
  }
}

export default Track;
