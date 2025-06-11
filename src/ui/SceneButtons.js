export default class SceneButtons {
  constructor(container) {
    this.container = container;
  }

  /**
   * Register handler for scene button clicks.
   * @param {(scene:string) => void} handler - callback with chosen scene
   */
  bindSceneChange(handler) {
    this.container.addEventListener('click', e => {
      const scene = e.target.dataset.scene;
      if (scene) {
        handler(scene);
      }
    });
  }
}
