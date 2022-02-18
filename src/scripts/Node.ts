import { FixedLengthArray } from 'common/types/types';

class Node<T> {
  public value: T | null;
  protected _link: FixedLengthArray<[Node<T> | null]>;

  constructor(value: T | null = null) {
    this.value = value;
    this._link = [null];
  }

  getLink(): Node<T> | null {
    return this._link[0];
  }

  setLink(node: Node<T>): void {
    this._link[0] = node;
  }

  clearLink(): void {
    this._link[0] = null;
  }
}

export default Node;
