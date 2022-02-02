import BEMElement from 'components/BEMElement';

import Slider from "./Slider";

const ELEM_NAME = 'handle';

const modifier = {
  ACTIVE: 'active',
};

class Handle extends BEMElement {
  public $elem: JQuery<HTMLElement>;
  public index: number;
  public offset: number;
  public zIndex: number;

  constructor(block: Slider, index: number = 0, zIndex: number = 0) {
    super(ELEM_NAME, block);
    this.index = index;
    this.zIndex = zIndex;
    this.offset = 0;
    this.$elem = this._getTemplate();
  }

  public setOffsetAttr(offset: number = 0) {
    this.offset = offset;
    this.$elem.attr('data-offset', offset);
  }

  public setIndexAttr(index: number = 0) {
    this.index = index;
    this.$elem.attr('data-item', index);
  }

  public setModifierActive() {
    this.$elem.addClass(this.getModifier(modifier.ACTIVE));
  }

  public unsetModifierActive() {
    this.$elem.removeClass(this.getModifier(modifier.ACTIVE));
  }

  public setZIndex(zIndex: number) {
    this.zIndex = zIndex;
    this.$elem.css('z-index', zIndex);
  }

  protected _getTemplate() {
    return super._getTemplate()
      .attr('data-item', this.index)
      .attr('data-offset', this.offset)
      .css('z-index', this.zIndex);
  }
}

export default Handle;
