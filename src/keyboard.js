import Note from 'tonal/note';
import { range, toRGBA } from './utils';

const keyboardContainer = document.getElementById('keyboard');


const NOTE_RADIUS = 5;
const NOTE_WHITE_WIDTH = 40;
const NOTE_WHITE_HEIGHT = 150;
const NOTE_BLACK_WIDTH = 22;
const NOTE_BLACK_HEIGHT = 90;
const NOTE_TONIC_RADIUS = 5;
const NOTE_TONIC_BOTTOM_OFFSET = 30;
const NOTE_NAME_BOTTOM_OFFSET = 2;


const WHEEL_RADIUS = 10;
const WHEEL_PADDING = 5;
const WHEEL_MARGIN = 10;
const WHEEL_WIDTH = NOTE_WHITE_WIDTH;
const WHEEL_HEIGHT = NOTE_WHITE_HEIGHT;
const WHEEL_AMPLITUDE = 2 * WHEEL_HEIGHT - 80;

const pitchWheelColorDown = '#bf3a2b'
const pitchWheelColorUp = '#44ffaa';
const modWheelColor = '#44bbff';

const NOTE_WHITE_TEMPLATE = (props, posX) => `\
<g id="note-${props.midi}" class="note white" transform="translate(${posX},0)">
  <rect class="piano-key" width="${NOTE_WHITE_WIDTH}" height="${NOTE_WHITE_HEIGHT+NOTE_RADIUS}" x="0" y="${-NOTE_RADIUS}" rx="${NOTE_RADIUS}" ry="${NOTE_RADIUS}"></rect>
  <circle class="piano-tonic" cx="${NOTE_WHITE_WIDTH/2}" cy="${NOTE_WHITE_HEIGHT-NOTE_TONIC_BOTTOM_OFFSET}" r="${NOTE_TONIC_RADIUS}"></circle>
  <text class="piano-key-name" x="${NOTE_WHITE_WIDTH/2}" y="${NOTE_WHITE_HEIGHT-NOTE_NAME_BOTTOM_OFFSET}" text-anchor="middle">${props.name}</text>
</g>`;

const NOTE_BLACK_TEMPLATE = (props, posX) => `\
<g id="note-${props.midi}" class="note black" transform="translate(${posX - NOTE_BLACK_WIDTH/2},0)">
  <rect class="piano-key" width="${NOTE_BLACK_WIDTH}" height="${NOTE_BLACK_HEIGHT+NOTE_RADIUS}" x="0" y="${-NOTE_RADIUS}" rx="${NOTE_RADIUS}" ry="${NOTE_RADIUS}"></rect>
  <circle class="piano-tonic" cx="${NOTE_BLACK_WIDTH/2}" cy="${NOTE_BLACK_HEIGHT-NOTE_TONIC_BOTTOM_OFFSET}" r="${NOTE_TONIC_RADIUS}"></circle>
</g>`;

const WHEEL_TEMPLATE = (id, offsetX) => `\
<g id="${id}" transform="translate(${offsetX},0)">
  <rect class="wheelSocket" width="${WHEEL_WIDTH}" height="${WHEEL_HEIGHT}" rx="${WHEEL_RADIUS}" ry="${WHEEL_RADIUS}" />
  <g transform="translate(${WHEEL_PADDING},0)" clip-path="url(#wheelClip)">
    <rect class="wheel" transform="translate(0, ${-WHEEL_HEIGHT / 2})" width="${WHEEL_WIDTH - 2 * WHEEL_PADDING}" height="${WHEEL_HEIGHT * 2}"></rect>
  </g>
</g>
`;

const KEYBOARD_TEMPLATE = (keyboardNotes, wheels) => `\
<svg width="100%" viewBox="${-wheels.width} 0 ${keyboardNotes.width + wheels.width} ${keyboardNotes.height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="insetKey">                                                            <!-- source: https://www.xanthir.com/b4Yv0 -->
      <feOffset dx="0" dy="-7"/>                                                          <!-- Shadow Offset -->
      <feGaussianBlur stdDeviation="5" result="offset-blur"/>                            <!-- Shadow Blur -->
      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/> <!-- Invert the drop shadow to create an inner shadow -->
      <feFlood flood-color="black" flood-opacity="0.4" result="color"/>                   <!-- Color & Opacity -->
      <feComposite operator="in" in="color" in2="inverse" result="shadow"/>               <!-- Clip color inside shadow -->
      <feComponentTransfer in="shadow" result="shadow">                                   <!-- Shadow Opacity -->
        <feFuncA type="linear" slope="5"/>
      </feComponentTransfer>
      <feBlend mode="soft-light" in="shadow" in2="SourceGraphic"/>                        <!-- Put shadow over original object -->
    </filter>
    <filter id="insetWheel">                                                            <!-- source: https://www.xanthir.com/b4Yv0 -->
      <feOffset dx="0" dy="0"/>                                                          <!-- Shadow Offset -->
      <feGaussianBlur stdDeviation="2" result="offset-blur"/>                            <!-- Shadow Blur -->
      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/> <!-- Invert the drop shadow to create an inner shadow -->
      <feFlood flood-color="black" flood-opacity="1" result="color"/>                   <!-- Color & Opacity -->
      <feComposite operator="in" in="color" in2="inverse" result="shadow"/>               <!-- Clip color inside shadow -->
      <feComponentTransfer in="shadow" result="shadow">                                   <!-- Shadow Opacity -->
        <feFuncA type="linear" slope="1.5"/>
      </feComponentTransfer>
      <feBlend mode="normal" in="shadow" in2="SourceGraphic" />
    </filter>
    <linearGradient id="whiteKey" gradientTransform="rotate(90)">
      <stop offset="0%"  stop-color="#bbbbbb" />
      <stop offset="8%"  stop-color="#eeeeee" />
      <stop offset="90%" stop-color="#ffffff" />
      <stop offset="91%" stop-color="#eeeeee" />
    </linearGradient>
    <linearGradient id="blackKey" gradientTransform="rotate(90)">
      <stop offset="0%"  stop-color="#000000" />
      <stop offset="16%" stop-color="#222222" />
      <stop offset="80%" stop-color="#444444" />
      <stop offset="80.5%" stop-color="#aaaaaa" />
      <stop offset="85%" stop-color="#222222" />
      <stop offset="91%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="wheelGradient" gradientTransform="rotate(90)">
      <stop offset="0%"  stop-color="#000000" />
      <stop offset="45%" stop-color="#555555" />
      <stop offset="46%" stop-color="#111111" />
      <stop offset="49.5%" stop-color="#333333" />
      <stop offset="50%" stop-color="#bbbbbb" />
      <stop offset="50.5%" stop-color="#444444" />
      <stop offset="51%" stop-color="#555555" />
      <stop offset="54%" stop-color="#666666" />
      <stop offset="55%" stop-color="#333333" />
      <stop offset="91%" stop-color="#000000" />
    </linearGradient>
    
    <clipPath id="wheelClip">
      <rect width="${WHEEL_WIDTH - 2 * WHEEL_PADDING}" height="${WHEEL_HEIGHT - 2}" y="1" rx="${WHEEL_RADIUS / 2}" ry="${WHEEL_RADIUS / 2}" />
    </clipPath>
  </defs>

  <g id="wheels" transform="translate(${-wheels.width},0)">
    ${wheels.markup}
  </g>

  <g id="board" transform="translate(0,0)">
    <rect id="keyboard-bg" width="${keyboardNotes.width}" height="${keyboardNotes.height}" x="0" y="0" />
    ${keyboardNotes.markup}
    <rect id="board-border" width="${keyboardNotes.width}" height="${keyboardNotes.height}" x="0" y="0" />
  </g>
</svg>
`;

function getWheelsMarkup(ids) {
  return ids.reduce((wheels, id) => {
    const markup = WHEEL_TEMPLATE(id, wheels.width);
    
    return {
      width: wheels.width + WHEEL_WIDTH + WHEEL_MARGIN,
      height: wheels.height,
      markup: wheels.markup + markup,
    }
  }, { width: 0, height: WHEEL_HEIGHT, markup: ''})
}

function getNoteMarkup(noteNumber, offsetX) {
  const note = Note.fromMidi(noteNumber, { sharps: true });
  const props = Note.props(note);

  if (props.alt) {
    return {
      width: 0,
      isWhite: false,
      markup: NOTE_BLACK_TEMPLATE(props, offsetX),
    }
  }

  return {
    width: NOTE_WHITE_WIDTH,
    isWhite: true,
    markup: NOTE_WHITE_TEMPLATE(props, offsetX),
  }
}

export function generateKeyboard(from, to, wheelIds = ['pitchWheel', 'modWheel']) {
  const fromProps = Note.props(Note.simplify(from));
  const toProps = Note.props(Note.simplify(to));

  const noteStart = (
    fromProps.name
    ? fromProps.alt
      ? fromProps.midi - 1
      : fromProps.midi
    : Note.midi('C2')
  );

  const noteEnd = (
    toProps.name
    ? toProps.alt
      ? toProps.midi + 1
      : toProps.midi
    : Note.midi('B4')
  );

  const keyboardNotes = range(noteStart, noteEnd).reduce(
    (keyboard, noteNumber) => {
      const { width, isWhite, markup } = getNoteMarkup(noteNumber, keyboard.width);
      return {
        width: keyboard.width + width,
        height: keyboard.height,
        markup: isWhite
        ? markup + keyboard.markup
        : keyboard.markup + markup,
      }
    }, { width: 0, height: NOTE_WHITE_HEIGHT, markup: ''}
  );

  const wheels = getWheelsMarkup(wheelIds);
  
  return KEYBOARD_TEMPLATE(keyboardNotes, wheels);
}

export function setPitchWheel(pitch) {
  const pitchWheelSocket = document.querySelector('#pitchWheel .wheelSocket');
  const pitchWheel = document.querySelector('#pitchWheel .wheel');

  const translateY = -(WHEEL_HEIGHT / 2) - pitch * (WHEEL_AMPLITUDE / 4);
  pitchWheel.setAttribute('transform', `translate(0, ${translateY})`);
  if (pitch > 0) {
    pitchWheelSocket.style.fill = toRGBA(pitchWheelColorUp, pitch);
  } else {
    pitchWheelSocket.style.fill = toRGBA(pitchWheelColorDown, -pitch);
  }
}

export function setModWheel(mod) {
  const modWheelSocket = document.querySelector('#modWheel .wheelSocket');
  const modWheel = document.querySelector('#modWheel .wheel');

  const translateY = -((WHEEL_HEIGHT - WHEEL_AMPLITUDE / 2) / 2) - mod * (WHEEL_AMPLITUDE / 2) ;
  modWheel.setAttribute('transform', `translate(0, ${translateY})`);
  modWheelSocket.style.fill = toRGBA(modWheelColor, mod);
}

export function initializeKeyboard() {
  keyboardContainer.innerHTML = generateKeyboard('C0', 'C6');
}
