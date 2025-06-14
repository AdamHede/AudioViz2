# AudioViz2

Clone and run:

```bash
git clone <repo-url> && cd AudioViz2 && npm i && npm run dev
```

The bars visualization now uses **Three.js** for 3D rendering. Running `npm install` installs the required `three` dependency.

## Project Structure

```
/src
  audio/             # audio playback and analysis
  render/            # visualization components
  core/              # application controller
  ui/                # user interface elements
  main.js            # application entry point
```

## Running Tests

First install dev dependencies:

```bash
npm install
```

Run the test suite with:

```bash
npm test
npx jest --coverage
```

The tunnel scene is currently disabled when using the Three.js renderer. A new
**3D text** scene displays rotating text that gently bounces to the beat. When this scene is active a text field appears in the settings panel allowing the displayed text to be edited in real time.

## Noise Overlay

An optional Perlin noise layer can be enabled from the settings panel. Blend
modes, scale and animation speed allow customization of the effect.
