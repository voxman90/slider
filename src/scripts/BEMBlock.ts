import BEMComponent from './BEMComponent';

abstract class BEMBlock extends BEMComponent {
  constructor (name: string = '') {
    super(name);
  }

  public getClassName(): string {
    return this._name;
  }

  public getModifier(modifier: string): string {
    return `${this.getClassName()}_${modifier}`;
  }
}

export default BEMBlock;
