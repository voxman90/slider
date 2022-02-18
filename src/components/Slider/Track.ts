import BEMElement from "components/BEMElement";

import Slider from "./Slider";
import { elemName } from "./constants";

class Track extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor(block: Slider) {
    super(elemName.TRACK, block);
    this.$elem = this._getTemplate();
  }
}

export default Track;
