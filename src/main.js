const path = require('path');
const fs = require('fs');
const { app, ipcMain, Menu, shell } = require('electron');
const parserProperty = require('parser-property');
const { AppWindow } = require('./entities/AppWindow');
const menuTemplate = require('./entities/menuTemplate');
const { uploadPic } = require('./helper/upload');
const { uploadForCompress } = require('./helper/TinifyHelper');
const { StoreHelper } = require('./helper/StoreHelper');

/**
 * 创建主window
 */
function createWindow() {
  const win = new AppWindow(
    {
      title: '文件上传助手',
      width: 320,
      height: 400,
      resizable: false,
      maximizable: false,
      backgroundColor: '#e6e6e6'
    },
    path.resolve(__dirname, './renderer/index/index.html')
  );
  // 去掉默认菜单
  // 菜单
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  // 复制成功
  ipcMain.on('copy-success', () => {
    // const notification = {
    //   title: "提示",
    //   body: "文件路径已复制到粘贴板",
    // };
    win.minimize();
    // new Notification(notification).show();
  });
  // 通过浏览器打开预览图片
  ipcMain.on('open-url', function (e, url) {
    shell.openExternal(url);
  });
  // 上传
  ipcMain.on('upload', async function (e, paths) {
    try {
      const finalFilePaths = [];
      let info;
      let compressFilePath;
      // 是否开启了压缩
      const compress = StoreHelper.get('compress');
      for (const filePath of paths) {
        info = fs.statSync(filePath);
        // 发送开始上传事件
        win.send('currentUpload', filePath, Math.ceil(info.size / 1000));

        compressFilePath = filePath;
        const value = parseInt(StoreHelper.get('compress-times') || '1');
        // 是否开启了压缩并设置了压缩次数
        if (compress && value) {
          compressFilePath = filePath;
          for (let index = 0; index < value; index++) {
            compressFilePath = await uploadForCompress(compressFilePath);
          }
        }
        const res = await uploadPic(compressFilePath);
        if (res) {
          const parserExpression = StoreHelper.get('parser-expression') || '';
          const finalFilePath = parserProperty(
            parserExpression,
            eval(`(${res})`)
          );
          const obj = {
            localFilePath: filePath,
            networkFilePath: finalFilePath
          };
          info = fs.statSync(compressFilePath);
          win.send('uploadSinglePicSuccess', obj, Math.ceil(info.size / 1000));
          finalFilePaths.push(obj);
        }
      }
      win.send('uploadSuccess', finalFilePaths);
    } catch (e) {
      if (e.status === 401) {
        win.send('error', 'Api Key错误，请检查！');
      } else {
        win.send('error', e.message ? e.message : e);
      }
    }
  });

  win.on('close', () => {
    app.quit();
  });

  win.on('focus', (event) => {
    win.send('win-focus');
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
