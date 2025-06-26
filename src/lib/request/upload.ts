import Proxy from '@/config/proxy';
import Taro from '@tarojs/taro';
import Router from '../router';
import fetch from './index';
import { getToken } from './tools';

type IUpload = <T>(
  filePath: string,
  params?: IAnyObject,
  options?: {
    temp?: boolean;
    bigFile?: boolean;
  },
) => Promise<[T | null, Error | null]>;

const upload: IUpload = (filePath, params, options) => {
  return new Promise(async (resolve, reject) => {
    let urlHost = options?.temp ? 'upload-tmp' : 'upload';
    let formData = params;
    let fileKey = '';
    if (options?.bigFile) {
      const [result, error] = await fetch.getOssSign();
      if (error || !result) {
        reject(error);
        return;
      }
      const suffix = filePath.match(/\.(\w+)$/)?.[1];
      const uploadName = `${result.filename}.${suffix}`;
      urlHost = result.host;
      fileKey = `${result.dir}${uploadName}`;
      formData = {
        key: fileKey,
        name: uploadName,
        policy: result.policy,
        OSSAccessKeyId: result.accessid,
        success_action_status: '200',
        signature: result.signature,
      };
    }
    const token = getToken();
    Taro.uploadFile({
      url: options?.bigFile ? urlHost : `${Proxy.dev}/api/img/${urlHost}`,
      filePath,
      name: 'file',
      formData,
      header: {
        Authorization: token,
      },
      success: async ({ data: resData }) => {
        console.info(`接收返回: ${resData}`);
        if (options?.bigFile) {
          const [result, error] = await fetch.getOssUpload({
            conversation_id: params?.conversation_id,
            filepath: fileKey,
          });
          if (error || !result) return;
          // @ts-ignore
          resolve([result, null]);
          return;
        }
        // @ts-ignore
        const { code, err_msg, data } = JSON.parse(resData);
        if (code !== 0) {
          switch (code) {
            case 401:
              Taro.showToast({ title: '未登录', icon: 'none' });
              Router.navigate('LIngInt://login');
              break;
            default:
              Taro.showToast({ title: err_msg, icon: 'none' });
              break;
          }
          resolve([null, new Error(err_msg)]);
        } else {
          // 当 data 为 null 时 可以通过 __result 判断返回结果
          resolve([data ?? { __result: 1 }, null]);
        }
      },
      fail: (error) => reject(error),
    });
  });
};

export default upload;
