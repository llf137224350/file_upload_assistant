const { initCore } = require('../../helper/UploadRenderHelper');
const { initSetting } = require('../../helper/SettingHelper');

window.addEventListener('DOMContentLoaded', function () {
  // 初始化核心功能
  initCore();
  // 设置相关
  initSetting();
});
