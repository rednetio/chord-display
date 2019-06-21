/* source: https://github.com/cwilso/midi-synth/blob/master/js/midi.js */

import {
  noteOff,
  noteOn,
  controller,
  pitchWheel,
  modWheel,
  polyPressure,
} from './events';
import { setChordHtml, setNotesHtml } from './ui';

const PREFERRED_MIDI = [
  'mpk',
  'key',
];

function midiMessageReceived(ev) {
  let cmd = ev.data[0] >> 4;
  let channel = ev.data[0] & 0xf;
  let noteNumber = ev.data[1];
  let velocity = ev.data[2];

  if (channel === 9) return;
  if (cmd === 8 || (cmd === 9 && velocity === 0)) {
    // with MIDI, note on with velocity zero is the same as note off
    // note off
    noteOff(noteNumber);
  } else if (cmd === 9) {
    // note on
    noteOn(noteNumber, velocity / 127.0);
  } else if (cmd === 11) {
    if (noteNumber === 1) {
      modWheel(velocity / 127.0);
    } else {
      controller(noteNumber, velocity / 127.0);
    }
  } else if (cmd === 14) {
    // pitch wheel
    pitchWheel((velocity * 128.0 + noteNumber - 8192) / 8192.0);
  } else if (cmd === 10) {
    // poly aftertouch
    polyPressure(noteNumber, velocity / 127);
  } else console.log('' + ev.data[0] + ' ' + ev.data[1] + ' ' + ev.data[2]);
}

let selectMIDI = null;
let midiAccess = null;
let midiIn = null;

function selectMIDIIn(ev) {
  if (midiIn) midiIn.onmidimessage = null;
  let id = ev.target[ev.target.selectedIndex].value;
  if (typeof midiAccess.inputs === 'function')
    //Old Skool MIDI inputs() code
    midiIn = midiAccess.inputs()[ev.target.selectedIndex];
  else midiIn = midiAccess.inputs.get(id);
  if (midiIn) midiIn.onmidimessage = midiMessageReceived;
}

function populateMIDIInSelect() {
  // clear the MIDI input select
  selectMIDI.options.length = 0;
  if (midiIn && midiIn.state == 'disconnected') midiIn = null;
  let firstInput = null;

  let inputs = midiAccess.inputs.values();
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    input = input.value;

    if (!firstInput) firstInput = input;
    const str = input.name.toString();
    let preferred = false;

    // if we're rebuilding the list, but we already had this port open, reselect it.
    if (midiIn && midiIn === input) preferred = true; 

    for (const pref of PREFERRED_MIDI) {
      if (!midiIn && str.toLowerCase().indexOf(pref) !== -1) {
        preferred = true;
      }
    }

    selectMIDI.appendChild(
      new Option(input.name, input.id, preferred, preferred),
    );
    if (preferred) {
      midiIn = input;
      midiIn.onmidimessage = midiMessageReceived;
    }
  }
  if (!midiIn) {
    midiIn = firstInput;
    if (midiIn) midiIn.onmidimessage = midiMessageReceived;
  }
}

function midiConnectionStateChange(e) {
  console.log(`connection: ${e.port.name} ${e.port.connection} ${e.port.state}`);
  populateMIDIInSelect();
}

function onMIDIStarted(midi) {
  midiAccess = midi;

  document.getElementById('app').className = 'loaded';
  selectMIDI = document.getElementById('midiIn');
  midi.onstatechange = midiConnectionStateChange;
  populateMIDIInSelect();
  selectMIDI.onchange = selectMIDIIn;
}

function onMIDISystemError(err) {
  document.getElementById('app').className = 'error';
  showError();
  console.log(`MIDI not initialized - error encountered: ${err.code}`);
}

function showError() {
  setChordHtml('Error');
  setNotesHtml('Cannot initialize MIDI');
}

export function initializeMidi() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDIStarted, onMIDISystemError);
  } else {
    showError();
  }
}
