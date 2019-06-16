import './styles.css';
import { initializeMidi } from './midi';

let initialized = false;
//init: start up MIDI
if (!initialized) {
  initializeMidi();
  initialized = true;
}
