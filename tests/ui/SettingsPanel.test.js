import SettingsPanel from '../../src/ui/SettingsPanel.js';

describe('SettingsPanel', () => {
  test('updates settings and canvas color', () => {
    document.body.innerHTML = `
      <div id="panel">
        <input id="colorMode" value="Rainbow" />
        <input id="intensity" value="1" />
        <input id="smoothing" value="0.2" />
        <input id="strobeToggle" type="checkbox" />
        <input id="strobeSensitivity" value="50" />
        <label id="strobeSensitivityLabel"></label>
        <input id="bgColor" type="color" value="#ff0000" />
      </div>
      <canvas id="c"></canvas>`;
    const panel = document.getElementById('panel');
    const canvas = document.getElementById('c');
    const settings = {};
    new SettingsPanel(panel, settings, canvas);
    expect(settings.bgColor).toBe('#ff0000');
    expect(canvas.style.backgroundColor).toBe('rgb(255, 0, 0)');
    const colorInput = panel.querySelector('#bgColor');
    colorInput.value = '#00ff00';
    colorInput.dispatchEvent(new Event('input'));
    expect(settings.bgColor).toBe('#00ff00');
    expect(canvas.style.backgroundColor).toBe('rgb(0, 255, 0)');
  });
});
