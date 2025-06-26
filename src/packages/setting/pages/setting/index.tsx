import Router from '@/lib/router';
import { Cell } from '@taroify/core';
import { Arrow } from '@taroify/icons';
import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import styles from './index.module.scss';
import { Storage, storageConst } from '@/lib/storage';
import Taro from '@tarojs/taro';
import { storeActions } from '@/store';
const Setting = () => {
  /** 路由跳转 */
  const goToUserInfo = useMemoizedFn(() => Router.navigate('LIngInt://userInfo'));
  const goToAccount = useMemoizedFn(() => Router.navigate('LIngInt://account'));
  const goToWallet = useMemoizedFn(() => Router.navigate('LIngInt://wallet'));

  /** 退出登录 */
  const handelLogout = useMemoizedFn(() => {
    Storage.remove(storageConst.ACCESS_TOKEN);
    Taro.showToast({ title: '退出成功' });
    storeActions('RESET_STATE');
    setTimeout(() => Router.navigate('LIngInt://creation'), 1500);
  });

  return (
    <View>
      <View className={styles.cellBox}>
        <Cell className={styles.cellItem} rightIcon={<Arrow />} title="基本信息" onClick={goToUserInfo}></Cell>
        <Cell className={styles.cellItem} rightIcon={<Arrow />} title="账号管理" onClick={goToAccount}></Cell>
        <Cell className={styles.cellItem} rightIcon={<Arrow />} title="我的钱包" onClick={goToWallet}></Cell>
      </View>
      {/* <View className={styles.cellCenter}>切换账号</View> */}
      <View className={styles.cellCenter} onClick={handelLogout}>
        退出登录
      </View>
    </View>
  );
};

export default Setting;
