import * as $ from 'jquery';
import BEMBlock from './BEMBlock';
import Connect from './Connect';
import Ground from './Ground';
import Handle from './Handle';
import Track from './Track';
import { HORIZONTAL } from './Constants';
import { orientation, ModelState, PointState } from './Types';

const BLOCK_NAME = 'slider';

const modifier = {
  ORIENTATION_HORIZONTAL: 'orientation_horizontal',
  ORIENTATION_VERTICAL: 'orientation_vertical',
}

class Slider extends BEMBlock {
  public $elem: JQuery<HTMLElement>;
  public track: Track;
  public connects: Array<Connect>;
  public grounds: Array<Ground>;
  public handles: Array<Handle>;
  protected _orientation: orientation;

  constructor (config: any) {
    super(BLOCK_NAME);
    const {
      orientation = HORIZONTAL,
      numberOfHandles = 1,
    } = config;
    this._orientation = orientation;
    this.$elem = this._getTemplate();
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

  public setHandlePositions(points: Array<PointState>) {
    points.forEach((state, id) => {
      this.setHandlePosition(id, state);
    });
  }

  public setHandlePosition(index: number, state: PointState) {
    const { offset, leftIndent, rightIndent } = state;
    this.grounds[index].move(offset);
    this.handles[index].setOffsetAttr(offset);
    this.connects[index].resize(leftIndent);
    this.connects[index + 1].moveAndResize(offset, rightIndent);
  }

  private _getTemplate(): JQuery<HTMLElement> {
    const orientation = (this._orientation === HORIZONTAL)
      ? this.getModifier(modifier.ORIENTATION_HORIZONTAL)
      : this.getModifier(modifier.ORIENTATION_VERTICAL);
    return $('<div>').addClass([this.getClassName(), orientation]);
  }

  private _connectSliderElements(): void {
    this.track.appendTo(this);
    this.connects.forEach((connect) => connect.appendTo(this));
    this.grounds.forEach((ground, i) => {
      this.handles[i].appendTo(ground);
      ground.appendTo(this);
    });
  }

  private _createTrack() {
    return new Track(this._name, this.namespace);
  }

  private _createGround(): Ground {
    return new Ground(this._name, this.namespace);
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
    return new Handle(this._name, this.namespace, index);
  }

  private _createHandles(numberOfHandles: number): Array<Handle> {
    const handles = [];
    for (let index = 0; index < numberOfHandles; index += 1) {
      const handle = this._createHandle(index);
      handles.push(handle);
    }
    return handles;
  }

  protected _createConnect(index: number): Connect {
    return new Connect(this._name, this.namespace, index);
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
