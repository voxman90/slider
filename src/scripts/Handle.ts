import * as $ from 'jquery';
import BEMElement from './BEMElement';

const ELEM_NAME = 'handle';

const modifier = {
  ACTIVE: 'active',
};

class Handle extends BEMElement {
  public $elem: JQuery<HTMLElement>;
  protected _index: number;
  protected _offset: number;

  constructor(blockName: string, blockNamespace: string, index: number = 0) {
    super(ELEM_NAME, blockName, blockNamespace);
    this._index = index;
    this._offset = 0;
    this.$elem = this._getTemplate();
  }

  public setOffsetAttr(offset: number = 0) {
    this._offset = offset;
    this.$elem.attr('data-offset', offset);
  }

  public setIndexAttr(index: number = 0) {
    this._index = index;
    this.$elem.attr('data-item', index);
  }

  public setModifierActive() {
    this.$elem.addClass(this.getModifier(modifier.ACTIVE));
  }

  public unsetModifierActive() {
    this.$elem.removeClass(this.getModifier(modifier.ACTIVE));
  }

  protected _getTemplate() {
    return $('<div>').addClass(this.getClassName())
      .attr('data-item', this._index)
      .attr('data-offset', this._offset);
  }
}

export default Handle;
