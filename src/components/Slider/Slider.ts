import BEMBlock from "components/BEMBlock";
import { HORIZONTAL } from "common/constants/Constants";
import { orientation, PointState, ModelState } from "common/types/Types";

import Connect from "./Connect";
import Ground from "./Ground";
import Handle from "./Handle";
import Track from "./Track";
import Base from "./Base";
import "./Slider.scss";

const BLOCK_NAME = 'slider';

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
  public activeHandleIndex: number | null;
  protected _orientation: orientation;

  constructor (config: any) {
    super(BLOCK_NAME);
    const {
      orientation = HORIZONTAL,
      numberOfHandles = 1,
    } = config;
    this.activeHandleIndex = null;
    this._orientation = orientation;
    this.$elem = this._getTemplate();
    this.base = this._createBase();
    this.track = this._createTrack();
    this.connects = this._createConnects(numberOfHandles);
    this.grounds = this._createGrounds(numberOfHandles);
    this.handles = this._createHandles(numberOfHandles);
    this._connectSliderElements();
  }

  public get numberOfHandles() {
    return this.handles.length;
  }

  public get numberOfConnects() {
    return this.handles.length + 1;
  }

  public setState(state: ModelState) {
    const { points } = state;
    this.setHandlePositions(points);
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

  public setHandlePositions(points: Array<PointState>) {
    points.forEach((state, id) => {
      this.setHandlePosition(id, state);
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

  public setHandlePosition(index: number, state: PointState) {
    const { offset, leftIndent, rightIndent } = state;
    this.grounds[index].move(offset, this._orientation);
    this.handles[index].setOffsetAttr(offset);
    this.connects[index].resize(leftIndent, this._orientation);
    this.connects[index + 1].moveAndResize(offset, rightIndent, this._orientation);
  }

  protected _getTemplate(): JQuery<HTMLElement> {
    const orientation = (this._orientation === HORIZONTAL)
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
}

export default Slider;
