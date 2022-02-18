import * as $ from 'jquery';

import Generator from 'scripts/Generator';
import { ALPHABET } from 'common/constants/Constants';

const ID_LENGTH = 16;

type EventListenerParameters<T> = {
  $target: JQuery<EventTarget>,
  eventName: string,
  data: T,
  handler: (event: JQuery.TriggeredEvent<EventTarget, T, EventTarget, EventTarget>) => void,
};

abstract class BEMComponent {
  public abstract $elem: JQuery<HTMLElement>;
  public name: string;
  protected _id: string;

  constructor (name: string = '') {
    this.name = name;
    this._id = this._createId();
  }

  public get namespace(): string {
    return `${this.name}#${this._id}`;
  }

  public attachEventListener<T>(listenerParam: EventListenerParameters<T>): void {
    const {
      $target,
      eventName,
      handler,
      data,
    } = listenerParam;

    const uniqueEventName = this._getUniqueEventName(eventName);
    $target.on(uniqueEventName, data, (event) => handler(event));
  }

  public removeEventListeners(events: Array<{ eventName: string, $target: JQuery<HTMLElement> }>): void {
    events.forEach(({ $target, eventName }) => this.removeEventListener($target, eventName));
  }

  public removeEventListener($target: JQuery<HTMLElement>, eventName: string): void {
    const uniqueEventName = this._getUniqueEventName(eventName);
    $target.off(uniqueEventName);
  }

  public appendTo(target: JQuery<HTMLElement> | BEMComponent): JQuery<HTMLElement> {
    if (target instanceof BEMComponent) {
      return this.$elem.appendTo(target.$elem);
    }

    return this.$elem.appendTo(target);
  }

  public prependTo(target: JQuery<HTMLElement> | BEMComponent): JQuery<HTMLElement> {
    if (target instanceof BEMComponent) {
      return this.$elem.appendTo(target.$elem);
    }

    return this.$elem.prependTo(target);
  }

  public remove(): JQuery<HTMLElement> {
    return this.$elem.remove();
  }

  public empty(): JQuery<HTMLElement> {
    return this.$elem.empty();
  }

  public detach(): JQuery<HTMLElement> {
    return this.$elem.detach();
  }

  protected abstract get className(): string;

  protected _setModifier(modifier: string | string[]) {
    this.$elem.addClass(modifier);
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

  protected _getTemplate(classes: string | string[] = [], tag: string = '<div>'): JQuery<HTMLElement> {
    if (classes instanceof Array) {
      return $(tag).addClass([this.className, ...classes]);
    }

    return $(tag).addClass([this.className, classes]);
  }
}

export default BEMComponent;
