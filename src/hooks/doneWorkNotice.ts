import { useEffect, useState } from 'react';
import {  useStoreData,storeActions } from '@/store';
import Taro from '@tarojs/taro';
type canDoListP = {
  k:string;
  path:string;
  v:string;
}[]
export function doneWorkNotice(k: string) {
  const [creditExtra,setCreditExtra]= useState<canDoListP>();
  const { dicSetting } = useStoreData(({ common }) => ({
    dicSetting: common.dicSetting
  }));
  useEffect(() => {
    if(dicSetting && dicSetting.length){
      setCreditExtra(dicSetting[0].content.credit_extra)
    }
  }, [dicSetting]);
  const showPermissionDialog = () => {
    if(creditExtra && creditExtra.length){
      let ind  = creditExtra.findIndex((item)=>{
        return k == item.k
      })
      if(ind != -1){
        Taro.eventCenter.trigger('show_notify', {
          message: `${k}已完成，加${creditExtra[ind].v}`
        });
        storeActions('GET_USERINFO');
      }
      
    }
  };
  return { showPermissionDialog };
}