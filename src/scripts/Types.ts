export type primitive = number | string | boolean | symbol | bigint | null | undefined;
export type NonBottomValue = NonNullable<primitive> | object;
export type NonUndefined = NonBottomValue | null;

export type horizontal = 1;
export type vertical = 0;
export type orientation = horizontal | vertical;

export type left = -1;
export type right = 1;
export type direction = left | right;

export interface Configuration {
  type: 'range' | 'set';
  step: number;
  min: number;
  max: number;
  range: [number, number];
  points: Array<number>;
  connects: Array<0 | 1>;
  set: Array<NonBottomValue>;
  direction: 'horizontal' | 'vertical';
  orientation: 'ltr' | 'rtl';
  hasTooltips: boolean;
  hasScale: boolean;
  scaleMap: Array<number>;
  isCached: boolean;
  cacheCapacity: number;
  prettifier: (x: string) => string;
}
