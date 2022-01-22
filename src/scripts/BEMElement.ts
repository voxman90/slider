import BEMComponent from './BEMComponent';

abstract class BEMElement extends BEMComponent {
  protected _blockName: string;
  protected _blockNamespace: string;

  constructor(elemName: string, blockName: string, blockNamespace: string) {
    super(elemName);
    this._blockName = blockName;
    this._blockNamespace = blockNamespace;
  }

  public getClassName(): string {
    return `${this._blockName}__${this._name}`;
  }

  public getModifier(modifier: string): string {
    return `${this.getClassName()}_${modifier}`;
  }

  public getNamespace(): string {
    return `${this._blockNamespace}.${super.getNamespace()}`;
  }
}

export default BEMElement;
