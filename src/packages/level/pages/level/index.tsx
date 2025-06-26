import {  useStoreData } from '@/store';
import { View,Text,Image,ScrollView } from '@tarojs/components';
import { useEffect,useState } from 'react';
import styles from './index.module.scss';
import classnames from 'classnames';
import Router,{ _checkLogin } from '@/lib/router';
import { useMemoizedFn } from 'ahooks';
import Taro from '@tarojs/taro';
definePageConfig({
  navigationBarTitleText: '员工成长计划',
});
type canDoListP = {
  logo:string;
  min_credit:number;
  permission:{
    logo:string;
    name:string;
  }[]
}
type creditExtra = {
  k:string;
  v:string;
  path:string;
}[]
const levels = [
  { level: 'V1', value: 2.55 },
  { level: 'V2', value: 15 },
  { level: 'V3', value: 40 },
  { level: 'V4', value: 65 },
  { level: 'V5', value: 97.5 },
];
const Level = () => {
  const [nextLevel,setNextLevel]= useState('');
  const [nextLevelNumber,setNextLevelNumber]= useState(0);
  const [range,setRange]= useState<string[]>(['V1']);
  const [progress,setProgress]= useState(2.55);
  const [canDoList,setCanDoList]= useState<canDoListP['permission']>();
  const [nextDoList,setNextDoList]= useState<canDoListP['permission']>();
  const [creditExtraList,setCreditExtraList]= useState<creditExtra>();
  const { dicSetting } = useStoreData(({ common }) => ({
    dicSetting: common.dicSetting
  }));
  const { userInfo } = useStoreData(({ user }) => ({
    userInfo: user.userInfo,
  }));
  useEffect(() => {
    if(dicSetting && dicSetting.length && userInfo.employee){
      setCanDoList(dicSetting[0].content.credit_level[userInfo.employee.level].permission);
      setCreditExtraList(dicSetting[0].content.credit_extra);
      const number = Number(userInfo.employee.level.substring(1));
      var arr: string[] = [];
      for(let i=number;i>0;i--){
        arr.push(`V${i}`)
      }
      setRange(arr);
      setProgress((userInfo.employee.credit/ 5000) * 100 + levels[number - 1].value)
      if(!number || number > 4){
        setProgress(100)
        return;
      }
      let key = `V${number + 1}`;
      setNextLevel(key);
      setNextLevelNumber(dicSetting[0].content.credit_level[key].min_credit - userInfo.employee.credit);
      setNextDoList(dicSetting[0].content.credit_level[key].permission)
    }
  }, [dicSetting,userInfo]);
  // { data:
  const goDoWork = useMemoizedFn((path) => {
    if(path === 'creation'){
      Taro.setStorage({
        key:'ind_index',
        data:1
      });
    }
    Router.navigate(`LIngInt://${path}`)
  });
  return (
    <ScrollView className={styles.level} scrollWithAnimation scrollY>
      <View className={classnames(styles.mesTopBox)}> 
        <View className={styles.mesTopAvatar}>
          <Image mode="widthFix" className={styles.imageStyle} src={ userInfo.employee.avatar} />
          <View className={styles.mesTopAvaRight}>
            <View className={styles.mesTopAvaRightNav}>{`姓名：${userInfo.employee.name}`}</View>
            <View className={styles.mesTopAvaRightNav}>{`部门：${userInfo.employee.department}`}</View>
            <View className={styles.mesTopAvaRightNav}>{`职位：${userInfo.employee.position}`}</View>
          </View>
        </View>
        <View className={styles.mesTopScope}>
          <View className={styles.mesTopScopeBox}>
            <Image mode="widthFix" className={styles.mesTopScopeBoxImg} src='https://image.aindecor.co/AInDecorBase/source_data/icon/work_experience.png' />
            <Text  className={styles.mesTopScopeBoxText}>{`入职${userInfo.employee.onboard_days}天`}</Text>
          </View>
          <View className={styles.mesTopScopeBox}>
            <Image mode="widthFix" className={styles.mesTopScopeBoxImg} src='https://image.aindecor.co/AInDecorBase/source_data/icon/hiredate.png' />
            <Text  className={styles.mesTopScopeBoxText}>{`经验${userInfo.employee.credit}点`}</Text>
          </View>
        </View>
      </View>
      <View className={styles.mesMidBox}>
        <View className={styles.mesMidBoxTitle}>
          {nextLevel ? `还差 ${nextLevelNumber} 点经验升级到 ${nextLevel}` : ''}
        </View>
        <View className={styles.vipLevelBar}>
          {/* 等级条 */}
          <View className={styles.levelLine}>
            {levels.map((item) => (
              <View
                key={item.level}
                className={classnames(styles.levelDot)}
                style={{ left: `${(item.value / 100) * 100}%` }}
              >
                <View className={classnames(styles.dot,{[styles.dotActive]:range.indexOf(item.level) != -1})} />
                <Text className={styles.levelLabel}>{item.level}</Text>
              </View>
            ))}
          </View>
          <View
            className={styles.currentPointMarker}
            style={{
              width: `${Math.min(progress, 100)}%`,
            }}
          >
          </View>
        </View>
      </View>
      <View className={styles.mesMidBoxT}>
        <View className={styles.mesMidBoxTitle}>工作权限</View>
        <View  className={styles.permissionBox}>
          {
            canDoList && canDoList.length ? (
              canDoList.map((item,index)=>{
                return  <View key={index} className={styles.permissionBoxChild}>
                    <View className={styles.permissionBoxImg}>
                      <Image mode="widthFix" className={styles.img} src={item.logo} />
                    </View>
                    <View className={styles.name}>{item.name}</View>
                </View>
              })
            ) : null
          }
        </View>
        <View>
          <View className={styles.nextLevel}>下一职级可获以下权限</View>
          <View  className={styles.permissionBox}>
          {
            nextDoList && nextDoList.length ? (
              nextDoList.map((item,index)=>{
                return  <View key={index} className={styles.permissionBoxChild}>
                    <View className={styles.permissionBoxImg}>
                      <Image mode="widthFix" className={styles.img} src={item.logo} />
                    </View>
                    <View className={styles.name}>{item.name}</View>
                </View>
              })
            ) : null
          }
        </View>
        </View>
      </View>
      <View className={styles.mesMidBoxB}>
        <View className={styles.mesMidBoxTitle}>提升我的经验值</View>
        <View className={styles.improve}>
            {creditExtraList&&creditExtraList.map((item,index)=>{
              return <View key={index} className={styles.improveChild}>
                <View>{item.k}</View>
                <View>{item.v}</View>
                <View className={styles.improveChildBtn} onClick={()=>goDoWork(item.path)}>去完成</View>
              </View>
            })}
        </View>
      </View>
    </ScrollView>
  );
};
export default Level;