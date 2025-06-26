import { routerMap } from '@/globalConfig/modules/router';
import Taro, { Current } from '@tarojs/taro';
import { joinParameters, parseURL } from './tools';
import { isLogin } from '@/tools';

const routerCore = {
  open: (options) => {
    const { path, subPackage, navigateType, params } = options;
    const _path = `${subPackage ? `/packages/${subPackage}` : ''}/${path}`;
    const _navigateType = navigateType || 'navigateTo';
    Taro[_navigateType]({ url: `${_path}${joinParameters({ ...params })}` });
  },
};

/** 页面数据记录器 */
const PageRecord: Record<'data', IAnyObject> & {
  removeRouter: (routeKey: string) => void;
} = {
  data: {},
  removeRouter: (routeKey) => {
    delete PageRecord.data[routeKey];
  },
};

/** 钩子函数 */
const routerHook = {
  beforeRouter: (options) => {
    const { noLogin } = options;
    if (noLogin) return true;
    return _checkLogin();
  },
};

export const _checkLogin = (force = true) => {
  if (isLogin()) return true;
  force && Router.navigate('LIngInt://login');
  return false;
};

/** 钩子函数结束 */

/** 路由 */
const Router = {
  navigate: (
    url: string,
    userConfig?: {
      data: IAnyObject;
    },
  ) => {
    const obj = parseURL(url);
    const { protocol, params } = obj;
    if (protocol !== 'LIngInt') return;
    // 获取路由信息
    const router = routerMap[obj.pathname];
    if (!router) throw Error(`未找到【${JSON.stringify(obj)}】的路由配置`);
    const routeKey = `${Date.now()}`;
    Current['_page'] = Current.page;
    Object.defineProperties(Current, {
      page: {
        set: function (page) {
          if (page === undefined || page === null) {
            this._page = page;
            return;
          }
          if (!page['route_key']) {
            const originOnUnload = page.onUnload;
            page.onUnload = function () {
              originOnUnload && originOnUnload.apply(this);
              PageRecord.removeRouter(routeKey);
            };
            page['route_key'] = routeKey;
          }
          this._page = page;
        },
        get: function () {
          return this._page;
        },
      },
    });
    // 生成新的路由信息
    const filterRouter = { ...router, params };
    // 钩子函数
    if (!routerHook.beforeRouter(filterRouter)) return;
    routerCore.open(filterRouter);
    return new Promise<unknown>(() => {
      PageRecord.data[routeKey] = userConfig?.data;
    });
  },
  navigateBack: (options?: { delta }) => {
    Taro.navigateBack({ delta: options?.delta });
  },
  /** 页面数据提取 */
  getData: () => {
    if (!Current.page) return;
    const routerKey = Current.page['route_key'];
    if (routerKey) {
      return PageRecord.data[routerKey];
    }
    return null;
  },
};

export default Router;
