import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import {  useStoreData } from '@/store';
import Router from '@/lib/router';
type canDoListP = {
  V1:{
    logo:string;
    min_credit:number;
    permission:{
      logo:string;
      name:string;
    }
  },
  V2:{
    logo:string;
    min_credit:number;
    permission:{
      logo:string;
      name:string;
    }
  },
  V3:{
    logo:string;
    min_credit:number;
    permission:{
      logo:string;
      name:string;
    }
  },
  V4:{
    logo:string;
    min_credit:number;
    permission:{
      logo:string;
      name:string;
    }
  },
  V5:{
    logo:string;
    min_credit:number;
    permission:{
      logo:string;
      name:string;
    }
  }
}
export function usePermission(permissionName: string) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [level, setLevel] = useState<string>('V1');
  const [toLevel, setToLevel] = useState<string>('V2');
  const [nextDoList,setNextDoList]= useState<canDoListP>();
  const [range,setRange]= useState<string[]>(['V2','V3','V4','V5']);
  const [notice, setNotice] = useState<string>('');
  const { dicSetting } = useStoreData(({ common }) => ({
    dicSetting: common.dicSetting
  }));
  const { userInfo } = useStoreData(({ user }) => ({
    userInfo: user.userInfo,
  }));
  useEffect(() => {
    if(dicSetting && dicSetting.length && userInfo.employee){
      setLevel(userInfo.employee.level);
      const number = Number(userInfo.employee.level.substring(1));
      var arr: string[] = [];
      for(let i=number+1;i<6;i++){
        arr.push(`V${i}`)
      }
      setRange(arr);
      if(!number || number > 5){
        setRange([]);
        return;
      }
      let key = `V${number + 1}`;
      setToLevel(key);
      setNextDoList(dicSetting[0].content.credit_level)
    }
  }, [dicSetting,userInfo]);
  useEffect(() => {
    // 模拟异步加载权限数据
    const checkPermission = async () => {
      // 模拟一个异步请求权限判断
      const result = await new Promise<boolean>((resolve) => {
        setTimeout(() => {
          if(level == 'V5'){
            resolve(true);
            return;
          }
          for(let i=0;i< range.length;i++){
            if(nextDoList){
              let ind = nextDoList[range[i]].permission.findIndex((o)=>{
                if(o.notice){
                  setNotice(o.notice);
                }
                return  o.name == permissionName;
              })
              if(ind != -1){
                // if(permissionName == '客户消息'){
                //   resolve(false);
                // }else{
                //   resolve(true);
                // }
                resolve(false); 
                return
              }
            }
          }
          resolve(true);  
        }, 700);
      });
      setHasPermission(result);
    };
    checkPermission();
  }, [permissionName,nextDoList]);
  const showPermissionDialog = () => {
    Taro.showModal({
      title: '温馨提示',
      content: notice,
      confirmText:'去升级',
      confirmColor:"#6236FF",
      success: function (res) {
        if (res.confirm) {
          Router.navigate('LIngInt://level')
        } 
      }
    });
  };
  const handlePermissionCheck = () => {
    if (!hasPermission) {
      showPermissionDialog();
    }
    return hasPermission;
  };
  return { hasPermission, handlePermissionCheck };
}