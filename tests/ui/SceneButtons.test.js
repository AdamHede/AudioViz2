import SceneButtons from '../../src/ui/SceneButtons.js';

describe('SceneButtons', () => {
  test('bindSceneChange fires handler with dataset', () => {
    document.body.innerHTML = '<div id="sc"><button data-scene="bars"></button></div>';
    const container = document.getElementById('sc');
    const buttons = new SceneButtons(container);
    const handler = jest.fn();
    buttons.bindSceneChange(handler);
    container.querySelector('button').click();
    expect(handler).toHaveBeenCalledWith('bars');
  });
});
