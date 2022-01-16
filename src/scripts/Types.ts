export type primitive = number | string | boolean | symbol | bigint | null | undefined;
export type NonBottomValue = NonNullable<primitive> | object;
export type NonUndefined = NonBottomValue | null;

export type horizontal = 1;
export type vertical = 0;
export type orientation = horizontal | vertical;

export type left = -1;
export type right = 1;
export type direction = left | right;

type ArrayLengthMutationKeys = "pup" | "push" | "shift" | "unshift" | 'splice' | number;
export type FixedLengthArray<T extends Array<NonUndefined>> =
  Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>>
  & { [Symbol.iterator]: () => IterableIterator<NonUndefined> };

export interface Configuration {
  type: 'range' | 'set';
  step: number;
  min: number;
  max: number;
  range: [number, number];
  points: Array<number>;
  connects: Array<boolean>;
  set: Array<NonBottomValue>;
  direction: 'ltr' | 'rtl';
  orientation: orientation;
  hasTooltips: boolean;
  hasScale: boolean;
  scaleMap: Array<number>;
  isCached: boolean;
  cacheCapacity: number;
  prettifier: (x: string) => string;
}

export interface ModelChanges {
  scope: string,
  index?: number,
}

export interface HandleState {
  leftIndent: number,
  offset: number,
  rightIndent: number,
  view: NonNullable<primitive>,
}

export interface SliderState {
  scale: Array<number>,
  distances: Array<number>,
  values: Array<NonNullable<primitive>>,
  min: NonNullable<primitive>,
  max: NonNullable<primitive>,
  step: number,
}
