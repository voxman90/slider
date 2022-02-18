import BEMElement from "components/BEMElement";
import { Orientation } from "common/types/types";

import Slider from "./Slider";
import { elemName } from "./constants";

class Ground extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor (block: Slider) {
    super(elemName.GROUND, block);
    this.$elem = this._getTemplate();
  }

  public move(offset: number = 0, orientation: Orientation = Orientation.Horizontal): void {
    this._transform(offset, orientation);
  }

  protected _getTemplate() {
    return super._getTemplate()
      .css('transform', 'translate(0px, 0px)');
  }

  private _transform(offset: number, orientation: Orientation) {
    if (orientation === Orientation.Horizontal) {
      return this.$elem.css('transform', `translate(${offset}%, 0px)`);
    }

    return this.$elem.css('transform', `translate(0px, ${offset}%)`);
  }
}

export default Ground;
