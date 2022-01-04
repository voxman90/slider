import Subject from './Subject';
import DataProcessor from './DataProcessor';
import DataProcessorFactory from './DataProcessorFactory';
import { Configuration } from './Types';

class Model extends Subject {
  private _dp: DataProcessor;

  constructor (config: Partial<Configuration>) {
    super();
    this._dp = DataProcessorFactory(config);
  }

  protected _notify() {
    this._observers.forEach((observer) => {
      observer.update(this);
    });
  }
}

export default Model;
