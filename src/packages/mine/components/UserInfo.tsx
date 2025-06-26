import useStatusTools from '@/hooks/useStatusTools';
import Router from '@/lib/router';
import { storeActions } from '@/store';
import { Arrow } from '@taroify/icons';
import { Image, View } from '@tarojs/components';
import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import styles from '../pages/index.module.scss';

const UserInfo = () => {
  /** 全局状态值 */
  const { userLogin } = useStatusTools();
  const genderArr=['保密','男','女']
  /** 头像 */
  const [avatar, setAvatar] = useState<Fetch.IUserInfo['avatar_path']>();
  /** 昵称 */
  const [nickname, setNickname] = useState<Fetch.IUserInfo['nickname']>();
  const [gender,setGender] = useState<Fetch.IUserInfo['gender']>(0);
  /** 获取用户信息 */
  useAsyncEffect(async () => {
    if (userLogin) {
      const userInfo = await storeActions('GET_USERINFO');
      setAvatar(userInfo?.avatar_path);
      setNickname(userInfo?.nickname);
      setGender(userInfo?.gender || 0);
    }
  }, [userLogin]);

  /** 点击 未登录-> 去登录 已登录->编辑信息 */
  const handelClick = useMemoizedFn(() => (userLogin ? goToUserInfo() : goToLogin()));

  /** 路由跳转  */
  const goToLogin = useMemoizedFn(() => Router.navigate('LIngInt://login'));
  const goToUserInfo = useMemoizedFn(() => Router.navigate('LIngInt://userInfo'));

  return (
    <View className={styles.container} onClick={handelClick}>
      <View className={styles.userInfo}>
        {/* 头像 */}
        <View className={styles.avatar}>{avatar && <Image className={styles.avatarImage} src={avatar}></Image>}</View>
        {/* 用户信息 */}
        <View className={styles.info}>{userLogin ? <View>
          <View>{nickname}</View>
          {
            gender > -1 &&  <View className={styles.gender}>{genderArr[gender]}</View>
          }
        </View> : <View>点击注册/登录</View>}</View>
      </View>
      <Arrow />
    </View>
  );
};

export default UserInfo;
