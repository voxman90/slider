import * as $ from 'jquery';
import { HORIZONTAL } from './Constants';
import { orientation } from './Types';
import BEMBlock from './BEMBlock';

const BLOCK_NAME = 'grid';

class Grid extends BEMBlock {
  public $elem: JQuery<HTMLElement>;
  
  constructor (config: any) {
    super(BLOCK_NAME);
    this.$elem = this._getTemplate();
  }

  protected _getTemplate() {
    return $('<div>').addClass(this.getClassName());
  }
}

export default Grid;
