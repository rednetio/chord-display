import Note from 'tonal/note';
import { range } from './utils';
export { setPitchWheel, setModWheel } from './keyboard';

const chordDisplay = document.getElementById('chord');
const notesDisplay = document.getElementById('notes');

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