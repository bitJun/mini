import React, { useState } from 'react';
import Router, { _checkLogin } from '@/lib/router';
import { View,Text } from '@tarojs/components';
import {
  Tabs,
} from '@nutui/nutui-react-taro';
import styles from './index.module.scss';

definePageConfig({
  navigationBarTitleText: "营销发展员工", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

const DevelopCustomer = () => {
  const [tabvalue, setTabvalue] = useState<string | number>('0');

  return (
    <View className={styles.container}>
      <Tabs
        className={styles['custom-tabs']}
        value={tabvalue}
        onChange={(value) => {
          setTabvalue(value)
        }}
        tabStyle={{
          height: '80rpx',
          background: 'transparent'
        }}
      >
        <Tabs.TabPane title="消息">消息</Tabs.TabPane>
        <Tabs.TabPane title="线索">线索</Tabs.TabPane>
        <Tabs.TabPane title="通知">通知</Tabs.TabPane>
      </Tabs>
    </View>
  );
};

export default DevelopCustomer;
