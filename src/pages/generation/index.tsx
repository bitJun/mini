import useShareMessage from '@/hooks/useShareMessage';
import { _checkLogin } from '@/lib/router';
import { View } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import './index.module.scss';
import styles from './index.module.scss';
definePageConfig({
  navigationBarTitleText: "营销发展员工", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

const Mine = () => {
  useShareMessage();
  useDidShow(() => {
    _checkLogin();
  });

  return (
    <View className={styles.generation}>
       待开发
    </View>
  );
};

export default Mine;
