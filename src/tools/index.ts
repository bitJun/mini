import { getSystemInfoSync } from '@tarojs/taro';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import MD5 from 'crypto-js/md5';
import Hex from 'crypto-js/enc-hex';
/** 判断用户登录态 */
import { Storage, storageConst } from '@/lib/storage';

export const isLogin = () => {
  const token = Storage.get(storageConst.ACCESS_TOKEN, { access_token: '' });
  return !!token.access_token;
};

/** 获取状态栏高度 */
export const getStatusBarHeight = () => {
  let { statusBarHeight } = getSystemInfoSync();
  // h5 的 statusBarHeight 会返回 NaN，这里兼容
  if (!statusBarHeight || Number.isNaN(statusBarHeight)) {
    statusBarHeight = 0;
  }
  return statusBarHeight;
};

/** object 转 query string */
export const json2GetParams = (obj) =>
  Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

export const calculateMember = ( member:string,text: string): number => {
  // 提取字符串中的数字
  const matchText = text.match(/\d+/);
  const divisor = matchText ? parseInt(matchText[0], 10) : 1; // 如果没有匹配到数字，默认除数为 1

  // 将 member 转换为数字
  const memberNumber = parseInt(member, 10) || 0; // 如果 member 不是数字，默认为 0

  // 计算结果并取整数
  return Math.floor(memberNumber / divisor);
};
export const isMemberLessThanText = (member:string,text: string): boolean => {
  // 提取 text 中的数字
  const matchText = text.match(/\d+/);
  const numberFromText = matchText ? parseInt(matchText[0], 10) : 0; // 如果没有匹配到数字，默认为 0

  // 将 member 转换为数字
  const memberNumber = parseInt(member, 10) || 0; // 如果 member 不是数字，默认为 0

  // 判断 member 是否小于 text 中的数字
  return memberNumber < numberFromText;
};