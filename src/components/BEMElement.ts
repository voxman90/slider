import BEMBlock from './BEMBlock';
import BEMComponent from './BEMComponent';

abstract class BEMElement extends BEMComponent {
  protected _block: BEMBlock;

  constructor(name: string, block: BEMBlock) {
    super(name);
    this._block = block;
  }

  public get className(): string {
    return `${this._block.name}__${this.name}`;
  }

  public get namespace(): string {
    return `${this._block.namespace}.${super.namespace}`;
  }

  public getModifier(modifier: string): string {
    return `${this.className}_${modifier}`;
  }
}

export default BEMElement;
