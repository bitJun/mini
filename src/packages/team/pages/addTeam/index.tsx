import { useState, useEffect,useRef } from 'react';
import { View,Text } from '@tarojs/components';
import Router from '@/lib/router';
import fetch from '@/lib/request';
import { useMemoizedFn } from 'ahooks';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useStoreData } from '@/store';
import Input from '@/extend/Input';
import { SafeArea } from '@taroify/core';
import Taro from '@tarojs/taro';
definePageConfig({
  navigationStyle: 'custom'
});
const AddTeam = () => {
  const [teamCode, setTeamCode] = useState<string>('');
  const handelTeamInput: Input.onInput = useMemoizedFn(({ detail }) => setTeamCode(detail.value));
  const goToChoiceRole = () => {
    Router.navigate('LIngInt://choiceRole');
  };
  return (
    <View className={styles.addTeam}>
      <View className={styles.addTeamNav}>
        <Text>请输入团队码</Text>
        <View className={styles.teamInput}>
          <Input value={teamCode} height={72} color='#fff' onInput={handelTeamInput} placeholder=""></Input>
        </View>
        <View className={styles.teamBtns}>
           <View className={styles.btnLeft}>加入团队</View>
           <View className={styles.btnRight} onClick={goToChoiceRole}>新建团队</View>
        </View>
      </View>
    </View>
  );
};

export default AddTeam;