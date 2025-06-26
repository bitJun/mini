import { Checkbox } from '@taroify/core';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import Router from '@/lib/router';

type IContractProps = {
  onChange: (checked: boolean) => void;
};

const Contract: React.FC<IContractProps> = (props) => {
  const { onChange } = props;

  const [contractChecked, setContractChecked] = useState(false);

  const handelChecked = useMemoizedFn((checked) => {
    setContractChecked(checked);
    onChange(checked);
  });

  // 用户协议
  const goToUserContract = useMemoizedFn(() =>
    Router.navigate('LIngInt://contract', { data: { type: 'userContract' } }),
  );

  // 隐私协议
  const goToPrivacyContract = useMemoizedFn(() =>
    Router.navigate('LIngInt://contract', { data: { type: 'privacyContract' } }),
  );

  return (
    <View className={styles.contract}>
      <Checkbox defaultChecked={contractChecked} checked={contractChecked} onChange={handelChecked} className={styles.selfStyle} >
        <Text className={styles.selfColor}>阅读并同意</Text>
        <Text className={styles.link} onClick={(e)=>{
          e.stopPropagation();
          goToUserContract();
        }}>
          《用户协议》
        </Text>
        <Text className={styles.selfColor}>和</Text>
        <Text className={styles.link} onClick={(e)=>{
          e.stopPropagation();
          goToPrivacyContract();
        }}>
          《隐私协议》
        </Text>
      </Checkbox>
    </View>
  );
};

export default Contract;
