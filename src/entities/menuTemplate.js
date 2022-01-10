const template = [{
  label: '窗口',
  role: 'window',
  submenu: [{
    label: '最小化',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize',
  }, {
    label: '关闭',
    accelerator: 'CmdOrCtrl+W',
    role: 'close',
  }],
},
{
  label: '编辑',
  submenu: [
    {
      label: '剪切',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut',
    }, {
      label: '复制',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy',
    }, {
      label: '粘贴',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste',
    }, {
      label: '全选',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall',
    },
  ],
},
];
module.exports = template;
