import BEMElement from "components/BEMElement";

import Slider from "./Slider";
import { elemName } from "./Constants";

class Base extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor(block: Slider) {
    super(elemName.BASE, block);
    this.$elem = this._getTemplate();
  }
}

export default Base;
