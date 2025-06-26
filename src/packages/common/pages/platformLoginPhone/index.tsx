import { View,Image,Text } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import styles from './index.module.scss';
import { useEffect, useMemo, useState,useRef } from 'react';
import Taro from '@tarojs/taro';
import fetch from '@/lib/request';
import useInterval from '@/hooks/useInterval';
import Router from '@/lib/router';
import logo from '@/assets/logo-light.png';
import Input from '@/extend/Input';
import GlobalNotify from "@/components/GlobalNotify/index";
const platformChinese = {
  xhs:'小红书',
  dy:'抖音',
  toutiao:'今日头条'
}
type IRouterData = { platform: string,account_type?:string,id?:number};
definePageConfig({
  navigationBarTitleText: '灵应智能员工',
});
const PlatformLogin = () => {
  useEffect(() => {
    return () => {
      resetData();
    };
  },[]);
  const { platform} = Router.getData() as IRouterData || Taro.getStorage({
    key:'platform'
  });
  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [countdownNumber, setCountdownNumber] = useState<number>(-1);
   const hasSendCode = useRef<boolean>(false);
  const handelPhoneInput: Input.onInput = useMemoizedFn(({ detail }) => setPhone(detail.value));
  const handelCodeInput: Input.onInput = useMemoizedFn(({ detail }) => setCode(detail.value));
  const resetData = (() => {
    setCountdownNumber(-1);
    setCode('');
    setPhone('');
    countdownClear();
  });
   /** 验证码定时器 */
   const countdown = useMemoizedFn(() => {
    if (countdownNumber <= 0) {
      countdownClear();
      return;
    }
    setCountdownNumber(countdownNumber - 1);
  });
  const [countdownRun, countdownClear] = useInterval(countdown, 1000);
  const verifyFn = useMemoizedFn(async () => {
    if(countdownNumber > 0)return;
    let reg = /^1[3-9]\d{9}$/;
    if (!reg.test(phone)) {
      Taro.showToast({ title: '请输入有效手机号', icon: 'none' });
      return;
    }
    sendCode();
  });
  const handelSubmit = useMemoizedFn(async () => {
    let reg = /^1[3-9]\d{9}$/;
    if (!reg.test(phone)) {
      Taro.showToast({ title: '请输入有效手机号', icon: 'none' });
      return;
    }
    let regCode = /^\d{6}$/;
    if (!regCode.test(code)) {
      Taro.showToast({ title: '请输入有效验证码', icon: 'none' });
      return;
    }
    const [result, error] = await fetch.postDelLogin({ phone, code,platform });
    if (error || !result) {
      return;
    };
    Taro.showToast({ title: '登录成功', icon: 'none' });
    setTimeout(() => Router.navigateBack());
  });
  /** 发送验证码 */
  const sendCode = useMemoizedFn(async () => {
    const [result, error] = await fetch.postDelSendCode({ phone,platform });
    if (error || !result) return;
    hasSendCode.current = true;
    const { __result } = result;
    if (__result) {
      Taro.showToast({ title: '验证码已发送', icon: 'none' });
      setCountdownNumber(60);
      countdownRun();
    }
  });
  const sendCodeText = useMemo(() => {
    if (countdownNumber > 0) {
      return `倒计时(${countdownNumber})s`;
    }
    return hasSendCode.current ? '重发验证码' : '发送验证码';
  }, [countdownNumber]);
  return (
    <View className={styles.platformLogin}>
        <View style={{display:'flex',justifyContent:'center'}}>
          <Image className={styles.logo} src={logo} />
        </View>
        <View className={styles.arrangeWorkBoxTitle}>手机号。验证码登录。使用。</View>
        <Text className={styles.desc}>登录新媒体账号，你需要输入账户登录手机号，轻点下方获取验证码按钮，接收到验证码短信后，输入验证码并点击登录按钮，完成登录操作。</Text>
        <View className={styles.operatingArea}>
          <View className={styles.phoneInput}>
            <Input value={phone}  onInput={handelPhoneInput} placeholder="请输入手机号"></Input>
          </View>
          <View className={styles.sendCode}>
            <View className={styles.sendCodeInput}>
              <Input value={code} onInput={handelCodeInput} placeholder="请输入验证码"></Input>
            </View>
            <View className={styles.sendCodeBtn} onClick={verifyFn}>
              {sendCodeText}
            </View>
          </View>
          <View className={styles.submit} onClick={handelSubmit}>
            {`${platformChinese[platform]}账号登录`}
          </View>
        </View>
        <GlobalNotify type='top' />
    </View>
  );
};
export default PlatformLogin;