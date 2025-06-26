import { View,Image,Text } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import styles from './index.module.scss';
import { useEffect, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import fetch from '@/lib/request';
import useInterval from '@/hooks/useInterval';
import Router from '@/lib/router';
import logo from '@/assets/logo-light.png';
import { Replay } from "@taroify/icons";
import Input from '@/extend/Input';
import classnames from 'classnames';
import GlobalNotify from "@/components/GlobalNotify/index";
import { doneWorkNotice } from '@/hooks/doneWorkNotice';
type IRouterData = { platform: string,account_type?:string,id?:number};
definePageConfig({
  navigationBarTitleText: '灵应智能员工',
});
const PlatformLogin = () => {
  useEffect(() => {
    loadAccount(platform);
    return () => {
      resetData();
    };
  },[]);
  const loginM = doneWorkNotice('账号登录'); 
  const { platform,account_type,id } = Router.getData() as IRouterData || Taro.getStorage({
    key:'platform'
  });
  const recordPlatform = useRef<string>();
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [popupInfo, setPopupInfo] = useState<Fetch.IGetCreateQrCodeRes & { platform: 
    string }>();
  const [countdownNumber, setCountdownNumber] = useState<number>(-1);
  const [countdownNumberCode, setCountdownNumberCode] = useState<number>(60);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [reloadQr, setReloadQr] = useState<boolean>(false);
  const [sendBtn, setSendBtn] = useState<boolean>(false);
  const resetData = (() => {
    countdownClear();
    setPopupOpen(false);
    setCountdownNumber(-1);
    setDialogOpen(false);
    setCode('');
    setReloadQr(false);
    quitLoadAccount();
    countdownClearCode();
    setCountdownNumberCode(60);
    setSendBtn(false);
  });
  /** 新增账号 */
  const loadAccount = useMemoizedFn(async (platform) => {
    Taro.showLoading({ title: '加载中',mask:true });
    const [result, error] = await fetch.getCreateQrCode({ platform: platform,account_type,id });
    if (error || !result){
      Taro.showLoading({ title:'登录失败',mask:true });
      setTimeout(()=>{
        Taro.navigateBack({
          delta: 1, 
        });
      },2000);
      return
    };
    recordPlatform.current = platform;
    Taro.hideLoading();
    setPopupInfo({ ...result, platform });
    setPopupOpen(true);
    countdownRun();
    setCountdownNumber(result.expire_seconds);
    setReloadQr(false);
  });
  /** 关闭登录 */
  const quitLoadAccount = useMemoizedFn(async () => {
    if (!recordPlatform.current) return;
    const [result, error] = await fetch.quitCreateQrCode({ platform: recordPlatform.current });
    if (error || !result) return;
    countdownClear();
  });
  /** 检测登录 */
  const checkLoadAccount = useMemoizedFn(async () => {
    if (!popupInfo) return;
    if (code && code.length < 6) return;
    // Taro.showLoading({ title: '登录中',mask:true });
    const [result, error] = await fetch.getLoginQrCode({ code, platform: popupInfo.platform });
    Taro.hideLoading();
    if (error) {
      switch (result) {
        case 6003:
          if(!dialogOpen){
            setDialogOpen(true); 
            setReloadQr(false);
            countdownRunCode();
          }
          break;
        default:
          break;
      }
    }
    if (error || !result) return;
    // 登录成功
    Taro.showToast({ title: '登录成功', icon: 'none' });
    loginM.showPermissionDialog();
    resetData();
    setTimeout(()=>{
      Taro.reLaunch({
        url: '/pages/generation/index' // 强制重启到首页
      });
    },1500)
    //跟新投放账号列表--TODO
    return result;
  });
  /** 验证码定时器 */
  const countdown = useMemoizedFn(() => {
    if (countdownNumber <= 0) {
      setReloadQr(true);
      Taro.showToast({ title: '二维码超时，请刷新二维码', icon: 'none' });
      return;
    }
    if (countdownNumber % 6 === 0) {
      checkLoadAccount();
    }
    setCountdownNumber(countdownNumber - 1);
  });
   /** 验证码定时器 */
   const countdownCode = useMemoizedFn(() => {
    if (countdownNumberCode <= 0) {
      Taro.showToast({ title: '验证码超时，请刷新二维码', icon: 'none' });
      resetData();
      setReloadQr(true);
      return;
    }
    setCountdownNumber(-1);
    countdownClear();
    setReloadQr(false);
    setCountdownNumberCode(countdownNumberCode - 1);
  });
  const [countdownRun, countdownClear] = useInterval(countdown, 1000);
  const [countdownRunCode, countdownClearCode] = useInterval(countdownCode, 1000);
  const submitDialog = useMemoizedFn(async () => {
    if (!code){
      Taro.showToast({ title: '验证码不能为空', icon: 'none' });
      return
    };
    setSendBtn(true);
    Taro.showLoading({ title: '登录中',mask:true });
    await checkLoadAccount();
  });
  /** 图片预览 */
  const previewImage = useMemoizedFn((url) => {
    Taro.previewImage({
      current: url,
      urls: [url],
    });
  });
  const downloadQRCode = (qrCodeUrl:string) => {
    // 提取 Base64 数据部分
    const base64Content = qrCodeUrl.replace(/^data:image\/\w+;base64,/, '');
    const fileSystemManager = Taro.getFileSystemManager();
    const tempFilePath = `${Taro.env.USER_DATA_PATH}/qrcode.png`;
    // 写入临时文件
    fileSystemManager.writeFile({
      filePath: tempFilePath,
      data: base64Content,
      encoding: 'base64',
      success() {
        // 保存到相册
        Taro.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success() {
            Taro.showToast({
              title: '二维码已保存到相册',
              icon: 'success',
            });
          },
          fail(err) {
            console.error('保存失败', err);
            if (err.errMsg.includes('auth deny') || err.errMsg.includes('auth denied')) {
              // 引导用户授权
              Taro.showModal({
                title: '提示',
                content: '需要授权保存到相册，是否前往设置？',
                success(modalRes) {
                  if (modalRes.confirm) {
                    Taro.openSetting();
                  }
                },
              });
            } else {
              Taro.showToast({
                title: '保存失败',
                icon: 'none',
              });
            }
          },
        });
      },
      fail(err) {
        console.error('写入文件失败', err);
        Taro.showToast({
          title: '保存二维码失败',
          icon: 'none',
        });
      },
    });
  }
  const reloadFn = ()=>{
    resetData();
    loadAccount(platform)
  }
  return (
    <View className={styles.platformLogin}>
        <View style={{display:'flex',justifyContent:'center'}}>
          <Image className={styles.logo} src={logo} />
        </View>
        <View className={styles.arrangeWorkBoxTitle}>保存。扫码登录。使用。</View>
        <Text className={styles.desc}>登录新媒体账号，你需要轻点下方按钮，先保存登录二维码到本地相册，然后前往新媒体平台，并使用二维码扫码登录方式完成登录操作。</Text>
        {
          dialogOpen && <View className={styles.secondLogin}>
             <Text className={styles.secondLoginTitle}>二次登录验证</Text>
             <View className={styles.secondLoginInput}>
                <View>
                  <Input
                    value={code}
                    height={80} 
                    color='#fff'
                    onInput={({ detail }) => setCode(detail.value)}
                    placeholder="输入短信验证码"
                  ></Input>
                </View>
                <View style={{marginBottom:'12px'}} className={classnames(styles.saveBtn,{[styles.saveBtnNo]:sendBtn})} onClick={submitDialog}>确认</View>
             </View>
             <View className={styles.popupTimeB}>剩余登录时间：{countdownNumberCode}秒</View>
          </View>
        }
        <View className={styles.ercodeBox}>
          <View style={{display:'flex',justifyContent:'center',position:"relative"}}>
            <Image mode="aspectFit" className={styles.popupImage} src={popupInfo?.image || ''} 
              onClick={()=>previewImage(popupInfo?.image)}
            ></Image>
            {
             reloadQr && <View className={styles.mask} onClick={reloadFn}>
              <><Replay /></> 刷新二维码
             </View>
            }
          </View>
         {
           countdownNumber > 0 && <View className={styles.popupTime}>剩余登录时间：{countdownNumber}秒</View>
         }
         {
          !dialogOpen && popupOpen && !reloadQr ? <View style={{display:'flex',justifyContent:'center'}}>
          <View className={styles.saveBtn} onClick={()=>{
              downloadQRCode(popupInfo?.image || '')
            }}>保存二维码</View>
          </View> : null
         }
        <View style={{color:'#f00',width:"100%",textAlign:"center",lineHeight:'36px'}}>
          ⚠️ 登录中请勿退出，成功后将自动跳转
        </View>
        </View>
        <GlobalNotify type='top' />
    </View>
  );
};
export default PlatformLogin;