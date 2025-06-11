import SettingsPanel from '../../src/ui/SettingsPanel.js';

describe('SettingsPanel', () => {
  test('bindTextChange triggers handler', () => {
    document.body.innerHTML = '<div id="sp"><input id="colorMode"/><input id="intensity"/><input id="bgColor"/><input id="smoothing"/><input id="strobeToggle" type="checkbox"/><input id="strobeSensitivity"/><label id="strobeSensitivityLabel"></label><label id="textContentLabel"><input id="textContent"/></label></div>';
    const container = document.getElementById('sp');
    const settings = {};
    const panel = new SettingsPanel(container, settings);
    const handler = jest.fn();
    panel.bindTextChange(handler);
    const input = container.querySelector('#textContent');
    input.value = 'Hello';
    input.dispatchEvent(new Event('input'));
    expect(handler).toHaveBeenCalledWith('Hello');
  });

  test('toggleTextInput shows and hides label', () => {
    document.body.innerHTML = '<div id="sp"><label id="textContentLabel" style="display:none"><input id="textContent"/></label><input id="colorMode"/><input id="intensity"/><input id="bgColor"/><input id="smoothing"/><input id="strobeToggle"/><input id="strobeSensitivity"/><label id="strobeSensitivityLabel"></label></div>';
    const container = document.getElementById('sp');
    const settings = {};
    const panel = new SettingsPanel(container, settings);
    const label = container.querySelector('#textContentLabel');
    panel.toggleTextInput(true);
    expect(label.style.display).toBe('flex');
    panel.toggleTextInput(false);
    expect(label.style.display).toBe('none');
  });
});
