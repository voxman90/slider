import BEMBlock from "components/BEMBlock";
import { Direction, Orientation, PointState } from "common/types/types";

import { BLOCK_NAME, defaultFilter, defaultPrettifier } from "./constants";
import { TDivisionState } from "./types";
import Division from "./Division";
import Value from "./Value";
import Base from "./Base";

const modifier = {
  ORIENTATION_Orientation.Horizontal: 'orientation_Orientation.Horizontal',
  ORIENTATION_VERTICAL: 'orientation_vertical',
};

class Grid extends BEMBlock {
  public $elem: JQuery<HTMLElement>;
  private _orientation: Orientation;
  private _base: Base;
  private _direction: Direction;
  private _divisions: Division[];
  private _values: Value[];
  private _prettifier: (view?: string) => string;
  private _filter: (point?: PointState, index?: number) => TDivisionState | null;

  constructor (config: any) {
    super(BLOCK_NAME);
    const {
      direction = Direction.Right,
      orientation = Orientation.Orientation.Horizontal,
      prettifier = defaultPrettifier,
      filter = defaultFilter,
    } = config;
    this._direction = direction;
    this._orientation = orientation;
    this._prettifier = prettifier;
    this._filter = filter;
    this.$elem = this._getTemplate();
    this._base = new Base(this);
    this._divisions = [];
    this._values = [];
  }

  public get divisionsCount(): number {
    return this._divisions.length;
  }

  public get valuesCount(): number {
    return this._values.length;
  }

  public get lastValueIndex(): number {
    return this.valuesCount - 1;
  }

  public get lastDivisionIndex(): number {
    return this.divisionsCount - 1;
  }

  private _convertToDivisionStates(points: PointState[]): TDivisionState[] {
    return points.map((point, i) => this._filter(point, i))
      .filter((a): a is TDivisionState => a !== null);
  }

  public setGridState(pointStates: PointState[]): boolean {
    const divisionStates = this._convertToDivisionStates(pointStates);
    const numberOfDivisions = divisionStates.length;
    if (numberOfDivisions < 2) {
      return false;
    }

    const base = this._base.detach();

    this._setDivisions(divisionStates);
    this._setValues(divisionStates);

    base.appendTo(this.$elem);

    return true;
  }

  private _setValues(divisionStates: TDivisionState[]): void {
    const valueStates = divisionStates.filter((state) => state.isDisplayed);

    const newValueCount = valueStates.length;
    this._setValuesCount(newValueCount);

    this._values.forEach((value, i) => this._setValueState(value, valueStates[i]));
  }

  private _setValuesCount(newCount: number): void {
    const addCount = newCount - this.valuesCount;
    if (addCount === 0) {
      return;
    }

    let deleteCount = 0;
    let start = this.valuesCount;
    if (addCount < 0) {
      deleteCount = Math.abs(addCount);
      start = newCount;
    }

    const addValues = this._createValues(addCount);
    addValues.forEach((value) => value.appendTo(this._base));
    const deletedValues = this._values.splice(start, deleteCount, ...addValues);
    deletedValues.forEach((value) => value.remove());
  }

  private _setValueState(value: Value, state: TDivisionState): void {
    value.move(state.percent, this._orientation, this._direction);
    const prettifiedView = this._prettifier(state.view);
    value.text(prettifiedView);
  }

  private _setDivisions(states: TDivisionState[]): void {
    const newDivisionCount = states.length;
    this._setDivisionsCount(newDivisionCount);

    this._divisions.forEach((div, i) => {
      this._setDivisionState(div, states[i]);
    });
  }

  private _setDivisionsCount(newCount: number): void {
    const addCount = newCount - this.divisionsCount;
    if (
      newCount < 2
      || addCount === 0
    ) {
      return;
    }

    let deleteCount = 0;
    let start = this.divisionsCount;
    if (addCount < 0) {
      deleteCount = Math.abs(addCount);
      start = newCount;
    }

    const addDivisions = this._createDivisions(addCount);
    addDivisions.forEach((div) => div.appendTo(this._base));
    const deletedDivisions = this._divisions.splice(start, deleteCount, ...addDivisions);
    deletedDivisions.forEach((div) => div.remove());
  }

  private _setDivisionState(division: Division, state: TDivisionState): void {
    division.move(state.percent, this._orientation, this._direction);
  }

  private _createValues(count: number): Value[] {
    if (count <= 0) {
      return [];
    }

    return new Array(count).map(() => new Value(this));
  }

  private _createDivisions(count: number): Division[] {
    if (count <= 0) {
      return [];
    }

    return new Array(count).map(() => new Division(this));
  }

  protected _getTemplate(): JQuery<HTMLElement> {
    const orientation = (this._orientation === Orientation.Orientation.Horizontal)
      ? this.getModifier(modifier.ORIENTATION_Orientation.Horizontal)
      : this.getModifier(modifier.ORIENTATION_VERTICAL);
    return super._getTemplate(orientation);
  }
}

export default Grid;
