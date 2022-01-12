import Node from './Node';
import Queue from './Queue';

let headNode: Node<string>;
let tailNode: Node<string>;
let extraNode: Node<string>;
let queue: Queue<string>;

beforeEach(() => {
  headNode = new Node("head");
  tailNode = new Node("tail");
  extraNode = new Node("extra");
  queue = new Queue();
  queue.enqueue(headNode);
  queue.enqueue(tailNode);
  queue.enqueue(extraNode);
});

describe("Test 'enqueue' utility", () => {
  it("Check that 'enqueue' is adding nodes in the correct order (at the end)", () => {
    const tailHead = headNode.getLink();
    expect(tailHead).toStrictEqual(tailNode);

    const tailTailHead = tailHead?.getLink();
    expect(tailTailHead).toStrictEqual(extraNode);
  });

  it("Check that 'enqueue' is cannot add the node to the queue twice", () => {
    expect(queue.enqueue(extraNode)).toStrictEqual(false);
    expect(queue.enqueue(tailNode)).toStrictEqual(false);
    expect(queue.enqueue(headNode)).toStrictEqual(false);
  });
});

it("Check that the queue property 'length' is calculated correctly", () => {
  expect(queue.length).toStrictEqual(3);

  queue.dequeue();
  queue.dequeue();
  queue.dequeue();
  expect(queue.length).toStrictEqual(0);

  queue.dequeue();
  expect(queue.length).toStrictEqual(0);
});

it("Check that the queue is iterated through the 'for...of' loop", () => {
  const nodeValues = [];

  for (const value of queue) {
    nodeValues.push(value);
  }

  expect(nodeValues.join(", ")).toStrictEqual("head, tail, extra");
});
