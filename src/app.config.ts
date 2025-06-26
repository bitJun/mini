import { getRouter } from '../config/modules/router';
console.log(getRouter, 'getRouter');
const config = defineAppConfig({
  ...getRouter(),
  window: {
    navigationBarBackgroundColor:"#ffffff",
    backgroundTextStyle: 'light',
    navigationBarTitleText: '营销发展员工',
    navigationBarTextStyle: "black"
  },
  tabBar: {
    color:"#999999",
    selectedColor: '#000000',
    list: [
      {
        text: '创作',
        pagePath: 'pages/creation/index',
        iconPath: './assets/creation.png',
        selectedIconPath: './assets/creation_active.png',
      },
      {
        text: '消息',
        pagePath: 'pages/developcustomer/index',
        iconPath: './assets/message.png',
        selectedIconPath: './assets/message_active.png',
      },
      {
        text: '资产',
        pagePath: 'pages/generation/index',
        iconPath: './assets/assets.png',
        selectedIconPath: './assets/assets_active.png',
      },
      {
        text: '我的',
        pagePath: 'pages/data/index',
        iconPath: './assets/mine.png',
        selectedIconPath: './assets/mine_active.png',
      },
    ],
  },
});

export default config;
