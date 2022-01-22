import * as $ from 'jquery';
import { HORIZONTAL } from './Constants';
import { orientation } from './Types';
import BEMElement from './BEMElement';

const ELEM_NAME = 'connect';

const modifier = {
  VISIBLE: 'visible',
  ORIENTATION_HORIZONTAL: 'orientation_horizontal',
  ORIENTATION_VERTICAL: 'orientation_vertical',
};

class Connect extends BEMElement {
  public $elem: JQuery<HTMLElement>;
  protected _index: number;
  protected _offset: number;
  protected _size: number;

  constructor(blockName: string, blockNamespace: string, index: number = 0) {
    super(ELEM_NAME, blockName, blockNamespace);
    this._index = index;
    this._offset = 0;
    this._size = 0;
    this.$elem = this._getTemplate();
  }

  public setIndexAttr(index: number = 0) {
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
    this.$elem.addClass(this.getModifier(modifier.VISIBLE));
  }

  public unsetModifierVisible() {
    this.$elem.removeClass(this.getModifier(modifier.VISIBLE));
  }

  protected _getTemplate() {
    return $('<div>').addClass(this.getClassName())
      .attr('data-item', this._index)
      .css('transform', 'translate(0px, 0px) scale(1, 1)');
  }

  protected _transform(offset: number, size: number, orientation: orientation) {
    if (orientation === HORIZONTAL) {
      return this.$elem.css('transform', `translate(${offset}%, 0px) scale(${size}%, 1)`);
    }

    return this.$elem.css('transform', `translate(0px, ${offset}%) scale(1, ${size}%)`);
  }
}

export default Connect;
