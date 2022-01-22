import * as $ from 'jquery';
import Generator from './Generator';
import { ALPHABET } from './Constants';

const ID_LENGTH = 16;

type EventListenerParameters = {
  $target: JQuery<HTMLElement>,
  eventName: string,
  data: Object,
  handler: (event: JQuery.Event) => void,
};

abstract class BEMComponent {
  public abstract $elem: JQuery<HTMLElement>;
  protected _name: string;
  protected _id: string;
  protected namespace: string;

  constructor (name: string = '') {
    this._name = name;
    this._id = this._createId();
    this.namespace = this.getNamespace();
  }

  public attachEventListeners(listeners: Array<EventListenerParameters>): void {
    listeners.forEach((listener) => this.attachEventListener(listener));
  }

  public attachEventListener(listenerParam: EventListenerParameters): void {
    const {
      $target,
      eventName,
      handler,
      data = null,
    } = listenerParam;

    const uniqueEventName = this._getUniqueEventName(eventName);
    $target.on(uniqueEventName, data, (event) => handler(event));
  }

  public removeEventListeners(events: Array<{ eventName: string, target: JQuery<HTMLElement> }>): void {
    events.forEach(({ target, eventName }) => this.removeEventListener(target, eventName));
  }

  public removeEventListener(target: JQuery<HTMLElement>, eventName: string): void {
    const uniqueEventName = this._getUniqueEventName(eventName);
    target.off(uniqueEventName);
  }

  public appendTo(target: JQuery<HTMLElement>) {
    this.$elem.appendTo(target);
  }

  public prependTo(target: JQuery<HTMLElement>) {
    this.$elem.prependTo(target);
  }

  public remove() {
    this.$elem.remove();
  }

  public getNamespace(): string {
    return `${this._name}#${this._id}`;
  }

  protected _getUniqueEventName(event: string): string {
    return `${event}.${this.namespace}`;
  }

  protected _createId(): string {
    let id = '';
    for (let i = 0; i < ID_LENGTH; i += 1) {
      id += Generator.getRandomChar(ALPHABET);
    }
    return id;
  }
}

export default BEMComponent;
