import BEMElement from "./BEMElement";
import { HORIZONTAL } from "./Constants";
import { orientation } from "./Types";

const ELEM_NAME = 'ground';

class Ground extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor (blockName: string, blockNamespace: string) {
    super(ELEM_NAME, blockName, blockNamespace);
    this.$elem = this._getTemplate();
  }

  public move(offset: number = 0, orientation: orientation = HORIZONTAL): void {
    this._transform(offset, orientation);
  }

  private _getTemplate() {
    return $('<div>').addClass(this.getElemClassName)
      .css('transform', 'translate(0px, 0px)');
  }

  private _transform(offset: number, orientation: orientation): void {
    if (orientation === HORIZONTAL) {
      this.$elem.css('transform', `translate(${offset}%, 0px)`);
    } else {
      this.$elem.css('transform', `translate(0px, ${offset}%)`);
    }
  }
}

export default Ground;
