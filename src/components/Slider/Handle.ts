import BEMElement from 'components/BEMElement';

import Slider from "./Slider";

const ELEM_NAME = 'handle';

const modifier = {
  ACTIVE: 'active',
};

class Handle extends BEMElement {
  public $elem: JQuery<HTMLElement>;
  private _index: number;
  private _offset: number;

  constructor(block: Slider, index: number = 0) {
    super(ELEM_NAME, block);
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
    return super._getTemplate()
      .attr('data-item', this._index)
      .attr('data-offset', this._offset);
  }
}

export default Handle;
