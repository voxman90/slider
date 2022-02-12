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

export type EventWithData<Data> = JQuery.TriggeredEvent<EventTarget, Data, EventTarget, EventTarget>;

export interface Config {
  type: string;
  step: number;
  min: number;
  max: number;
  range: Array<number>;
  values: Array<number>;
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

export type ViewChanges<T> = {
  type: Array<string>;
  event: JQuery.TriggeredEvent<EventTarget, T, EventTarget, EventTarget>;
}

export type ModelChanges = {
  scope: string;
  index?: number;
};

export type Point = {
  value: number;
  percent: number;
};

export type PointState = {
  value: number;
  percent: number;
  view: NonNullable<primitive>;
};

export type PointStatePlusIndents = {
  leftIndent: IntervalState;
  point: PointState;
  rightIndent: IntervalState;
};

export type Interval = {
  from: Point;
  to: Point;
  value: number;
  percent: number;
};

export type IntervalState = {
  value: number;
  percent: number;
};

export type ScaleState = {
  points: Array<PointState>;
  intervals: Array<IntervalState>;
  min: PointState;
  max: PointState;
  step: number;
};
