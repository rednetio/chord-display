# Chord Display

A free tool to show chords and notes being played using a MIDI keyboard.

## Where ?

You can use this tool online at [https://chord-display.rednet.io](https://chord-display.rednet.io) or [Download ZIP](https://github.com/rednetio/chord-display/archive/master.zip) and open the file `dist/index.html` directly.

## Why ?

I was searching for a VST or any software that can show me the chords while I (or anybody jamming with me) play on a screen.
And I was unable to find any good solution, so I created this free tool.
It is very simple and very customizable, since it's based on the Web MIDI API now supported by all modern browsers.

You can use it for streaming on Twitch by including it as a BrowserSource in OBS (Open Broadcast Software) or for your Youtube videos.
Do not hesitate to mention it in your channel and video description.

## Customize

You can customize Chord Display without knowing much about programming.
For instance, OBS BrowserSource let you inject any CSS in the page, to let you:

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

- [ ] Change keyboard size / octaves
- [ ] Settings via URL (keyboard size, MIDI Input, French notation, style without CSS, ...)
- [ ] Better chord notations and alternative notations (provided by tonal)
- [ ] Scale detection and display (provided by tonal)
- [ ] Sustain pedal ?
- [ ] Pitch Wheel ?

### Contribute / Bugs

This project is fully open to contribution and it would be appreciated have some feedbacks and new ideas.
Please feel free to open an issue or open a Merge request.

For any UI or UX bug, please [Open an issue](https://github.com/rednetio/chord-display/issues).

If you discover unexpected Chord detection, please see [tonaljs/tonal issues](https://github.com/tonaljs/tonal/issues) and contribute to make it work perfectly.

### Credits

Chord Display is entirely based on the amazing [tonaljs/tonal](https://github.com/tonaljs/tonal) which is still under development.