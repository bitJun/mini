import Router from '@/lib/router';
import { Cell } from '@taroify/core';
import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import styles from './index.module.scss';

definePageConfig({
  navigationBarTitleText: '会员管理',
});

const Member = () => {
  const goToMemberAgent = useMemoizedFn(() => Router.navigate('LIngInt://memberAgent'));
  const goToMemberAssets = useMemoizedFn(() => Router.navigate('LIngInt://memberAssets'));
  const goToMemberPackage = useMemoizedFn(() => Router.navigate('LIngInt://memberPackage'));
  const goToMemberPurchase = useMemoizedFn(() => Router.navigate('LIngInt://memberPurchase'));

  return (
    <View className={styles.container}>
      <View className={styles.cell} onClick={goToMemberPackage}>
        <Cell title="会员套餐" isLink className={styles.cellText} />
      </View>
      <View className={styles.cell} onClick={goToMemberAssets}>
        <Cell title="资源套餐" isLink className={styles.cellText} />
      </View>
      <View className={styles.cell} onClick={goToMemberAgent}>
        <Cell title="代理商计划" isLink className={styles.cellText} />
      </View>
      <View className={styles.cell} onClick={goToMemberPurchase}>
        <Cell title="购买计划" isLink className={styles.cellText} />
      </View>
    </View>
  );
};

export default Member;
