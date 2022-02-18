import { Orientation, Direction } from "common/types/types";
import BEMElement from "components/BEMElement";

import { elemName, directionMatrix } from "./constants";
import Grid from "./Grid";

const modifier = {
  SIZE_SMALL: 'size_small',
  SIZE_MIDDLE: 'size_middle',
  SIZE_BIG: 'size_big',
};

class Division extends BEMElement {
  public $elem: JQuery<HTMLElement>;
  public offset: number;

  constructor (block: Grid) {
    super(elemName.DIVISION, block);
    this.$elem = this._getTemplate();
    this.offset = 0;
  }

  public setModifierSizeSmall(): void {
    this._setModifier(modifier.SIZE_SMALL);
  }

  public setModifierSizeMiddle(): void {
    this._setModifier(modifier.SIZE_MIDDLE);
  }

  public setModifierSizeBig(): void {
    this._setModifier(modifier.SIZE_BIG);
  }

  public move(offset: number, orientation: Orientation, direction: Direction): void {
    this.offset = offset;
    const dir = directionMatrix[orientation][direction];
    this.$elem.css(dir, offset);
  }
}

export default Division;
