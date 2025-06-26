import logo from '@/assets/logo.png';
import { storageConst } from '@/config/constant';
import Input from '@/extend/Input';
import useInterval from '@/hooks/useInterval';
import fetch from '@/lib/request';
import Router from '@/lib/router';
import { Storage } from '@/lib/storage';
import { storeActions } from '@/store';
import { Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import { useMemo, useRef, useState } from 'react';
import Contract from '../../components/Contract';
import styles from './index.module.scss';
import SliderVerify from '../sliderVerify/index';
definePageConfig({
  navigationBarTitleText: '手机登录',
});

const PhoneLogin = () => {
  const isContract = useRef(false);
  const hasSendCode = useRef<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [countdownNumber, setCountdownNumber] = useState<number>(-1);
  const [openVerify, setOpenVerify] = useState(false);
  const handelPhoneInput: Input.onInput = useMemoizedFn(({ detail }) => setPhone(detail.value));
  const handelCodeInput: Input.onInput = useMemoizedFn(({ detail }) => setCode(detail.value));

  const sendCodeText = useMemo(() => {
    if (countdownNumber > 0) {
      setOpenVerify(false)
      return `倒计时(${countdownNumber})s`;
    }
    return hasSendCode.current ? '重发验证码' : '发送验证码';
  }, [countdownNumber]);

  /** 验证码定时器 */
  const countdown = useMemoizedFn(() => {
    if (countdownNumber <= 0) {
      countdownClear();
      return;
    }
    setCountdownNumber(countdownNumber - 1);
  });
  const [countdownRun, countdownClear] = useInterval(countdown, 1000);

  /** 发送验证码 */
  const sendCode = useMemoizedFn(async () => {
    const [result, error] = await fetch.getSms({ phone });
    if (error || !result) return;
    hasSendCode.current = true;
    const { __result } = result;
    if (__result) {
      Taro.showToast({ title: '验证码已发送', icon: 'none' });
      setCountdownNumber(60);
      countdownRun();
    }
  });

  /** 登录 */
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
    if (!isContract.current) {
      Taro.showToast({ title: '请同意用户协议', icon: 'none' });
      return;
    }
    const wxObj = await Taro.login();
    if(!wxObj.code)return;
    const [result, error] = await fetch.phoneLogin({ phone, code,wx_mini_code:wxObj.code });
    if (error || !result) {
      handleVerifySuccess(false);
      return;
    };
    const { access_token, userinfo } = result;
    storeActions('UPDATE_USERINFO', userinfo);
    Storage.set(storageConst.ACCESS_TOKEN, { access_token });
    Taro.setStorage({
      key:'is_new',
      data:userinfo.prepare_task_finished ? 'ok' : 'no'
    });
    Taro.showToast({ title: '登录成功', icon: 'none' });
    Taro.hideLoading();
    storeActions('GET_MEMBER_DATA');
    storeActions('GET_DEFAULT_SETTING');
    setTimeout(() => Router.navigate('LIngInt://creation'), 1500);
  });
  const verifyFn = useMemoizedFn(async () => {
    if(countdownNumber > 0)return;
    let reg = /^1[3-9]\d{9}$/;
    if (!reg.test(phone)) {
      Taro.showToast({ title: '请输入有效手机号', icon: 'none' });
      return;
    }
    if (!isContract.current) {
      Taro.showToast({ title: '请同意用户协议', icon: 'none' });
      return;
    }
    setOpenVerify(true);
   });
  const handleVerifySuccess = (off) => {
    setOpenVerify(false);
    if(off){
      // 去登录
      Taro.showLoading({ title: '正在登录',mask:true });
      sendCode();
    }
  };
  return (
    <View className={styles.container}>
      <Image className={styles.logo} src={logo} />
      <View className={styles.operatingArea}>
        <View className={styles.phoneInput}>
          <Input value={phone} onInput={handelPhoneInput} placeholder="请输入手机号"></Input>
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
          登录
        </View>
        {/* {
          dicSetting[0] && dicSetting[0].content && !dicSetting[0].content.switch  && 
          <View className={styles.noLogin} onClick={goToHome}>
            暂不登录
          </View>
        } */}
      </View>
      <SliderVerify onVerifySuccess={handleVerifySuccess} openVerify={openVerify} />
      <Contract onChange={(checked) => (isContract.current = checked)}></Contract>
    </View>
  );
};

export default PhoneLogin;
