import ArrayMask from './ArrayMask';

test("Check that 'createEmptyMask' method creates an empty (null-filled) array with fixed length", () => {
  expect(ArrayMask.createEmptyMask(3)).toEqual([null, null, null]);
});

describe("Check that 'apply' method filter elements by mask", () => {
  let array = [0, 1, 2, 3, 4];

  it("When the mask and array length match", () => {
    const mask: ArrayMask = [0, 1, 0, 0, 1];
    expect(ArrayMask.apply(array, mask)).toEqual([1, 4]);
  });

  it("When the array length is longer", () => {
    let mask: ArrayMask = [];
    expect(ArrayMask.apply(array, mask)).toEqual([]);

    mask = [1];
    expect(ArrayMask.apply(array, mask)).toEqual([0]);

    mask = [1, 1];
    expect(ArrayMask.apply(array, mask)).toEqual([0, 1]);

    mask = [1, 1, 1];
    expect(ArrayMask.apply(array, mask)).toEqual([0, 1, 2]);

    mask = [1, 1, 1, 1];
    expect(ArrayMask.apply(array, mask)).toEqual([0, 1, 2, 3]);
  });

  it("When the array length is less", () => {
    const mask: ArrayMask = [1, 1, 1, 1, 1, 1];
    expect(ArrayMask.apply(array, mask)).toEqual([0, 1, 2, 3, 4]);
  });

  it("When we start from a non-zero position", () => {
    const mask: ArrayMask = [1, 1, 1, 1, 1];
    expect(ArrayMask.apply(array, mask, -1)).toEqual([0, 1, 2, 3, 4]);
    expect(ArrayMask.apply(array, mask,  0)).toEqual([0, 1, 2, 3, 4]);
    expect(ArrayMask.apply(array, mask,  1)).toEqual([1, 2, 3, 4]);
    expect(ArrayMask.apply(array, mask,  2)).toEqual([2, 3, 4]);
    expect(ArrayMask.apply(array, mask,  3)).toEqual([3, 4]);
    expect(ArrayMask.apply(array, mask,  4)).toEqual([4]);
    expect(ArrayMask.apply(array, mask,  5)).toEqual([]);
  });
})

test("Check that 'bypassUnweightedElements' method bypasses the array elements corresponding to empty (null-filled)\
 elements in the mask", () => {
  const array = [0, 1, 2, 3, 4];
  const mask: ArrayMask = [0, null, 0, null, 0];
  const callback = <T>(_: T, i: number, arr: Array<T | string>): void => { arr[i] = 'bypassed' };
  ArrayMask.bypassUnweightedElements(array, mask, callback);
  expect(array).toEqual([0, 'bypassed', 2, 'bypassed', 4]);
});
