import logo from '@/assets/logo.png';
import fetch from '@/lib/request';
import Router from '@/lib/router';
import { Storage, storageConst } from '@/lib/storage';
import { storeActions } from '@/store';
import { Button, Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import Contract from '../../components/Contract';
import styles from './index.module.scss';
import { useStoreData } from '@/store';
definePageConfig({
  navigationBarTitleText: '用户登录',
});

const Login = () => {
  const [isContract, setIsContract] = useState(false);

  const handelShowContract = useMemoizedFn(() => {
    if (!isContract) {
      Taro.showToast({ title: '请同意用户协议', icon: 'none' });
    }
  });

  /** 快速验证组件 获取用户手机号 */
  const handelGetPhoneNumber = useMemoizedFn(async ({ detail }) => {
    const { wx_token } = Storage.get(storageConst.WX_TOKEN);
    const [result, error] = await fetch.login({ code: detail.code, pre_auth: wx_token });
    if (error || !result) return;
    const { access_token, userinfo } = result;
    storeActions('UPDATE_USERINFO', userinfo);
    Storage.set(storageConst.ACCESS_TOKEN, { access_token });
    Taro.setStorage({
      key:'is_new',
      data:userinfo.prepare_task_finished ? 'ok' : 'no'
    });
    Taro.showToast({ title: '登录成功', icon: 'none' });
    storeActions('GET_MEMBER_DATA');
    storeActions('GET_DEFAULT_SETTING');
    setTimeout(() => Router.navigate('LIngInt://creation'), 1500);
  });

  useAsyncEffect(async () => {
    // 微信登录
    const { code } = await Taro.login();
    const [result, error] = await fetch.preLogin({ code });
    if (error || !result) return;
    const { key } = result;
    Storage.set(storageConst.WX_TOKEN, { wx_token: key });
  }, []);

  /** 跳转到 手机号登录 */
  const goToPhoneLogin = useMemoizedFn(() => {
    Router.navigate('LIngInt://phoneLogin');
  });

  const goToHome = useMemoizedFn(() => {
    Router.navigate('LIngInt://creation',{ data: { isWXCheck: true } });
  });
  const { dicSetting } = useStoreData(({ common }) => ({
    dicSetting: common.dicSetting,
  }));
  
  return (
    <View className={styles.container}>
      <Image className={styles.logo} src={logo} />
      <View className={styles.operatingArea}>
        {isContract ? (
          <Button className={styles.quickLogin} openType="getPhoneNumber" onGetPhoneNumber={handelGetPhoneNumber}>
            一键登录
          </Button>
        ) : (
          <View className={styles.quickLogin} onClick={handelShowContract}>
            一键登录
          </View>
        )}
        <View className={styles.phoneLogin} onClick={goToPhoneLogin}>
          手机登录
        </View>
        {/* {
          dicSetting[0] && dicSetting[0].content && !dicSetting[0].content.switch  && 
          <View className={styles.noLogin} onClick={goToHome}>
            暂不登录
          </View>
        } */}
      </View>
      <Contract onChange={(checked) => setIsContract(checked)}></Contract>
    </View>
  );
};

export default Login;
