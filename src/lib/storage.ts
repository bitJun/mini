import Taro from '@tarojs/taro';
import { storageConst } from '@/config/constant';

export const Storage = {
  /** expired 有效期(分钟) */
  set: (key: string, value: IAnyObject, expired?: number) => {
    Taro.setStorageSync(key, value);
    if (expired) {
      Taro.setStorageSync(`${key}__EXPIRES__`, Date.now() + 1000 * 60 * expired);
    }
    return value;
  },
  get: (key: string, defaultValue?: IAnyObject) => {
    const currentTime = Date.now();
    const timeout = Taro.getStorageSync(`${key}__EXPIRES__`) || currentTime + 1;
    if (currentTime >= timeout) {
      Storage.remove(key);
      return defaultValue;
    }
    return Taro.getStorageSync(key) || defaultValue;
  },
  remove: (key: string) => {
    Taro.removeStorageSync(key);
    Taro.removeStorageSync(`${key}__EXPIRES__`);
    return undefined;
  },
};

export { storageConst };
