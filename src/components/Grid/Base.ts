import BEMElement from "components/BEMElement";

import Grid from "./Grid";
import { elemName } from "./constants";

class Base extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor (block: Grid) {
    super(elemName.BASE, block);
    this.$elem = this._getTemplate();
  }
}

export default Base;
