import BEMComponent from './BEMComponent';

abstract class BEMElement extends BEMComponent {
  protected _blockName: string;
  protected _blockNamespace: string;

  constructor(elemName: string, blockName: string, blockNamespace: string) {
    super(elemName);
    this._blockName = blockName;
    this._blockNamespace = blockNamespace;
  }

  public getElemClassName(): string {
    return `${this._blockName}__${this._name}`;
  }

  public getElemModifier(modifier: string): string {
    return `${this.getElemClassName()}_${modifier}`;
  }

  public getNamespace(): string {
    return `${this._blockNamespace}.${super.getNamespace()}`;
  }
}

export default BEMElement;
