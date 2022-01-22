import * as $ from 'jquery';
import BEMElement from './BEMElement';

const ELEM_NAME = 'track';

class Track extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor(blockName: string, blockNamespace: string) {
    super(ELEM_NAME, blockName, blockNamespace);
    this.$elem = this._getTemplate();
  }

  protected _getTemplate(): JQuery<HTMLElement> {
    return $('<div>').addClass(this.getClassName());
  }
}

export default Track;
