import Note from 'tonal/note';
import { range } from './utils';
import { getSetting } from './settings';
import { render as renderKeyboard, setPitchWheel, setModWheel } from './keyboard';

const LAYOUT_SETTINGS = ['hideKeyboard', 'hideNotes', 'hideChord', 'hideBassNote', 'hideKeyName', 'hideTonic'];

const appContainer = document.getElementById('app');
const chordDisplay = document.getElementById('chord');
const notesDisplay = document.getElementById('notes');

export { setPitchWheel, setModWheel };

export function highlightNote(noteNumber, className = 'active') {
  const keyElement = document.getElementById(`note-${noteNumber}`);
  if (!keyElement) return;

  keyElement.classList.add(className);
}

export function fadeNote(noteNumber) {
  const keyElement = document.getElementById(`note-${noteNumber}`);
  if (!keyElement) return;

  keyElement.classList.remove('active');
}

export function highlightTonic(tonic) {
  const notes = range(0,10).map(oct => Note.midi(`${tonic}${oct}`));

  for (const note of notes) {
    highlightNote(note, 'tonic');
  }
}

export function fadeTonics() {
  const elements = document.querySelectorAll('.tonic');

  if (elements && elements.length) {
    for (const element of elements) {
      element.classList.remove('tonic');
    }
  }
}

export function setChordHtml(html) {
  chordDisplay.innerHTML = html;
}

export function setNotesHtml(html) {
  notesDisplay.innerHTML = html;
}

export function setLayoutSettings() {
  for (const setting of LAYOUT_SETTINGS) {
    const value = getSetting(setting);

    if (value) {
      appContainer.classList.add(setting);
    } else {
      appContainer.classList.remove(setting);
    }
  }  
}

export function setAppLoaded(message) {
  appContainer.classList.add('loaded');
}

export function setAppError(message) {
  appContainer.classList.add('error');
  setChordHtml('Error');
  setNotesHtml(message);
}

export function render(reset) {
  setLayoutSettings();
  renderKeyboard(reset);
}
