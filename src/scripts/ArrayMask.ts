class ArrayMask extends Array<0 | 1 | null> {
  static createEmptyMask(length: number): ArrayMask {
    return new Array(length).fill(null);
  }

  static bypassUnweightedElements<T>(array: Array<T>, mask: ArrayMask, callback: (val: T, i: number, arr: Array<T>) => void): void {
    return array.forEach((val, i, arr) => {
      const isPassedElement = mask[i] !== null;
      if (!isPassedElement) {
        callback(val, i, arr);
      }
    });
  }

  static apply<T>(array: Array<T>, mask: ArrayMask, from: number = 0): Array<T> {
    const startingPosition = Math.min(array.length, Math.max(0, from));
    return array.filter((_, i) => {
      if (i >= startingPosition) {
        return mask[i - startingPosition] === 1
      }
    });
  }
}

export default ArrayMask;
