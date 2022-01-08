import Node from './Node';

let headNode: Node<string>;
let tailNode: Node<string>;

beforeEach(() => {
  headNode = new Node("head");
  tailNode = new Node("tail");
  headNode.setLink(tailNode);
});

it("Check that linking a node via 'setLink' method works correctly", () => {
  expect(headNode._link[0]).toStrictEqual(tailNode);
});

it("Check that 'getLink' method returns the correct link", () => {
  expect(headNode.getLink()).toStrictEqual(tailNode);
  expect(tailNode.getLink()).toStrictEqual(null);
});

it("Check that 'clearLink' method assigns a null to the '_link' property", () => {
  headNode.clearLink();
  expect(headNode.getLink()).toStrictEqual(null);
});
