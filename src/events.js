import Note from 'tonal/note';
import { chord as detectChord } from 'tonal/detect';
import { highlightNote, fadeNote, highlightTonic, fadeTonics, setChordHtml, setNotesHtml } from './ui';
import { chordToHtml, keyToHtml } from './chords';


console.log(chord)
const currentNotes = [];
let previousChord = null;

export function noteOn(noteNumber) {
  if (!currentNotes.includes(noteNumber)) {
    currentNotes.push(noteNumber);
    highlightNote(noteNumber);
  }
  currentNotes.sort();
  refresh();
}

export function noteOff(noteNumber) {
  const index = currentNotes.indexOf(noteNumber);
  if (index > -1) {
    currentNotes.splice(index, 1);
    fadeNote(noteNumber);
  }
  refresh();
}

function onEvent(...args) {
  console.log(...args);
}

function refresh() {
  const notes = currentNotes.map(Note.fromMidi).map(Note.pc);
  const chords = notes.length > 2 ? detectChord(notes) : [];
  
  
  setNotesHtml(notes.map(keyToHtml).join(' '));
  if (chords && chords.length) {
    const chord = chords[0];
    setChordHtml(chordToHtml(chord));


    if (previousChord) {
      fadeTonics();
    }

    highlightTonic(chord.tonic);
    previousChord = chord;
  } else {
    setChordHtml('');
    fadeTonics();
  }
  
}

export const controller = onEvent.bind(this, 'controller');
export const pitchWheel = onEvent.bind(this, 'pitchWheel');
export const polyPressure = onEvent.bind(this, 'polyPressure');
