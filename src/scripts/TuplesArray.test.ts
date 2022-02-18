import { NonBottomValue } from "common/types/types";

import { createTuplesArray, removeTuplesWithDuplicateKeys } from "./TuplesArray";

type Tuple = [string, NonBottomValue];

let tuplesArray: Array<Tuple>;

beforeEach(() => {
  const generatingFunc = (i: number): Tuple => [`${i}`, i];
  tuplesArray = createTuplesArray(generatingFunc, 5, "test");
})

describe("Test 'removeTuplesWithDuplicateKeys' utility", () => {
  test("case 1", () => {
    const doubledTuplesArray = [...tuplesArray, ...tuplesArray];
    expect(removeTuplesWithDuplicateKeys(doubledTuplesArray)).toEqual(tuplesArray);
  });

  test("case 2", () => {
    const tuplesArray: Array<Tuple> = [
      ["1", 1],
      ["1", 2],
      ["3", 1],
      ["1", 3],
      ["2", 1],
      ["2", 2],
      ["4", 1],
    ];
    const controlTuplesArray = [
      ["1", 1],
      ["3", 1],
      ["2", 1],
      ["4", 1],
    ];
    expect(removeTuplesWithDuplicateKeys(tuplesArray)).toEqual(controlTuplesArray);
  });

  test("case 3", () => {
    expect(removeTuplesWithDuplicateKeys([])).toEqual([]);
  });
});
