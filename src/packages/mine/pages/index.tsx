import useShareMessage from '@/hooks/useShareMessage';
import { _checkLogin } from '@/lib/router';
import { View } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import UserInfo from '../components/UserInfo';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import fetch from '@/lib/request';
import {  useStoreData,storeActions } from '@/store';
import Router from '@/lib/router';
import { Storage, storageConst } from '@/lib/storage';
import styles from './index.module.scss';
definePageConfig({
  navigationBarTitleText: '我的',
  disableScroll: true
});

const Mine = () => {
  useShareMessage();
  useDidShow(() => {
    storeActions('GET_MEMBER_DATA');
    getDictConfigComputility();
    getDictConfigEmploy();
  });
  const { memberInfo } = useStoreData(({ user }) => ({
    memberInfo: user.memberInfo,
  }));
  const [desc, setDesc] = useState('一元 = 10算力');
  const [rule, setRule] = useState<Fetch.rule>([]);
  const [initRule, setInitRule] = useState<Fetch.initRule>([]);
  const [ability, setAbility] = useState<Fetch.ability>([]);
  const [prices, setPrices] = useState<Fetch.prices>([]);
  const getDictConfigComputility = useMemoizedFn(async () => {
    const [result, error] =  await fetch.getDictConfigSub({ type: "default_setting",
      sub_type: 'computility' });
    if (!result || error) return;
    setDesc(result[0].content.desc);
    setRule(result[0].content.rule);
    setInitRule(result[0].content.initiative_rule);
    setPrices(result[0].content.prices);
  });
  const getDictConfigEmploy = useMemoizedFn(async () => {
    Taro.showLoading({ title: '请求中',mask:true });
    const [result, error] =  await fetch.getDictConfigSub({ type: "default_setting",
      sub_type: 'employ' });
    Taro.hideLoading();
    if (!result || error) return;
    setAbility(result[0].content.sdr.ability);
  });
  const reFresh = ()=>{
    getDictConfigComputility();
    storeActions('GET_MEMBER_DATA');
    storeActions('CHANGE_BALANCE_OFF',false);
  }
   /** 退出登录 */
  const handelLogout = useMemoizedFn(() => {
    Storage.remove(storageConst.ACCESS_TOKEN);
    Taro.showToast({ title: '退出成功' });
    storeActions('RESET_STATE');
    Taro.removeStorage({
      key:'is_new'
    })
    setTimeout(() => Router.navigate('LIngInt://creation'), 1500);
  });
  return (
    <View>
      {/* 用户信息 */}
      <UserInfo />
      <View className={styles.logOut} onClick={handelLogout}>
          退出登录
        </View>
    </View>
  );
};

export default Mine;
