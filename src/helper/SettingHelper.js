const { StoreHelper } = require('./StoreHelper');
let setting;
let settingPanel;
let close;
let timer;

let settingItemApiKey;
let settingItemCompressTimes;

let increment;
let decrement;
let compressTimes;
function initSetting() {
  setting = document.getElementById('setting');
  settingPanel = document.getElementById('setting-panel');
  close = document.getElementById('close');
  switchs = document.getElementsByClassName('switch');
  comprerss = document.getElementById('compress');
  settingItemApiKey = document.getElementById('setting-item-api-key');
  settingItemCompressTimes = document.getElementById(
    'setting-item-compress-times'
  );

  increment = document.getElementById('increment');
  decrement = document.getElementById('decrement');
  compressTimes = document.getElementById('compress-times');
  // 读取添加次数和减少次数按钮样式
  const value = parseInt(StoreHelper.get('compress-times') || '1');
  if (value === 0) {
    decrement.classList.add('disabled');
    decrement.setAttribute('disabled', 'disabled');
  } else if (value === 3) {
    increment.classList.add('disabled');
    increment.setAttribute('disabled', 'disabled');
  }

  // 所有switch，目前只有是否开启了压缩
  for (const switchComp of switchs) {
    let compress = StoreHelper.get(switchComp.dataset.action);
    if (compress) {
      // 显示api-key输入
      if (switchComp.dataset.action === 'compress') {
        // 只是压缩，不上传
        settingItemApiKey.style.display = 'flex';
        settingItemCompressTimes.style.display = 'flex';
      }
      switchComp.classList.add('open');
    } else {
      // 没有开启了压缩，隐藏api-key输入
      if (switchComp.dataset.action === 'compress') {
        // 只是压缩，不上传
        settingItemApiKey.style.display = 'none';
        settingItemCompressTimes.style.display = 'none';
      }
    }
  }

  setting.addEventListener('click', function () {
    settingPanel.style.display = 'block';
    settingPanel.classList.remove('slideOutRight');
    settingPanel.classList.add('slideInRight');
  });

  close.addEventListener('click', function () {
    settingPanel.classList.remove('slideInRight');
    settingPanel.classList.add('slideOutRight');
    setTimeout(function () {
      settingPanel.style.display = 'none';
    }, 400);
  });
  // 遍历添加事件
  for (const switchComp of switchs) {
    switchComp.addEventListener('click', function (event) {
      if (timer) {
        return;
      }
      if (
        this.dataset.action === 'compress' &&
        this.classList.contains('open')
      ) {
        // 只是压缩，不上传
        settingItemApiKey.classList.remove('fadeIn');
        settingItemApiKey.classList.add('fadeOut');
        settingItemApiKey.style.display = 'none';
        settingItemCompressTimes.classList.remove('fadeIn');
        settingItemCompressTimes.classList.add('fadeOut');
        settingItemCompressTimes.style.display = 'none';
      } else {
        settingItemApiKey.classList.remove('fadeOut');
        settingItemApiKey.classList.add('fadeIn');
        settingItemApiKey.style.display = 'flex';
        settingItemCompressTimes.classList.remove('fadeOut');
        settingItemCompressTimes.classList.add('fadeIn');
        settingItemCompressTimes.style.display = 'flex';
      }
      StoreHelper.set(
        this.dataset.action,
        this.classList.contains('open') ? false : true
      );
      this.classList.contains('open')
        ? this.classList.remove('open')
        : this.classList.add('open');
      timer = setTimeout(() => {
        timer = null;
      }, 400);
    });
  }
  //  数量减1
  decrement.addEventListener('click', () => {
    let value = parseInt(compressTimes.value || '0');
    if (value >= 1) {
      value--;
      if (increment.classList.contains('disabled')) {
        increment.classList.remove('disabled');
        increment.removeAttribute('disabled', 'disabled');
      }
      if (value === 0) {
        decrement.classList.add('disabled');
        decrement.setAttribute('disabled', 'disabled');
      }
    } else if (decrement.classList.contains('disabled')) {
      decrement.classList.add('disabled');
      decrement.setAttribute('disabled', 'disabled');
    }
    StoreHelper.set('compress-times', value);
    compressTimes.value = value;
  });

  increment.addEventListener('click', () => {
    let value = parseInt(compressTimes.value || '0');
    if (value <= 2) {
      value++;
      if (decrement.classList.contains('disabled')) {
        decrement.classList.remove('disabled');
        decrement.removeAttribute('disabled', 'disabled');
      }
      if (value === 3) {
        increment.classList.add('disabled');
        increment.setAttribute('disabled', 'disabled');
      }
    } else if (increment.classList.contains('disabled')) {
      increment.classList.add('disabled');
      increment.setAttribute('disabled', 'disabled');
    }
    StoreHelper.set('compress-times', value);
    compressTimes.value = value;
  });
  // 所有输入框输入监听
  const inputs = document.getElementsByClassName('input');
  for (const input of inputs) {
    input.value = StoreHelper.get(input.dataset.action) || (input.dataset.action === 'compress-times' ? '1' : '');

    input.addEventListener('input', function () {
      if (input.dataset.action === 'compress-times') {
        //  压缩次数
        let value;
        try {
          value = parseInt(this.value || '0');
        } catch {
          value = 0;
        }
        if (value >= 3) {
          value = 3;
          increment.classList.add('disabled');
          increment.setAttribute('disabled', 'disabled');
        } else {
          increment.classList.remove('disabled');
          increment.removeAttribute('disabled');
        }
        if (value <= 0) {
          value = 0;
          decrement.classList.add('disabled');
          decrement.setAttribute('disabled', 'disabled');
        } else {
          decrement.classList.remove('disabled');
          decrement.removeAttribute('disabled');
        }
        this.value = value;
        StoreHelper.set(input.dataset.action, value);
      } else {
        StoreHelper.set(input.dataset.action, this.value);
      }
    });
  }
}

module.exports = {
  initSetting
};
