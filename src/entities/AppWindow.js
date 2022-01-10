const { BrowserWindow } = require('electron');
/**
 *  window
 */
class AppWindow extends BrowserWindow {
  /**
   *
   * @param {*} config window配置
   * @param {*} fileLocation 视图路径
   */
  constructor(config, fileLocation) {
    /** */
    const baseConfig = {
      width: 800,
      height: 600,

      webPreferences: {
        webSecurity: false,
        enableRemoteModule: true,
        contextIsolation: false,
        nodeIntegration: true, // 设置为true，可以是用nodejs api
      },
    };
    const finalConfig = Object.assign(baseConfig, config);
    super(finalConfig);
    // 加载文件
    this.loadFile(fileLocation);
    this.once('ready-to-show', () => {
      this.show();
      this.send('win-focus');
    });
  }
}
module.exports = {
  AppWindow: AppWindow,
};
