import useShareMessage from '@/hooks/useShareMessage';
import {useShareMessagePYQ} from '@/hooks/useShareMessage';
import { View } from '@tarojs/components';
import styles from './index.module.scss';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import useStatusTools from '@/hooks/useStatusTools';
import { _checkLogin } from '@/lib/router';
definePageConfig({
  navigationBarTitleText: "营销发展员工", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});
const Index = () => {
  const { userLogin } = useStatusTools();
  const [loading, setLoading] = useState(true);
  useShareMessage();
  useShareMessagePYQ();
  /** 全局状态值 */
  useDidShow(() => {
   var aa = _checkLogin();
   if(aa){
    Taro.getStorage({
      key: 'is_new',
      success: function (res) {
        if (res.data == 'no') {
          setLoading(false);
        }else if (res.data  == 'ok'){
          setLoading(true);
        }
      }
    })    
   }
  });
 
  return (
    <View className={styles.design}>
      {userLogin && <View>首页，待更新</View>}
    </View>
  );
};

export default Index;
