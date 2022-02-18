import { Orientation, Direction, PointState } from "common/types/types";

import { Size, TDivisionState } from "./types";

const BLOCK_NAME = "grid";

const elemName = {
  BASE: "base",
  DIVISION: "division",
  VALUE: "value",
};

const defaultFilter = (point: PointState): TDivisionState | null => {
  const { percent, view } = point;
  if (percent === 0 || percent === 100) {
    return {
      percent,
      view,
      size: Size.Big,
      isDisplayed: true,
    };
  }

  return {
    percent,
    view,
    size: Size.Small,
    isDisplayed: false,
  };
}

const defaultPrettifier = (view: string): string => view;

const directionMatrix = {
  [Orientation.Horizontal]: {
    [Direction.Right]: 'left',
    [Direction.Left]: 'right',
  },
  [Orientation.Vertical]: {
    [Direction.Right]: 'top',
    [Direction.Left]: 'bottom',
  },
};

export {
  defaultFilter,
  defaultPrettifier,
  BLOCK_NAME,
  elemName,
  directionMatrix,
}
