import useShareMessage from '@/hooks/useShareMessage';
import Router, { _checkLogin } from '@/lib/router';
import { Cell, Picker, Popup, Empty, Tabs } from '@taroify/core';
import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import styles from './index.module.scss';
import fetch from '@/lib/request';
import { useState, useEffect, useMemo, useRef } from 'react';
import CustomHeader from '@/components/CustomHeader/index';
import { CalendarOutlined } from '@taroify/icons';
import classnames from 'classnames';
import { usePermission } from '@/hooks/usePermission';
import DataMarketTab from './tabs/data-market-tab';
import { getStatusBarHeight } from '@/tools';
// const { handlePermissionCheck } = usePermission('客户消息');
definePageConfig({
  navigationStyle: 'custom',
  enableShareAppMessage: true,
  enableShareTimeline: true,
});
const Creator = () => {
  const [value, setValue] = useState(0);
  const lins = usePermission('客户线索');
  const statusBarHeight = useRef(getStatusBarHeight());
  const { handlePermissionCheck } = usePermission('客户消息');
  const setTabVal = (v) => {
    if (v == 1) {
       const hasPermission = handlePermissionCheck();
      if (!hasPermission) {
        return;
      } 
    } else if (v == 2) {
      const hasPermission = lins.handlePermissionCheck();
      if (!hasPermission) {
        return;
      } 
    }
    setValue(v);
  };
  return (
    <View className={styles.container}>
      <CustomHeader title="灵应智能员工" bgType="gray1" fixed={true} leftType="home" titleColor="#fff"></CustomHeader>
      <View className={styles.creatorTabs} style={{ marginTop: `${statusBarHeight.current + 50}px` }}>
        <Tabs className={classnames(styles.mesMidBox)} onChange={(v) => setTabVal(v)} value={value}>
          <Tabs.TabPane title="数据大盘">
            <DataMarketTab></DataMarketTab>
          </Tabs.TabPane>
        </Tabs>
      </View>
    </View>
  );
};

export default Creator;
