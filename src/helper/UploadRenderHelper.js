const { ipcRenderer } = require('electron');
const copy = require('clipboard-copy');
let container; // 上传容器
let list; // 图片列表
let preview; // 与狼
let timer; // 延迟处理预览
/**
 * 上传文件
 * @param paths
 */
function upload(paths) {
  if (container && container.classList.contains('hover')) {
    container.classList.remove('hover');
  }
  paths = paths.filter(function (path) {
    return /\.(jpe?g|png|gif)/g.test(path);
  });
  list = document.getElementById('list');
  list.innerHTML = '';

  if (!paths.length) {
    const div = document.createElement('div');
    div.innerText = '当前仅支持上传jpg、jpeg、png、gif等图片类型文件';
    div.classList.add('error');
    list.appendChild(div);
    return;
  }
  appendItems(paths);
  // 开始上传
  ipcRenderer.send('upload', paths);
}

/**
 * 添加上传的item
 */
function appendItems(paths) {
  const fragment = document.createDocumentFragment();
  for (const path of paths) {
    // 创建item
    const div = document.createElement('div');
    div.classList.add('item', 'animated', 'fadeIn');
    // 设置文本
    const childDiv = document.createElement('div');
    childDiv.classList.add('text');
    const filePath = path.replace(/\\/g, '/');
    childDiv.innerText = filePath.substring(filePath.lastIndexOf('/') + 1);
    childDiv.setAttribute('id', 'div-' + path);

    const sizeDiv = document.createElement('div');
    sizeDiv.classList.add('size');
    sizeDiv.setAttribute('id', 'size-' + path);

    // 布局填充
    const fill = document.createElement('div');
    fill.classList.add('fill');

    // 添加加载动画或复制
    const img = document.createElement('img');
    img.setAttribute('src', '../../images/loading.gif');
    img.setAttribute('style', 'display: none;');
    img.setAttribute('id', 'img-' + path);

    div.appendChild(childDiv);
    div.appendChild(sizeDiv);
    div.appendChild(fill);
    div.appendChild(img);
    fragment.appendChild(div);
  }
  list.appendChild(fragment);
}
/**
 * 初始化核心功能
 */
function initCore() {
  list = document.getElementById('list');
  container = document.getElementById('draggable');
  preview = document.getElementById('preview');

  // 拖动进入
  container.addEventListener('dragover', function (event) {
    // 阻止默认动作
    event.preventDefault();
    if (!container.classList.contains('hover')) {
      container.classList.add('hover');
    }
  });
  // 拖动离开
  container.addEventListener('dragleave', function (event) {
    if (container.classList.contains('hover')) {
      container.classList.remove('hover');
    }
  });

  container.addEventListener('drop', function (event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length) {
      const paths = Array.from(files).map(function (item) {
        return item.path;
      });
      upload(paths);
    }
  });
  // 监听输入框
  document.getElementById('file').addEventListener('change', function (event) {
    event.preventDefault();
    const files = event.target.files;
    if (files.length) {
      const paths = Array.from(files).map(function (item) {
        return item.path;
      });
      this.value = '';
      upload(paths);
    }
  });
  // 全部上传完成
  ipcRenderer.on('uploadSuccess', (e, paths) => {});

  // 单张上传完成
  ipcRenderer.on('uploadSinglePicSuccess', (e, file, size) => {
    const img = document.getElementById('img-' + file.localFilePath);
    img.setAttribute('title', '点击复制');
    img.setAttribute('src', '../../images/copy.png');
    img.classList.add('uploaded');
    // 添加点击复制
    img.addEventListener('click', (event) => {
      copy(file.networkFilePath).then(() => {
        ipcRenderer.send('copy-success');
      });
    });

    const div = document.getElementById('div-' + file.localFilePath);
    div.setAttribute('data-url', file.networkFilePath);
    div.classList.add('uploaded');
    div.addEventListener('click', () => {
      ipcRenderer.send('open-url', file.networkFilePath);
    });
    // 添加鼠标事件
    div.addEventListener('mouseenter', (event) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        preview.classList.remove('fadeOut');
        preview.src = event.target.dataset.url;
        preview.classList.add('animated', 'fadeIn');
        preview.style.display = 'block';
        preview.style.left = event.clientX + 'px';
        preview.style.top =
          event.target.offsetTop + event.target.offsetHeight + 'px';
      }, 400);
    });
    div.addEventListener('mouseleave', (event) => {
      preview.classList.remove('fadeIn');
      preview.classList.add('animated', 'fadeOut');
      setTimeout(() => {
        preview.style.display = 'none';
      }, 400);
    });

    // 显示压缩大小
    const sizeDiv = document.getElementById('size-' + file.localFilePath);
    const oldSize = parseInt(sizeDiv.getAttribute('old-size'), 10);
    const targetSize = Math.ceil(oldSize - size);
    sizeDiv.innerText =
      '-' +
      targetSize +
      'K（' +
      ((targetSize / oldSize) * 100).toFixed(2) +
      '%）';
  });

  // 开始上传
  ipcRenderer.on('currentUpload', (e, currentPath, size) => {
    const img = document.getElementById('img-' + currentPath);
    img.classList.add('animated', 'fadeIn');
    img.setAttribute('style', 'display: block');

    const sizeDiv = document.getElementById('size-' + currentPath);
    sizeDiv.setAttribute('old-size', size);
  });

  // 发生错误
  ipcRenderer.on('error', function (e, message) {
    list.innerHTML = '';
    const div = document.createElement('div');
    div.innerText = message;
    div.classList.add('error');
    list.appendChild(div);
  });
}

module.exports = {
  initCore
};
