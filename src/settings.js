import { selectMIDIIn } from './midi';
import { render } from './ui';
import qs from 'qs';

const DEFAULT_SETTINGS = {
  midiIn: null,
  noteStart: 'C3',
  noteEnd: 'C5',
  latinNotationEnabled: false,
  pitchWheelEnabled: true,
  modWheelEnabled: true,
  colorNote: '#bf3a2b',
  colorPitchWheelDown: '#bf3a2b',
  colorPitchWheelUp: '#44ffaa',
  colorModWheel: '#44bbff',
  hideKeyboard: false,
  hideNotes: false,
  hideChord: false,
  hideBassNote: false,
  hideKeyName: false,
  hideTonic: false,
};

let customSettings = {}; 

export function getSetting(name) {
  return customSettings[name] !== undefined ? customSettings[name] : DEFAULT_SETTINGS[name]; 
}

export function setSetting(name, value) {
  customSettings[name] = value;
  saveQueryParams();
}

function qsValueDecoder(str, decoder, charset) {
  if (!Number.isNaN(Number(str))) return Number(str);
  if (str === 'true') return true;
  if (str === 'false') return false;

  // https://github.com/ljharb/qs/blob/master/lib/utils.js
  let strWithoutPlus = str.replace(/\+/g, ' ');
  if (charset === 'iso-8859-1') {
      // unescape never throws, no try...catch needed:
      return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  }
  // utf-8
  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
};

function parseQueryParams() {
  const newSettings = qs.parse(window.location.search, { depth: 0, parseArrays: false, ignoreQueryPrefix: true, decoder: qsValueDecoder })
  Object.assign(customSettings, newSettings);
}

function saveQueryParams() {
  const queryParams = qs.stringify(customSettings, { addQueryPrefix: true });
  window.history.pushState(customSettings, 'settings update', queryParams);
} 

function onSettingChange(setting, evt) {
  if (setting === 'midiIn') {
    selectMIDIIn(evt);
    render(true);
    return;
  }

  const { target } = evt; 

  if (target.type === 'checkbox') {
    setSetting(setting, !!target.checked);
  }

  if(target.type === 'text' || target.type === 'color') {
    setSetting(setting, target.value);
  }

  render();
}

export function initSettings() {
  parseQueryParams()

  for (const setting of Object.keys(DEFAULT_SETTINGS)) {
    const element = document.getElementById(setting);
    if (element.type === 'checkbox') {
      element.checked = getSetting(setting);
    }
    if (element.type === 'text' || element.type === 'color') {
      element.value = getSetting(setting);
    }
     
    element.addEventListener('input', onSettingChange.bind(null, setting));
  }
}
