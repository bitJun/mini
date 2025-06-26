import { Storage, storageConst } from '@/lib/storage';

/** 获取登录token */
export const getToken = () => {
  const token = Storage.get(storageConst.ACCESS_TOKEN, { access_token: '' });
  if (token.access_token) {
    return token.access_token;
  }
  return '';
};

/** 构造socket消息 */
export const buildUserMessage = (text: string) => {
  console.log('text', text);
};
