import { Configuration  } from './Types';
import Subject from './Subject';
import Handle from './Handle';

class View extends Subject {
  protected _handles: Array<Handle>;
  constructor(config: Partial<Configuration>) {
    super();
    this._handles = [];
  }

  protected _notify(data?: Object): void {
    this._observers.forEach((observer) => observer.update(this, data));
  }
}

export default View;
