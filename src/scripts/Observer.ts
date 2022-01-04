import Subject from "./Subject";

abstract class Observer {
  public abstract update(subject: Subject, data?: Object): void;
}

export default Observer;
