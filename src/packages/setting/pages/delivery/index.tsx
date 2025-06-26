import Router from '@/lib/router';
import { Cell } from '@taroify/core';
import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import styles from './index.module.scss';

definePageConfig({
  navigationBarTitleText: '投放管理',
  enableShareAppMessage: true,
});

const Delivery = () => {
  const goToDeliveryAccount = useMemoizedFn(() => Router.navigate('LIngInt://deliveryAccount'));
  const goToDeliveryGroup = useMemoizedFn(() => Router.navigate('LIngInt://deliveryGroup'));
  const goToDeliverySetting = useMemoizedFn(() => Router.navigate('LIngInt://deliverySetting'));

  return (
    <View className={styles.container}>
      <View onClick={goToDeliveryAccount} className={styles.cell}>
        <Cell title="投放账号" isLink className={styles.cellText} />
      </View>
      <View onClick={goToDeliveryGroup} className={styles.cell}>
        <Cell title="投放账号组" isLink className={styles.cellText} />
      </View>
      <View onClick={goToDeliverySetting} className={styles.cell}>
        <Cell title="投放配置" isLink className={styles.cellText} />
      </View>
    </View>
  );
};

export default Delivery;
