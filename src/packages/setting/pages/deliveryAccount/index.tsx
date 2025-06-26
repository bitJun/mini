import useInterval from '@/hooks/useInterval';
import fetch from '@/lib/request';
import { useStoreData } from '@/store';
import { Button, Dialog, Empty, FixedView, Popup, SafeArea, Input } from '@taroify/core';
import { Image, ScrollView, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import classnames from 'classnames';

definePageConfig({
  navigationBarTitleText: '投放账号',
});

const Delivery = () => {
  const { defaultSetting } = useStoreData(({ common }) => ({
    defaultSetting: common.defaultSetting,
  }));

  const [accountList, setAccountList] = useState<Fetch.IGetAccountRes['records']>(); // 账号列表
  const [loading, setLoading] = useState<boolean>(false);

  /** 重新登录 */
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [popupInfo, setPopupInfo] = useState<Fetch.IGetCreateQrCodeRes & { platform: string }>();
  const [countdownNumber, setCountdownNumber] = useState<number>(-1);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [code, setCode] = useState<string>();

  /** 登录 */
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [accountIndex, setAccountIndex] = useState<number>(0);

  /** 记录platform */
  const recordPlatform = useRef<string>();

  useEffect(() => {
    _getAccount();
    return () => {
      closePopup();
    };
  }, []);

  /** 验证码定时器 */
  const countdown = useMemoizedFn(() => {
    if (countdownNumber <= 0) {
      closePopup();
      Taro.showToast({ title: '登录失败', icon: 'none' });
      return;
    }
    if (countdownNumber % 6 === 0) {
      checkLoadAccount();
    }
    setCountdownNumber(countdownNumber - 1);
  });
  const [countdownRun, countdownClear] = useInterval(countdown, 1000);

  /** 退出登录 */
  const logoutAccount = useMemoizedFn(async (item) => {
    const [result, error] = await fetch.logoutAccount({ id: item.id });
    if (error || !result) return;
    Taro.showToast({ title: '退出成功', icon: 'none' });
    Taro.removeStorage({
      key:'is_new'
    })
    _getAccount();
  });

  /** 新增账号 */
  const loadAccount = useMemoizedFn(async (item) => {
    Taro.showLoading({ title: '加载中',mask:true });
    const [result, error] = await fetch.getCreateQrCode({ platform: item.englishName });
    _getAccount();
    if (error || !result) return;
    recordPlatform.current = item.englishName;
    Taro.hideLoading();
    setPopupInfo({ ...result, platform: item.englishName });
    setPopupOpen(true);
    setCountdownNumber(result.expire_seconds);
    countdownRun();
  });

  /** 重新登录 */
  const reloadAccount = useMemoizedFn(async (item) => {
    Taro.showLoading({ title: '加载中',mask:true });
    const { deliver_platform } = defaultSetting;
    const findPlatform = deliver_platform.find((i) => item.platform === i.chineseName);
    const [result, error] = await fetch.getCreateQrCode({ id: item.id, platform: findPlatform.englishName });
    _getAccount();
    if (error || !result) return;
    recordPlatform.current = findPlatform.englishName;
    Taro.hideLoading();
    setPopupInfo({ ...result, platform: findPlatform.englishName });
    setPopupOpen(true);
    setCountdownNumber(result.expire_seconds);
    countdownRun();
  });

  /** 关闭登录 */
  const quitLoadAccount = useMemoizedFn(async () => {
    if (!recordPlatform.current) return;
    const [result, error] = await fetch.quitCreateQrCode({ platform: recordPlatform.current });
    if (error || !result) return;
  });

  /** 检测登录 */
  const checkLoadAccount = useMemoizedFn(async () => {
    if (!popupInfo) return;
    if (code && code.length < 6) return;
    const [result, error] = await fetch.getLoginQrCode({ code, platform: popupInfo.platform });
    if (error) {
      switch (result) {
        case 6003:
          !dialogOpen && setDialogOpen(true);
          break;
        default:
          break;
      }
    }
    if (error || !result) return;
    // 登录成功
    Taro.showToast({ title: '登录成功', icon: 'none' });
    _getAccount();
    closePopup();
    return result;
  });

  const closePopup = useMemoizedFn(() => {
    countdownClear();
    setCode('');
    quitLoadAccount();
    setPopupOpen(false);
  });

  const cancelDialog = useMemoizedFn(() => {
    setCode('');
    setDialogOpen(false);
  });

  const submitDialog = useMemoizedFn(async () => {
    await checkLoadAccount();
    setDialogOpen(false);
  });

  const _getAccount = useMemoizedFn(async () => {
    const [result, error] = await fetch.getAccount({ fetch_all: true });
    if (error || !result) return;
    const { deliver_platform } = defaultSetting;
    if(deliver_platform){
      setAccountList(
        result.records.map((item) => {
          const findPlatform = deliver_platform.find((i) => item.platform === i.chineseName);
          return { ...item, platformUrl: findPlatform.url };
        }),
      );
    }
  });

  const _checkStatusAccount = useMemoizedFn(async () => {
    if (!accountList || loading) return;
    setLoading(true);
    const cloneAccountList = {};
    accountList.forEach((item, index) => (cloneAccountList[index] = item));
    for (let index in cloneAccountList) {
      cloneAccountList[index].online_status = '检测中...';
      setAccountList(Object.values(cloneAccountList));
      const [result, error] = await fetch.checkStatusAccount({ account_id: cloneAccountList[index].id });
      if (error || !result) return;
      cloneAccountList[index].online_status = result.is_online ? '在线' : '登录过期';
      setAccountList(Object.values(cloneAccountList));
    }
    setLoading(false);
  });

  return (
    <View className={styles.container}>
      <ScrollView scrollY className={styles.scrollView}>
        {accountList && accountList.length > 0 ? (
          <>
            {accountList.map((item) => {
              return (
                <View className={styles.accountItem}>
                  <View className={styles.accountFlex}>
                    {/* @ts-ignore */}
                    <Image src={item.platformUrl} className={styles.platformIcon}></Image>
                    <View className={item.online_status == '在线' ? styles.success : styles.error}>
                      {item.online_status}
                    </View>
                  </View>
                  <View className={styles.accountFlex}>
                    <View className={styles.accountInfo}>
                      <Image src={item.image} className={styles.icon}></Image>
                      <View>{item.name}</View>
                    </View>
                    {item.online_status == '在线' ? (
                      <View className={styles.textBtn} onClick={() => logoutAccount(item)}>
                        退出登录
                      </View>
                    ) : (
                      <View className={styles.textBtn} onClick={() => reloadAccount(item)}>
                        重新登录
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          <Empty className={styles.empty}>
            <Empty.Image />
            <Empty.Description>暂无账号</Empty.Description>
          </Empty>
        )}
      </ScrollView>
      <FixedView position="bottom">
        <View className={styles.controls}>
          <Button
            variant="outlined"
            color="primary"
            shape="round"
            loading={loading}
            className={styles.button}
            onClick={_checkStatusAccount}
          >
            检测登录状态
          </Button>
          <Button
            variant="contained"
            color="primary"
            shape="round"
            className={styles.button}
            onClick={() => setAccountOpen(true)}
          >
            新增账号
          </Button>
        </View>
        <SafeArea position="bottom" />
      </FixedView>
      {/* 弹窗 */}
      <Popup open={popupOpen}>
        <View className={styles.popupTitle}>
          <View className={styles.title}>请截图使用</View>
          <View onClick={() => closePopup()}>
            <Popup.Close />
          </View>
        </View>
        <Image className={styles.popupImage} src={popupInfo?.image || ''}></Image>
        <View className={styles.popupTime}>有效时间{countdownNumber}秒</View>
      </Popup>
      {/* 输入短信验证码 */}
      <Dialog open={dialogOpen} onClose={cancelDialog}>
        <Dialog.Content>
          <Input value={code} onChange={({ detail }) => setCode(detail.value)} placeholder="输入短信验证码"></Input>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={cancelDialog}>取消</Button>
          <Button onClick={submitDialog}>确认</Button>
        </Dialog.Actions>
      </Dialog>
      {/* 选择登录账号类型 */}
      <Popup open={accountOpen} rounded placement="bottom" onClose={setAccountOpen} style={{ height: '360px' }}>
        <View className={styles.popupBox}>
          <View className={styles.operatingArea}>
            <View className={styles.cancel}></View>
            <View className={styles.title}>选择账号类型</View>
            <View
              className={styles.confirm}
              onClick={() => {
                loadAccount(defaultSetting.deliver_platform[accountIndex]);
                setAccountOpen(false);
              }}
            >
              确定
            </View>
          </View>
          <ScrollView scrollY enableFlex className={styles.popupContent}>
            {defaultSetting.deliver_platform.map((item, index) => {
              return (
                <View
                  className={classnames(styles.platformItem, { [styles.active]: accountIndex === index })}
                  onClick={() => {
                    setAccountIndex(index);
                  }}
                >
                  <Image src={item.url} className={styles.platformIcon}></Image>
                  <View>{item.chineseName}</View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Popup>
    </View>
  );
};

export default Delivery;
