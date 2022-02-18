import BEMBlock from "components/BEMBlock";
import { Orientation, PointStatePlusIndents, PointState, IntervalState, ScaleState } from "common/types/types";
import Grid from "components/Grid/Grid";

import Connect from "./Connect";
import Ground from "./Ground";
import Handle from "./Handle";
import Track from "./Track";
import Base from "./Base";
import { BLOCK_NAME } from "./constants";
import "./Slider.scss";

const modifier = {
  ORIENTATION_HORIZONTAL: 'orientation_horizontal',
  ORIENTATION_VERTICAL: 'orientation_vertical',
}

class Slider extends BEMBlock {
  public $elem: JQuery<HTMLElement>;
  public base: Base;
  public track: Track;
  public connects: Array<Connect>;
  public grounds: Array<Ground>;
  public handles: Array<Handle>;
  public grid?: Grid;
  public activeHandleIndex: number | null;
  public orientation: Orientation;

  constructor (config: any) {
    super(BLOCK_NAME);
    const {
      orientation = Orientation.Horizontal,
      numberOfHandles = 1,
      connectsMap = [],
      grid,
    } = config;
    this.activeHandleIndex = null;
    this.orientation = orientation;
    this.$elem = this._getTemplate();
    this.base = this._createBase();
    this.track = this._createTrack();
    this.connects = this._createConnects(numberOfHandles);
    this.grounds = this._createGrounds(numberOfHandles);
    this.handles = this._createHandles(numberOfHandles);
    this._enableConnects(connectsMap);
    this.grid = this._createGrid(10);
    this._connectSliderElements();
  }

  public get numberOfHandles() {
    return this.handles.length;
  }

  public get numberOfConnects() {
    return this.handles.length + 1;
  }

  public setState(state: ScaleState) {
    this.setHandlePositions(state);
    // TODO: values, min, max, step
  }

  public setInitialHandlesLayout() {
    this.handles.forEach((handle, index) => {
      handle.setZIndex(index);
    });
  }

  public setHandleZIndex(index: number, zIndex: number): void {
    const handle = this.handles[index];
    handle.setZIndex(zIndex);
  }

  public setHandlePositions(state: ScaleState) {
    const { points, intervals } = state;
    points.forEach((point, index) => {
      const pointStatePlusIndents = {
        leftIndent: intervals[index],
        point,
        rightIndent: intervals[index + 1],
      };
      this.setHandlePosition(pointStatePlusIndents, index);
    });
  }

  public setHandleActive(index: number): void {
    this.setHandleInactive();
    this.activeHandleIndex = index;
    this.handles[index].setModifierActive();
  }

  public setHandleInactive(): void {
    if (this.activeHandleIndex !== null) {
      const activeHandle = this.handles[this.activeHandleIndex];
      activeHandle.unsetModifierActive();
      this.activeHandleIndex = null;
    }
  }

  public setHandlePosition(state: PointStatePlusIndents, index: number) {
    const { leftIndent, point, rightIndent } = state;
    this.grounds[index].move(point.percent, this.orientation);
    this.handles[index].setOffsetAttr(point.percent);
    this.connects[index].resize(leftIndent.percent, this.orientation);
    this.connects[index + 1].moveAndResize(point.percent, rightIndent.percent, this.orientation);
  }

  protected _getTemplate(): JQuery<HTMLElement> {
    const orientation = (this.orientation === Orientation.Horizontal)
      ? this.getModifier(modifier.ORIENTATION_HORIZONTAL)
      : this.getModifier(modifier.ORIENTATION_VERTICAL);
    return super._getTemplate(orientation);
  }

  private _connectSliderElements(): void {
    this.base.appendTo(this);
    this.track.appendTo(this.base);
    this.connects.forEach((connect) => connect.appendTo(this.track));
    this.grounds.forEach((ground, i) => {
      this.handles[i].appendTo(ground);
      ground.appendTo(this.base);
    });
  }

  private _createBase() {
    return new Base(this);
  }

  private _createTrack() {
    return new Track(this);
  }

  private _createGround(): Ground {
    return new Ground(this);
  }

  private _createGrounds(numberOfHandles: number): Array<Ground> {
    const grounds = [];
    for (let index = 0; index < numberOfHandles; index += 1) {
      const ground = this._createGround();
      grounds.push(ground);
    }
    return grounds;
  }

  private _createGrid(numberOfDivisions: number): Grid {
    return new Grid({
      numberOfDivisions,
      orientation: this.orientation,
    });
  }

  private _createHandle(index: number): Handle {
    return new Handle(this, index);
  }

  private _createHandles(numberOfHandles: number): Array<Handle> {
    const handles = [];
    for (let index = 0; index < numberOfHandles; index += 1) {
      const handle = this._createHandle(index);
      handle.setZIndex(index);
      handles.push(handle);
    }
    return handles;
  }

  protected _createConnect(index: number): Connect {
    return new Connect(this, index);
  }

  protected _createConnects(numberOfHandles: number): Array<Connect> {
    const numberOfConnects = numberOfHandles + 1;
    const connects = [];
    for (let index = 0; index < numberOfConnects; index += 1) {
      const connect = this._createConnect(index);
      connects.push(connect);
    }
    return connects;
  }

  protected _enableConnects(connectsMap: Array<boolean> = []): void {
    if (connectsMap.length === 0) {
      connectsMap = this._getDefaultConnectsMap();
    }

    console.log(connectsMap)

    this.connects.forEach((connect, i) => {
      if (connectsMap[i]) {
        connect.enable();
      } else {
        connect.disable();
      }
    });
  }

  protected _getDefaultConnectsMap(): Array<boolean> {
    const connectsMap: Array<boolean> = [];
    const base = (this.numberOfHandles + 1) % 2;
    this.connects.forEach((_, i) => connectsMap.push((base + i) % 2 === 1));
    return connectsMap;
  }
}

export default Slider;
