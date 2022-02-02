import Observer from "./Observer";

abstract class Subject {
  protected _observers: Array<Observer> = [];

  public attach(observer: Observer): boolean {
    const isExist = this._observers.includes(observer);
    if (isExist) {
      return false;
    }

    this._observers.push(observer);
    return true;
  }

  public detach(observer: Observer): boolean {
    const observerIndex = this._observers.indexOf(observer);
    const isExist = observerIndex !== -1;
    if (isExist) {
      this._observers.splice(observerIndex, 1);
      return true;
    }

    return false;
  }

  protected abstract notify(data?: object): void;
}

export default Subject;
