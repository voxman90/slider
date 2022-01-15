import Node from './Node';
import Queue from './Queue';

class Cache<T> {
  private _capacity: number;
  private _map: Map<string, T>;
  private _queue: Queue<string>;

  constructor (capacity: number = 0) {
    this._capacity = capacity;
    this._queue = new Queue();
    this._map = new Map();
  }

  get size() {
    return this._queue.length;
  }

  public set(key: string, value: T): Cache<T> {
    const isValueCached = this.has(key);
    if (isValueCached) {
      return this;
    }

    const isCacheFull = this._capacity === this.size;
    if (isCacheFull) {
      this._deleteLast();
    }

    this._enqueue(key);
    this._map.set(key, value);
    return this;
  }

  public get(key: string): T | null {
    return this._map.get(key) || null;
  }

  public has(key: string): boolean {
    return this._map.has(key);
  }

  public entries() {
    return this._map.entries();
  }

  public keys() {
    return this._map.keys();
  }

  public [Symbol.iterator]() {
    return this._map[Symbol.iterator];
  }

  private _deleteLast(): boolean {
    const firstEntryKey = this._dequeue();
    const isQueueEmpty = firstEntryKey === null;
    if (isQueueEmpty) {
      return false;
    }

    this._map.delete(firstEntryKey);
    return true;
  }

  private _enqueue(key: string): void {
    const node = new Node(key);
    this._queue.enqueue(node);
  }

  private _dequeue(): string | null {
    const firstNode = this._queue.dequeue();
    return firstNode?.value || null;
  }
}

export default Cache;
