import { NonBottomValue } from "common/types/types";

type Tuple = [string, NonBottomValue];
type TuplesArray = Array<Tuple>;

function createTuplesArray(generatingFunc: (i: number) => Tuple, length: number, prefix: string = ""): TuplesArray {
  const tuplesArray: TuplesArray = [];

  for (let i = 0; i < length; i += 1) {
    const [tupleKey, tupleValue] = generatingFunc(i);
    tuplesArray.push([`${prefix}${tupleKey}`, tupleValue]);
  }

  return tuplesArray;
}

function removeTuplesWithDuplicateKeys(tuplesArray: TuplesArray): Array<Tuple> {
  const seen: Set<string> = new Set();
  return tuplesArray.filter(([tupleKey, _]) => {
    return seen.has(tupleKey) ? false : (seen.add(tupleKey), true);
  });
}

export { createTuplesArray, removeTuplesWithDuplicateKeys };
