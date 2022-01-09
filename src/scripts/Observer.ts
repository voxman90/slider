import Subject from "./Subject";

abstract class Observer {
  public abstract update(subject: Subject, data?: object): void;
}

export default Observer;
