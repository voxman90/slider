import BEMComponent from './BEMComponent';

abstract class BEMBlock extends BEMComponent {
  constructor (name: string = '') {
    super(name);
  }

  public get className(): string {
    return this.name;
  }

  public getModifier(modifier: string): string {
    return `${this.className}_${modifier}`;
  }
}

export default BEMBlock;
