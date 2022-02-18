import { PointState } from "common/types/types";

enum Size {
  Small = 'Small',
  Middle = 'Middle',
  Big = 'Big',
};

type TDivisionState = {
  percent: number,
  view: string,
  size: Size,
  isDisplayed: boolean,
};

type TGridConfig = {
  step: number;
  stepType: "value" | "percent";
  filter: (point?: PointState, index?: number) => TDivisionState | null;
  prettifier: (view?: string) => string;
};

export {
  Size,
  TGridConfig,
  TDivisionState,
}
