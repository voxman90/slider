import BEMComponent from './BEMComponent';

abstract class BEMBlock extends BEMComponent {
  constructor (name: string = '') {
    super(name);
  }
}

export default BEMBlock;
