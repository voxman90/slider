import { TDivisionState, TGridConfig } from "components/Grid/types";

export type primitive = number | string | boolean | symbol | bigint | null | undefined;
export type NonBottomValue = NonNullable<primitive> | object;
export type NonUndefined = NonBottomValue | null;

export enum Orientation {
  Horizontal = 1,
  Vertical = 0,
};

export enum Direction {
  Left = -1,
  Right = 1,
};

type ArrayLengthMutationKeys = "pup" | "push" | "shift" | "unshift" | 'splice' | number;
export type FixedLengthArray<T extends Array<NonUndefined>> =
  Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>>
  & { [Symbol.iterator]: () => IterableIterator<NonUndefined> };

export type EventWithData<Data> = JQuery.TriggeredEvent<EventTarget, Data, EventTarget, EventTarget>;

export type Config = {
  type: string;
  step: number;
  min: number;
  max: number;
  range: Array<number>;
  values: Array<number>;
  connects: Array<boolean>;
  set: Array<NonBottomValue>;
  direction: Direction;
  orientation: Orientation;
  hasTooltips: boolean;
  grid: TGridConfig;
  isCached: boolean;
  cacheCapacity: number;
  filter: (x: number) => boolean;
  prettifier: (x: string) => string;
}

export type ViewChanges<T> = {
  type: Array<string>;
  event: JQuery.TriggeredEvent<EventTarget, T, EventTarget, EventTarget>;
};

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
  view: string;
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
