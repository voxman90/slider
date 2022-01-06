import { Configuration  } from './Types';
import Subject from './Subject';

class View extends Subject {
  constructor(config: Partial<Configuration>) {
    super();
  }

  protected _notify(data?: Object): void {
    this._observers.forEach((observer) => observer.update(this, data));
  }
}

export default View;
