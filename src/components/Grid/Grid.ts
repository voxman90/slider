import BEMBlock from 'components/BEMBlock';
import { HORIZONTAL } from 'common/constants/Constants';
import { orientation } from 'common/types/Types';

const BLOCK_NAME = 'grid';

const modifier = {
  ORIENTATION_HORIZONTAL: 'orientation_horizontal',
  ORIENTATION_VERTICAL: 'orientation_vertical',
}

class Grid extends BEMBlock {
  public $elem: JQuery<HTMLElement>;
  private _orientation: orientation;

  constructor (config: any) {
    super(BLOCK_NAME);
    const {
      orientation = HORIZONTAL,
    } = config;
    this._orientation = orientation;
    this.$elem = this._getTemplate();
  }

  protected _getTemplate() {
    const orientation = (this._orientation === HORIZONTAL)
      ? this.getModifier(modifier.ORIENTATION_HORIZONTAL)
      : this.getModifier(modifier.ORIENTATION_VERTICAL);
    return super._getTemplate(orientation);
  }
}

export default Grid;
