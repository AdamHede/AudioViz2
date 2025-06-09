import AudioPlayer from '../../src/audio/AudioPlayer.js';

describe('AudioPlayer', () => {
  let player;
  let mockAudio;
  let mockCtx;

  beforeEach(() => {
    mockAudio = {
      play: jest.fn(),
      pause: jest.fn(),
      currentTime: 0,
    };

    global.Audio = jest.fn(() => mockAudio);

    global.URL.createObjectURL = jest.fn(() => 'blob:mock');

    mockCtx = {
      createMediaElementSource: jest.fn(() => ({ connect: jest.fn() })),
      state: 'running',
      resume: jest.fn(),
    };
    global.AudioContext = jest.fn(() => mockCtx);
    player = new AudioPlayer();
  });

  afterEach(() => {
    delete global.URL.createObjectURL;
  });

  test('loads only audio files', () => {
    expect(() => player.load({ type: 'text/plain' })).toThrow('Invalid audio file');
    const file = { type: 'audio/mp3' };
    player.load(file);
    expect(global.Audio).toHaveBeenCalled();
    expect(mockCtx.createMediaElementSource).toHaveBeenCalledWith(mockAudio);
  });

  test('play, pause and stop control playback', () => {
    const file = { type: 'audio/mp3' };
    player.load(file);
    player.play();
    expect(mockAudio.play).toHaveBeenCalled();
    player.pause();
    expect(mockAudio.pause).toHaveBeenCalledTimes(1);
    player.stop();
    expect(mockAudio.pause).toHaveBeenCalledTimes(2);
    expect(mockAudio.currentTime).toBe(0);
  });
});
