import Node from './Node';

class Queue<T> {
  public length: number;
  private _head: Node<T> | null;
  private _end: Node<T> | null; 

  constructor() {
    this.length = 0;
    this._head = null;
    this._end = null;
  }

  public enqueue(node: Node<T>): boolean {
    if (!this._isValidNode(node)) {
      return false;
    }

    this.length += 1;

    const end = this._end;
    const isQueueEmpty = end === null;
    if (isQueueEmpty) {
      this._head = node;
      this._end = node;
      return true;
    }

    end.setLink(node);
    this._end = node;
    return true;
  }

  public dequeue(): Node<T> | null {
    const head = this._head;
    const isQueueEmpty = head === null;
    if (isQueueEmpty) {
      return null;
    }

    this.length -= 1;

    const tailHead = head.getLink();
    const isTailEmpty = tailHead === null;
    if (isTailEmpty) {
      this._head = null;
      this._end = null;
      return head
    }

    this._head = tailHead;
    return head;
  }

  public [Symbol.iterator]() {
    let head = this._head;

    return {
      next() {
        if (head === null) {
          return {
            value: undefined,
            done: true,
          };
        }

        const value = head.value;
        head = head.getLink();
        return {
          value,
          done: false,
        };
      }
    };
  }

  // These conditions ensure that the queue nodes will not form a cycle and do not repeated.
  private _isValidNode(node: Node<T>): boolean {
    const isLinkEmpty = node.getLink() === null;
    const isSameAsLastNode = node === this._end;
    return isLinkEmpty && !isSameAsLastNode;
  }
}

export default Queue;
