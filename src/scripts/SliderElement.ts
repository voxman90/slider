import * as $ from 'jquery';
import Generator from './Generator';
import { ALPHABET } from './Constants';

const ID_LENGTH = 16;

type EventListenerParameters = {
  eventName: string,
  data: Object,
  handler: (event: JQuery.Event) => void,
};

abstract class SliderElement {
  protected abstract _elem: JQuery<HTMLElement>;
  public _name: string;
  public _id: string;
  public _namespace: string;

  constructor (name: string = '') {
    this._name = name;
    this._id = this._createId();
    this._namespace = this._getNamespace();
  }

  public attachEventListeners(listeners: Array<EventListenerParameters>): void {
    listeners.forEach((listener) => this.attachEventListener(listener));
  }

  public attachEventListener(listenerParam: EventListenerParameters): void {
    const {
      eventName,
      handler,
      data = null,
    } = listenerParam;

    const uniqueEventName = this._getUniqueEventName(eventName);
    this._elem.on(uniqueEventName, data, (event) => handler(event));
  }

  public removeEventListeners(eventNames: Array<string>): void {
    eventNames.forEach((eventName) => this.removeEventListener(eventName));
  }

  public removeEventListener(eventName: string): void {
    const uniqueEventName = this._getUniqueEventName(eventName);
    this._elem.off(uniqueEventName);
  }

  private _getNamespace(): string {
    return `${this._name}#${this._id}`;
  }

  private _getUniqueEventName(event: string): string {
    return `${event}.${this._namespace}`;
  }

  private _createId(): string {
    let id = '';
    for (let i = 0; i < ID_LENGTH; i += 1) {
      id += Generator.getRandomChar(ALPHABET);
    }
    return id;
  }
}

export default SliderElement;
