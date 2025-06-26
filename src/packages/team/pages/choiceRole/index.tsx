import { useState, useEffect,useRef } from 'react';
import { ScrollView,View,Text,Image } from '@tarojs/components';
import Router from '@/lib/router';
import fetch from '@/lib/request';
import { useMemoizedFn } from 'ahooks';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useStoreData } from '@/store';
import { Button } from '@taroify/core';
import Taro from '@tarojs/taro';
definePageConfig({
   navigationStyle: 'custom'
});
type role = {
  url: string;
  roles:string[]
};
const ChoiceRole = () => {
  const [activeInd, setActiveInd] = useState<number>(0);
  const [roleInd, setRoleInd] = useState<number>(0);
  const allData = [
    {
      url: 'https://image.aindecor.co/AInDecorBase/source_data/digital_man/lingint_ai.jpg',
      roles: ['律师','财税']
    },
    {
      url: 'https://image.aindecor.co/AInDecorBase%2Fgenerate_data%2F202411%2F05%2FUpload-ab6421-13141.jpeg',
      roles: ['装修','汽车']
    }
  ]
  const [roleObj, setRoleObj] = useState<role>(allData[0]);
  const changeInd = (ind) => {
    setActiveInd(ind);
    setRoleObj(allData[ind])
  };
  const changeRoleInd = (ind) => {
    setRoleInd(ind);
  };
  return (
    <View className={styles.choiceRole}>
        <View className={styles.choiceRoleNav}>
          <View className={styles.title}>请选择您要聘用的员工</View>
          <View className={styles.btns}>
            <View onClick={()=>changeInd(0)}  className={classnames(styles.btnLeft, { [styles.active]: activeInd === 0 })}>个人IP助理</View>
            <View onClick={()=>changeInd(1)}  className={classnames(styles.btnLeft, { [styles.active]: activeInd === 1 })}>营销发展员工</View>
          </View>
          <Image mode="widthFix" className={styles.imageStyle} src={roleObj.url} />
          <View className={styles.areaTitle}>请选择您的所在领域</View>
          <View className={styles.roles}>
            {
              roleObj.roles.map((item,index)=>{
                return <Text onClick={()=>changeRoleInd(index)} className={classnames(styles.rolesText, { [styles.active]: roleInd === index })}  key={index}>{item}</Text>
              })
            }
          </View>
          <Button color="primary" shape="round" block style={{ backgroundColor: "#6236FF", color: "#fff",fontSize:'18px',fontWeight:'bold' }}>聘用员工</Button>
        </View>
    </View>
  );
};

export default ChoiceRole;