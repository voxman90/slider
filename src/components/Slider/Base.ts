import BEMElement from 'components/BEMElement';

import Slider from './Slider';

const ELEM_NAME = 'base';

class Base extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor(block: Slider) {
    super(ELEM_NAME, block);
    this.$elem = this._getTemplate();
  }
}

export default Base;
