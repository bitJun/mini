import useShareMessage from '@/hooks/useShareMessage';
import { _checkLogin } from '@/lib/router';
import { View,ScrollView,Image } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import fetch from '@/lib/request';
import {  useStoreData,storeActions } from '@/store';
import styles from './index.module.scss';
definePageConfig({
  navigationBarTitleText: '任务列表',
  navigationStyle:"default"
});

const taskList = () => {
  const { taskList,dicSetting } = useStoreData(({ common }) => ({
    taskList: common.taskList,
    dicSetting: common.dicSetting,
  }));
  const { userInfo } = useStoreData(({ user }) => ({
    userInfo: user.userInfo,
  }));
  useDidShow(() => {
    storeActions('GET_TASK');
  });
  return (
    <ScrollView
      className={styles.taskList}
      scrollWithAnimation
      scrollY
    >
      <View className={styles.listsBox}>
          <Image
            mode="widthFix"
            className={styles.imageStyle}
            src={dicSetting.length ? dicSetting[0].content.welcome.avatar : userInfo.avatar_path}
          />
          {taskList.length ? (
            taskList.map((item,index)=>{
            return <View key={index} className={styles.lists}>
              <View className={styles.listsT}>
                 <View className={styles.listsTL}>生成创意文案</View>
                 <View className={styles.listsTR}> {item.status_code === 2 ? <View className={styles.statusOk}>
                    <View className={styles.statusOkL}></View>
                    <View className={styles.statusOkR}>工作中</View>
                 </View> : item.estimate_finish_time}</View>
              </View>
              <View className={styles.listsB}>
                {item.info}
              </View>
            </View>
            })
          ) : null}
      </View>
    </ScrollView>
  );
};

export default taskList;
