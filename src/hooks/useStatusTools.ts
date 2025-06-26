import { isLogin } from '@/tools';
import { useDidShow } from '@tarojs/taro';
import { useState } from 'react';

const useStatusTools = () => {
  /** 用户登录态 */
  const [userLogin, setUserLogin] = useState<boolean>(false);

  useDidShow(() => setUserLogin(isLogin()));

  return { userLogin };
};

export default useStatusTools;
