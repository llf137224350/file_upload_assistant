const tinify = require('tinify');
const { StoreHelper } = require('./StoreHelper');

/**
 * 上传文件
 * @returns {Promise<unknown>}
 */
function uploadForCompress(fromUrl, targetUrl = fromUrl) {
  const key = StoreHelper.get('api-key');
  if (!key) {
    return Promise.reject('请先设置API Key，获取地址：https://tinypng.com/')
  }
  tinify.key = key;
  return new Promise((resolve, reject) => {
    tinify.fromFile(fromUrl).toFile(targetUrl, (res) => {
      if (!res) {
        resolve(targetUrl);
      } else {
        reject(res);
      }
    });
  });
}

module.exports = { uploadForCompress };
