import BEMElement from "components/BEMElement";

import Grid from "./Grid";

const ELEM_NAME = 'division';

const modifier = {
  SMALL: 'size_small',
  MEDIUM: 'size_medium',
  BIG: 'size_big',
}

class Division extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor (block: Grid) {
    super(ELEM_NAME, block);
    this.$elem = this._getTemplate();
  }

  protected _getTemplate() {
    return super._getTemplate();
  }
}

export default Division;
