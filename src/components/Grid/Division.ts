import BEMElement from "components/BEMElement";

import Grid from "./Grid";

const ELEM_NAME = 'division';

const modifier = {
  SIZE_SMALL: 'size_small',
  SIZE_MEDIUM: 'size_medium',
  SIZE_BIG: 'size_big',
}

class Division extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor (block: Grid) {
    super(ELEM_NAME, block);
    this.$elem = this._getTemplate();
  }

  public setModifierSizeSmall() {
    this._setModifier(modifier.SIZE_SMALL);
  }

  public setModifierSizeMedium() {
    this._setModifier(modifier.SIZE_MEDIUM);
  }

  public setModifierSizeBig() {
    this._setModifier(modifier.SIZE_BIG);
  }

  protected _getTemplate() {
    return super._getTemplate();
  }
}

export default Division;
