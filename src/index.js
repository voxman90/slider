import * as $ from 'jquery';
import Model from './scripts/Model';
import View from './scripts/View';
import Presenter from './scripts/Presenter';
import { HORIZONTAL } from './scripts/Constants';

import './styles/slider.scss';

const config = {
  type: 'range',
  orientation: HORIZONTAL,
  range: [0, 10],
  points: [2, 6, 8],
  connects: [false, true, false, true],
};
const presenter = new Presenter(config);
const model = new Model(config);
const view = new View(config);
presenter.attachToModel(model);
presenter.attachToView(view);
model.notifyAll();

const container = $('.container');
view.appendSliderTo(container);
