import { Direction, Orientation } from "common/types/types";
import BEMElement from "components/BEMElement";

import { elemName, directionMatrix } from "./constants";
import Grid from "./Grid";

class Value extends BEMElement {
  public $elem: JQuery<HTMLElement>;

  constructor (block: Grid) {
    super(elemName.VALUE, block);
    this.$elem = this._getTemplate();
  }

  public move(offset: number, orientation: Orientation, direction: Direction): void {
    const dir = directionMatrix[orientation][direction];
    this.$elem.css(dir, offset);
  }

  public text(view: string): void {
    this.$elem.text(view);
  }
}

export default Value;
