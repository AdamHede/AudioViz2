# AGENTS.md – Project Guide for OpenAI Codex

This file provides guidance for OpenAI Codex and other AI agents contributing to this audio visualization tool. The project uses JavaScript (ES6+) and Web APIs, and is in early stages with a single-song visualization MVP, planning to scale into a professional lighting control system.

## 🎯 Project Purpose

This project is an audio-reactive visualizer built with JavaScript, Web Audio API, and Canvas. It is designed to evolve into a real-time lighting and visual control system for concerts and festivals. The current MVP loads a single audio file ("Electric Pulse.mp3") and displays synchronized visuals in real time.

---

## 🗂 Project Structure

- `/src`
  - `main.js` — entry point for initializing the app
  - `/audio/` — audio decoding, playback, and analysis logic
    - `AudioPlayer.js` — manages load/play/pause of audio
    - `AudioAnalyzer.js` — real-time FFT & frequency data interface
  - `/render/` — rendering logic
    - `VisualizerCanvas.js` — draws visuals based on mapped data
    - `SceneConfig.js` — defines visual fixture layout & mappings
  - `/core/` — controller logic
    - `AppController.js` — coordinates audio/render/UI components
  - `/ui/` — basic controls (e.g., play/pause buttons)
- `/public/`
  - `Electric Pulse.mp3` — test track for manual and automated analysis
- `/tests/`
  - Unit tests (Jest) for all pure functions and audio analysis components

---

## 🧑‍💻 Coding Conventions

- Language: **JavaScript (ES6+)**
- Use **pure functions** where possible for logic (especially in audio → visual mapping)
- Code should be **modular** and avoid large monolithic files
- Prefer **dependency injection** for config/state
- Naming conventions:
  - PascalCase for classes and components (`VisualizerCanvas`)
  - camelCase for functions and variables (`mapFftToVisuals`)
- Each function or method must include a short comment for non-obvious logic
- Files should be ≤ 200 LOC if possible

---

## 🧪 Testing Protocols

OpenAI Codex should follow a test-first or test-parallel approach for new code.

### Test Framework: [Jest](https://jestjs.io/)

### Test Requirements:

- All logic-heavy modules (e.g., `AudioAnalyzer`, `mapFftToVisuals`) must include unit tests
- Audio test data should be deterministic — e.g., fixed FFT input arrays or sine wave generation
- Use `/public/Electric Pulse.mp3` for integration-level analysis consistency
- Prefer mock-based tests for `AudioContext`, `AnalyserNode`, and `CanvasRenderingContext2D`

### Run Commands:

```bash
npm test              # run all tests
npm test -- --watch   # watch mode for development
