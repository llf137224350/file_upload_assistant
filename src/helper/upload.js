const fs = require('fs');
const request = require('request');
const { StoreHelper } = require('./StoreHelper');

// 上传文件
async function uploadPic(localPath) {
  const baseUrl = StoreHelper.get('file-upload-url');
  return new Promise((resolve, reject) => {
    if (!baseUrl) { // 判断是否设置了上传文件路径
      reject('请先设置文件上传接口路径');
      return;
    }
    const req = request.post(baseUrl, (err, httpResponse, body) => {
      if (err) {
        reject('上传失败');
      }
      resolve(body);
    });
    // 获取文件属性
    const fileProperty = StoreHelper.get('file-property');
    if (!fileProperty) {
      reject('请先设置文件属性key');
      return;
    }
    const form = req.form();
    form.append(fileProperty, fs.createReadStream(localPath));
  });
}

module.exports = {
  uploadPic
};
