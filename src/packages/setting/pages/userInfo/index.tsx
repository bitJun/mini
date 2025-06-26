import { GenderEnum } from '@/config/enum';
import Input from '@/extend/Input';
import fetch from '@/lib/request';
import { storeActions } from '@/store';
import { Cell, ConfigProvider, Picker, Popup } from '@taroify/core';
import { Arrow } from '@taroify/icons';
import { Button, Form, Image, View } from '@tarojs/components';
import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';
definePageConfig({
  navigationBarTitleText: '用户详情',
  disableScroll: true
});
const UserInfo = () => {
  /** 头像 */
  const [avatar, setAvatar] = useState<Fetch.IUserInfo['avatar_path']>();
  /** 昵称 */
  const [nickname, setNickname] = useState<Fetch.IUserInfo['nickname']>();
  const [temNickname, setTemNickname] = useState<Fetch.IUserInfo['nickname']>();
  /** 性别 */
  const [gender, setGender] = useState<Fetch.IUserInfo['gender']>(0);
  /** 弹窗 */
  const [openPicker, setOpenPicker] = useState<boolean>(false);

  /** 获取用户信息 */
  useAsyncEffect(async () => {
    const userInfo = await storeActions('GET_USERINFO');
    setAvatar(userInfo?.avatar_path);
    setNickname(userInfo?.nickname);
    setTemNickname(userInfo?.nickname);
    setGender(userInfo?.gender || 0);
  }, []);

  /** 获取用户微信头像回调函数 */
  const handelChooseAvatar = useMemoizedFn(async ({ detail }) => {
    setAvatar(detail.avatarUrl);
    const [result, error] = await fetch.updateUserAvatar({ avatar_path: 'AInDecorBase/source_data/user_pics/01.png' });
    if (!result || error) return;
    storeActions('UPDATE_USERINFO', result);
    Taro.showToast({ title: '更新成功', icon: 'none' });
  });

  /** 昵称填写回调函数 */
  const handelNicknameInput: Input.onInput = useMemoizedFn(({ detail }) => setTemNickname(detail.value));
  const handelNicknameBlur: Input.onBlur = useMemoizedFn(() =>
    Taro.nextTick(() => (!!temNickname ? updateUserInfo() : setTemNickname(nickname))),
  );

  /** 性别更改确认事件 */
  const handelGenderConfirm = useMemoizedFn((values) => {
    setGender(values[0]);
    Taro.nextTick(() => updateUserInfo());
    setOpenPicker(false);
  });

  /** 更新用户信息 */
  const updateUserInfo = useMemoizedFn(async () => {
    const [result, error] = await fetch.updateUserInfo({ nickname: temNickname ?? ''});
    if (!result || error) return;
    setNickname(result?.nickname);
    setTemNickname(result?.nickname);
    setGender(result?.gender || 0);
    storeActions('UPDATE_USERINFO', result);
    Taro.showToast({ title: '更新成功', icon: 'none' });
  });

  return (
    <ConfigProvider
      theme={{
        '—cell-title-font-size-large': '28rpx',
      }}
    >
      <Cell className={styles.cellItem} align="center" size="large" title="头像">
        <View className={styles.right}>
          {/* 暂时关闭上传头像功能 */}
          {/* <Button className={styles.avatar} openType="chooseAvatar" onChooseAvatar={handelChooseAvatar}>
            {avatar && <Image className={styles.image} src={avatar} />}
          </Button> */}
          <View className={styles.avatar}>{avatar && <Image className={styles.image} src={avatar} />}</View>
        </View>
      </Cell>
      <Cell className={styles.cellItem} rightIcon={<Arrow />} title="昵称">
        <Form>
          <Input
            type="nickname"
            height={32}
            color='#101010'
            value={temNickname}
            onInput={handelNicknameInput}
            onBlur={handelNicknameBlur}
          ></Input>
        </Form>
      </Cell>
      <Cell className={styles.cellItem} rightIcon={<Arrow />} title="性别" onClick={() => setOpenPicker(true)}>
        <View className={styles.cellItemG}>{GenderEnum[gender]}</View>
      </Cell>
      {/* 性别选择框 */}
      <Popup open={openPicker} rounded placement="bottom" onClose={setOpenPicker} 
        style={{background:'#2e2e2e',color:'#fff',paddingTop:'12px',paddingBottom:'24px',overflow:'hidden',borderRadius:'16px 16px 0 0' }}
      >
        <Popup.Backdrop />
        <Picker defaultValue={GenderEnum[gender]} onCancel={() => setOpenPicker(false)} onConfirm={handelGenderConfirm}>
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>性别</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            <Picker.Option key={0} value={0}>
              保密
            </Picker.Option>
            <Picker.Option key={1} value={1}>
              男
            </Picker.Option>
            <Picker.Option key={2} value={2}>
              女
            </Picker.Option>
          </Picker.Column>
        </Picker>
      </Popup>
    </ConfigProvider>
  );
};

export default UserInfo;
