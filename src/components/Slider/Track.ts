import BEMElement from 'components/BEMElement';

import Slider from './Slider';

const ELEM_NAME = 'track';

class Track extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor(block: Slider) {
    super(ELEM_NAME, block);
    this.$elem = this._getTemplate();
  }
}

export default Track;
