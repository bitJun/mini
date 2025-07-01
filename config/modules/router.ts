type IRouterMap = {
  [name: string]: {
    path: string;
    subPackage?: string; // 分包名称 对应 文件夹名称
    text?: string; // 路由的中文名称
    navigateType?: 'navigateTo' | 'redirectTo' | 'switchTab' | 'navigateBack';
    noLogin?: boolean;
  };
};

type ISubPackages = {
  root: string;
  name?: string;
  pages: string[];
}[];

/** 路由表 */
const routerMap: IRouterMap = {
  creation: {
    path: 'pages/creation/index', // 营销
    navigateType: 'switchTab',
    noLogin: true,
  },
  developcustomer: {
    path: 'pages/developcustomer/index', //拓客
    navigateType: 'switchTab',
  },
  // workbench: {
  //   path: 'pages/workbench/index', // 日程
  //   navigateType: 'switchTab',
  // },
  data: {
    path: 'pages/data/index', // 数据
    navigateType: 'switchTab',
  },
  generation: {
    path: 'pages/generation/index', // 待办
    navigateType: 'switchTab',
  },
  webview: {
    subPackage: 'common',
    path: 'pages/webview/index', // webview
    noLogin: true,
  },
  login: {
    subPackage: 'feature',
    path: 'pages/login/index', // 一键登录
    noLogin: true,
  },
  phoneLogin: {
    subPackage: 'feature',
    path: 'pages/phoneLogin/index', // 手机号登录
    noLogin: true,
  },
  contract: {
    subPackage: 'feature',
    path: 'pages/contract/index', // 协议展示
    noLogin: true,
  },
  addTeam: {
    subPackage: 'team',
    path: 'pages/addTeam/index', //加入团队
  },
  choiceRole: {
    subPackage: 'team',
    path: 'pages/choiceRole/index', //聘用员工
  },
  mine: {
    subPackage: 'mine',
    path: 'pages/index', // 我的
    noLogin: true,
  },
  setting: {
    subPackage: 'setting', // 设置
    path: 'pages/setting/index',
  },
  userInfo: {
    subPackage: 'setting', // 用户信息/个人信息
    path: 'pages/userInfo/index',
  },
  delivery: {
    subPackage: 'setting', // 投放管理
    path: 'pages/delivery/index',
  },
  deliveryAccount: {
    subPackage: 'setting', // 投放账号管理
    path: 'pages/deliveryAccount/index',
  },
  deliveryGroup: {
    subPackage: 'setting', // 投放账号组管理
    path: 'pages/deliveryGroup/index',
  },
  deliverySetting: {
    subPackage: 'setting', // 投放设置管理
    path: 'pages/deliverySetting/index',
  },
  feedback: {
    subPackage: 'setting', // 用户反馈
    path: 'pages/feedback/index',
  },
  platformLogin: {
    subPackage: 'common',
    path: 'pages/platformLogin/index', // 二维码
  },
  platformLoginPhone: {
    subPackage: 'common',
    path: 'pages/platformLoginPhone/index', // 小红书
  },
  level: {
    subPackage: 'level',
    path: 'pages/level/index', // level
  },
  taskList: {
    subPackage: 'tasklist',
    path: 'pages/index' // 任务列表
  },
  msgDetail: {
    subPackage: 'msgDetail',
    path: 'pages/subpages/msg/index', //聘用员工
  },
};

const getRouter = () => {
  const _pages: string[] = [];
  const _subPackages: ISubPackages = [];
  const routerMapKeys = Object.keys(routerMap);
  routerMapKeys.forEach((key) => {
    const routerItem = routerMap[key];
    if (routerItem.subPackage) {
      if (!_subPackages[routerItem.subPackage]) {
        _subPackages[routerItem.subPackage] = {
          root: `packages/${routerItem.subPackage}`,
          name: routerItem.subPackage,
          pages: [routerItem.path],
        };
      } else {
        _subPackages[routerItem.subPackage].pages.push(routerItem.path);
      }
    } else {
      _pages.push(routerItem.path);
    }
  });
  return {
    pages: _pages,
    subPackages: Object.keys(_subPackages).map((key) => _subPackages[key]),
  };
};

export { getRouter, routerMap };
