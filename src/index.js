import './styles.css';
import { initializeMidi } from './midi';
import { initializeKeyboard } from './keyboard';

let initialized = false;
//init: start up MIDI
if (!initialized) {
  initializeMidi();
  initialized = true;
}

initializeKeyboard();
