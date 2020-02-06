/* source: https://github.com/cwilso/midi-synth/blob/master/js/midi.js */

import {
  noteOff,
  noteOn,
  controller,
  pitchWheel,
  modWheel,
  polyPressure,
} from './events';
import { setChordHtml, setNotesHtml, setAppError, setAppLoaded } from './ui';
import { getSetting, setSetting } from './settings';

const PREFERRED_MIDI = [
  'mpk',
  'key',
  'piano',
];

const CMD_NOTE_OFF = 8;
const CMD_NOTE_ON = 9;
const CMD_AFTERTOUCH = 10;
const CMD_CC = 11;
const CMD_PITCHBEND = 14;
const NOTE_CC_MODWHEEL = 1;

function midiMessageReceived(ev) {
  let cmd = ev.data[0] >> 4;
  let channel = ev.data[0] & 0xf;
  let noteNumber = ev.data[1];
  let velocity = ev.data[2];

  if (channel === 9) return;
  if (cmd === CMD_NOTE_OFF || (cmd === CMD_NOTE_ON && velocity === 0)) {
    // with MIDI, note on with velocity zero is the same as note off
    // note off
    noteOff(noteNumber);
  } else if (cmd === CMD_NOTE_ON) {
    // note on
    noteOn(noteNumber, velocity / 127.0);
  } else if (cmd === CMD_CC) {
    if (noteNumber === NOTE_CC_MODWHEEL) {
      modWheel(velocity / 127.0);
    } else {
      controller(noteNumber, velocity / 127.0);
    }
  } else if (cmd === CMD_PITCHBEND) {
    // pitch wheel
    pitchWheel((velocity * 128.0 + noteNumber - 8192) / 8192.0);
  } else if (cmd === CMD_AFTERTOUCH) {
    // poly aftertouch
    polyPressure(noteNumber, velocity / 127);
  } else console.log('' + ev.data[0] + ' ' + ev.data[1] + ' ' + ev.data[2]);
}

let selectMIDI = null;
let midiAccess = null;
let midiIn = null;

export function selectMIDIIn(ev) {
  if (midiIn) midiIn.onmidimessage = null;
  let id = ev.target[ev.target.selectedIndex].value;
  if (typeof midiAccess.inputs === 'function')
    //Old Skool MIDI inputs() code
    midiIn = midiAccess.inputs()[ev.target.selectedIndex];
  else midiIn = midiAccess.inputs.get(id);
  if (midiIn) midiIn.onmidimessage = midiMessageReceived;

  setSetting('midiIn', midiIn.name.toString());
}

function populateMIDIInSelect() {
  const midiInSetting = getSetting('midiIn');

  // clear the MIDI input select
  selectMIDI.options.length = 0;
  if (midiIn && midiIn.state == 'disconnected') midiIn = null;
  let firstInput = null;

  let inputs = midiAccess.inputs.values();
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    input = input.value;
    const str = input.name.toString();
    
    if (!firstInput) {
      firstInput = input;
    }

    let preferred = false;

    if (midiIn && midiIn === input) {
      preferred = true;
    }

    if (!midiIn && midiInSetting && str.toLowerCase().indexOf(midiInSetting.toLowerCase()) !== -1) {
      preferred = true;
    }

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
  setAppLoaded()
  selectMIDI = document.getElementById('midiIn');
  midi.onstatechange = midiConnectionStateChange;
  populateMIDIInSelect();
}

function onMIDISystemError(err) {
  setAppError('Cannot initialize MIDI');
  console.log(`MIDI not initialized - error encountered: ${err.code}`);
}


export function initializeMidi() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDIStarted, onMIDISystemError);
  } else {
    showError();
  }
}
