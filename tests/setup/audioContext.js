import { AudioContext, OfflineAudioContext } from 'web-audio-test-api';

// Polyfill global constructors for Web Audio API
if (!globalThis.AudioContext) {
  globalThis.AudioContext = AudioContext;
}
if (!globalThis.OfflineAudioContext) {
  globalThis.OfflineAudioContext = OfflineAudioContext;
}
