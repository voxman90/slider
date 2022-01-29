import BEMElement from 'components/BEMElement';
import { HORIZONTAL } from 'common/constants/Constants';
import { orientation } from 'common/types/Types';

import Slider from './Slider';

const ELEM_NAME = 'tooltip';

const modifier = {
  VISIBLE: 'visible',
  ORIENTATION_HORIZONTAL: 'orientation_horizontal',
  ORIENTATION_VERTICAL: 'orientation_vertical',
};

class Tooltip extends BEMElement {
  public $elem: JQuery<HTMLElement>;
  private _index: number;
  private _offset: number;
  private _size: number;

  constructor(block: Slider, index: number = 0) {
    super(ELEM_NAME, block);
    this._index = index;
    this.$elem = this._getTemplate();
    this._offset = 0;
    this._size = 0;
  }

  public setIndex(index: number) {
    this._index = index;
    this.$elem.attr('data-item', index);
  }

  public move(offset: number = 0, orientation: orientation = HORIZONTAL): void {
    this._offset = offset;
    this._transform(offset, this._size, orientation);
  }

  public resize(size: number = 0, orientation: orientation = HORIZONTAL): void {
    this._size = size;
    this._transform(this._offset, size, orientation);
  }

  public moveAndResize(offset: number = 0, size: number = 0, orientation: orientation = HORIZONTAL) {
    this._offset = offset;
    this._size = size;
    this._transform(offset, size, orientation);
  }

  public setModifierVisible() {
    this.$elem.addClass(modifier.VISIBLE);
  }

  public unsetModifierVisible() {
    this.$elem.removeClass(modifier.VISIBLE);
  }

  protected _getTemplate() {
    return super._getTemplate()
      .attr('data-item', this._index)
      .css('transform', 'translate(0px, 0px) scale(1, 1)');
  }

  protected _transform(offset: number, size: number, orientation: orientation): JQuery<HTMLElement> {
    if (orientation === HORIZONTAL) {
      return this.$elem.css('transform', `translate(${offset}%, 0px) scale(${size}%, 1)`);
    }

    return this.$elem.css('transform', `translate(0px, ${offset}%) scale(1, ${size}%)`);
  }
}

export default Tooltip;
