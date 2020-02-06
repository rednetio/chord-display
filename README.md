# Chord Display

A free tool to show chords and notes being played using a MIDI keyboard.

## Where ?

You can use this tool online at [https://chord-display.rednet.io](https://chord-display.rednet.io) or [Download ZIP](https://github.com/rednetio/chord-display/archive/master.zip) and open the file `dist/index.html` directly.

## Why ?

I was searching for a VST or any software that can show me the chords while I (or anybody jamming with me) play on a screen.
And I was unable to find any good solution, so I created this free tool.
It is very simple and very customizable, since it's based on the Web MIDI API now supported by all modern browsers.

You can use it for streaming on Twitch by including it as a BrowserSource in OBS (Open Broadcast Software), Streamlabs OBS or for your Youtube videos.
Do not hesitate to mention it in your channel and video description.

## Customize

You can customize Chord Display without knowing much about programming.

### via CSS

OBS BrowserSource let you inject any CSS in the page, so you can add any style to existing layout, like:

Remove detected Chord:
```css
#chord { display: none; }
```

Remove Bass Note / Slash chord / Compound chord notation:
```css
.bassnote { display: none; }
```

Remove played Notes:
```css
#notes { display: none; }
```

Remove keyboard:
```css
#keyboard { display: none; }
```

Change Keyboard colors:
```css
.note.white.active .piano-key {
  fill: #ecb2ab;
}

.note.black.active .piano-key {
  fill: #bf3a2b;
}
```

Remove tonic dots:
```css
.piano-tonic { display: none; }
```

Add a background to the keyboard:
```css
#keyboard { 
  padding: 32px;
  background: url('http://cdn.backgroundhost.com/backgrounds/subtlepatterns/bo_play_pattern.png') repeat;
}
```

Change display order:
```css
#keyboard { order: 1; }
#chordContainer { order: 2; }
#notes { order: 3; }
```

Change Text Color:
```css
body { color: #fff; }
```

Change Note Highlight Colors:
```css
.note.white { color: #ff4444; }
.note.black { color: #ff0000; }
```

Change chord size and placement:
```css
#chordContainer {
  align-items: flex-end;
  justify-content: flex-end;
  padding: 2vh;
}

#chord {
  font-size: 10vh;
}

#notes { display: none; }
```

### via Settings in Query Params

Settings are passed throught URL query params (urlencoded), and let you customize some features that might need programmatical changes.
When using Chord Display with a standard web browser, on mouse over, the settings sections appears.
Any changes to settings are reflected in URL, and will be kept on refresh.

To persist those settings, favorite the page, or copy/paste it in OBS BrowserSource to use the same settings.

With settings you can:

| Setting Name         | Description                                           |
|----------------------|-------------------------------------------------------|
| midiIn               | Select the midi input (by name)                       |
| noteStart            | First note of keyboard                                |
| noteEnd              | Last note of keyboard                                 |
| latinNotationEnabled | Display notes and chords with latin (french) notation |
| pitchWheelEnabled    | Display the pitch wheel                               |
| modWheelEnabled      | display the mod wheel                                 |
| colorNote            | Base color of hightlight notes                        |
| colorPitchWheelDown  | Color when pitch wheel goes down                      |
| colorPitchWheelUp    | Color when pitch wheel goes up                        |
| colorModWheel        | Mod wheel color                                       |
| hideKeyboard         | Hide the keyboard                                     |
| hideNotes            | Hide the played notes names                           |
| hideChord            | Hide the guessed chord                                |
| hideBassNote         | Hide the bass note of played chord                    |
| hideKeyName          | Hide name of notes on keys                            |
| hideTonic            | Hide tonic dot on keys                                |

## What then ?

### Build

This project is built with [Parcel](https://parceljs.org).

```
npm install

npm start
 -or-
npm build
```

### Planned features / Ideas

- [x] Change keyboard size / octaves
- [x] Settings via URL (keyboard size, MIDI Input, French notation, style without CSS, ...)
- [x] Pitch Wheel / ModWheel
- [ ] Sustain pedal ?
- [ ] Better chord notations and alternative notations (provided by tonal)
- [ ] Scale detection and display (provided by tonal)

### Contribute / Bugs

This project is fully open to contribution and it would be appreciated have some feedbacks and new ideas.
Please feel free to open an issue or open a Merge request.

For any UI or UX bug, please [Open an issue](https://github.com/rednetio/chord-display/issues).

If you discover unexpected Chord detection, please see [tonaljs/tonal issues](https://github.com/tonaljs/tonal/issues) and contribute to make it work perfectly.

### Credits

Chord Display is entirely based on the amazing [tonaljs/tonal](https://github.com/tonaljs/tonal) which is still under development.
