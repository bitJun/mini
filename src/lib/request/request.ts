import Proxy from '@/config/proxy';
import Taro from '@tarojs/taro';
import { getToken } from './tools';
import Router from '../router';
import { json2GetParams } from '@/tools';
import { storeActions } from '@/store';
type IRequestOptions = {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  url: string;
  params?: IAnyObject | [];
  forceLogin?: boolean;
  ignoreError?: boolean;
  noBaseUrl?: boolean;
  noFormat?: boolean;
  isUrlParams?: boolean;
  version?:string;
  noCode?: boolean;
};

type IRequest = <T>(options: IRequestOptions) => Promise<[T | null, Error | null]>;

/** http请求 */
const request: IRequest = (options) => {
  return new Promise((resolve) => {
    const { method, url, params, forceLogin, ignoreError, noFormat, noBaseUrl, isUrlParams,version,noCode } = options;
    const preUrl = '/api'; // 所有接口通用前缀

    const token = getToken();

    const defaultHeader: IAnyObject = {};
    if (token) {
      defaultHeader.Authorization = token;
    }

    // console.info(`发送请求: ${url}`);
    let requestUrl = `${process.env.NODE_ENV === 'production' ? Proxy.online : Proxy.dev}${preUrl}${url}`;
    if (noBaseUrl) {
      requestUrl = url;
    } else if (method === 'DELETE' || isUrlParams) {
      requestUrl = `${requestUrl}?${json2GetParams(params)}`;
    }
    Taro.request({
      method,
      url: requestUrl,
      data: params,
      dataType: 'json',
      header: {
        ...defaultHeader,
        'aindecor-version':version || ''
      },
      success: ({ data: resData }) => {
        // console.info(`接收返回: ${url} - ${JSON.stringify(resData)}`);
        if(noCode){
          resolve([resData ?? { __result: 1 }, null]);
          return;
        }
        const { code, err_msg, data } = resData;
        if (noFormat) {
          resolve([resData ?? { __result: 1 }, null]);
          return;
        }
        if (code !== 0) {
          switch (code) {
            case 401:
              if (forceLogin) {
                Taro.showToast({ title: '未登录', icon: 'none' });
                Router.navigate('LIngInt://login');
              }
              break;
          case 1004:
              storeActions('CHANGE_BALANCE_OFF',true);
              Router.navigate('LIngInt://mine');
              break;
            default:
              !ignoreError && Taro.showToast({ title: err_msg, icon: 'none' });
              break;
          }
          resolve([code, new Error(err_msg)]);
        } else {
          // 当 data 为 null 时 可以通过 __result 判断返回结果
          resolve([data ?? { __result: 1 }, null]);
        }
      },
    });
  });
};

export { IRequestOptions };
export default request;
