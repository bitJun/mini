import fetch from '@/lib/request';
import { Button, Cell, Dialog, Input, Popup } from '@taroify/core';
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import useInterval from '@/hooks/useInterval';
import CodeCreator from 'taro-code-creator';

definePageConfig({
  navigationBarTitleText: '账号管理',
});

const Account = () => {
  const [security, setSecurity] = useState<Fetch.IGetSecurityRes>();

  // 绑定/更换手机号
  const [dialogOpenPhone, setDialogOpenPhone] = useState<boolean>(false);
  const [dialogValuePhone, setDialogValuePhone] = useState<string>();
  const [dialogValueCode, setDialogValueCode] = useState<string>();
  const [dialogValueBtnText, setDialogValueBtnText] = useState<string>('发送验证码');
  const [dialogTimeNumber, setDialogTimeNumber] = useState<number>(-1);
  const dialogTimeNumberRef = useRef<number>(-1);
  const dialogTimer = useRef<Timeout>();

  const handelSendDialogCode = useMemoizedFn(async () => {
    if (dialogTimer.current) return;
    if (!dialogValuePhone) {
      Taro.showToast({ title: '请输入手机号码', icon: 'none' });
      return;
    }

    const [result, error] = await fetch.getSms({ phone: dialogValuePhone });
    if (error || !result) return;
    Taro.showToast({ title: '验证码已发送', icon: 'none' });
    dialogTimer.current = setInterval(() => {
      if (dialogTimeNumberRef.current === 0) {
        clearInterval(dialogTimer.current);
        dialogTimer.current = undefined;
        setDialogValueBtnText('重新发送');
        dialogTimeNumberRef.current = -1;
        setDialogTimeNumber(dialogTimeNumberRef.current);
        return;
      }
      dialogTimeNumberRef.current = dialogTimeNumberRef.current > 0 ? dialogTimeNumberRef.current - 1 : 60;
      setDialogTimeNumber(dialogTimeNumberRef.current);
    }, 1000);
  });

  const handelCancelDialogPhone = useMemoizedFn(() => {
    setDialogValuePhone('');
    setDialogValueCode('');
    clearInterval(dialogTimer.current);
    dialogTimer.current = undefined;
    setDialogValueBtnText('发送验证码');
    dialogTimeNumberRef.current = -1;
    setDialogTimeNumber(dialogTimeNumberRef.current);
    setDialogOpenPhone(false);
  });

  const handelSubmitDialogPhone = useMemoizedFn(async () => {
    if (!dialogValuePhone || !dialogValueCode) {
      Taro.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }
    const [result, error] = await fetch.updateUserPhone({ phone: dialogValuePhone, code: dialogValueCode });
    if (error || !result) return;
    Taro.showToast({ title: '修改成功', icon: 'none' });
    handelCancelDialogPhone();
    getSecurity();
  });

  // 第三方绑定 getWxBindQrCode
  const [popupOpenBind, setPopupOpenBind] = useState<boolean>(false);
  const [popupInfoBind, setPopupInfoBind] = useState<Fetch.IGetWxBindQrCodeRes>();
  const popupGetStatus = useMemoizedFn(async () => {
    if (!popupInfoBind) {
      popupGetStatusClear();
      return;
    }
    const [result, error] = await fetch.getWxBindStatus({ key: popupInfoBind.key });
    if (error || !result) return;
    Taro.showToast({ title: '微信绑定成功', icon: 'none' });
    popupGetStatusClear();
    setPopupOpenBind(false);
  });
  const [popupGetStatusRun, popupGetStatusClear] = useInterval(popupGetStatus, 2000);
  const handelGetWxBindQrCode = useMemoizedFn(async () => {
    const [result, error] = await fetch.getWxBindQrCode();
    if (error || !result) return;
    console.log(result);
    setPopupInfoBind(result);
    setPopupOpenBind(true);
    popupGetStatusRun();
  });

  /** 初始化 */
  useEffect(() => {
    getSecurity();
  }, []);

  /** 获取账户信息 */
  const getSecurity = useMemoizedFn(async () => {
    const [result, error] = await fetch.getSecurity();
    if (!result || error) return;
    setSecurity(result);
  });

  return (
    <View>
      {/* <Cell title="登录密码">
        <View className={styles.cellItem}>
          <Text>{security?.passwd_set ? '已设置' : '未设置'}</Text>
          <Text className={styles.vertical}></Text>
          <Text className={styles.textBtn}>{security?.passwd_set ? '修改' : '设置'}</Text>
        </View>
      </Cell> */}
      <Cell title="绑定手机">
        <View className={styles.cellItem}>
          <Text>{security?.phone ?? '未设置'}</Text>
          <Text className={styles.vertical}></Text>
          <Text className={styles.textBtn} onClick={() => setDialogOpenPhone(true)}>
            {security?.phone ? '更换' : '设置'}
          </Text>
        </View>
      </Cell>
      <Cell title="微信账号">
        <View className={styles.cellItem}>
          <Text>{security?.wx_bind ? '已绑定' : '未绑定'}</Text>
          <Text className={styles.vertical}></Text>
          <Text className={styles.textBtn} onClick={handelGetWxBindQrCode}>
            {security?.wx_bind ? '更换' : '绑定'}
          </Text>
        </View>
      </Cell>
      {/* 绑定/更换手机 */}
      <Dialog open={dialogOpenPhone} onClose={handelCancelDialogPhone}>
        <Dialog.Content>
          <View className={styles.dialogItem}>
            <View className={styles.label}>手机号</View>
            <View className={styles.content}>
              <Input
                className={styles.input}
                value={dialogValuePhone}
                placeholder="请输入手机号码"
                onChange={({ detail }) => setDialogValuePhone(detail.value)}
              ></Input>
            </View>
          </View>
          <View className={styles.dialogItem}>
            <View className={styles.label}>验证码</View>
            <View className={styles.content}>
              <Input
                className={styles.input}
                value={dialogValueCode}
                placeholder="请输入验证码"
                onChange={({ detail }) => setDialogValueCode(detail.value)}
              ></Input>
              <Button className={styles.button} color="primary" size="small" onClick={handelSendDialogCode}>
                {dialogTimeNumber >= 0 ? `倒计时${dialogTimeNumber}秒` : dialogValueBtnText}
              </Button>
            </View>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={handelCancelDialogPhone}>取消</Button>
          <Button onClick={handelSubmitDialogPhone}>确认</Button>
        </Dialog.Actions>
      </Dialog>
      {/* 第三方绑定 */}
      <Popup open={popupOpenBind}>
        <View className={styles.popupTitle}>
          <View className={styles.title}>请截图使用</View>
          <View
            onClick={() => {
              popupGetStatusClear();
              setPopupOpenBind(false);
            }}
          >
            <Popup.Close />
          </View>
        </View>
        <View className={styles.popupContent}>
          <CodeCreator size={480} codeText={popupInfoBind?.url || ''}></CodeCreator>
          {/* <Image className={styles.popupImage} src={popupInfoBind?.url || ''}></Image> */}
        </View>
      </Popup>
    </View>
  );
};

export default Account;
