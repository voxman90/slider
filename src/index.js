import * as $ from 'jquery';

import { Orientation } from 'common/types/types';

import Model from './scripts/Model';
import View from './scripts/View';
import Presenter from './scripts/Presenter';

import './styles/styles.scss';

const config = {
  type: 'range',
  orientation: Orientation.Horizontal,
  range: [0, 10],
  step: 1,
  values: [2, 6, 8],
  connects: [false, true, false, true],
};
const model = new Model(config);
const presenter = new Presenter(model);
const view = new View(config);
presenter.attachToModel(model);
presenter.attachToView(view);
model.notifyScopeAll();

const container = $('.container');
view.appendSliderTo(container);
