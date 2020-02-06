import './styles.css';
import { initializeMidi } from './midi';
import { initSettings } from './settings';
import { render } from './ui';

let initialized = false;

initSettings();

//init: start up MIDI
if (!initialized) {
  initializeMidi();
  initialized = true;
}

render();
