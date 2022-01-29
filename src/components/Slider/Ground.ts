import BEMElement from 'components/BEMElement';
import { HORIZONTAL } from 'common/constants/Constants';
import { orientation } from 'common/types/Types';

import Slider from "./Slider";

const ELEM_NAME = 'ground';

class Ground extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor (block: Slider) {
    super(ELEM_NAME, block);
    this.$elem = this._getTemplate();
  }

  public move(offset: number = 0, orientation: orientation = HORIZONTAL): void {
    this._transform(offset, orientation);
  }

  protected _getTemplate() {
    return super._getTemplate()
      .css('transform', 'translate(0px, 0px)');
  }

  private _transform(offset: number, orientation: orientation) {
    if (orientation === HORIZONTAL) {
      return this.$elem.css('transform', `translate(${offset}%, 0px)`);
    }

    return this.$elem.css('transform', `translate(0px, ${offset}%)`);
  }
}

export default Ground;
