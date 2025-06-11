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

The tunnel scene is currently disabled when using the Three.js renderer.
