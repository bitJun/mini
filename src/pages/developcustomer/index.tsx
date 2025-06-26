import Router, { _checkLogin } from '@/lib/router';
import { View,Text } from '@tarojs/components';
import styles from './index.module.scss';
definePageConfig({
  navigationBarTitleText: "营销发展员工", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

const DevelopCustomer = () => {
  return (
    <View className={styles.container}>
       待开发
    </View>
  );
};

export default DevelopCustomer;
